
from dataclasses import dataclass


@dataclass
class TextAnalysisResult:
    indicators: list[str]
    safety_review_required: bool
    model_version: str = "rules-demo-v1"


# Demo-only phrase categories, not validated clinical indicators.
INDICATOR_PHRASES = {
    "distress_language": [
        "overwhelmed",
        "very stressed",
        "feeling distressed",
        "cannot cope",
        "can't cope",
    ],
    "fear_language": [
        "i feel unsafe",
        "i am afraid",
        "i feel scared",
        "threatened",
    ],
    "sleep_concern": [
        "cannot sleep",
        "can't sleep",
        "nightmares",
        "trouble sleeping",
    ],
    "support_request": [
        "need help",
        "want support",
        "need someone to talk to",
    ],
}


def analyze_text(text: str) -> TextAnalysisResult:
    """
    Identify candidate phrases for human review.

    This demo does not diagnose stress or trauma, determine risk,
    or replace a validated assessment and trained human review.
    """
    normalized_text = " ".join(text.casefold().split())
    indicators = []

    for category, phrases in INDICATOR_PHRASES.items():
        if any(phrase in normalized_text for phrase in phrases):
            indicators.append(category)

    return TextAnalysisResult(
        indicators=indicators,
        # Human review is required regardless of keyword matches.
        safety_review_required=True,
    )
