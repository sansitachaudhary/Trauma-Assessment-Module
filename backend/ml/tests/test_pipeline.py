
import pandas as pd
import pytest

from ml.preprocessing.clean_text import clean_text
from ml.preprocessing.prepare_dataset import (
    prepare_dataset,
    prepare_daicwoz_split,
)

def test_clean_text_removes_extra_whitespace():
    assert clean_text("  I   cannot   sleep.  ") == "I cannot sleep."


def test_clean_text_preserves_negation():
    assert clean_text("I can't cope") == "I can't cope"


def test_prepare_dataset_cleans_text(tmp_path):
    path = tmp_path / "sample.csv"
    pd.DataFrame({
        "text": ["  hello   there ", "another example"],
        "label": ["class_a", "class_b"],
    }).to_csv(path, index=False)

    result = prepare_dataset(str(path), "text", "label")

    assert result.loc[0, "text"] == "hello there"
    assert len(result) == 2


def test_prepare_dataset_rejects_missing_columns(tmp_path):
    path = tmp_path / "sample.csv"
    pd.DataFrame({"message": ["hello"], "label": ["class_a"]}).to_csv(
        path, index=False
    )

    with pytest.raises(ValueError, match="Missing required columns"):
        prepare_dataset(str(path), "text", "label")



def test_prepare_daicwoz_split_matches_transcript_to_label(tmp_path):
    labels_path = tmp_path / "train.csv"
    transcripts_dir = tmp_path / "raw"
    transcripts_dir.mkdir()

    pd.DataFrame({
        "Participant_ID": [303, 304],
        "PHQ8_Binary": [0, 1],
    }).to_csv(labels_path, index=False)

    pd.DataFrame({
        "start_time": [0.0, 1.0, 2.0],
        "stop_time": [1.0, 2.0, 3.0],
        "speaker": ["Ellie", "Participant", "Participant"],
        "value": ["Hello", "I feel tired", "I cannot sleep"],
    }).to_csv(
        transcripts_dir / "303_TRANSCRIPT.csv",
        sep="\t",
        index=False,
    )

    result = prepare_daicwoz_split(
        str(labels_path),
        str(transcripts_dir),
    )

    assert len(result) == 1
    assert result.loc[0, "Participant_ID"] == 303
    assert result.loc[0, "label"] == 0
    assert "I feel tired" in result.loc[0, "text"]
    assert "Hello" not in result.loc[0, "text"]
