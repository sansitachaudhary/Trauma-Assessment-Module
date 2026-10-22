import type { ReactNode } from "react";
import {
  Activity, ArrowRight, BookOpen, BriefcaseBusiness, FileChartColumnIncreasing, FilePlus2, HeartHandshake,
  Info, LifeBuoy, Settings2, ShieldAlert, ShieldCheck, Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { DemoCase, DemoReferral, Priority, ReferralCategory } from "@/lib/demo-data";

export type View = "Overview" | "New Assessment" | "Case Management" | "Referrals" | "Reports" | "Settings" | "Case detail";

export const navigation: { label: Exclude<View, "Case detail">; icon: typeof Home; group: "WORKSPACE" | "ADMINISTRATION" }[] = [
  { label: "Overview", icon: Home, group: "WORKSPACE" },
  { label: "New Assessment", icon: FilePlus2, group: "WORKSPACE" },
  { label: "Case Management", icon: BriefcaseBusiness, group: "WORKSPACE" },
  { label: "Referrals", icon: HeartHandshake, group: "WORKSPACE" },
  { label: "Reports", icon: FileChartColumnIncreasing, group: "ADMINISTRATION" },
  { label: "Settings", icon: Settings2, group: "ADMINISTRATION" },
];

export const referralCategoryIcons: Record<ReferralCategory, typeof HeartHandshake> = {
  "Counselling": HeartHandshake,
  "Legal aid": BookOpen,
  "Medical assistance": Activity,
  "Police intervention": ShieldAlert,
  "Witness protection": ShieldCheck,
  "Emergency support": LifeBuoy,
};

export function PageIntro({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) {
  return <div className="mb-7 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
    <div className="min-w-0">
      <p className="mb-2 text-[10px] font-semibold tracking-[0.16em] text-primary">{eyebrow}</p>
      <h2 className="text-[25px] font-semibold leading-tight tracking-normal sm:text-[29px]">{title}</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div>;
}

export function DemoNotice({ children }: { children: ReactNode }) {
  return <div className="flex items-start gap-2.5 border border-status-moderate/25 bg-status-moderate/5 px-3.5 py-3 text-xs leading-5 text-foreground">
    <Info className="mt-0.5 size-4 shrink-0 text-status-moderate" />
    <p>{children}</p>
  </div>;
}

export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return <div className="flex flex-col items-center gap-2 px-5 py-12 text-center">
    <div className="grid size-10 place-items-center rounded-full bg-muted"><Info className="size-5 text-muted-foreground" /></div>
    <p className="text-sm font-medium">{title}</p>
    <p className="max-w-sm text-xs leading-5 text-muted-foreground">{description}</p>
    {action && <div className="mt-2">{action}</div>}
  </div>;
}

export function StatCard({ label, value, sub, icon: Icon, tone = "brand" }: { label: string; value: string | number; sub: string; icon: typeof Activity; tone?: "brand" | "amber" | "red" | "green" }) {
  const toneClasses = { brand: "bg-brand-soft text-brand-ink", amber: "bg-status-moderate/10 text-status-moderate", red: "bg-status-urgent/10 text-status-urgent", green: "bg-status-low/10 text-status-low" };
  return <div className="border border-border bg-card px-4 py-4 sm:px-5">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-2 text-[27px] font-semibold tabular-nums leading-none">{value}</p>
      </div>
      <div className={`grid size-9 shrink-0 place-items-center rounded-md ${toneClasses[tone]}`}><Icon className="size-[17px]" /></div>
    </div>
    <p className="mt-3 text-[11px] text-muted-foreground">{sub}</p>
  </div>;
}

const statusColors: Record<string, string> = {
  "Reviewed": "border-status-low/20 bg-status-low/10 text-status-low",
  "Completed": "border-status-low/20 bg-status-low/10 text-status-low",
  "In review": "border-primary/20 bg-primary/5 text-primary",
  "In progress": "border-primary/20 bg-primary/5 text-primary",
  "Approved": "border-primary/20 bg-primary/5 text-primary",
  "Referred": "border-primary/20 bg-primary/5 text-primary",
  "New": "border-primary/25 bg-primary/5 text-primary",
  "Follow-up requested": "border-status-moderate/25 bg-status-moderate/10 text-status-moderate",
  "Awaiting human approval": "border-status-moderate/25 bg-status-moderate/10 text-status-moderate",
  "Suggested": "border-status-moderate/25 bg-status-moderate/10 text-status-moderate",
  "Pending review": "border-status-high/20 bg-status-high/10 text-status-high",
  "Closed": "border-border bg-muted text-muted-foreground",
  "Cancelled": "border-border bg-muted text-muted-foreground",
};

export function StatusBadge({ status }: { status: string }) {
  return <Badge variant="outline" className={`whitespace-nowrap rounded-sm font-medium ${statusColors[status] ?? "border-status-high/20 bg-status-high/10 text-status-high"}`}>
    <span className="mr-1.5 size-1.5 rounded-full bg-current" />{status}
  </Badge>;
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  const cls = priority === "Urgent review" ? "border-status-urgent/25 bg-status-urgent/10 text-status-urgent"
    : priority === "High" ? "border-status-high/25 bg-status-high/10 text-status-high"
    : priority === "Moderate" ? "border-status-moderate/25 bg-status-moderate/10 text-status-moderate"
    : "border-status-low/25 bg-status-low/10 text-status-low";
  return <Badge variant="outline" className={`whitespace-nowrap rounded-sm font-medium ${cls}`}>{priority}</Badge>;
}

export function SectionHeading({ title, caption, action }: { title: string; caption?: string; action?: ReactNode }) {
  return <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3.5 sm:px-5">
    <div>
      <h3 className="text-sm font-semibold">{title}</h3>
      {caption && <p className="mt-1 text-[11px] text-muted-foreground">{caption}</p>}
    </div>
    {action}
  </div>;
}

export function CaseTable({ cases, onOpenCase, compact = false }: { cases: DemoCase[]; onOpenCase: (id: string) => void; compact?: boolean }) {
  return <div className="overflow-x-auto">
    <table className="w-full min-w-[690px] text-left text-xs">
      <thead><tr className="border-b border-border text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
        <th className="px-4 py-3 font-medium sm:px-5">Case ID</th>
        <th className="px-4 py-3 font-medium">Date</th>
        <th className="px-4 py-3 font-medium">Language</th>
        <th className="px-4 py-3 font-medium">Review status</th>
        <th className="px-4 py-3 font-medium">Assigned responder</th>
        <th className="px-4 py-3 font-medium">Priority</th>
        <th className="px-4 py-3" />
      </tr></thead>
      <tbody className="divide-y divide-border">
        {cases.slice(0, compact ? 5 : undefined).map((item) => (
          <tr key={item.id} className="transition-colors hover:bg-muted/30">
            <td className="px-4 py-3.5 sm:px-5"><Button variant="link" className="h-auto p-0 font-semibold text-primary" onClick={() => onOpenCase(item.id)}>{item.id}</Button></td>
            <td className="whitespace-nowrap px-4 py-3.5 text-muted-foreground">{item.date}</td>
            <td className="px-4 py-3.5 text-foreground">{item.language}</td>
            <td className="px-4 py-3.5"><StatusBadge status={item.status} /></td>
            <td className="px-4 py-3.5 text-muted-foreground">{item.assigned}</td>
            <td className="px-4 py-3.5"><PriorityBadge priority={item.priority} /></td>
            <td className="px-4 py-3.5"><Button variant="ghost" size="icon" aria-label={`Open case ${item.id}`} onClick={() => onOpenCase(item.id)} className="size-7"><ArrowRight /></Button></td>
          </tr>
        ))}
      </tbody>
    </table>
    {cases.length === 0 && <div className="px-5 py-12 text-center text-sm text-muted-foreground">No matching cases found.</div>}
  </div>;
}

export function ReferralMiniList({ referrals }: { referrals: DemoReferral[] }) {
  return <div className="divide-y divide-border">
    {referrals.length
      ? referrals.map((referral) => <div key={referral.id} className="flex items-center justify-between gap-2 px-4 py-3 text-[11px]"><span>{referral.category}</span><StatusBadge status={referral.status} /></div>)
      : <p className="px-4 py-4 text-[11px] text-muted-foreground">No mock referrals for this case.</p>}
  </div>;
}
