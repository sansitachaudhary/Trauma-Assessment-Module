import type { ReactNode } from "react";
import {
  Activity,
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileChartColumnIncreasing,
  FilePlus2,
  HeartHandshake,
  Home,
  Info,
  LifeBuoy,
  Search,
  Settings2,
  ShieldAlert,
  ShieldCheck,
  User,
  UsersRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { DemoCase, DemoReferral, Priority, ReferralCategory } from "@/lib/demo-data";

export type View =
  | "Overview"
  | "New Assessment"
  | "Case Management"
  | "Referrals"
  | "Reports"
  | "Settings"
  | "Case detail";

export const navigation: {
  label: Exclude<View, "Case detail">;
  icon: typeof Home;
  group: "WORKSPACE" | "ADMINISTRATION";
}[] = [
  { label: "Overview", icon: Home, group: "WORKSPACE" },
  { label: "New Assessment", icon: FilePlus2, group: "WORKSPACE" },
  { label: "Case Management", icon: BriefcaseBusiness, group: "WORKSPACE" },
  { label: "Referrals", icon: HeartHandshake, group: "WORKSPACE" },
  { label: "Reports", icon: FileChartColumnIncreasing, group: "ADMINISTRATION" },
  { label: "Settings", icon: Settings2, group: "ADMINISTRATION" },
];

export const referralCategoryIcons: Record<ReferralCategory, typeof HeartHandshake> = {
  Counselling: HeartHandshake,
  "Legal aid": BookOpen,
  "Medical assistance": Activity,
  "Police intervention": ShieldAlert,
  "Witness protection": ShieldCheck,
  "Emergency support": LifeBuoy,
};

export function PageIntro({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div className="min-w-0">
        <p className="mb-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#328B86]">
          {eyebrow}
        </p>
        <h2 className="text-2xl font-extrabold tracking-tight text-[#123052] sm:text-3xl">
          {title}
        </h2>
        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-[#5A6E82]">
          {description}
        </p>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function DemoNotice({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-[#E8DAC0] bg-[#FCF8EE] px-4 py-3 text-xs leading-relaxed text-[#78511B] shadow-xs">
      <Info className="mt-0.5 size-4 shrink-0 text-[#9B6C28]" />
      <div className="flex-1">{children}</div>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
  icon: Icon = Info,
}: {
  title: string;
  description: string;
  action?: ReactNode;
  icon?: typeof Info;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#DCE7E2] bg-white px-6 py-14 text-center">
      <div className="flex size-12 items-center justify-center rounded-2xl bg-[#EAF5F1] text-[#328B86]">
        <Icon className="size-6" />
      </div>
      <h3 className="mt-4 text-base font-bold text-[#123052]">{title}</h3>
      <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-[#5A6E82]">
        {description}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  tone = "brand",
}: {
  label: string;
  value: string | number;
  sub: string;
  icon: typeof Activity;
  tone?: "brand" | "amber" | "red" | "green";
}) {
  const toneClasses = {
    brand: "bg-[#EAF5F1] text-[#328B86] border-[#C8DFD7]",
    amber: "bg-[#FCF8EE] text-[#9B6C28] border-[#E8DAC0]",
    red: "bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]",
    green: "bg-[#EBF7F2] text-[#248261] border-[#C2E8DA]",
  };

  return (
    <div className="group rounded-2xl border border-[#DCE7E2] bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#328B86] hover:shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-[#5A6E82]">{label}</p>
          <p className="mt-2 text-3xl font-extrabold tabular-nums leading-none text-[#123052]">
            {value}
          </p>
        </div>
        <div
          className={`flex size-10 shrink-0 items-center justify-center rounded-xl border ${toneClasses[tone]} shadow-xs transition-transform duration-200 group-hover:scale-105`}
        >
          <Icon className="size-5" strokeWidth={2} />
        </div>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-[#5A6E82]/80">{sub}</p>
    </div>
  );
}

const statusColors: Record<string, { bg: string; text: string; border: string }> = {
  Reviewed: { bg: "bg-[#EBF7F2]", text: "text-[#248261]", border: "border-[#C2E8DA]" },
  Completed: { bg: "bg-[#EBF7F2]", text: "text-[#248261]", border: "border-[#C2E8DA]" },
  "In review": { bg: "bg-[#EAF5F1]", text: "text-[#328B86]", border: "border-[#C8DFD7]" },
  "In progress": { bg: "bg-[#EAF5F1]", text: "text-[#328B86]", border: "border-[#C8DFD7]" },
  Approved: { bg: "bg-[#EAF5F1]", text: "text-[#328B86]", border: "border-[#C8DFD7]" },
  Referred: { bg: "bg-[#EAF5F1]", text: "text-[#328B86]", border: "border-[#C8DFD7]" },
  New: { bg: "bg-[#EBF2F7]", text: "text-[#123052]", border: "border-[#CCDCE8]" },
  "Follow-up requested": { bg: "bg-[#FCF8EE]", text: "text-[#9B6C28]", border: "border-[#E8DAC0]" },
  "Awaiting human approval": {
    bg: "bg-[#FCF8EE]",
    text: "text-[#9B6C28]",
    border: "border-[#E8DAC0]",
  },
  Suggested: { bg: "bg-[#FCF8EE]", text: "text-[#9B6C28]", border: "border-[#E8DAC0]" },
  "Pending review": { bg: "bg-[#FFF7ED]", text: "text-[#D97706]", border: "border-[#FED7AA]" },
  Closed: { bg: "bg-[#F3F4F6]", text: "text-[#6B7280]", border: "border-[#E5E7EB]" },
  Cancelled: { bg: "bg-[#F3F4F6]", text: "text-[#6B7280]", border: "border-[#E5E7EB]" },
};

export function StatusBadge({ status }: { status: string }) {
  const conf = statusColors[status] ?? {
    bg: "bg-[#FFF7ED]",
    text: "text-[#D97706]",
    border: "border-[#FED7AA]",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${conf.bg} ${conf.text} ${conf.border}`}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  const conf =
    priority === "Urgent review"
      ? "border-[#FECACA] bg-[#FEF2F2] text-[#DC2626]"
      : priority === "High"
        ? "border-[#FED7AA] bg-[#FFF7ED] text-[#D97706]"
        : priority === "Moderate"
          ? "border-[#E8DAC0] bg-[#FCF8EE] text-[#9B6C28]"
          : "border-[#C2E8DA] bg-[#EBF7F2] text-[#248261]";

  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${conf}`}
    >
      {priority}
    </span>
  );
}

export function SectionHeading({
  title,
  caption,
  action,
}: {
  title: string;
  caption?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 border-b border-[#EBF2EE] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 className="text-sm font-bold text-[#123052]">{title}</h3>
        {caption && <p className="mt-0.5 text-xs text-[#5A6E82]">{caption}</p>}
      </div>
      {action}
    </div>
  );
}

export function CaseTable({
  cases,
  onOpenCase,
  compact = false,
}: {
  cases: DemoCase[];
  onOpenCase: (id: string) => void;
  compact?: boolean;
}) {
  const displayCases = compact ? cases.slice(0, 5) : cases;

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[700px] text-left text-xs">
        <thead>
          <tr className="border-b border-[#EBF2EE] bg-[#FCFBF8] text-[10px] font-bold uppercase tracking-[0.1em] text-[#5A6E82]">
            <th className="px-5 py-3">Case ID</th>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Language</th>
            <th className="px-4 py-3">Review status</th>
            <th className="px-4 py-3">Assigned responder</th>
            <th className="px-4 py-3">Priority</th>
            <th className="px-5 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#EBF2EE]">
          {displayCases.map((item) => (
            <tr
              key={item.id}
              className="group transition-colors hover:bg-[#F4FAF7]/50"
            >
              <td className="px-5 py-3.5">
                <button
                  type="button"
                  onClick={() => onOpenCase(item.id)}
                  className="font-bold text-[#123052] transition hover:text-[#328B86] hover:underline"
                >
                  {item.id}
                </button>
              </td>
              <td className="whitespace-nowrap px-4 py-3.5 text-[#5A6E82]">
                {item.date}
              </td>
              <td className="px-4 py-3.5 font-medium text-[#123052]">
                {item.language}
              </td>
              <td className="px-4 py-3.5">
                <StatusBadge status={item.status} />
              </td>
              <td className="px-4 py-3.5 text-[#5A6E82]">
                <div className="flex items-center gap-1.5">
                  <User className="size-3.5 text-[#5A6E82]/60" />
                  <span>{item.assigned}</span>
                </div>
              </td>
              <td className="px-4 py-3.5">
                <PriorityBadge priority={item.priority} />
              </td>
              <td className="px-5 py-3.5 text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label={`Open case ${item.id}`}
                  onClick={() => onOpenCase(item.id)}
                  className="h-8 gap-1.5 rounded-lg px-2.5 text-xs font-semibold text-[#123052] hover:bg-[#EAF5F1] hover:text-[#328B86]"
                >
                  <span>Review</span>
                  <ArrowRight className="size-3.5" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {cases.length === 0 && (
        <div className="px-5 py-12 text-center text-sm text-[#5A6E82]">
          No cases found matching your criteria.
        </div>
      )}
    </div>
  );
}

export function ReferralMiniList({ referrals }: { referrals: DemoReferral[] }) {
  return (
    <div className="divide-y divide-[#EBF2EE]">
      {referrals.length ? (
        referrals.map((referral) => (
          <div
            key={referral.id}
            className="flex items-center justify-between gap-3 px-5 py-3.5 text-xs transition hover:bg-[#F4FAF7]/40"
          >
            <div>
              <p className="font-semibold text-[#123052]">{referral.category}</p>
              <p className="mt-0.5 text-[11px] text-[#5A6E82]">
                {referral.service || "Service intake"} · ID: {referral.id}
              </p>
            </div>
            <StatusBadge status={referral.status} />
          </div>
        ))
      ) : (
        <p className="px-5 py-6 text-center text-xs text-[#5A6E82]">
          No active referrals for this case.
        </p>
      )}
    </div>
  );
}
