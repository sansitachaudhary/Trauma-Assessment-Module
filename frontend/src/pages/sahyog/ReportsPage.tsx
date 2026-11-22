import {
  Activity,
  BarChart3,
  CheckCircle2,
  FileText,
  HeartHandshake,
  Info,
  ShieldAlert,
  Users,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { PageIntro, SectionHeading } from "@/components/sahyog/shared";
import type { DemoCase, DemoReferral } from "@/lib/demo-data";

export interface ReportsPageProps {
  cases: DemoCase[];
  referrals: DemoReferral[];
}

export function ReportsPage({ cases, referrals }: ReportsPageProps) {
  const total = cases.length;
  const reviewedCount = cases.filter(
    (item) => item.status === "Reviewed" || item.status === "Closed",
  ).length;
  const urgentCount = cases.filter(
    (item) => item.priority === "Urgent review",
  ).length;
  const clearanceRate = total > 0 ? Math.round((reviewedCount / total) * 100) : 0;

  const statusData = [
    { name: "New", count: cases.filter((i) => i.status === "New").length, fill: "#318c85" },
    { name: "Pending", count: cases.filter((i) => i.status === "Pending review").length, fill: "#D97706" },
    { name: "In review", count: cases.filter((i) => i.status === "In review").length, fill: "#2563EB" },
    { name: "Reviewed", count: cases.filter((i) => i.status === "Reviewed").length, fill: "#248261" },
    { name: "Follow-up", count: cases.filter((i) => i.status === "Follow-up requested").length, fill: "#9333EA" },
  ];

  const languageData = [
    { name: "English", count: cases.filter((i) => i.language === "English").length, fill: "#153451" },
    { name: "Hindi", count: cases.filter((i) => i.language === "Hindi").length, fill: "#318c85" },
    { name: "Other", count: cases.filter((i) => i.language !== "English" && i.language !== "Hindi").length, fill: "#64748B" },
  ];

  const referralData = [
    { name: "Awaiting", count: referrals.filter((i) => i.status === "Awaiting human approval").length, fill: "#D97706" },
    { name: "Approved", count: referrals.filter((i) => i.status === "Approved").length, fill: "#318c85" },
    { name: "In progress", count: referrals.filter((i) => i.status === "In progress").length, fill: "#2563EB" },
    { name: "Completed", count: referrals.filter((i) => i.status === "Completed").length, fill: "#248261" },
  ];

  const volume = [
    { month: "May", cases: 18 },
    { month: "Jun", cases: 24 },
    { month: "Jul", cases: 21 },
    { month: "Aug", cases: 30 },
    { month: "Sep", cases: 26 },
    { month: "Oct", cases: total + 8 },
  ];

  return (
    <>
      <PageIntro
        eyebrow="ADMINISTRATION / AUDIT & ANALYTICS"
        title="Reports & Service Insights"
        description="Review case triage volume trends, review status clearance rates, language diversity, and referral handover metrics across the NHAAS 14566 workspace."
        action={
          <Badge
            variant="outline"
            className="border-primary/30 bg-primary/10 text-xs font-semibold text-primary"
          >
            LIVE TRIAGE DATA · MOCK BENCHMARKS
          </Badge>
        }
      />

      {/* KPI Overview Strip */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4 shadow-2xs">
          <p className="text-xs font-semibold text-muted-foreground">Total Ingestion</p>
          <p className="mt-1 text-2xl font-black text-foreground">{total}</p>
          <p className="mt-1 text-[11px] text-muted-foreground">Complaints logged</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-2xs">
          <p className="text-xs font-semibold text-muted-foreground">Review Clearance</p>
          <p className="mt-1 text-2xl font-black text-status-low">{clearanceRate}%</p>
          <p className="mt-1 text-[11px] text-muted-foreground">{reviewedCount} reviewed</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-2xs">
          <p className="text-xs font-semibold text-muted-foreground">High Distress</p>
          <p className="mt-1 text-2xl font-black text-status-urgent">{urgentCount}</p>
          <p className="mt-1 text-[11px] text-muted-foreground">Urgent review tier</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-2xs">
          <p className="text-xs font-semibold text-muted-foreground">Referral Pathways</p>
          <p className="mt-1 text-2xl font-black text-primary">{referrals.length}</p>
          <p className="mt-1 text-[11px] text-muted-foreground">Care handovers</p>
        </div>
      </div>

      {/* 4 Analytics Visualizations */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Case Volumes by Month */}
        <section
          aria-label="Case volume trend by month"
          className="overflow-hidden rounded-xl border border-border bg-card shadow-xs"
        >
          <SectionHeading
            title="Intake Volume Trend"
            caption="Monthly trend in caller report volume across helpline pilot"
          />
          <div className="h-[250px] p-4 sm:p-5" role="img" aria-label="Area chart showing monthly intake trend">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={volume} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="reportsVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#318c85" stopOpacity={0.28} />
                    <stop offset="95%" stopColor="#318c85" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="var(--color-border)" strokeDasharray="3 4" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-card, #fff)",
                    borderColor: "var(--color-border, #e2e8f0)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Area dataKey="cases" name="Intake Cases" type="monotone" stroke="#318c85" strokeWidth={2.5} fill="url(#reportsVolume)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Review Queue Status Distribution */}
        <section
          aria-label="Cases by review status"
          className="overflow-hidden rounded-xl border border-border bg-card shadow-xs"
        >
          <SectionHeading
            title="Review Queue Clearance Breakdown"
            caption="Distribution of cases across triage stages"
          />
          <div className="h-[250px] p-4 sm:p-5" role="img" aria-label="Bar chart showing cases by review status">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="var(--color-border)" strokeDasharray="3 4" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-card, #fff)",
                    borderColor: "var(--color-border, #e2e8f0)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="count" name="Case Count" radius={[4, 4, 0, 0]}>
                  {statusData.map((entry, index) => (
                    <Cell key={`status-cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Language Representation */}
        <section
          aria-label="Language distribution"
          className="overflow-hidden rounded-xl border border-border bg-card shadow-xs"
        >
          <SectionHeading
            title="Language Representation"
            caption="Recorded language of complainant intake conversations"
          />
          <div className="h-[250px] p-4 sm:p-5" role="img" aria-label="Bar chart showing intake volume by language">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={languageData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="var(--color-border)" strokeDasharray="3 4" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-card, #fff)",
                    borderColor: "var(--color-border, #e2e8f0)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="count" name="Cases" radius={[4, 4, 0, 0]}>
                  {languageData.map((entry, index) => (
                    <Cell key={`lang-cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Referral Pipeline Outcomes */}
        <section
          aria-label="Referral status stages"
          className="overflow-hidden rounded-xl border border-border bg-card shadow-xs"
        >
          <SectionHeading
            title="Referral Pipeline Statuses"
            caption="Current progress of external care handovers"
          />
          <div className="h-[250px] p-4 sm:p-5" role="img" aria-label="Bar chart showing referral statuses">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={referralData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="var(--color-border)" strokeDasharray="3 4" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-card, #fff)",
                    borderColor: "var(--color-border, #e2e8f0)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="count" name="Referrals" radius={[4, 4, 0, 0]}>
                  {referralData.map((entry, index) => (
                    <Cell key={`ref-cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
        <Info className="size-4 shrink-0 text-primary" aria-hidden="true" />
        <span>Audit metrics derive from active cases in your local session. All values demonstrate compliance with human-centred decision-support standards.</span>
      </div>
    </>
  );
}
