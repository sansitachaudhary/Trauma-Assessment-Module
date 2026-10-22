import { useState } from "react";
import {
  Activity,
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Clock,
  Compass,
  FilePlus2,
  Filter,
  HeartHandshake,
  Info,
  Plus,
  Search,
  Settings2,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CaseTable,
  DemoNotice,
  EmptyState,
  PageIntro,
  PriorityBadge,
  SectionHeading,
  StatCard,
  StatusBadge,
  type View,
} from "@/components/sahyog/shared";
import type { DemoCase, DemoReferral } from "@/lib/demo-data";

export function OverviewPage({
  cases,
  referrals,
  onNavigate,
  onOpenCase,
}: {
  cases: DemoCase[];
  referrals: DemoReferral[];
  onNavigate: (view: View) => void;
  onOpenCase: (id: string) => void;
}) {
  const [filterTab, setFilterTab] = useState<"all" | "pending" | "urgent" | "reviewed">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const pending = cases.filter((item) => item.status === "Pending review").length;
  const urgent = cases.filter(
    (item) =>
      item.priority === "Urgent review" &&
      item.status !== "Reviewed" &&
      item.status !== "Closed",
  ).length;
  const activeCases = cases.filter((item) => item.status !== "Closed").length;
  const inProgressReferrals = referrals.filter(
    (item) => item.status === "In progress" || item.status === "Approved",
  ).length;

  const trend = [
    { month: "May", count: 18 },
    { month: "Jun", count: 24 },
    { month: "Jul", count: 21 },
    { month: "Aug", count: 30 },
    { month: "Sep", count: 26 },
    { month: "Oct", count: cases.length + 8 },
  ];

  const categories = [
    {
      name: "Low distress",
      value: cases.filter((item) => item.priority === "Low").length,
      fill: "#248261",
    },
    {
      name: "Moderate",
      value: cases.filter((item) => item.priority === "Moderate").length,
      fill: "#9B6C28",
    },
    {
      name: "High concern",
      value: cases.filter((item) => item.priority === "High").length,
      fill: "#D97706",
    },
    {
      name: "Urgent review",
      value: cases.filter((item) => item.priority === "Urgent review").length,
      fill: "#DC2626",
    },
  ];

  // Filtered cases for the table
  const filteredCases = cases.filter((item) => {
    const matchesSearch =
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.language.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterTab === "pending") return item.status === "Pending review";
    if (filterTab === "urgent") return item.priority === "Urgent review";
    if (filterTab === "reviewed")
      return item.status === "Reviewed" || item.status === "Closed";
    return true;
  });

  const recentEvents = cases
    .flatMap((item) =>
      item.history.slice(0, 1).map((event) => ({
        caseId: item.id,
        event,
        priority: item.priority,
      })),
    )
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-[#DCE7E2] bg-white p-6 shadow-xs sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex size-2 rounded-full bg-[#328B86] animate-pulse" />
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#328B86]">
              SAHYOG AI · NHAAS 14566 HELPLINE
            </p>
          </div>
          <h1 className="mt-1.5 text-2xl font-extrabold tracking-tight text-[#123052] sm:text-3xl">
            Trauma Assessment Dashboard
          </h1>
          <p className="mt-1 max-w-2xl text-xs sm:text-sm text-[#5A6E82]">
            AI-assisted distress assessment with mandatory human responder review.
            Organize reported concerns, surface indicators, and connect callers with care pathways.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <Button
            onClick={() => onNavigate("New Assessment")}
            className="gap-2 rounded-xl bg-[#123052] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#1A406D]"
          >
            <Plus className="size-4" />
            <span>Start New Assessment</span>
          </Button>
        </div>
      </div>

      {/* Synthetic Data & Medical Notice */}
      <DemoNotice>
        <span className="font-bold text-[#78511B]">Demonstration workspace · Human oversight required.</span>{" "}
        All cases and indicators are synthetic for workflow demonstration. AI-assisted insights do not replace qualified medical or psychological evaluation.
      </DemoNotice>

      {/* Key Metric Overview Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total active cases"
          value={activeCases}
          sub="Across current triage queue"
          icon={BriefcaseBusiness}
          tone="brand"
        />
        <StatCard
          label="Pending human reviews"
          value={pending}
          sub="Awaiting responder confirmation"
          icon={UsersRound}
          tone="amber"
        />
        <StatCard
          label="High-priority safety queue"
          value={urgent}
          sub="Explicit distress signals flagged"
          icon={ShieldAlert}
          tone="red"
        />
        <StatCard
          label="Active support referrals"
          value={inProgressReferrals}
          sub="Counselling & legal pathways"
          icon={HeartHandshake}
          tone="green"
        />
      </div>

      {/* Quick Action Shortcuts */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <button
          type="button"
          onClick={() => onNavigate("New Assessment")}
          className="flex items-center gap-3 rounded-xl border border-[#DCE7E2] bg-white p-3.5 text-left transition hover:border-[#328B86] hover:bg-[#EAF5F1]/30 hover:shadow-xs"
        >
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#EAF5F1] text-[#328B86]">
            <FilePlus2 className="size-4.5" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#123052]">New Assessment</p>
            <p className="text-[10px] text-[#5A6E82]">Intake & rule analysis</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate("Case Management")}
          className="flex items-center gap-3 rounded-xl border border-[#DCE7E2] bg-white p-3.5 text-left transition hover:border-[#328B86] hover:bg-[#EAF5F1]/30 hover:shadow-xs"
        >
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#FCF8EE] text-[#9B6C28]">
            <Clock className="size-4.5" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#123052]">Review Queue</p>
            <p className="text-[10px] text-[#5A6E82]">{pending} pending attention</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate("Referrals")}
          className="flex items-center gap-3 rounded-xl border border-[#DCE7E2] bg-white p-3.5 text-left transition hover:border-[#328B86] hover:bg-[#EAF5F1]/30 hover:shadow-xs"
        >
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#EBF7F2] text-[#248261]">
            <HeartHandshake className="size-4.5" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#123052]">Care Referrals</p>
            <p className="text-[10px] text-[#5A6E82]">14566 pathways</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate("Settings")}
          className="flex items-center gap-3 rounded-xl border border-[#DCE7E2] bg-white p-3.5 text-left transition hover:border-[#328B86] hover:bg-[#EAF5F1]/30 hover:shadow-xs"
        >
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#F4FAF7] text-[#123052]">
            <Settings2 className="size-4.5" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#123052]">Scoring Rules</p>
            <p className="text-[10px] text-[#5A6E82]">Adjust weights & tiers</p>
          </div>
        </button>
      </div>

      {/* Analytics & Trend Charts */}
      <div className="grid gap-6 xl:grid-cols-[1.55fr_0.95fr]">
        {/* Case Intake Volume Chart */}
        <section className="rounded-2xl border border-[#DCE7E2] bg-white shadow-xs overflow-hidden">
          <SectionHeading
            title="Assessment Intake Trend"
            caption="Monthly intake volume across helpline demonstration"
            action={
              <Badge variant="outline" className="border-[#DCE7E2] bg-[#FCFBF8] text-[10px] font-bold text-[#5A6E82]">
                DEMO TREND
              </Badge>
            }
          />
          <div className="h-[240px] p-5">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="volumeFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#328B86" stopOpacity={0.25} />
                    <stop offset="90%" stopColor="#328B86" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#EBF2EE" strokeDasharray="3 4" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#5A6E82", fontSize: 11, fontWeight: 500 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#5A6E82", fontSize: 11, fontWeight: 500 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderColor: "#DCE7E2",
                    borderRadius: 12,
                    fontSize: 12,
                    boxShadow: "0 8px 24px rgba(18, 48, 82, 0.08)",
                  }}
                />
                <Area
                  dataKey="count"
                  type="monotone"
                  stroke="#328B86"
                  strokeWidth={2.5}
                  fill="url(#volumeFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Observed Indicator Severity Distribution */}
        <section className="rounded-2xl border border-[#DCE7E2] bg-white shadow-xs overflow-hidden">
          <SectionHeading
            title="Distress Signal Breakdown"
            caption="Rule-identified priority tiers across current cases"
          />
          <div className="grid grid-cols-[140px_minmax(0,1fr)] items-center gap-4 p-5 sm:grid-cols-[160px_minmax(0,1fr)]">
            <div className="relative h-[170px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categories}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={48}
                    outerRadius={68}
                    paddingAngle={3}
                    strokeWidth={0}
                  >
                    {categories.map((item) => (
                      <Cell key={item.name} fill={item.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      borderColor: "#DCE7E2",
                      borderRadius: 10,
                      fontSize: 11,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-extrabold text-[#123052]">{cases.length}</span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#5A6E82]">
                  CASES
                </span>
              </div>
            </div>

            <div className="space-y-2.5">
              {categories.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-[#5A6E82]">
                    <span
                      className="size-2.5 rounded-full"
                      style={{ backgroundColor: item.fill }}
                    />
                    <span className="font-medium text-[#123052]">{item.name}</span>
                  </span>
                  <span className="font-bold tabular-nums text-[#123052]">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="border-t border-[#EBF2EE] bg-[#FCFBF8] px-5 py-2.5 text-[11px] text-[#5A6E82]">
            Rule indicators support human prioritization; they do not establish psychological diagnosis.
          </div>
        </section>
      </div>

      {/* Recent Assessments Table with Search & Filter Tabs */}
      <section className="rounded-2xl border border-[#DCE7E2] bg-white shadow-xs overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-[#EBF2EE] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-bold text-[#123052]">Recent Assessments</h2>
            <p className="mt-0.5 text-xs text-[#5A6E82]">
              Review case narratives, assess distress indicators, and confirm next steps
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-[#5A6E82]" />
              <input
                type="text"
                placeholder="Search cases..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 rounded-lg border border-[#DCE7E2] bg-white pl-8 pr-3 text-xs placeholder:text-[#5A6E82]/60 focus:border-[#328B86] focus:outline-none"
              />
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate("Case Management")}
              className="h-8 gap-1.5 rounded-lg border-[#DCE7E2] px-3 text-xs font-semibold text-[#123052] hover:bg-[#EAF5F1]"
            >
              <span>All Cases</span>
              <ArrowRight className="size-3.5" />
            </Button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[#EBF2EE] bg-[#FCFBF8] px-5 py-2.5">
          {[
            { id: "all", label: `All (${cases.length})` },
            { id: "pending", label: `Pending Review (${pending})` },
            { id: "urgent", label: `Urgent Safety (${urgent})` },
            { id: "reviewed", label: "Completed" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterTab(tab.id as any)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                filterTab === tab.id
                  ? "bg-[#123052] text-white"
                  : "bg-white text-[#5A6E82] border border-[#DCE7E2] hover:border-[#328B86]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Case Table Component */}
        <CaseTable cases={filteredCases} onOpenCase={onOpenCase} compact={filterTab === "all" && !searchQuery} />
      </section>

      {/* Activity Timeline Section */}
      <section className="rounded-2xl border border-[#DCE7E2] bg-white shadow-xs overflow-hidden">
        <SectionHeading
          title="Recent Responder Activity"
          caption="Audit trail of case reviews, status changes, and intake events"
        />
        <div className="divide-y divide-[#EBF2EE]">
          {recentEvents.map((item, idx) => (
            <div key={`${item.caseId}-${idx}`} className="flex items-center justify-between gap-4 px-5 py-3.5 text-xs transition hover:bg-[#F4FAF7]/40">
              <div className="flex items-center gap-3">
                <span className="flex size-7 items-center justify-center rounded-lg bg-[#EAF5F1] text-[#328B86]">
                  <Activity className="size-3.5" />
                </span>
                <div>
                  <button
                    type="button"
                    onClick={() => onOpenCase(item.caseId)}
                    className="font-bold text-[#123052] hover:underline"
                  >
                    {item.caseId}
                  </button>
                  <span className="mx-2 text-[#DCE7E2]">·</span>
                  <span className="text-[#5A6E82]">{item.event}</span>
                </div>
              </div>
              <PriorityBadge priority={item.priority} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
