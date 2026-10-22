import { Plus, ShieldAlert } from "lucide-react";
import {
  Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CaseTable, DemoNotice, EmptyState, PageIntro, PriorityBadge, SectionHeading, StatCard, StatusBadge } from "@/components/sahyog/shared";
import type { View } from "@/components/sahyog/shared";
import { ArrowRight, BriefcaseBusiness, HeartHandshake, UsersRound } from "lucide-react";
import { referralStatuses, type DemoCase, type DemoReferral } from "@/lib/demo-data";

export function OverviewPage({ cases, referrals, onNavigate, onOpenCase }: {
  cases: DemoCase[];
  referrals: DemoReferral[];
  onNavigate: (view: View) => void;
  onOpenCase: (id: string) => void;
}) {
  const pending = cases.filter((item) => item.status === "Pending review").length;
  const urgent = cases.filter((item) => item.priority === "Urgent review" && item.status !== "Reviewed" && item.status !== "Closed").length;
  const reviewQueue = cases
    .filter((item) => item.status === "Pending review" || item.priority === "Urgent review")
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
  const awaitingHuman = cases.filter((item) => item.status === "New" || item.status === "Follow-up requested");
  const trend = [
    { month: "May", count: 18 }, { month: "Jun", count: 24 }, { month: "Jul", count: 21 },
    { month: "Aug", count: 30 }, { month: "Sep", count: 26 }, { month: "Oct", count: cases.length + 8 },
  ];
  const categories = [
    { name: "Low", value: cases.filter((item) => item.priority === "Low").length, fill: "var(--color-status-low)" },
    { name: "Moderate", value: cases.filter((item) => item.priority === "Moderate").length, fill: "var(--color-status-moderate)" },
    { name: "High", value: cases.filter((item) => item.priority === "High").length, fill: "var(--color-status-high)" },
    { name: "Urgent review", value: cases.filter((item) => item.priority === "Urgent review").length, fill: "var(--color-status-urgent)" },
  ];
  const activity = cases.flatMap((item) => item.history.slice(0, 1).map((event) => ({ caseId: item.id, event }))).slice(0, 6);

  return <>
    <PageIntro
      eyebrow="MONDAY, 19 OCTOBER 2026 · WORKSPACE OVERVIEW"
      title="Good morning, responder"
      description="Monitor support requests, assessment activity, and referral progress."
      action={<Button onClick={() => onNavigate("New Assessment")} className="gap-2"><Plus /> <span className="hidden sm:inline">New assessment</span><span className="sm:hidden">New</span></Button>}
    />
    <DemoNotice><strong>Synthetic demonstration data.</strong> Every figure and case shown is fictional and for interface demonstration only — not validated assessment results.</DemoNotice>
    <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      <StatCard label="Active cases" value={cases.filter((item) => item.status !== "Closed").length} sub="Across the demonstration queue" icon={BriefcaseBusiness} />
      <StatCard label="Pending human reviews" value={pending} sub="Awaiting responder attention" icon={UsersRound} tone="amber" />
      <StatCard label="High-priority reviews" value={urgent} sub="Human review is always required" icon={ShieldAlert} tone="red" />
      <StatCard label="Referrals in progress" value={referrals.filter((item) => item.status === "In progress" || item.status === "Approved").length} sub="Mock referrals only · no external action" icon={HeartHandshake} tone="green" />
    </div>
    <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1.55fr)_minmax(300px,0.8fr)]">
      <section className="border border-border bg-card">
        <SectionHeading title="Case volumes" caption="Illustrative number of cases · May–October 2026" action={<Badge variant="outline" className="rounded-sm text-[10px]">MOCK DATA</Badge>} />
        <div className="h-[235px] p-4 pt-5">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trend} margin={{ top: 5, right: 6, left: -20, bottom: 0 }}>
              <defs><linearGradient id="volumeFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.17} /><stop offset="90%" stopColor="var(--color-primary)" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid vertical={false} stroke="var(--color-border)" strokeDasharray="3 4" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} />
              <Tooltip contentStyle={{ borderColor: "var(--color-border)", borderRadius: 4, fontSize: 12 }} />
              <Area dataKey="count" type="monotone" stroke="var(--color-primary)" strokeWidth={2} fill="url(#volumeFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>
      <section className="border border-border bg-card">
        <SectionHeading title="Illustrative indicators" caption="Rule-based categories across mock cases" />
        <div className="grid grid-cols-[130px_minmax(0,1fr)] items-center gap-2 px-3 py-2 sm:grid-cols-[145px_minmax(0,1fr)]">
          <div className="relative h-[160px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categories} dataKey="value" nameKey="name" innerRadius={47} outerRadius={66} paddingAngle={2} strokeWidth={0}>
                  {categories.map((item) => <Cell key={item.name} fill={item.fill} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
              <div><p className="text-xl font-semibold">{cases.length}</p><p className="text-[9px] text-muted-foreground">CASES</p></div>
            </div>
          </div>
          <div className="space-y-2 pr-2">
            {categories.map((item) => (
              <div key={item.name} className="flex items-center justify-between gap-2 text-[11px]">
                <span className="flex min-w-0 items-center gap-2 text-muted-foreground"><span className="size-2 shrink-0 rounded-sm" style={{ backgroundColor: item.fill }} />{item.name}</span>
                <span className="font-medium tabular-nums">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-border px-4 py-2.5 text-[10px] text-muted-foreground">Categories are illustrative — not validated model performance.</div>
      </section>
    </div>
    <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1.55fr)_minmax(300px,0.8fr)]">
      <section className="border border-border bg-card">
        <SectionHeading title="Recent cases" caption="Fictional case records · review state is editable" action={<Button variant="outline" size="sm" className="hidden gap-2 sm:inline-flex" onClick={() => onNavigate("Case Management")}>All cases <ArrowRight /></Button>} />
        <CaseTable cases={cases} onOpenCase={onOpenCase} compact />
        <div className="border-t border-border px-4 py-3 sm:hidden">
          <Button variant="outline" size="sm" className="w-full" onClick={() => onNavigate("Case Management")}>View all cases <ArrowRight /></Button>
        </div>
      </section>
      <div className="space-y-4">
        <section className="border border-border bg-card">
          <SectionHeading title="Priority review queue" caption="Urgent review and pending cases first" />
          {reviewQueue.length
            ? <div className="divide-y divide-border">{reviewQueue.map((item) => (
              <button type="button" key={item.id} onClick={() => onOpenCase(item.id)} className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/30">
                <span className="min-w-0 flex-1"><span className="block text-xs font-semibold text-primary">{item.id}</span><span className="mt-0.5 block truncate text-[10px] text-muted-foreground">{item.summary}</span></span>
                <PriorityBadge priority={item.priority} />
              </button>
            ))}</div>
            : <EmptyState title="Queue is clear" description="No urgent or pending reviews right now. This does not mean any person is safe — review status is only a workspace state." />}
        </section>
        <section className="border border-border bg-card">
          <SectionHeading title="Cases awaiting human review" caption="New drafts and requested follow-ups" />
          {awaitingHuman.length
            ? <div className="divide-y divide-border">{awaitingHuman.map((item) => (
              <button type="button" key={item.id} onClick={() => onOpenCase(item.id)} className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/30">
                <span className="text-xs font-semibold text-primary">{item.id}</span>
                <StatusBadge status={item.status} />
              </button>
            ))}</div>
            : <EmptyState title="Nothing awaiting" description="No draft or follow-up cases are waiting for a responder." />}
        </section>
        <section className="border border-border bg-card">
          <SectionHeading title="Referral status summary" caption="Local demonstration records only" />
          <div className="grid grid-cols-2 gap-2 p-4">
            {referralStatuses.map((status) => (
              <div key={status} className="flex items-center justify-between gap-2 border border-border px-2.5 py-2 text-[10px]">
                <span className="truncate text-muted-foreground">{status}</span>
                <span className="font-semibold tabular-nums">{referrals.filter((item) => item.status === status).length}</span>
              </div>
            ))}
          </div>
        </section>
        <section className="border border-border bg-card">
          <SectionHeading title="Recent activity" caption="Latest demonstration events" />
          {activity.length
            ? <ul className="divide-y divide-border">{activity.map((entry, index) => (
              <li key={`${entry.caseId}-${index}`} className="px-4 py-3 text-[11px] leading-5">
                <span className="font-semibold text-primary">{entry.caseId}</span>
                <span className="mt-0.5 block text-muted-foreground">{entry.event}</span>
              </li>
            ))}</ul>
            : <EmptyState title="No activity yet" description="Workspace events will appear here as cases and referrals are updated." />}
        </section>
        <section className="border border-border bg-card">
          <SectionHeading title="Quick actions" />
          <div className="grid gap-2 p-4">
            <Button size="sm" onClick={() => onNavigate("New Assessment")} className="justify-start gap-2"><Plus /> New assessment</Button>
            <Button size="sm" variant="outline" onClick={() => onNavigate("Case Management")} className="justify-start gap-2"><BriefcaseBusiness /> Case management</Button>
          </div>
        </section>
      </div>
    </div>
  </>;
}
