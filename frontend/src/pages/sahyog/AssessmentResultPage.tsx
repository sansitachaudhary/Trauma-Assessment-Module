import {
  ArrowRight,
  CheckCircle2,
  Copy,
  HeartHandshake,
  Info,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PriorityBadge, SectionHeading } from "@/components/sahyog/shared";
import type { assessDemonstration } from "@/lib/assessment-service";

export interface AssessmentResultProps {
  result: ReturnType<typeof assessDemonstration>;
  narrative: string;
  onOpen: () => void;
  onNotify: (message: string) => void;
}

export function AssessmentResultPage({
  result,
  narrative,
  onOpen,
  onNotify,
}: AssessmentResultProps) {
  const [copied, setCopied] = useState(false);

  const displayEvidence: { label: string; evidence: string }[] = result.indicators.length
    ? result.indicators
    : [
        {
          label: "No configured distress phrase matched",
          evidence: "No direct keyword matches found in narrative text. A person may still require safety and human support.",
        },
      ];

  const handleCopySummary = () => {
    const summary = [
      `SAHYOG AI Trauma Assessment Summary`,
      `Priority Tier: ${result.priority} (SVI Score: ${result.score}/100)`,
      `Indicators: ${result.indicators.map((i) => i.label).join(", ") || "None flagged"}`,
      `Narrative: "${narrative}"`,
      `Protocol: NHAAS 14566 · Human review required before action.`,
    ].join("\n");

    if (navigator.clipboard) {
      navigator.clipboard.writeText(summary);
      setCopied(true);
      onNotify("Clinical triage summary copied to clipboard.");
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <section
      className="mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-xs"
      aria-live="polite"
      aria-label="Assessment result summary"
    >
      <SectionHeading
        title="Assessment Result & Vulnerability Profile"
        caption="Rule-based distress screening with transparent scoring criteria"
        action={
          <Badge
            variant="outline"
            className="flex items-center gap-1.5 border-status-high/30 bg-status-high/10 text-xs font-bold text-status-high"
          >
            <ShieldAlert className="size-3.5" aria-hidden="true" />
            <span>MANDATORY RESPONDER REVIEW</span>
          </Badge>
        }
      />

      <div className="grid gap-0 lg:grid-cols-[280px_minmax(0,1fr)]">
        {/* Left Column: SVI Score Gauge & Tier */}
        <div className="border-b border-border bg-muted/10 p-5 sm:p-6 lg:border-b-0 lg:border-r">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
            Severe Vulnerability Index (SVI)
          </p>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-5xl font-black tabular-nums tracking-tight text-foreground">
              {result.score}
            </span>
            <span className="text-sm font-semibold text-muted-foreground">/ 100</span>
          </div>

          <div className="mt-3">
            <PriorityBadge priority={result.priority} />
          </div>

          <div className="mt-4">
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={result.score} aria-valuemin={0} aria-valuemax={100}>
              <div
                className={`h-full transition-all duration-500 ${
                  result.priority === "Urgent review"
                    ? "bg-status-urgent"
                    : result.priority === "High"
                      ? "bg-status-high"
                      : result.priority === "Moderate"
                        ? "bg-status-moderate"
                        : "bg-status-low"
                }`}
                style={{ width: `${result.score}%` }}
              />
            </div>
            <div className="mt-1.5 flex justify-between text-[10px] text-muted-foreground">
              <span>Low (0-24)</span>
              <span>Mod (25-49)</span>
              <span>High (50-74)</span>
              <span>Urgent (75+)</span>
            </div>
          </div>

          <div className="mt-6 rounded-lg border border-border bg-card p-3 text-[11px] leading-relaxed text-muted-foreground">
            <p className="font-semibold text-foreground">Transparent Screening Note</p>
            <p className="mt-1">
              Score is a simple weighted sum of observable phrases. It does not replace psychological or medical evaluation.
            </p>
          </div>
        </div>

        {/* Right Column: Detailed Indicators, Questions, Narrative */}
        <div className="p-5 sm:p-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Observed text indicators */}
            <div>
              <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <CheckCircle2 className="size-3.5 text-primary" aria-hidden="true" />
                Observed Text Indicators
              </h3>
              <div className="mt-3 space-y-3">
                {displayEvidence.map((item, index) => (
                  <div
                    key={`${item.label}-${index}`}
                    className="rounded-lg border border-border/80 bg-muted/20 p-3"
                  >
                    <p className="text-xs font-bold text-foreground">{item.label}</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      "{item.evidence}"
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Source narrative quote */}
            <div>
              <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <Info className="size-3.5 text-muted-foreground" aria-hidden="true" />
                Source Complainant Narrative
              </h3>
              <blockquote className="mt-3 max-h-48 overflow-y-auto rounded-lg border border-border bg-muted/20 p-3.5 text-xs leading-relaxed text-foreground italic">
                “{narrative}”
              </blockquote>
              <div className="mt-3 flex items-start gap-2 text-[11px] text-muted-foreground">
                <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-status-low" aria-hidden="true" />
                <span>Preliminary keyword indicators only. Verify details directly with the caller.</span>
              </div>
            </div>
          </div>

          {/* Suggested Follow-up Questions */}
          {result.suggestedQuestions && result.suggestedQuestions.length > 0 && (
            <div className="mt-6 border-t border-border pt-4">
              <h3 className="flex items-center gap-2 text-xs font-bold text-primary">
                <HeartHandshake className="size-4" aria-hidden="true" />
                Suggested Responder Clarification Questions
              </h3>
              <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                {result.suggestedQuestions.map((q, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 rounded-lg border border-border/70 bg-muted/20 p-3 text-xs leading-relaxed"
                  >
                    <span className="grid size-5 shrink-0 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground" aria-hidden="true">
                      {idx + 1}
                    </span>
                    <span className="text-foreground">{q}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Limitations & Missing Information */}
          {result.missingInformation && result.missingInformation.length > 0 && (
            <div className="mt-4 rounded-xl border border-border bg-muted/20 p-3.5 text-xs">
              <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-foreground">
                <Info className="size-3.5 text-primary" aria-hidden="true" />
                Assessment Context & Limitations
              </p>
              <ul className="mt-2 list-disc pl-4 space-y-1 text-[11px] text-muted-foreground">
                {result.missingInformation.map((info, idx) => (
                  <li key={idx}>{info}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Toolbar */}
          <div className="mt-6 flex flex-wrap items-center gap-2.5 border-t border-border pt-4">
            <Button
              size="sm"
              onClick={onOpen}
              className="gap-2 bg-primary font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span>Open Case Details</span>
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={handleCopySummary}
              className="gap-1.5 focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Copy className="size-3.5" aria-hidden="true" />
              <span>{copied ? "Copied!" : "Copy Clinical Summary"}</span>
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                onNotify("Follow-up noted in case records. Follow standard helpline protocols.")
              }
              className="gap-1.5 focus-visible:ring-2 focus-visible:ring-primary"
            >
              <RotateCcw className="size-3.5" aria-hidden="true" />
              <span>Request Follow-up</span>
            </Button>

            <Button
              size="sm"
              variant="secondary"
              onClick={() =>
                onNotify("Referral directory options available in Referral Center.")
              }
              className="gap-1.5 text-foreground focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span>Explore Referrals</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export { AssessmentResultPage as AssessmentResult };