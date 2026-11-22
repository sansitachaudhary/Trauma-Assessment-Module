import { useState, type FormEvent } from "react";
import {
  CheckCircle2,
  HeartHandshake,
  Info,
  Plus,
  ShieldCheck,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  PageIntro,
  SectionHeading,
  StatusBadge,
  referralCategoryIcons,
} from "@/components/sahyog/shared";
import {
  referralCategories,
  type DemoCase,
  type DemoReferral,
  type ReferralCategory,
} from "@/lib/demo-data";

export interface ReferralsPageProps {
  referrals: DemoReferral[];
  cases: DemoCase[];
  onAdd: (referral: DemoReferral) => void;
  onUpdate: (id: string, status: DemoReferral["status"]) => void;
  onNotify: (message: string) => void;
}

export function ReferralsPage({
  referrals,
  cases,
  onAdd,
  onUpdate,
  onNotify,
}: ReferralsPageProps) {
  const [showForm, setShowForm] = useState(false);
  const [caseId, setCaseId] = useState(cases[0]?.id ?? "");
  const [category, setCategory] = useState<ReferralCategory>("Counselling");
  const [service, setService] = useState("Direct counselling referral");
  const [error, setError] = useState("");

  const create = (event: FormEvent) => {
    event.preventDefault();
    if (!caseId) {
      setError(
        "Please select an active case record before creating a referral.",
      );
      return;
    }

    const id = `RF-${String(26009 + referrals.length).padStart(5, "0")}`;
    onAdd({
      id,
      caseId,
      category,
      status: "Awaiting human approval",
      service: service || "Support referral intake",
      followUpDate: "Within 48 hours",
      notes: "Initiated via referral center dashboard",
      outcome: "Awaiting responder review",
      date: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    });

    setShowForm(false);
    setError("");
    onNotify(`Mock referral ${id} created for case ${caseId}.`);
  };

  return (
    <>
      <PageIntro
        eyebrow="WORKSPACE / CARE PATHWAYS"
        title="Referral Center"
        description="Coordinate specialized external care pathways including trauma-informed counselling, legal counsel, emergency protection, and medical aid under NHAAS 14566 protocols."
        action={
          <Button
            onClick={() => setShowForm((val) => !val)}
            className="gap-2 bg-primary font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Plus className="size-4" aria-hidden="true" />
            <span>Create New Referral</span>
          </Button>
        }
      />

      {/* Slide-out / Collapsible Referral Creation Form */}
      {showForm && (
        <form
          onSubmit={create}
          className="mt-5 overflow-hidden rounded-xl border border-primary/30 bg-card p-5 shadow-xs"
          aria-label="Create new referral form"
        >
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h2 className="text-sm font-bold text-foreground">
                Initiate Care Referral Pathway
              </h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Record a new referral for responder review. No automated
                messages are dispatched.
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Close referral form"
              onClick={() => setShowForm(false)}
              className="size-8 text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" aria-hidden="true" />
            </Button>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div>
              <label
                htmlFor="ref-case-select"
                className="block text-xs font-semibold text-foreground"
              >
                Select Case Record <span className="text-status-urgent">*</span>
              </label>
              <select
                id="ref-case-select"
                value={caseId}
                onChange={(event) => setCaseId(event.target.value)}
                className="mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {cases.map((item) => (
                  <option value={item.id} key={item.id}>
                    {item.id} — {item.language} (
                    {item.status === "New" ? "Not assessed" : item.priority})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="ref-category-select"
                className="block text-xs font-semibold text-foreground"
              >
                Referral Category <span className="text-status-urgent">*</span>
              </label>
              <select
                id="ref-category-select"
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value as ReferralCategory)
                }
                className="mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {referralCategories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="ref-service-input"
                className="block text-xs font-semibold text-foreground"
              >
                Service Description
              </label>
              <input
                id="ref-service-input"
                type="text"
                value={service}
                onChange={(e) => setService(e.target.value)}
                placeholder="e.g. Trauma counselling session"
                className="mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>
          </div>

          {error && (
            <p
              role="alert"
              className="mt-3 text-xs font-semibold text-status-urgent"
            >
              {error}
            </p>
          )}

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
            <Button
              size="sm"
              type="submit"
              className="gap-2 bg-primary font-semibold text-primary-foreground"
            >
              <CheckCircle2 className="size-3.5" aria-hidden="true" />
              <span>Register Pending Referral</span>
            </Button>
            <span className="text-[11px] text-muted-foreground">
              Human approval required prior to external provider handover
            </span>
          </div>
        </form>
      )}

      {/* Referral Queue Table */}
      <section
        aria-label="Active referral queue"
        className="mt-6 overflow-hidden rounded-xl border border-border bg-card shadow-xs"
      >
        <SectionHeading
          title="Active Referral Queue"
          caption={`${referrals.length} referrals recorded across current session`}
        />
        <div
          className="overflow-x-auto"
          tabIndex={0}
          role="region"
          aria-label="Referrals table"
        >
          <table className="w-full min-w-[700px] text-left text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/20 text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
                <th scope="col" className="px-5 py-3.5 font-semibold">
                  Referral ID
                </th>
                <th scope="col" className="px-4 py-3.5 font-semibold">
                  Target Case
                </th>
                <th scope="col" className="px-4 py-3.5 font-semibold">
                  Category
                </th>
                <th scope="col" className="px-4 py-3.5 font-semibold">
                  Service Details
                </th>
                <th scope="col" className="px-4 py-3.5 font-semibold">
                  Date
                </th>
                <th scope="col" className="px-4 py-3.5 font-semibold">
                  Status
                </th>
                <th scope="col" className="px-4 py-3.5 font-semibold">
                  Update Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {referrals.map((item) => (
                <tr
                  key={item.id}
                  className="transition-colors hover:bg-muted/40"
                >
                  <td className="px-5 py-3.5 font-bold text-foreground">
                    {item.id}
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-primary">
                    {item.caseId}
                  </td>
                  <td className="px-4 py-3.5 font-medium text-foreground">
                    {item.category}
                  </td>
                  <td className="px-4 py-3.5 text-muted-foreground">
                    {item.service || "Standard intake"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-muted-foreground">
                    {item.date}
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-4 py-3.5">
                    <select
                      aria-label={`Update referral status for ${item.id}`}
                      value={item.status}
                      onChange={(event) =>
                        onUpdate(
                          item.id,
                          event.target.value as DemoReferral["status"],
                        )
                      }
                      className="h-8 rounded-md border border-input bg-background px-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <option value="Awaiting human approval">
                        Awaiting approval
                      </option>
                      <option value="Approved">Approved</option>
                      <option value="In progress">In progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {referrals.length === 0 && (
            <div className="px-5 py-12 text-center text-sm text-muted-foreground">
              No active referrals found in the current workspace queue.
            </div>
          )}
        </div>
      </section>

      {/* Directory Knowledge Cards */}
      <div className="mt-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Verified NHAAS 14566 Referral Pathways
        </h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {referralCategories.map((item) => {
            const Icon = referralCategoryIcons[item];
            return (
              <div
                key={item}
                className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-2xs"
              >
                <div
                  className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary"
                  aria-hidden="true"
                >
                  <Icon className="size-4.5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">{item}</p>
                  <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                    Connect callers with authorized partner specialists under
                    emergency response guidelines.
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
