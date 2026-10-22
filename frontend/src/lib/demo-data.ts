// Synthetic demonstration data for the SAHYOG AI prototype.
// Every record in this file is fictional and exists only to demonstrate the
// interface. No real complaint data is stored or processed.

export type ReviewStatus =
  | "New"
  | "Pending review"
  | "In review"
  | "Reviewed"
  | "Referred"
  | "Follow-up requested"
  | "Closed";

export type Priority = "Low" | "Moderate" | "High" | "Urgent review";
export type IndicatorKey = "fear" | "duration" | "safety" | "overwhelm";

export type Indicator = {
  key: IndicatorKey;
  label: string;
  evidence: string;
};

export type DemoCase = {
  id: string;
  date: string;
  language: string;
  status: ReviewStatus;
  assigned: string;
  score: number;
  priority: Priority;
  summary: string;
  narrative: string;
  indicators: Indicator[];
  notes: string;
  followUpDate: string;
  history: string[];
};

export type ReferralCategory =
  | "Counselling"
  | "Legal aid"
  | "Medical assistance"
  | "Police intervention"
  | "Witness protection"
  | "Emergency support";

export type ReferralStatus =
  | "Suggested"
  | "Awaiting human approval"
  | "Approved"
  | "In progress"
  | "Completed"
  | "Cancelled";

export type DemoReferral = {
  id: string;
  caseId: string;
  category: ReferralCategory;
  status: ReferralStatus;
  date: string;
  service: string;
  followUpDate: string;
  notes: string;
  outcome: string;
};

export type ConversationTurn = {
  id: string;
  speaker: "Complainant" | "Responder";
  text: string;
};

export type ContactChannel = "Text" | "Phone" | "Portal";

export const concernCategories = [
  "General support request",
  "Emotional distress",
  "Safety concern",
  "Information request",
  "Other concern",
] as const;

export type ScoreSettings = {
  weights: Record<IndicatorKey, number>;
  thresholds: { moderate: number; high: number; urgent: number };
};

export type ThresholdKey = keyof ScoreSettings["thresholds"];

export function updateScoreThreshold(
  thresholds: ScoreSettings["thresholds"],
  key: ThresholdKey,
  value: number,
): ScoreSettings["thresholds"] {
  const bounded = Math.max(0, Math.min(100, Math.round(value / 5) * 5));
  if (key === "moderate") return { ...thresholds, moderate: Math.min(bounded, thresholds.high) };
  if (key === "high") {
    return {
      ...thresholds,
      moderate: Math.min(thresholds.moderate, bounded),
      high: bounded,
      urgent: Math.max(thresholds.urgent, bounded),
    };
  }
  return { ...thresholds, urgent: Math.max(bounded, thresholds.high) };
}

export const defaultScoreSettings: ScoreSettings = {
  weights: { fear: 20, duration: 20, safety: 40, overwhelm: 20 },
  thresholds: { moderate: 25, high: 50, urgent: 75 },
};

export const caseStatuses: ReviewStatus[] = [
  "New",
  "Pending review",
  "In review",
  "Reviewed",
  "Referred",
  "Follow-up requested",
  "Closed",
];

export const priorities: Priority[] = ["Low", "Moderate", "High", "Urgent review"];

export const responders = ["Unassigned", "Responder 01", "Responder 02", "Responder 03", "Responder 04"];

export function nextCaseId(cases: DemoCase[]): string {
  return `SY-${String(26020 + cases.length - 10).padStart(5, "0")}`;
}

export function nextReferralId(referrals: DemoReferral[]): string {
  return `RF-${String(26009 + referrals.length).padStart(5, "0")}`;
}

export function todayLabel(): string {
  return new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export function formatAuditLine(message: string): string {
  return `${todayLabel()} · ${message}`;
}

export function daysFromToday(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export function isWithinLastDays(dateLabel: string, days: number): boolean {
  const parsed = new Date(dateLabel).getTime();
  if (Number.isNaN(parsed)) return false;
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return parsed >= cutoff;
}

export const preparedScenarios = [
  {
    id: "support",
    title: "General support request",
    narrative:
      "I would like to understand what support options are available and speak with someone about my situation.",
  },
  {
    id: "prolonged",
    title: "Prolonged distress",
    narrative:
      "I have felt overwhelmed for months and feel afraid when I think about what has happened. I would like help finding support.",
  },
  {
    id: "safety",
    title: "Stated immediate safety concern",
    narrative:
      "I feel afraid and unsafe right now. I am overwhelmed and need to speak with a responder about my immediate safety concern.",
  },
] as const;

const syntheticCases: DemoCase[] = [
  {
    id: "SY-26019", date: "19 Oct 2026", language: "English", status: "Pending review", assigned: "Responder 04", score: 80, priority: "Urgent review",
    summary: "Caller described feeling unsafe and requested support.",
    narrative: "I feel afraid and unsafe right now. I am overwhelmed and need to speak with a responder about my immediate safety concern.",
    indicators: [{ key: "fear", label: "Expressed fear", evidence: "feel afraid" }, { key: "safety", label: "Stated safety concern", evidence: "unsafe right now" }, { key: "overwhelm", label: "Emotional overwhelm", evidence: "I am overwhelmed" }],
    notes: "", followUpDate: "", history: ["19 Oct 2026 · Assessment created · Human review required"],
  },
  {
    id: "SY-26018", date: "19 Oct 2026", language: "Hindi", status: "In review", assigned: "Responder 02", score: 60, priority: "High",
    summary: "Caller described a difficult situation lasting several months.",
    narrative: "मैं कई महीनों से बहुत परेशान और डरी हुई महसूस कर रही हूँ। मुझे सहायता के विकल्प जानने हैं।",
    indicators: [{ key: "fear", label: "Expressed fear", evidence: "डरी हुई" }, { key: "duration", label: "Reported prolonged distress", evidence: "कई महीनों से" }, { key: "overwhelm", label: "Emotional overwhelm", evidence: "बहुत परेशान" }],
    notes: "Review in progress; confirm the caller's preferred support.", followUpDate: "23 Oct 2026", history: ["19 Oct 2026 · Assigned to Responder 02"],
  },
  {
    id: "SY-26017", date: "18 Oct 2026", language: "Other", status: "Follow-up requested", assigned: "Responder 01", score: 45, priority: "Moderate",
    summary: "Caller asked for information about support services.", narrative: "Caller requested information about available services and a follow-up conversation.",
    indicators: [], notes: "Follow-up requested for a preferred contact time.", followUpDate: "22 Oct 2026", history: ["18 Oct 2026 · Follow-up requested"],
  },
  {
    id: "SY-26016", date: "18 Oct 2026", language: "English", status: "Reviewed", assigned: "Responder 03", score: 20, priority: "Low",
    summary: "Caller requested guidance on the next steps.", narrative: "I want to understand my options and speak with a responder.", indicators: [], notes: "Options discussed; caller may reconnect if needed.", followUpDate: "", history: ["18 Oct 2026 · Reviewed by Responder 03"],
  },
  {
    id: "SY-26015", date: "17 Oct 2026", language: "Hindi", status: "Pending review", assigned: "Responder 04", score: 85, priority: "Urgent review",
    summary: "Caller reported a safety concern and asked to speak with a responder.", narrative: "मुझे खतरा महसूस हो रहा है और मैं बहुत परेशान हूँ। कृपया मुझसे बात करें।",
    indicators: [{ key: "safety", label: "Stated safety concern", evidence: "खतरा महसूस" }, { key: "overwhelm", label: "Emotional overwhelm", evidence: "बहुत परेशान" }], notes: "", followUpDate: "", history: ["17 Oct 2026 · Assessment created · Human review required"],
  },
  {
    id: "SY-26014", date: "17 Oct 2026", language: "English", status: "In review", assigned: "Responder 02", score: 55, priority: "High",
    summary: "Caller described ongoing distress and asked about counselling.", narrative: "I have felt overwhelmed for weeks and would like to talk with someone.",
    indicators: [{ key: "duration", label: "Reported prolonged distress", evidence: "for weeks" }, { key: "overwhelm", label: "Emotional overwhelm", evidence: "felt overwhelmed" }], notes: "Discussing available counselling options.", followUpDate: "21 Oct 2026", history: ["17 Oct 2026 · Review started"],
  },
  {
    id: "SY-26013", date: "16 Oct 2026", language: "Other", status: "Reviewed", assigned: "Responder 01", score: 15, priority: "Low",
    summary: "Caller requested general information about the helpline.", narrative: "Caller would like general information about the helpline and available support.", indicators: [], notes: "Information shared; no referral requested.", followUpDate: "", history: ["16 Oct 2026 · Reviewed by Responder 01"],
  },
  {
    id: "SY-26012", date: "16 Oct 2026", language: "Hindi", status: "Pending review", assigned: "Responder 03", score: 50, priority: "High",
    summary: "Caller described feeling afraid and asked for support options.", narrative: "मैं डरी हुई हूँ और सहायता के विकल्प जानना चाहती हूँ।",
    indicators: [{ key: "fear", label: "Expressed fear", evidence: "डरी हुई" }], notes: "", followUpDate: "", history: ["16 Oct 2026 · Assessment created · Human review required"],
  },
  {
    id: "SY-26011", date: "15 Oct 2026", language: "English", status: "Follow-up requested", assigned: "Responder 04", score: 35, priority: "Moderate",
    summary: "Caller requested a later conversation about legal information.", narrative: "I would like a follow-up to learn about legal aid options.", indicators: [], notes: "Caller asked to speak again at a later time.", followUpDate: "20 Oct 2026", history: ["15 Oct 2026 · Follow-up requested"],
  },
  {
    id: "SY-26010", date: "15 Oct 2026", language: "English", status: "Reviewed", assigned: "Responder 02", score: 25, priority: "Moderate",
    summary: "Caller asked for a referral to medical assistance.", narrative: "I would like information about medical assistance and how to arrange a conversation.", indicators: [], notes: "Caller reviewed available options.", followUpDate: "", history: ["15 Oct 2026 · Reviewed by Responder 02"],
  },
];

export const initialCases = syntheticCases;

export const initialReferrals: DemoReferral[] = [
  { id: "RF-26008", caseId: "SY-26018", category: "Counselling", status: "In progress", date: "19 Oct 2026", service: "Counselling service (to be confirmed)", followUpDate: "24 Oct 2026", notes: "Responder is arranging a counselling conversation.", outcome: "" },
  { id: "RF-26007", caseId: "SY-26016", category: "Legal aid", status: "Completed", date: "18 Oct 2026", service: "Legal aid service (to be confirmed)", followUpDate: "21 Oct 2026", notes: "Legal information session recorded by responder.", outcome: "Information shared; no further action requested." },
  { id: "RF-26006", caseId: "SY-26014", category: "Medical assistance", status: "Approved", date: "17 Oct 2026", service: "Medical assistance (to be confirmed)", followUpDate: "22 Oct 2026", notes: "Approved by responder; awaiting practical arrangements.", outcome: "" },
  { id: "RF-26005", caseId: "SY-26011", category: "Counselling", status: "Awaiting human approval", date: "16 Oct 2026", service: "To be assigned by responder", followUpDate: "23 Oct 2026", notes: "Suggested by the demonstration workflow; requires responder approval.", outcome: "" },
];

export const referralCategories: ReferralCategory[] = [
  "Counselling", "Legal aid", "Medical assistance", "Police intervention", "Witness protection", "Emergency support",
];

export const referralStatuses: ReferralStatus[] = [
  "Suggested", "Awaiting human approval", "Approved", "In progress", "Completed", "Cancelled",
];
