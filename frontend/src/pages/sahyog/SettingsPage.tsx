import {
  Info,
  Languages,
  RotateCcw,
  ShieldAlert,
  Sliders,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageIntro, SectionHeading } from "@/components/sahyog/shared";
import { defaultScoreSettings, type ScoreSettings } from "@/lib/demo-data";

export interface SettingsPageProps {
  settings: ScoreSettings;
  setSettings: (value: ScoreSettings) => void;
}

export function SettingsPage({
  settings,
  setSettings,
}: SettingsPageProps) {
  const updateWeight = (key: keyof ScoreSettings["weights"], value: number) =>
    setSettings({
      ...settings,
      weights: { ...settings.weights, [key]: value },
    });

  const updateThreshold = (
    key: keyof ScoreSettings["thresholds"],
    value: number,
  ) =>
    setSettings({
      ...settings,
      thresholds: { ...settings.thresholds, [key]: value },
    });

  const handleReset = () => {
    setSettings(defaultScoreSettings);
  };

  const totalWeights = Object.values(settings.weights).reduce((a, b) => a + b, 0);

  return (
    <>
      <PageIntro
        eyebrow="ADMINISTRATION / CONFIGURATION"
        title="Settings & Rule Weights"
        description="Configure interface preferences, transparent indicator weights for the Severe Vulnerability Index (SVI), and priority categorization thresholds for this browser session."
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="gap-1.5 text-xs font-semibold focus-visible:ring-2 focus-visible:ring-primary"
          >
            <RotateCcw className="size-3.5" aria-hidden="true" />
            <span>Reset to Standard Defaults</span>
          </Button>
        }
      />

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Interface Localization */}
        <section
          aria-label="Localization preferences"
          className="overflow-hidden rounded-xl border border-border bg-card shadow-xs"
        >
          <SectionHeading
            title="Interface & Helpline Preferences"
            caption="Adjust display parameters for this responder session"
          />
          <div className="space-y-4 p-5 sm:p-6">
            <div>
              <label htmlFor="pref-language" className="block text-xs font-semibold text-foreground">
                Preferred Interface Display Language
              </label>
              <select
                id="pref-language"
                defaultValue="English"
                className="mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <option value="English">English (EN)</option>
                <option value="Hindi">Hindi — हिंदी (HI)</option>
              </select>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-border/80 bg-muted/20 p-3.5">
              <Languages className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              <p className="text-xs leading-relaxed text-muted-foreground">
                Localization settings adjust client interface labels. Complainant intakes in Hindi or other languages remain preserved in their original verbatim text.
              </p>
            </div>
          </div>
        </section>

        {/* Observable Indicator Scoring Weights */}
        <section
          aria-label="Indicator weights configuration"
          className="overflow-hidden rounded-xl border border-border bg-card shadow-xs"
        >
          <SectionHeading
            title="Screening Indicator Weights"
            caption="Relative contribution of text distress markers (Capped at 100)"
            action={
              <Badge variant="outline" className="border-border bg-muted/30 text-xs font-bold text-foreground">
                Sum: {totalWeights} pts
              </Badge>
            }
          />
          <div className="space-y-5 p-5 sm:p-6">
            {[
              { key: "fear", label: "Expressed Fear & Panic", desc: "Phrases describing immediate terror or bodily trembling" },
              { key: "duration", label: "Prolonged Distress", desc: "Longstanding insomnia, chronic flashback episodes" },
              { key: "safety", label: "Stated Safety / Threat Concern", desc: "Explicit stalker, violence, or bodily endangerment" },
              { key: "overwhelm", label: "Emotional Overwhelm", desc: "Severe helplessness, despair, absence of social support" },
            ].map((item) => {
              const weightVal = settings.weights[item.key as keyof ScoreSettings["weights"]];
              return (
                <div key={item.key} className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-foreground">{item.label}</span>
                      <p className="text-[11px] text-muted-foreground">{item.desc}</p>
                    </div>
                    <span className="rounded-md bg-muted px-2 py-0.5 font-bold tabular-nums text-foreground">
                      {weightVal} pts
                    </span>
                  </div>
                  <input
                    id={`weight-${item.key}`}
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    aria-label={`${item.label} weight`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={weightVal}
                    value={weightVal}
                    onChange={(e) =>
                      updateWeight(item.key as keyof ScoreSettings["weights"], Number(e.target.value))
                    }
                    className="h-1.5 w-full cursor-pointer accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  />
                </div>
              );
            })}
          </div>
        </section>

        {/* Priority Categorization Cutoffs */}
        <section
          aria-label="Priority threshold cutoffs"
          className="overflow-hidden rounded-xl border border-border bg-card shadow-xs lg:col-span-2"
        >
          <SectionHeading
            title="Priority Categorization Thresholds"
            caption="Configure SVI cutoff points for triage queue prioritization (0–100 scale)"
          />
          <div className="grid gap-6 p-5 sm:grid-cols-3 sm:p-6">
            {[
              { key: "moderate", label: "Moderate Threshold", desc: "Triggers amber review badge", min: 10, max: 40 },
              { key: "high", label: "High Concern Threshold", desc: "Triggers orange review badge", min: 45, max: 70 },
              { key: "urgent", label: "Urgent Review Threshold", desc: "Fast-tracks to red safety queue", min: 75, max: 95 },
            ].map((item) => {
              const threshVal = settings.thresholds[item.key as keyof ScoreSettings["thresholds"]];
              return (
                <div key={item.key} className="rounded-xl border border-border/80 bg-muted/20 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground">{item.label}</span>
                    <span className="rounded-md bg-card px-2 py-0.5 text-xs font-black tabular-nums text-foreground shadow-2xs">
                      {threshVal}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">{item.desc}</p>
                  <input
                    id={`thresh-${item.key}`}
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    aria-label={`${item.label} cutoff score`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={threshVal}
                    value={threshVal}
                    onChange={(e) =>
                      updateThreshold(item.key as keyof ScoreSettings["thresholds"], Number(e.target.value))
                    }
                    className="mt-4 h-1.5 w-full cursor-pointer accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  />
                </div>
              );
            })}
          </div>
        </section>

        {/* Session Security & Oversight Notice */}
        <section className="overflow-hidden rounded-xl border border-status-urgent/30 bg-status-urgent/5 p-5 lg:col-span-2">
          <div className="flex items-start gap-3">
            <ShieldAlert className="mt-0.5 size-5 shrink-0 text-status-urgent" aria-hidden="true" />
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-status-urgent">
                Client Session Demonstration Scope
              </h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Settings adjusted here modify local triage calculations during this browser session. Production scoring policies for the NHAAS 14566 helpline are governed centrally by clinical supervisors and ethical review boards.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
