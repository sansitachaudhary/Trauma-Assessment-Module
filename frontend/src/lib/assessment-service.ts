// Assessment service module.
// The scoring logic below is intentionally isolated so it can be replaced with
// a validated assessment method later. It is a transparent, rule-based
// demonstration only: phrase matching over submitted text. It is experimental,
// not clinically validated, and never constitutes a diagnosis or a safety
// determination.

import {
  defaultScoreSettings,
  type Indicator,
  type IndicatorKey,
  type Priority,
  type ScoreSettings,
} from "./demo-data";

export const indicatorRules: Record<
  IndicatorKey,
  { label: string; terms: string[]; kind: "emotional" | "safety" | "contextual" }
> = {
  fear: {
    label: "Expressed fear",
    terms: ["afraid", "fear", "scared", "डर", "डरी", "डरा"],
    kind: "emotional",
  },
  duration: {
    label: "Reported prolonged distress",
    terms: ["for months", "for weeks", "long time", "कई महीनों", "महीनों से", "लंबे समय"],
    kind: "contextual",
  },
  safety: {
    label: "Stated safety concern",
    terms: ["unsafe", "safety concern", "in danger", "threatened", "खतरा", "असुरक्षित", "धमकी"],
    kind: "safety",
  },
  overwhelm: {
    label: "Emotional overwhelm",
    terms: ["overwhelmed", "can't cope", "cannot cope", "hopeless", "बहुत परेशान", "बेबस"],
    kind: "emotional",
  },
};

export const followUpSuggestions: Record<IndicatorKey, string> = {
  fear: "Ask, in the person's own words, what they are afraid of and what would help them feel safer.",
  duration: "Ask how long the situation has been going on and whether it is getting better or worse.",
  safety: "Follow the urgent-safety workflow: confirm immediate safety and, if needed, connect a trained responder now.",
  overwhelm: "Ask what support would feel most useful right now and whether they can reach their usual supports.",
};

export type AssessmentOutcome = {
  score: number;
  priority: Priority;
  indicators: Indicator[];
  humanReviewRequired: true;
  missingInformation: string[];
  suggestedQuestions: string[];
};

function clipEvidence(text: string, start: number, termLength: number): string {
  const from = Math.max(0, start - 22);
  const to = Math.min(text.length, start + termLength + 36);
  return `“…${text.slice(from, to).trim()}…”`;
}

export function assessDemonstration(
  text: string,
  settings: ScoreSettings = defaultScoreSettings,
): AssessmentOutcome {
  const normalized = text.toLocaleLowerCase();
  const indicators = (Object.keys(indicatorRules) as IndicatorKey[]).flatMap((key) => {
    const rule = indicatorRules[key];
    const term = rule.terms.find((candidate) => normalized.includes(candidate.toLocaleLowerCase()));
    if (!term) return [];
    const start = normalized.indexOf(term.toLocaleLowerCase());
    return [{ key, label: rule.label, evidence: clipEvidence(text, start, term.length) }];
  });

  const score = Math.min(100, indicators.reduce((sum, indicator) => sum + settings.weights[indicator.key], 0));
  const { moderate, high, urgent } = settings.thresholds;
  const priority: Priority =
    score >= urgent ? "Urgent review" : score >= high ? "High" : score >= moderate ? "Moderate" : "Low";

  const found = new Set(indicators.map((indicator) => indicator.key));
  const missingInformation: string[] = [];
  if (!found.has("duration")) {
    missingInformation.push("Duration of the reported problem is not stated in the supplied text.");
  }
  if (!found.has("safety")) {
    missingInformation.push("No explicit safety statement was found; safety can never be inferred from an absence of words.");
  }
  missingInformation.push(
    "Phrase rules behave differently across languages; accuracy is not equivalent across English, Hindi, and other languages.",
  );
  missingInformation.push("Tone, context, and information conveyed by voice are not available to this text-only demonstration.");

  const suggestedQuestions = indicators
    .map((indicator) => followUpSuggestions[indicator.key])
    .concat(found.size === 0 ? ["Ask open, non-leading questions about how the person is feeling and what kind of support they want."] : []);

  return { score, priority, indicators, humanReviewRequired: true, missingInformation, suggestedQuestions };
}
