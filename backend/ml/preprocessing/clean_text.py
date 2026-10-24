
import re
import unicodedata


def clean_text(text: str) -> str:
    """
    Normalize text while preserving meaningful words,
    punctuation, and negations for NLP research.
    """
    if not isinstance(text, str):
        raise TypeError("text must be a string")

    # Normalize Unicode characters.
    text = unicodedata.normalize("NFKC", text)

    # Replace repeated whitespace and line breaks.
    text = re.sub(r"\s+", " ", text)

    # Remove leading and trailing whitespace.
    text = text.strip()

    return text
