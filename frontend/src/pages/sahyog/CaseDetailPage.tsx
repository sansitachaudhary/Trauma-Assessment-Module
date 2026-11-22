import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  Database,
  HeartHandshake,
  MessageSquareText,
  Save,
  ShieldAlert,
  ShieldCheck,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  DemoNotice,
  PageIntro,
  PriorityBadge,
  SectionHeading,
  StatusBadge,
  type View,
} from "@/components/sahyog/shared";
import type { DemoCase, DemoReferral, ReviewStatus } from "@/lib/demo-data";
import { getCaseDescription } from "@/lib/case-description";

export interface CaseDetailPageProps {
  item: DemoCase;
  referrals: DemoReferral[];
  onBack: () => void;
  onUpdate: (id: string, updates: Partial<DemoCase>, history?: string) => void;
  onNavigate: (view: View) => void;
  onNotify: (message: string) => void;
}

export function CaseDetailPage({
  item,
  referrals,
  onBack,
  onUpdate,
  onNavigate,
  onNotify,
}: CaseDetailPageProps) {
  const [notes, setNotes] = useState(item.notes);
  const [savedNotesFeedback, setSavedNotesFeedback] = useState(false);

  const isSubmittedComplaint = item.id.startsWith("DB-");
  const summary = getCaseDescription({ summary: item.summary, narrative: "" });
  const description = getCaseDescription(item);

  const handleSaveNotes = () => {
    onUpdate(item.id, { notes }, "Responder notes updated");
    setSavedNotesFeedback(true);
    onNotify("Case notes updated successfully.");
    setTimeout(() => setSavedNotesFeedback(false), 2500);
  };

  return (
    <>
      <div className="mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="-ml-2 gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary"
        >
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          <span>Back to Case Management</span>
        </Button>
      </div>

      <PageIntro
        eyebrow={`CASE RECORD / ${item.id}`}
        title={`Case ${item.id}`}
        description="Comprehensive intake report, observable text distress indicators, responder documentation, and referral coordination."
        action={
          <div className="flex flex-wrap items-center gap-2">
            {isSubmittedComplaint ? (
              <Badge
                variant="outline"
                className="gap-1 border-primary/30 bg-[#e8f4f0] text-xs font-bold text-[#1a5f57]"
              >
                <Database className="size-3" aria-hidden="true" />
                Submitted Complaint
              </Badge>
            ) : null}
            <StatusBadge status={item.status} />
            {item.status === "New" ? (
              <span className="text-xs text-muted-foreground">
                Not assessed
              </span>
            ) : (
              <PriorityBadge priority={item.priority} />
            )}
          </div>
        }
      />

      <DemoNotice>
        <span className="font-bold text-[#78511B]">
          {isSubmittedComplaint
            ? "Helpline Intake Record · Confidential"
            : "Illustrative case."}
        </span>{" "}
        Distress indicator scores reflect transparent keyword screening and do
        not constitute a clinical psychiatric diagnosis. Mandatory human
        responder evaluation is required before initiating intervention or
        closing a case.
      </DemoNotice>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(300px,0.75fr)]">
        {/* Left Column: Complaint Narrative, Text Indicators, Notes */}
        <div className="space-y-6">
          {/* Narrative Summary */}
          <section className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
            <SectionHeading
              title="Complainant Narrative & Intake Details"
              caption={`Intake Date: ${item.date} · Language: ${item.language} · Assigned: ${item.assigned}`}
            />
            <div className="p-5 sm:p-6">
              {summary !== "No description provided yet." && (
                <div className="mb-4 rounded-lg bg-muted/20 p-3.5">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Triage Summary
                  </p>
                  <p className="mt-1 text-xs font-medium leading-relaxed text-foreground">
                    {summary}
                  </p>
                </div>
              )}

              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Complete Narrative Statement
                </p>
                <blockquote className="mt-2 rounded-lg border border-border bg-muted/10 p-4 text-xs italic leading-relaxed text-foreground">
                  “{description}”
                </blockquote>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <User
                    className="size-3.5 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <span>
                    Responder: <strong>{item.assigned}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock
                    className="size-3.5 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <span>
                    Date Registered: <strong>{item.date}</strong>
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Observable Text Indicators */}
          <section className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
            <SectionHeading
              title="Observable Text Indicators"
              caption="Direct phrase matches surfaced during automated screening"
            />
            {item.indicators.length ? (
              <div className="divide-y divide-border">
                {item.indicators.map((indicator, index) => (
                  <div
                    key={`${indicator.key}-${index}`}
                    className="grid gap-2 px-5 py-3.5 sm:grid-cols-[200px_minmax(0,1fr)] sm:items-center sm:gap-4"
                  >
                    <div>
                      <p className="text-xs font-bold text-foreground">
                        {indicator.label}
                      </p>
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        Category: {indicator.key}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      "{indicator.evidence}"
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-5 text-xs leading-relaxed text-muted-foreground">
                No configured distress phrases were matched in this narrative.
                The absence of flags does not imply safety; human evaluation is
                required.
              </div>
            )}
          </section>

          {/* Responder Clinical / Case Notes */}
          <section className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
            <SectionHeading
              title="Responder Clinical & Follow-up Notes"
              caption="Record confidential caller assessments, action items, and observations"
            />
            <div className="space-y-3 p-5 sm:p-6">
              <label htmlFor="responder-notes" className="sr-only">
                Responder notes
              </label>
              <Textarea
                id="responder-notes"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Enter notes from caller follow-up, immediate safety plans, or referral coordination..."
                rows={4}
                className="resize-y text-xs leading-relaxed focus-visible:ring-2 focus-visible:ring-primary"
              />
              <div className="flex items-center gap-3">
                <Button
                  size="sm"
                  onClick={handleSaveNotes}
                  className="gap-2 bg-primary text-xs font-bold text-primary-foreground hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <Save className="size-3.5" aria-hidden="true" />
                  <span>Save Notes</span>
                </Button>
                {savedNotesFeedback && (
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-status-low animate-fade-in">
                    <CheckCircle2 className="size-4" aria-hidden="true" />
                    <span>Notes saved to record</span>
                  </span>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Actions, Snapshot, Timeline, Referrals */}
        <div className="space-y-6">
          {/* Review Actions */}
          <section className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
            <SectionHeading title="Responder Review Actions" />
            <div className="space-y-4 p-5">
              <div>
                <label
                  htmlFor="status-select"
                  className="block text-xs font-semibold text-foreground"
                >
                  Update Review Status
                </label>
                <select
                  id="status-select"
                  aria-label="Change case status"
                  value={item.status}
                  onChange={(event) => {
                    const nextStatus = event.target.value as ReviewStatus;
                    onUpdate(
                      item.id,
                      { status: nextStatus },
                      `Review status updated to "${nextStatus}"`,
                    );
                    onNotify(`Case status changed to ${nextStatus}.`);
                  }}
                  className="mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <option value="New">New</option>
                  <option value="Pending review">Pending review</option>
                  <option value="In review">In review</option>
                  <option value="Reviewed">Reviewed</option>
                  <option value="Follow-up requested">
                    Follow-up requested
                  </option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 text-xs font-semibold focus-visible:ring-2 focus-visible:ring-primary"
                  onClick={() => {
                    onUpdate(
                      item.id,
                      { status: "Reviewed" },
                      "Marked as reviewed by trained responder",
                    );
                    onNotify("Case marked as Reviewed.");
                  }}
                >
                  <Check className="size-3.5" aria-hidden="true" />
                  <span>Mark Reviewed</span>
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 text-xs font-semibold focus-visible:ring-2 focus-visible:ring-primary"
                  onClick={() => {
                    onUpdate(
                      item.id,
                      { status: "Follow-up requested" },
                      "Follow-up protocol scheduled by responder",
                    );
                    onNotify("Follow-up protocol scheduled for case.");
                  }}
                >
                  <MessageSquareText className="size-3.5" aria-hidden="true" />
                  <span>Follow-up</span>
                </Button>
              </div>

              <Button
                size="sm"
                variant="secondary"
                className="w-full gap-2 text-xs font-semibold focus-visible:ring-2 focus-visible:ring-primary"
                onClick={() => onNavigate("Referrals")}
              >
                <HeartHandshake className="size-4" aria-hidden="true" />
                <span>Coordinate Support Referrals</span>
                <ArrowRight className="size-3.5 ml-auto" aria-hidden="true" />
              </Button>
            </div>
          </section>

          {/* Assessment Snapshot */}
          <section className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
            <SectionHeading title="Assessment Vulnerability Snapshot" />
            <div className="p-5">
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  Severe Vulnerability Index
                </span>
                <span className="text-2xl font-black tabular-nums text-foreground">
                  {item.score}
                  <span className="text-xs font-normal text-muted-foreground">
                    {" "}
                    / 100
                  </span>
                </span>
              </div>

              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full ${
                    item.priority === "Urgent review"
                      ? "bg-status-urgent"
                      : item.priority === "High"
                        ? "bg-status-high"
                        : item.priority === "Moderate"
                          ? "bg-status-moderate"
                          : "bg-status-low"
                  }`}
                  style={{ width: `${item.score}%` }}
                />
              </div>

              <div className="mt-3 flex items-center justify-between">
                <PriorityBadge priority={item.priority} />
                <span className="text-[11px] text-muted-foreground">
                  Rule-based screening score
                </span>
              </div>

              <div className="mt-4 flex items-center gap-2 border-t border-border pt-3 text-[11px] font-semibold text-status-high">
                <ShieldAlert className="size-4 shrink-0" aria-hidden="true" />
                <span>HUMAN OVERSIGHT MANDATORY</span>
              </div>
            </div>
          </section>

          {/* Case Audit Timeline */}
          <section className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
            <SectionHeading title="Case Activity Timeline" />
            <div className="p-5">
              <ul className="space-y-3" role="list">
                {item.history.map((event, index) => (
                  <li
                    key={`${event}-${index}`}
                    className="flex items-start gap-2.5 text-xs text-muted-foreground"
                  >
                    <span
                      className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary"
                      aria-hidden="true"
                    />
                    <span className="leading-relaxed">{event}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Related Referrals for this Case */}
          <section className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
            <SectionHeading
              title="Related Care Referrals"
              action={
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onNavigate("Referrals")}
                  className="h-7 text-xs text-primary hover:bg-primary/10"
                >
                  Manage
                </Button>
              }
            />
            <div className="divide-y divide-border">
              {referrals.length ? (
                referrals.map((referral) => (
                  <div
                    key={referral.id}
                    className="flex items-center justify-between gap-3 px-5 py-3 text-xs"
                  >
                    <div>
                      <p className="font-semibold text-foreground">
                        {referral.category}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        ID: {referral.id}
                      </p>
                    </div>
                    <StatusBadge status={referral.status} />
                  </div>
                ))
              ) : (
                <p className="px-5 py-6 text-center text-xs text-muted-foreground">
                  No referrals recorded yet for this case.
                </p>
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
