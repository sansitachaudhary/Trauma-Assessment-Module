
from backend.app.services.text_analysis import analyze_text


def test_distress_phrase_is_flagged_for_review():
    result = analyze_text("I feel very stressed.")

    assert "distress_language" in result.indicators
    assert result.safety_review_required is True


def test_unmatched_text_still_requires_review():
    result = analyze_text("This is fictional test text.")

    assert result.indicators == []
    assert result.safety_review_required is True


def test_matching_is_case_insensitive():
    result = analyze_text("I FEEL SCARED.")

    assert "fear_language" in result.indicators
