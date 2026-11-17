import argparse
import re
import struct
import subprocess
import tempfile
import zlib
from pathlib import Path

BASE_URL = "https://dcapswoz.ict.usc.edu/wwwdaicwoz"

ROOT = Path(__file__).resolve().parents[1]
RAW_DIR = ROOT / "ml" / "data" / "raw"

TAIL_SIZE = 1024 * 1024
TIMEOUT = 120


def curl_download(url, output_path, start=None, end=None, headers_path=None):
    """Download a file or a specific byte range using curl.exe."""

    command = [
        "curl.exe",
        "-sS",
    ]

    if start is not None and end is not None:
        command.extend(["--range", f"{start}-{end}"])

    if headers_path:
        command.extend(["--dump-header", str(headers_path)])

    command.extend(["--output", str(output_path), url])

    result = subprocess.run(
        command,
        capture_output=True,
        text=True,
        timeout=TIMEOUT + 15,
    )

    if result.returncode != 0:
        raise RuntimeError(
            f"curl failed with exit code {result.returncode}: "
            f"{result.stderr.strip()}"
        )

    if not output_path.exists():
        raise RuntimeError("curl did not create the expected output file")

    return output_path.read_bytes()


def fetch_range(url, start, end):
    """Fetch an exact byte range and reject full-file responses."""

    with tempfile.TemporaryDirectory(prefix="daic_range_") as temp:
        temp_path = Path(temp)
        output_path = temp_path / "range.bin"
        headers_path = temp_path / "headers.txt"

        content = curl_download(
            url,
            output_path,
            start=start,
            end=end,
            headers_path=headers_path,
        )

        headers = headers_path.read_text(
            encoding="latin-1"
        )

        matches = re.findall(
            r"(?im)^HTTP/\S+\s+(\d+)",
            headers,
        )

        # Use the final response status, allowing for redirects.
        if not matches or int(matches[-1]) != 206:
            raise RuntimeError(
                "Server did not return HTTP 206 Partial Content. "
                f"Response statuses: {matches}"
            )

        expected = end - start + 1

        if len(content) != expected:
            raise RuntimeError(
                f"Expected {expected} bytes, received {len(content)}"
            )

        return content


def get_archive_size(url):
    """Discover archive size through a one-byte range request."""

    with tempfile.TemporaryDirectory(prefix="daic_size_") as temp:
        temp_path = Path(temp)
        output_path = temp_path / "first_byte.bin"
        headers_path = temp_path / "headers.txt"

        curl_download(
            url,
            output_path,
            start=0,
            end=0,
            headers_path=headers_path,
        )

        headers = headers_path.read_text(
            encoding="latin-1"
        )

        matches = re.findall(
            r"(?im)^content-range:\s*bytes\s+\d+-\d+/(\d+)",
            headers,
        )

        if not matches:
            raise RuntimeError(
                "Could not determine archive size from Content-Range"
            )

        return int(matches[-1])


def find_eocd(data):
    """Locate the ZIP End of Central Directory record."""

    signature = b"PK\x05\x06"
    position = data.rfind(signature)

    if position < 0:
        raise RuntimeError("ZIP end directory not found")

    if position + 22 > len(data):
        raise RuntimeError("Incomplete ZIP end directory")

    fields = struct.unpack_from("<4s4H2LH", data, position)

    comment_length = fields[7]

    if position + 22 + comment_length > len(data):
        raise RuntimeError("Incomplete ZIP comment or EOCD record")

    disk_number = fields[1]
    central_directory_disk = fields[2]
    entries_on_disk = fields[3]
    entry_count = fields[4]
    directory_size = fields[5]
    directory_offset = fields[6]

    if disk_number != 0 or central_directory_disk != 0:
        raise RuntimeError("Multi-disk ZIP archives are unsupported")

    if entries_on_disk != entry_count:
        raise RuntimeError("Multi-disk ZIP archives are unsupported")

    if (
        entry_count == 0xFFFF
        or directory_size == 0xFFFFFFFF
        or directory_offset == 0xFFFFFFFF
    ):
        raise RuntimeError("ZIP64 archives are unsupported")

    return entry_count, directory_size, directory_offset


def parse_central_directory(directory, entry_count, participant_id):
    """Find the participant transcript entry in the ZIP directory."""

    wanted = f"{participant_id}_TRANSCRIPT.csv"
    position = 0

    for _ in range(entry_count):
        if position + 46 > len(directory):
            raise RuntimeError("Truncated central directory")

        fields = struct.unpack_from(
            "<4s6H3I5H2I",
            directory,
            position,
        )

        if fields[0] != b"PK\x01\x02":
            raise RuntimeError("Invalid central directory signature")

        compression_method = fields[4]
        flags = fields[3]
        crc = fields[7]
        compressed_size = fields[8]
        uncompressed_size = fields[9]
        filename_length = fields[10]
        extra_length = fields[11]
        comment_length = fields[12]
        local_offset = fields[16]

        end = (
            position + 46
            + filename_length
            + extra_length
            + comment_length
        )

        if end > len(directory):
            raise RuntimeError("Central directory entry is truncated")

        filename_bytes = directory[
            position + 46:
            position + 46 + filename_length
        ]

        filename = filename_bytes.decode("utf-8")

        extra = directory[
            position + 46 + filename_length:
            position + 46 + filename_length + extra_length
        ]

        if filename == wanted:
            if flags & 0x1:
                raise RuntimeError("Encrypted transcript entries are unsupported")

            if compression_method != 8:
                raise RuntimeError(
                    f"Unsupported compression method: {compression_method}"
                )

            if 0xFFFFFFFF in (
                compressed_size,
                uncompressed_size,
                local_offset,
            ):
                raise RuntimeError("ZIP64 transcript entry is unsupported")

            if b"\x01\x00" in extra:
                raise RuntimeError("ZIP64 extra field detected")

            return {
                "crc": crc,
                "compressed_size": compressed_size,
                "uncompressed_size": uncompressed_size,
                "local_offset": local_offset,
            }

        position = end

    raise FileNotFoundError(f"{wanted} not found in participant ZIP")


def get_zip_entry(url, participant_id):
    """Read the ZIP directory without downloading the full archive."""

    archive_size = get_archive_size(url)

    tail_start = max(0, archive_size - TAIL_SIZE)

    tail = fetch_range(
        url,
        tail_start,
        archive_size - 1,
    )

    entry_count, directory_size, directory_offset = find_eocd(tail)

    if directory_offset + directory_size > archive_size:
        raise RuntimeError("Invalid central directory bounds")

    if directory_offset >= tail_start:
        relative = directory_offset - tail_start

        directory = tail[
            relative:relative + directory_size
        ]
    else:
        directory = fetch_range(
            url,
            directory_offset,
            directory_offset + directory_size - 1,
        )

    if len(directory) != directory_size:
        raise RuntimeError("Central directory size mismatch")

    return parse_central_directory(
        directory,
        entry_count,
        participant_id,
    )


def download_transcript(participant_id):
    """Download, decompress, verify and safely save one transcript."""

    RAW_DIR.mkdir(parents=True, exist_ok=True)

    name = f"{participant_id}_TRANSCRIPT.csv"
    destination = RAW_DIR / name

    if destination.exists():
        print(f"SKIP {name}: already exists")
        return

    url = f"{BASE_URL}/{participant_id}_P.zip"

    print(f"Inspecting archive for participant {participant_id}...")

    entry = get_zip_entry(url, participant_id)

    # Read the local ZIP header.
    header = fetch_range(
        url,
        entry["local_offset"],
        entry["local_offset"] + 29,
    )

    fields = struct.unpack("<4s5H3I2H", header)

    if fields[0] != b"PK\x03\x04":
        raise RuntimeError("Invalid local ZIP header")

    flags = fields[2]
    compression_method = fields[3]
    filename_length = fields[9]
    extra_length = fields[10]

    if flags & 0x1:
        raise RuntimeError("Encrypted transcript entries are unsupported")

    if compression_method != 8:
        raise RuntimeError("Transcript is not DEFLATE compressed")

    data_start = (
        entry["local_offset"]
        + 30
        + filename_length
        + extra_length
    )

    print(
        f"Downloading transcript data: "
        f"{entry['compressed_size']} bytes"
    )

    compressed = fetch_range(
        url,
        data_start,
        data_start + entry["compressed_size"] - 1,
    )

    transcript = zlib.decompress(compressed, -15)

    if len(transcript) != entry["uncompressed_size"]:
        raise RuntimeError("Uncompressed size verification failed")

    actual_crc = zlib.crc32(transcript) & 0xFFFFFFFF

    if actual_crc != entry["crc"]:
        raise RuntimeError(
            f"CRC verification failed: expected "
            f"{entry['crc']:08x}, got {actual_crc:08x}"
        )

    # Exclusive creation prevents overwriting existing transcripts.
    try:
        with destination.open("xb") as file:
            file.write(transcript)
    except FileExistsError:
        print(f"SKIP {name}: another process created it")
        return

    print(
        f"SUCCESS {name} | "
        f"{len(transcript)} bytes | "
        f"CRC {actual_crc:08x}"
    )


def main():
    parser = argparse.ArgumentParser(
        description="Download only DAIC-WOZ participant transcripts"
    )

    parser.add_argument(
        "--ids",
        nargs="+",
        type=int,
        required=True,
        help="Participant IDs to download",
    )

    args = parser.parse_args()

    for participant_id in args.ids:
        try:
            download_transcript(participant_id)
        except Exception as error:
            print(f"FAILED {participant_id}: {error}")


if __name__ == "__main__":
    main()