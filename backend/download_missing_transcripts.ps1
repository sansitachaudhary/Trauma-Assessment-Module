
$ErrorActionPreference = "Continue"

$baseUrl = "https://dcapswoz.ict.usc.edu/wwwdaicwoz"
$rawDir = Join-Path $PWD "ml\data\raw"
$tempDir = Join-Path $env:TEMP "daicwoz_transcripts"

New-Item -ItemType Directory -Force -Path $rawDir, $tempDir | Out-Null

$trainCsv = Import-Csv "ml\data\metadata\train_split_Depression_AVEC2017.csv"
$existingIds = Get-ChildItem $rawDir -Filter "*_TRANSCRIPT.csv" |
    ForEach-Object { [int]($_.BaseName -replace "_TRANSCRIPT$", "") }

$missingIds = $trainCsv |
    Where-Object { [int]$_.Participant_ID -notin $existingIds } |
    ForEach-Object { [int]$_.Participant_ID } |
    Sort-Object -Unique

$failed = @()

foreach ($id in $missingIds) {
    $name = "${id}_P.zip"
    $zipPath = Join-Path $tempDir $name
    $extractDir = Join-Path $tempDir "${id}_extract"
    $transcript = "${id}_TRANSCRIPT.csv"
    $target = Join-Path $rawDir $transcript

    if (Test-Path $target) {
        Write-Host "SKIP $id - transcript already exists"
        continue
    }

    try {
        Write-Host "Downloading $name ..."
        Invoke-WebRequest `
            -Uri "$baseUrl/$name" `
            -OutFile $zipPath `
            -UseBasicParsing

        $archive = [System.IO.Compression.ZipFile]::OpenRead($zipPath)
        try {
            $entry = $archive.Entries |
                Where-Object { $_.FullName -eq $transcript } |
                Select-Object -First 1

            if (-not $entry) {
                throw "Expected transcript $transcript not found in ZIP."
            }

            $stream = $entry.Open()
            try {
                $output = [System.IO.File]::Create($target)
                try {
                    $stream.CopyTo($output)
                }
                finally {
                    $output.Dispose()
                }
            }
            finally {
                $stream.Dispose()
            }
        }
        finally {
            $archive.Dispose()
        }

        if ((Get-Item $target).Length -eq 0) {
            Remove-Item $target -Force
            throw "Extracted transcript is empty."
        }

        Write-Host "SUCCESS $transcript"
    }
    catch {
        if (Test-Path $target) {
            Remove-Item $target -Force
        }
        $failed += "$id : $($_.Exception.Message)"
        Write-Host "FAILED $id - $($_.Exception.Message)"
    }
    finally {
        Remove-Item $zipPath -Force -ErrorAction SilentlyContinue
        Remove-Item $extractDir -Recurse -Force -ErrorAction SilentlyContinue
    }
}

Write-Host "`nFinished processing training transcripts."
Write-Host "Successful transcripts: $((Get-ChildItem $rawDir -Filter '*_TRANSCRIPT.csv').Count)"
Write-Host "Failures: $($failed.Count)"
$failed | Set-Content (Join-Path $tempDir "training_failures.txt")

if ($failed.Count -gt 0) {
    Write-Host "Failure log: $(Join-Path $tempDir 'training_failures.txt')"
}
