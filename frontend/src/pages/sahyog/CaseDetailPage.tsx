import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock3,
  Database,
  HeartHandshake,
  MessageSquareText,
  Save,
  ShieldAlert,
  UserRound,
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
  onUpdate: (
    id: string,
    updates: Partial<DemoCase>,
    history?: string,
  ) => void | Promise<void>;
  onNavigate: (view: View) => void;
  onNotify: (message: string) => void;
}

const reviewStatuses: ReviewStatus[] = [
  "New",
  "Pending review",
  "In review",
  "Reviewed",
  "Referred",
  "Follow-up requested",
  "Closed",
];

export function CaseDetailPage({
  item,
  referrals,
  onBack,
  onUpdate,
  onNavigate,
  onNotify,
}: CaseDetailPageProps) {
  const [notes, setNotes] = useState(item.notes);
  const [assignedResponder, setAssignedResponder] = useState(
    normalizeResponder(item.assigned),
  );
  const [savedNotesFeedback, setSavedNotesFeedback] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setNotes(item.notes);
    setAssignedResponder(normalizeResponder(item.assigned));
    setSavedNotesFeedback(false);
  }, [item.id, item.notes, item.assigned]);

  const isSubmittedComplaint = item.id.startsWith("DB-");
  const summary = getCaseDescription({
    summary: item.summary,
    narrative: "",
  });
  const description = getCaseDescription(item);
  const notesChanged = notes !== item.notes;

  const saveUpdate = async (
    updates: Partial<DemoCase>,
    historyMessage: string,
    successMessage: string,
  ) => {
    setIsUpdating(true);
    try {
      await onUpdate(item.id, updates, historyMessage);
      onNotify(successMessage);
      return true;
    } catch {
      onNotify("The case change could not be saved. Please try again.");
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveNotes = async () => {
    if (isUpdating || !notesChanged) return;
    if (
      await saveUpdate(
        { notes },
        "Responder notes updated",
        "Case notes updated successfully.",
      )
    ) {
      setSavedNotesFeedback(true);
    }
  };

  const handleAssignResponder = async () => {
    if (isUpdating) return;
    const responder = assignedResponder.trim();
    if (!responder) {
      onNotify("Enter a responder name before assigning this case.");
      return;
    }
    if (
      responder.toLowerCase() ===
      normalizeResponder(item.assigned).toLowerCase()
    ) {
      onNotify("This responder is already assigned to the case.");
      return;
    }
    await saveUpdate(
      { assigned: responder },
      `Responder assigned to "${responder}"`,
      `Case assigned to ${responder}.`,
    );
  };

  const handleUnassignResponder = async () => {
    if (isUpdating) return;
    if (
      await saveUpdate(
        { assigned: "" },
        "Responder unassigned from case",
        "Responder unassigned from this case.",
      )
    ) {
      setAssignedResponder("");
    }
  };

  const handleStatusChange = async (nextStatus: ReviewStatus) => {
    if (isUpdating) return;
    await saveUpdate(
      { status: nextStatus },
      `Review status updated to "${nextStatus}"`,
      `Case status changed to ${nextStatus}.`,
    );
  };

  return (
    <>
      <div className="mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="-ml-2 gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          Back to Case Management
        </Button>
      </div>

      <PageIntro
        eyebrow={`CASE RECORD / ${item.id}`}
        title={`Case ${item.id}`}
        description="Review the intake, screening signals, responder notes, and support coordination in one place."
        action={
          <div className="flex flex-wrap items-center gap-2">
            {isSubmittedComplaint && (
              <Badge
                variant="outline"
                className="gap-1 border-primary/30 bg-primary/5 text-xs font-semibold text-primary"
              >
                <Database className="size-3" aria-hidden="true" />
                Submitted complaint
              </Badge>
            )}
            <StatusBadge status={item.status} />
            {item.status !== "New" && (
              <PriorityBadge priority={item.priority} />
            )}
          </div>
        }
      />

      <DemoNotice>
        <span className="font-semibold text-[#78511B]">
          {isSubmittedComplaint
            ? "Confidential intake record."
            : "Illustrative case."}
        </span>{" "}
        Automated indicators are for review support only; they are not a
        clinical diagnosis. A trained human responder must evaluate the case
        before intervention or closure.
      </DemoNotice>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryTile
          icon={<Clock3 className="size-4" aria-hidden="true" />}
          label="Registered"
          value={item.date || "Not recorded"}
        />
        <SummaryTile
          icon={<UserRound className="size-4" aria-hidden="true" />}
          label="Assigned responder"
          value={normalizeResponder(item.assigned) || "Unassigned"}
        />
        <SummaryTile
          icon={<ShieldAlert className="size-4" aria-hidden="true" />}
          label="Screening score"
          value={`${item.score} / 100`}
          detail="Rule-based indicator"
        />
        <SummaryTile
          icon={<MessageSquareText className="size-4" aria-hidden="true" />}
          label="Care referrals"
          value={String(referrals.length)}
          detail={
            referrals.length === 1 ? "Related referral" : "Related referrals"
          }
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.8fr)]">
        <div className="min-w-0 space-y-6">
          <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <SectionHeading
              title="Intake narrative"
              caption={`Language: ${item.language || "Not recorded"} · Intake date: ${item.date || "Not recorded"}`}
            />
            <div className="space-y-4 p-5 sm:p-6">
              {!isSubmittedComplaint &&
                summary !== "No description provided yet." && (
                  <div className="rounded-lg border border-primary/15 bg-primary/5 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                      Intake summary
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-foreground">
                      {summary}
                    </p>
                  </div>
                )}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Narrative statement
                </p>
                <blockquote className="mt-2 whitespace-pre-wrap break-words rounded-lg border border-border bg-muted/20 p-4 text-sm leading-relaxed text-foreground">
                  {description}
                </blockquote>
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <SectionHeading
              title="Observable text indicators"
              caption="Phrase matches surfaced by the rule-based screening"
            />
            {item.indicators.length ? (
              <div className="divide-y divide-border">
                {item.indicators.map((indicator, index) => (
                  <div
                    key={`${indicator.key}-${index}`}
                    className="grid gap-2 px-5 py-4 sm:grid-cols-[minmax(150px,0.65fr)_minmax(0,1.35fr)] sm:gap-5"
                  >
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {indicator.label}
                      </p>
                      <Badge variant="secondary" className="mt-1.5 text-[10px]">
                        {indicator.key}
                      </Badge>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      “{indicator.evidence}”
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="p-5 text-sm leading-relaxed text-muted-foreground">
                No configured distress phrases matched this narrative. The
                absence of flags does not establish safety; human review is
                still required.
              </p>
            )}
          </section>

          <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <SectionHeading
              title="Responder notes"
              caption="Document follow-up, observations, and coordination steps."
            />
            <div className="space-y-3 p-5 sm:p-6">
              <label htmlFor="responder-notes" className="sr-only">
                Responder notes
              </label>
              <Textarea
                id="responder-notes"
                value={notes}
                disabled={isUpdating}
                onChange={(event) => {
                  setNotes(event.target.value);
                  setSavedNotesFeedback(false);
                }}
                placeholder="Add responder notes or follow-up actions…"
                rows={5}
                className="resize-y text-sm leading-relaxed"
              />
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-muted/30 px-3 py-2.5">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-foreground">
                    {notesChanged
                      ? "You have unsaved changes"
                      : savedNotesFeedback
                        ? "Notes saved"
                        : "All changes saved"}
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {notes.length} characters
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={handleSaveNotes}
                  disabled={!notesChanged || isUpdating}
                  className="shrink-0 gap-2"
                >
                  {notesChanged ? (
                    <Save className="size-3.5" aria-hidden="true" />
                  ) : (
                    <CheckCircle2 className="size-3.5" aria-hidden="true" />
                  )}
                  {notesChanged ? "Save notes" : "Saved"}
                </Button>
              </div>
            </div>
          </section>
        </div>

        <aside className="min-w-0 space-y-6">
          <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <SectionHeading
              title="Review & next steps"
              caption="Changes are recorded in the case activity."
            />
            <div className="space-y-4 p-5">
              <div>
                <label
                  htmlFor="assigned-responder"
                  className="block text-sm font-medium text-foreground"
                >
                  Assign responder
                </label>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Enter the name of the responder responsible for this case.
                </p>
                <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                  <input
                    id="assigned-responder"
                    type="text"
                    value={assignedResponder}
                    disabled={isUpdating}
                    onChange={(event) =>
                      setAssignedResponder(event.target.value)
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        handleAssignResponder();
                      }
                    }}
                    placeholder="Enter responder name"
                    className="h-10 min-w-0 flex-1 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  />
                  <Button
                    size="sm"
                    className="min-h-10 gap-1.5"
                    onClick={handleAssignResponder}
                    disabled={
                      isUpdating ||
                      !assignedResponder.trim() ||
                      assignedResponder.trim().toLowerCase() ===
                        normalizeResponder(item.assigned).toLowerCase()
                    }
                  >
                    <UserRound className="size-3.5" aria-hidden="true" />
                    Assign
                  </Button>
                </div>
                {item.assigned && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="mt-1 h-8 px-0 text-xs text-muted-foreground hover:text-foreground"
                    onClick={handleUnassignResponder}
                    disabled={isUpdating}
                  >
                    Unassign current responder
                  </Button>
                )}
              </div>

              <div>
                <label
                  htmlFor="status-select"
                  className="block text-sm font-medium text-foreground"
                >
                  Review status
                </label>
                <select
                  id="status-select"
                  aria-label="Change case status"
                  value={item.status}
                  disabled={isUpdating}
                  onChange={(event) =>
                    handleStatusChange(event.target.value as ReviewStatus)
                  }
                  className="mt-2 h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {reviewStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div className="rounded-lg border border-border bg-muted/20 p-3">
                <p className="text-xs font-medium text-foreground">
                  Current step
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {item.status === "Reviewed"
                    ? "This case is marked reviewed. Update the status if further follow-up is needed."
                    : item.status === "Follow-up requested"
                      ? "Follow-up has been requested. Record any next steps in responder notes."
                      : "Review the intake and screening signals before marking this case reviewed."}
                </p>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <Button
                  size="sm"
                  variant={item.status === "Reviewed" ? "secondary" : "outline"}
                  disabled={item.status === "Reviewed" || isUpdating}
                  className="min-h-10 gap-1.5"
                  onClick={() => {
                    void handleStatusChange("Reviewed");
                  }}
                >
                  <Check className="size-3.5" aria-hidden="true" />
                  {item.status === "Reviewed" ? "Reviewed" : "Mark reviewed"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="min-h-10 gap-1.5"
                  onClick={() => {
                    void saveUpdate(
                      { status: "Follow-up requested" },
                      "Follow-up protocol scheduled by responder",
                      "Follow-up protocol scheduled for case.",
                    );
                  }}
                  disabled={isUpdating}
                >
                  <MessageSquareText className="size-3.5" aria-hidden="true" />
                  {item.status === "Follow-up requested"
                    ? "Follow-up requested"
                    : "Request follow-up"}
                </Button>
              </div>

              <Button
                size="sm"
                variant="secondary"
                className="w-full gap-2"
                onClick={() => onNavigate("Referrals")}
              >
                <HeartHandshake className="size-4" aria-hidden="true" />
                Coordinate support referrals
                <ArrowRight className="ml-auto size-3.5" aria-hidden="true" />
              </Button>
            </div>
          </section>

          <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <SectionHeading
              title="Screening snapshot"
              caption="Rule-based score · Not a clinical diagnosis"
            />
            <div className="p-5">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Vulnerability score
                  </p>
                  <p className="mt-1 text-3xl font-bold tabular-nums text-foreground">
                    {item.score}
                    <span className="ml-1 text-sm font-medium text-muted-foreground">
                      / 100
                    </span>
                  </p>
                </div>
                <PriorityBadge priority={item.priority} />
              </div>
              <div
                className="mt-4 h-2.5 overflow-hidden rounded-full bg-muted"
                role="progressbar"
                aria-label="Rule-based screening score"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.max(0, Math.min(100, item.score))}
              >
                <div
                  className={`h-full rounded-full ${
                    item.priority === "Urgent review"
                      ? "bg-status-urgent"
                      : item.priority === "High"
                        ? "bg-status-high"
                        : item.priority === "Moderate"
                          ? "bg-status-moderate"
                          : "bg-status-low"
                  }`}
                  style={{
                    width: `${Math.max(0, Math.min(100, item.score))}%`,
                  }}
                />
              </div>
              <div className="mt-4 flex items-start gap-2 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
                <ShieldAlert
                  className="mt-0.5 size-4 shrink-0 text-amber-600"
                  aria-hidden="true"
                />
                <span>
                  Human responder review is required before decisions about
                  intervention or case closure.
                </span>
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <SectionHeading title="Case activity" />
            <div className="p-5">
              {item.history.length ? (
                <ol className="relative space-y-0">
                  {item.history.map((event, index) => (
                    <li
                      key={`${event}-${index}`}
                      className="relative flex gap-3 pb-4 last:pb-0"
                    >
                      {index !== item.history.length - 1 && (
                        <span
                          className="absolute left-[7px] top-4 h-full w-px bg-border"
                          aria-hidden="true"
                        />
                      )}
                      <span
                        className="relative mt-1 flex size-4 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10"
                        aria-hidden="true"
                      >
                        <span className="size-1.5 rounded-full bg-primary" />
                      </span>
                      <div className="min-w-0 rounded-md bg-muted/25 px-3 py-2">
                        <p className="text-sm leading-relaxed text-foreground">
                          {event}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No activity has been recorded yet.
                </p>
              )}
            </div>
          </section>

          <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <SectionHeading
              title="Related referrals"
              action={
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onNavigate("Referrals")}
                  className="h-8 text-xs text-primary"
                >
                  Manage
                </Button>
              }
            />
            {referrals.length ? (
              <div className="divide-y divide-border">
                {referrals.map((referral) => (
                  <div
                    key={referral.id}
                    className="flex items-center justify-between gap-3 px-5 py-3.5"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground">
                        {referral.category}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        ID: {referral.id}
                      </p>
                    </div>
                    <StatusBadge status={referral.status} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-5">
                <div className="rounded-lg border border-dashed border-border bg-muted/20 px-4 py-5 text-center">
                  <HeartHandshake
                    className="mx-auto size-6 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <p className="mt-2 text-sm font-medium text-foreground">
                    No referrals linked
                  </p>
                  <p className="mx-auto mt-1 max-w-xs text-xs leading-relaxed text-muted-foreground">
                    Link a support service here to keep coordination details
                    connected to this case.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 gap-2"
                    onClick={() => onNavigate("Referrals")}
                  >
                    <HeartHandshake className="size-3.5" aria-hidden="true" />
                    Add referral
                  </Button>
                </div>
              </div>
            )}
          </section>
        </aside>
      </div>
    </>
  );
}

function normalizeResponder(value?: string | null) {
  const responder = value?.trim() ?? "";
  return responder.toLowerCase() === "unassigned" ? "" : responder;
}

function SummaryTile({
  icon,
  label,
  value,
  detail,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  detail?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="mt-2 truncate text-base font-semibold text-foreground">
        {value}
      </p>
      {detail && (
        <p className="mt-1 text-[11px] text-muted-foreground">{detail}</p>
      )}
    </div>
  );
}
