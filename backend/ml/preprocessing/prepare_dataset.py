
import pandas as pd

from ml.preprocessing.clean_text import clean_text


def prepare_dataset(
    input_path: str,
    text_column: str,
    label_column: str,
) -> pd.DataFrame:
    """
    Load and validate a labelled research dataset.

    This function does not invent labels or remove records
    based on assumptions about their meaning.
    """
    df = pd.read_csv(input_path)

    required_columns = {text_column, label_column}
    missing_columns = required_columns - set(df.columns)

    if missing_columns:
        raise ValueError(
            f"Missing required columns: {sorted(missing_columns)}"
        )

    df = df[[text_column, label_column]].copy()
    df = df.dropna(subset=[text_column, label_column])

    df[text_column] = df[text_column].astype(str).map(clean_text)

    # Remove empty text records only.
    df = df[df[text_column] != ""]

    if df.empty:
        raise ValueError("No usable labelled records found.")

    if df[label_column].nunique() < 2:
        raise ValueError(
            "At least two distinct labels are needed for classification."
        )

    return df.reset_index(drop=True)



def load_participant_transcript(
    transcript_path: str,
) -> str:
    """
    Load a DAIC-WOZ transcript and combine only participant utterances.
    """
    df = pd.read_csv(transcript_path, sep="\t")

    required_columns = {"speaker", "value"}
    missing_columns = required_columns - set(df.columns)

    if missing_columns:
        raise ValueError(
            f"Missing transcript columns: {sorted(missing_columns)}"
        )

    participant_text = df.loc[
        df["speaker"] == "Participant", "value"
    ].dropna().astype(str)

    text = " ".join(participant_text.tolist())
    return clean_text(text)



from pathlib import Path


def prepare_daicwoz_split(
    labels_path: str,
    transcripts_dir: str,
) -> pd.DataFrame:
    """
    Match DAIC-WOZ participant transcripts with labels
    using Participant_ID.

    Only participants with available transcript files are included.
    """
    labels = pd.read_csv(labels_path)
    required_columns = {"Participant_ID", "PHQ8_Binary"}

    missing = required_columns - set(labels.columns)
    if missing:
        raise ValueError(
            f"Missing label columns: {sorted(missing)}"
        )

    if labels["Participant_ID"].duplicated().any():
        raise ValueError("Duplicate participant IDs in labels.")

    records = []
    transcripts_dir = Path(transcripts_dir)

    for _, row in labels.iterrows():
        participant_id = int(row["Participant_ID"])
        transcript_path = (
            transcripts_dir / f"{participant_id}_TRANSCRIPT.csv"
        )

        if not transcript_path.exists():
            continue

        text = load_participant_transcript(str(transcript_path))
        if not text:
            continue

        records.append({
            "Participant_ID": participant_id,
            "text": text,
            "label": int(row["PHQ8_Binary"]),
        })

    result = pd.DataFrame(
        records,
        columns=["Participant_ID", "text", "label"],
    )

    if not result.empty and result["Participant_ID"].duplicated().any():
        raise ValueError("Duplicate participant IDs in prepared data.")

    return result
