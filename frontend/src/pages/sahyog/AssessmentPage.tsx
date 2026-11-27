import { useState, useRef, type FormEvent } from "react";
import {
  Activity,
  AlertCircle,
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  Info,
  Loader2,
  Mic,
  MicOff,
  RotateCcw,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { createComplaint } from "@/lib/complaint-api";
import { predictWithML, type MLPredictionResponse } from "@/lib/ml-api";
import {
  assessDemonstration,
  type AssessmentOutcome,
} from "@/lib/assessment-service";
import {
  preparedScenarios,
  type DemoCase,
  type ScoreSettings,
} from "@/lib/demo-data";
import {
  PageIntro,
  SectionHeading,
  type View,
} from "@/components/sahyog/shared";
import { AssessmentResultPage } from "./AssessmentResultPage";

export interface AssessmentPageProps {
  cases: DemoCase[];
  settings: ScoreSettings;
  onSubmitCase: (item: DemoCase) => void;
  onUpdateCase: (
    id: string,
    updates: Partial<DemoCase>,
    history?: string,
  ) => void;
  onNavigate: (view: View) => void;
  onOpenCase: (id: string) => void;
  onNotify: (message: string) => void;
  result: ReturnType<typeof assessDemonstration> | null;
  setResult: (result: ReturnType<typeof assessDemonstration> | null) => void;
  narrative: string;
  setNarrative: (text: string) => void;
}

export function AssessmentPage({
  cases,
  settings,
  onSubmitCase,
  onOpenCase,
  onNavigate,
  onNotify,
  result,
  setResult,
  narrative,
  setNarrative,
}: AssessmentPageProps) {
  const [language, setLanguage] = useState("English");
  const [mode, setMode] = useState<"Text" | "Transcript">("Text");
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const voiceRecognitionRef = useRef<any>(null);
  const voiceBaseTextRef = useRef("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mlResult, setMlResult] = useState<MLPredictionResponse | null>(null);
  const [createdId, setCreatedId] = useState<string | null>(null);

  const sourceText = mode === "Transcript" ? transcript : narrative;

  const selectScenario = (text: string) => {
    setNarrative(text);
    setTranscript(text);
    setResult(null);
    setError("");
    setCreatedId(null);
    setMlResult(null);
  };

  const startVoiceInput = () => {
    const speechWindow = window as any;
    const SpeechRecognition =
      speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError(
        "Voice input is not supported in this browser. Please use Chrome/Edge or type your narrative directly.",
      );
      return;
    }

    setError("");
    setMode("Transcript");
    setResult(null);
    setCreatedId(null);

    voiceBaseTextRef.current = transcript.trim()
      ? `${transcript.trim()} `
      : narrative.trim()
        ? `${narrative.trim()} `
        : "";

    const recognition = new SpeechRecognition();
    voiceRecognitionRef.current = recognition;

    recognition.lang = language === "Hindi" ? "hi-IN" : "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      let recognizedText = "";
      for (let i = 0; i < event.results.length; i++) {
        recognizedText += event.results[i][0].transcript;
      }
      setTranscript(`${voiceBaseTextRef.current}${recognizedText}`.trim());
    };

    recognition.onerror = (event: any) => {
      setIsListening(false);
      if (event.error !== "no-speech") {
        setError(
          `Microphone error (${event.error}). You can continue by typing your narrative.`,
        );
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
    } catch {
      setIsListening(false);
      setError(
        "Unable to initialize microphone. Please check browser microphone permissions.",
      );
    }
  };

  const stopVoiceInput = () => {
    voiceRecognitionRef.current?.stop();
    setIsListening(false);
  };

  const clearNarrative = () => {
    stopVoiceInput();
    setNarrative("");
    setTranscript("");
    setResult(null);
    setCreatedId(null);
    setError("");
    setMlResult(null);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();

    if (sourceText.trim().length < 12) {
      setError(
        "Please enter at least 12 characters to run an illustrative assessment.",
      );
      return;
    }

    if (!consent) {
      setError(
        "Please confirm human oversight acknowledgement before submitting.",
      );
      return;
    }

    setError("");
    setLoading(true);
    setResult(null);
    setCreatedId(null);

    try {
      const mock = assessDemonstration(sourceText, settings);

      // 1. Persist complaint via FastAPI backend
      const savedComplaint = await createComplaint({
        description: sourceText,
        language,
        notes:
          "Intake registered via dashboard. Mandatory responder review pending.",
        rule_based_score: mock.score,
        rule_based_priority: mock.priority,
        rule_based_indicators: mock.indicators,
      });

      // 2. Predict with experimental ML model
      let prediction: MLPredictionResponse | null = null;
      try {
        prediction = await predictWithML(sourceText);
        setMlResult(prediction);
      } catch {
        console.warn("ML model prediction was unavailable.");
      }

      // 3. Rule-based SVI assessment
      const id = `DB-${savedComplaint.id}`;

      const date = new Date(savedComplaint.created_at).toLocaleDateString(
        "en-GB",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        },
      );

      const created: DemoCase = {
        id,
        date,
        language:
          savedComplaint.language === "en"
            ? "English"
            : savedComplaint.language === "hi"
              ? "Hindi"
              : savedComplaint.language,
        status: "Pending review",
        assigned: savedComplaint.assigned,
        score: savedComplaint.rule_based_score,
        priority: savedComplaint.rule_based_priority,
        summary:
          sourceText.slice(0, 110) + (sourceText.length > 110 ? "…" : ""),
        narrative: savedComplaint.description,
        indicators: savedComplaint.rule_based_indicators,
        notes: savedComplaint.notes,
        followUpDate: "",
        history: savedComplaint.history,
      };

      onSubmitCase(created);
      setResult(mock);
      setCreatedId(id);
      onNotify(`Complaint ${id} registered successfully.`);
    } catch (err) {
      console.error("Failed to save complaint.");
      setError(
        err instanceof Error
          ? err.message
          : "Could not save the complaint. Please check your backend connection.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageIntro
        eyebrow="CASE INTAKE & SCREENING"
        title="New Assessment"
        description="Record the caller's concerns, analyze rule-based indicators, and generate decision-support signals for responder follow-up."
      />

      <div className="mt-4 grid items-start gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
        {/* Main Intake Form */}
        <form
          onSubmit={submit}
          className="space-y-6 rounded-2xl border border-border bg-card p-5 sm:p-7 shadow-xs"
          aria-label="Intake assessment form"
        >
          {/* Section 1: Intake & Language */}
          <div>
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <span className="grid size-6 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                1
              </span>
              <h2 className="text-sm font-bold text-foreground">
                Intake Configuration
              </h2>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="language-select"
                  className="block text-xs font-semibold text-foreground"
                >
                  Intake Language <span className="text-status-urgent">*</span>
                </label>
                <select
                  id="language-select"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm font-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi (हिंदी)</option>
                  <option value="Other">Other / Regional</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground">
                  Input Mode
                </label>
                <div
                  className="mt-1.5 grid h-10 grid-cols-2 gap-1 rounded-lg border border-input bg-muted/30 p-1"
                  role="radiogroup"
                  aria-label="Input mode"
                >
                  <button
                    type="button"
                    role="radio"
                    aria-checked={mode === "Text"}
                    onClick={() => {
                      stopVoiceInput();
                      setMode("Text");
                      setNarrative(transcript || narrative);
                    }}
                    className={`rounded-md text-xs font-semibold transition ${
                      mode === "Text"
                        ? "bg-card text-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Type Narrative
                  </button>

                  <button
                    type="button"
                    role="radio"
                    aria-checked={mode === "Transcript"}
                    onClick={() => {
                      stopVoiceInput();
                      setMode("Transcript");
                      setTranscript(narrative || transcript);
                    }}
                    className={`rounded-md text-xs font-semibold transition ${
                      mode === "Transcript"
                        ? "bg-card text-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Voice / Dictate
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Narrative Entry */}
          <div>
            <div className="flex items-center justify-between gap-3 border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <span className="grid size-6 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  2
                </span>
                <h2 className="text-sm font-bold text-foreground">
                  Complainant Narrative
                </h2>
              </div>
              <span className="text-[11px] font-medium text-muted-foreground">
                {sourceText.length} characters (min 12)
              </span>
            </div>

            <div className="mt-4">
              <label htmlFor="complaint-narrative" className="sr-only">
                Complaint narrative description
              </label>
              <Textarea
                id="complaint-narrative"
                value={sourceText}
                onChange={(event) => {
                  if (mode === "Text") setNarrative(event.target.value);
                  else setTranscript(event.target.value);
                  setResult(null);
                  setCreatedId(null);
                  setError("");
                }}
                placeholder="Type or dictate the caller's concerns respectfully (e.g. 'Caller describes intense panic attacks and trembling following recent harassment, cannot sleep...')"
                rows={7}
                aria-required="true"
                className="mt-1.5 resize-y text-sm leading-relaxed"
                required
                minLength={12}
              />
              <p className="mt-1.5 text-[11px] text-muted-foreground">
                A minimum of 12 characters is required to generate screening
                indicators.
              </p>
            </div>
          </div>

          {/* Section 3: Voice Input Assistant */}
          <div className="rounded-xl border border-border bg-muted/20 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div
                  className={`grid size-10 shrink-0 place-items-center rounded-xl border ${
                    isListening
                      ? "border-status-urgent/40 bg-status-urgent/10 text-status-urgent animate-pulse"
                      : "border-primary/25 bg-primary/10 text-primary"
                  }`}
                  aria-hidden="true"
                >
                  {isListening ? (
                    <Mic className="size-5" />
                  ) : (
                    <Activity className="size-5" />
                  )}
                </div>

                <div>
                  <p className="text-xs font-bold text-foreground">
                    Voice Dictation Assistant
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Dictate caller statements in real-time. Speech is
                    transcribed directly in-browser.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {!isListening ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={startVoiceInput}
                    className="gap-2 border-primary/30 text-primary hover:bg-primary/10 focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <Mic className="size-3.5" aria-hidden="true" />
                    <span>Start speaking</span>
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={stopVoiceInput}
                    className="gap-2 border-status-urgent/40 bg-status-urgent/10 text-status-urgent hover:bg-status-urgent/20 focus-visible:ring-2 focus-visible:ring-status-urgent"
                  >
                    <MicOff className="size-3.5" aria-hidden="true" />
                    <span>Stop listening</span>
                  </Button>
                )}

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearNarrative}
                  className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="size-3.5" aria-hidden="true" />
                  <span>Clear</span>
                </Button>
              </div>
            </div>

            {isListening && (
              <div
                role="status"
                className="mt-3 flex items-center gap-2 rounded-lg border border-status-urgent/30 bg-status-urgent/10 px-3 py-2 text-xs font-semibold text-status-urgent"
              >
                <span
                  className="size-2 rounded-full bg-status-urgent animate-ping"
                  aria-hidden="true"
                />
                Listening actively... Speak clearly into your microphone.
              </div>
            )}
          </div>

          {/* Section 4: Human Oversight Consent Checkbox */}
          <div className="border-t border-border pt-4">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                id="consent-checkbox"
                aria-required="true"
                className="mt-1 size-4 shrink-0 rounded border-input accent-primary focus-visible:ring-2 focus-visible:ring-primary"
                checked={consent}
                onChange={(event) => {
                  setConsent(event.target.checked);
                  if (event.target.checked && error.includes("oversight")) {
                    setError("");
                  }
                }}
              />
              <span className="text-xs leading-relaxed text-muted-foreground">
                <strong className="text-foreground">
                  Human Responder Oversight Acknowledged:
                </strong>{" "}
                I confirm that this assessment output is a preliminary
                decision-support indicator only. All care decisions and
                emergency referrals remain the sole responsibility of trained
                human personnel under NHAAS 14566 protocols.
              </span>
            </label>
          </div>

          {/* Error Message */}
          {error && (
            <div
              role="alert"
              className="flex items-start gap-2.5 rounded-lg border border-status-urgent/30 bg-status-urgent/10 p-3 text-xs text-status-urgent"
            >
              <AlertCircle
                className="mt-0.5 size-4 shrink-0"
                aria-hidden="true"
              />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <Button
              type="submit"
              disabled={loading || sourceText.trim().length < 12}
              className="gap-2 bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-xs hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  <span>Saving & Screening...</span>
                </>
              ) : (
                <>
                  <Sparkles className="size-4" aria-hidden="true" />
                  <span>Submit & Assess Complaint</span>
                </>
              )}
            </Button>

            <span className="text-[11px] text-muted-foreground">
              Syncs to database & runs AI screening pipeline
            </span>
          </div>
        </form>

        {/* Sidebar Scenarios & Rules */}
        <div className="space-y-5">
          {/* Prepared Demonstration Scenarios */}
          <section
            aria-label="Preset demonstration scenarios"
            className="overflow-hidden rounded-xl border border-border bg-card shadow-xs"
          >
            <SectionHeading
              title="Prepared Scenarios"
              caption="Click to load standard demonstration templates"
            />
            <div className="divide-y divide-border">
              {preparedScenarios.map((scenario, index) => (
                <button
                  type="button"
                  key={scenario.id}
                  onClick={() => selectScenario(scenario.narrative)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
                >
                  <span className="grid size-6 shrink-0 place-items-center rounded-md border border-border bg-muted/30 text-[10px] font-bold text-foreground">
                    0{index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-foreground">
                      {scenario.title}
                    </p>
                    <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                      {scenario.narrative}
                    </p>
                  </div>
                  <ChevronRight
                    className="size-4 shrink-0 text-muted-foreground"
                    aria-hidden="true"
                  />
                </button>
              ))}
            </div>
          </section>

          {/* Transparent Demonstration Rules Card */}
          <section
            aria-label="Screening rule indicators"
            className="overflow-hidden rounded-xl border border-border bg-card shadow-xs"
          >
            <SectionHeading
              title="Transparent Screening Rules"
              caption="Observable text indicators mapped during intake"
            />
            <div className="space-y-3 p-4 text-xs">
              <div className="grid grid-cols-2 gap-2">
                {[
                  {
                    key: "fear",
                    label: "Expressed Fear",
                    desc: "Panic, terrifying phrases",
                  },
                  {
                    key: "duration",
                    label: "Prolonged Distress",
                    desc: "Months, insomnia, flashbacks",
                  },
                  {
                    key: "safety",
                    label: "Stated Safety Concern",
                    desc: "Threats, stalker, physical danger",
                  },
                  {
                    key: "overwhelm",
                    label: "Emotional Overwhelm",
                    desc: "Hopelessness, isolation",
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="rounded-lg border border-border bg-muted/20 p-2.5 text-[11px]"
                  >
                    <div className="flex items-center gap-1.5 font-bold text-foreground">
                      <span
                        className="size-1.5 rounded-full bg-primary"
                        aria-hidden="true"
                      />
                      <span>{item.label}</span>
                    </div>
                    <p className="mt-1 text-[10px] text-muted-foreground">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>

              <div className="rounded-lg border border-border/80 bg-muted/10 p-3 text-[11px] leading-relaxed text-muted-foreground">
                <span className="font-semibold text-foreground">
                  Safety Notice:{" "}
                </span>
                Absence of keywords does not equate to absence of harm.
                Responders must always probe contextually.
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Experimental ML Prediction Card (DAIC-WOZ Model) */}
      {mlResult && (
        <section
          aria-label="Experimental machine learning model prediction"
          className="mt-6 overflow-hidden rounded-2xl border border-primary/30 bg-card shadow-xs"
        >
          <div className="border-b border-primary/20 bg-primary/5 px-5 py-4 sm:px-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <BrainCircuit
                  className="size-5 text-primary"
                  aria-hidden="true"
                />
                <h3 className="text-base font-bold text-foreground">
                  Experimental ML Prediction (DAIC-WOZ PHQ8_Binary)
                </h3>
              </div>
              <Badge
                variant="outline"
                className="border-primary/30 bg-primary/10 text-xs font-semibold text-primary"
              >
                Model: {mlResult.model_version}
              </Badge>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              TF-IDF and Logistic Regression research model. Its output is a
              DAIC-WOZ PHQ8_Binary depression-screening label, not a trauma or
              PTSD diagnosis.
            </p>
          </div>

          <div className="p-5 sm:p-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-border bg-muted/20 p-4">
                <p className="text-xs font-semibold text-muted-foreground">
                  Predicted Classification
                </p>
                <p className="mt-2 text-2xl font-black text-foreground">
                  {mlResult.predicted_label}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Binary distress classification
                </p>
              </div>

              <div className="rounded-xl border border-border bg-muted/20 p-4">
                <p className="text-xs font-semibold text-muted-foreground">
                  Class 0 Probability (PHQ8_Binary = 0)
                </p>
                <p className="mt-2 text-2xl font-black text-foreground">
                  {((mlResult.class_probabilities["0"] ?? 0) * 100).toFixed(1)}%
                </p>
                <div className="mt-2 h-1.5 w-full rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-status-low"
                    style={{
                      width: `${(mlResult.class_probabilities["0"] ?? 0) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div className="rounded-xl border border-border bg-muted/20 p-4">
                <p className="text-xs font-semibold text-muted-foreground">
                  Class 1 Probability (PHQ8_Binary = 1)
                </p>
                <p className="mt-2 text-2xl font-black text-foreground">
                  {((mlResult.class_probabilities["1"] ?? 0) * 100).toFixed(1)}%
                </p>
                <div className="mt-2 h-1.5 w-full rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-status-urgent"
                    style={{
                      width: `${(mlResult.class_probabilities["1"] ?? 0) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-start gap-3 rounded-lg border border-amber-300/40 bg-amber-500/10 p-3.5 text-xs text-foreground">
              <ShieldAlert
                className="mt-0.5 size-4 shrink-0 text-amber-600"
                aria-hidden="true"
              />
              <div>
                <strong className="font-bold text-amber-900 dark:text-amber-200">
                  Research Evaluation Only:{" "}
                </strong>
                <span className="text-muted-foreground">
                  {mlResult.label_meaning}.{" "}
                </span>
                <span className="text-muted-foreground">
                  This experimental model is not clinically certified and must
                  not be used as an autonomous diagnosis of PTSD or
                  psychological trauma. Human evaluation is mandatory.
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Render Assessment Result Component */}
      {result && createdId && (
        <AssessmentResultPage
          result={result}
          narrative={sourceText}
          onOpen={() => onOpenCase(createdId)}
          onNotify={onNotify}
        />
      )}
    </>
  );
}
