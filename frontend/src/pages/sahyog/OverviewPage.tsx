import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  HeartHandshake,
  ShieldAlert,
  ShieldCheck,
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

import {
  CaseTable,
  PriorityBadge,
  SectionHeading,
  StatCard,
  StatusBadge,
  type View,
} from "@/components/sahyog/shared";

import type {
  DemoCase as CaseRecord,
  DemoReferral as ReferralRecord,
} from "@/lib/demo-data";
import { getCaseDescription } from "@/lib/case-description";

export interface OverviewPageProps {
  cases: CaseRecord[];

  referrals: ReferralRecord[];

  onNavigate: (view: View) => void;

  onOpenCase: (id: string) => void;
}

export function OverviewPage({
  cases,

  referrals,

  onNavigate,

  onOpenCase,
}: OverviewPageProps) {
  const overviewCases = cases.filter((item) => item.id.startsWith("DB-"));
  const overviewCaseIds = new Set(overviewCases.map((item) => item.id));
  const overviewReferrals = referrals.filter((item) =>
    overviewCaseIds.has(item.caseId),
  );

  const pendingCases = overviewCases.filter(
    (item) => item.status === "New" || item.status === "Pending review",
  );

  const urgentCases = overviewCases.filter(
    (item) =>
      item.priority === "Urgent review" &&
      item.status !== "New" &&
      item.status !== "Reviewed" &&
      item.status !== "Closed",
  );

  const activeCases = overviewCases.filter(
    (item) => item.status !== "Closed",
  ).length;

  const activeReferrals = overviewReferrals.filter(
    (item) => item.status !== "Completed" && item.status !== "Cancelled",
  );

  const needsAttention = [
    ...urgentCases,

    ...pendingCases.filter(
      (item) => !urgentCases.some((urgentCase) => urgentCase.id === item.id),
    ),
  ].slice(0, 5);

  const totalCases = overviewCases.length;
  const assessedCases = overviewCases.filter((item) => item.status !== "New");

  const categories = [
    {
      name: "Low distress",

      shortName: "Low",

      value: assessedCases.filter((item) => item.priority === "Low").length,

      fill: "#248261",
    },

    {
      name: "Moderate",

      shortName: "Moderate",

      value: assessedCases.filter((item) => item.priority === "Moderate")
        .length,

      fill: "#9B6C28",
    },

    {
      name: "High concern",

      shortName: "High",

      value: assessedCases.filter((item) => item.priority === "High").length,

      fill: "#D97706",
    },

    {
      name: "Urgent review",

      shortName: "Urgent",

      value: assessedCases.filter((item) => item.priority === "Urgent review")
        .length,

      fill: "#DC2626",
    },
  ];

  const trend = Array.from({ length: 6 }, (_, index) => {
    const monthDate = new Date();
    monthDate.setDate(1);
    monthDate.setMonth(monthDate.getMonth() - (5 - index));

    const count = overviewCases.filter((item) => {
      const caseDate = new Date(item.date);
      return (
        !Number.isNaN(caseDate.getTime()) &&
        caseDate.getFullYear() === monthDate.getFullYear() &&
        caseDate.getMonth() === monthDate.getMonth()
      );
    }).length;

    return {
      month: monthDate.toLocaleDateString("en", { month: "short" }),
      count,
    };
  });

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Welcome / Workspace Header */}

      <div className="rounded-xl border border-border bg-gradient-to-r from-white to-[#edf6f3] px-5 py-5 shadow-xs sm:px-7 sm:py-6">
        <p className="text-sm font-semibold text-primary">
          Your support workspace
        </p>
        <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Your team’s workload
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
          Review new concerns, prioritize follow-up, and connect people with
          support.
        </p>
      </div>

      {/* 4 Summary Cards */}

      <section
        aria-label="Key triage queue metrics"

        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <StatCard
          label="Cases in progress"

          value={activeCases}

          sub="All cases currently being handled"

          icon={BriefcaseBusiness}

          tone="brand"
          action={
            <>
              <button
                type="button"

                onClick={() => onNavigate("Case Management")}

                className="font-bold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
              >
                View queue{" "}
                <ArrowRight className="ml-1 inline size-3" aria-hidden="true" />
              </button>
            </>
          }
        />

        <StatCard
          label="Awaiting review"

          value={pendingCases.length}

          sub="Waiting for a responder to review"

          icon={UsersRound}

          tone="amber"
          action={
            <>
              <button
                type="button"

                onClick={() => onNavigate("Case Management")}

                className="font-bold text-[#94600d] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#94600d] rounded-sm"
              >
                Review now{" "}
                <ArrowRight className="ml-1 inline size-3" aria-hidden="true" />
              </button>
            </>
          }
        />

        <StatCard
          label="Urgent cases"

          value={urgentCases.length}

          sub="Flagged for prompt attention"

          icon={ShieldAlert}

          tone="red"
          action={
            <>
              <button
                type="button"

                onClick={() => onNavigate("Case Management")}

                className="font-bold text-[#c74755] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c74755] rounded-sm"
              >
                View urgent{" "}
                <ArrowRight className="ml-1 inline size-3" aria-hidden="true" />
              </button>
            </>
          }
        />

        <StatCard
          label="Active referrals"

          value={activeReferrals.length}

          sub="People connected with support"

          icon={HeartHandshake}

          tone="green"
          action={
            <>
              <button
                type="button"

                onClick={() => onNavigate("Referrals")}

                className="font-bold text-[#24805b] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#24805b] rounded-sm"
              >
                Manage{" "}
                <ArrowRight className="ml-1 inline size-3" aria-hidden="true" />
              </button>
            </>
          }
        />
      </section>

      {/* Analytics & Priority Charts */}

      <div className="grid items-stretch gap-5 xl:grid-cols-[1.55fr_0.95fr]">
        {/* Case Intake Volume Chart */}

        <section
          aria-label="Intake volume trend"

          className="overflow-hidden rounded-xl border border-border bg-card shadow-xs"
        >
          <SectionHeading
            title="Assessment Intake Trend"

            caption="Cases received in the past six months"
          />

          <div className="p-4 sm:p-5">
            <div
              className="h-[230px] w-full"
              role="img"
              aria-label="Area chart showing case intake trend over the past 6 months"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={trend}

                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="volumeGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="var(--color-primary, #318c85)"
                        stopOpacity={0.28}
                      />

                      <stop
                        offset="95%"
                        stopColor="var(--color-primary, #318c85)"
                        stopOpacity={0.02}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    vertical={false}
                    stroke="var(--color-border)"
                    strokeDasharray="3 4"
                  />

                  <XAxis
                    dataKey="month"

                    tickLine={false}

                    axisLine={false}

                    tick={{
                      fill: "var(--color-muted-foreground)",
                      fontSize: 12,
                      fontWeight: 500,
                    }}
                  />

                  <YAxis
                    allowDecimals={false}

                    tickLine={false}

                    axisLine={false}

                    tick={{
                      fill: "var(--color-muted-foreground)",
                      fontSize: 12,
                      fontWeight: 500,
                    }}
                  />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-card, #ffffff)",

                      borderColor: "var(--color-border, #e2e8f0)",

                      borderRadius: 8,

                      fontSize: 13,

                      boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                    }}
                  />

                  <Area
                    dataKey="count"

                    name="Cases"

                    type="monotone"

                    stroke="var(--color-primary, #318c85)"

                    strokeWidth={2.5}

                    fill="url(#volumeGradient)"

                    activeDot={{
                      r: 5,
                      strokeWidth: 0,
                      fill: "var(--color-primary, #318c85)",
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <p className="mt-2 text-right text-xs text-muted-foreground">
              Monthly totals are based on the dates recorded for each case.
            </p>
          </div>
        </section>

        {/* Observed Indicator Severity Distribution */}

        <section
          aria-label="Distress priority breakdown"

          className="overflow-hidden rounded-xl border border-border bg-card shadow-xs"
        >
          <SectionHeading
            title="Priority Distribution"

            caption="Assessed cases by review priority"
          />

          <div className="grid grid-cols-[140px_minmax(0,1fr)] items-center gap-3 p-4 sm:grid-cols-[160px_minmax(0,1fr)] sm:p-5">
            <div
              className="relative h-[180px]"
              role="img"
              aria-label="Pie chart showing breakdown by priority category"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categories}

                    dataKey="value"

                    nameKey="name"

                    innerRadius={48}

                    outerRadius={68}

                    paddingAngle={3}

                    stroke="#fff"

                    strokeWidth={2}
                  >
                    {categories.map((item) => (
                      <Cell key={item.name} fill={item.fill} />
                    ))}
                  </Pie>

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-card, #ffffff)",

                      borderColor: "var(--color-border, #e2e8f0)",

                      borderRadius: 8,

                      fontSize: 13,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-black text-foreground">
                  {assessedCases.length}
                </span>

                <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Total
                </span>
              </div>
            </div>

            <div className="space-y-2.5">
              {categories.map((item) => {
                const percentage =
                  assessedCases.length > 0
                    ? Math.round((item.value / assessedCases.length) * 100)
                    : 0;

                return (
                  <div
                    key={item.name}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <span
                        className="size-2.5 shrink-0 rounded-full"

                        style={{ backgroundColor: item.fill }}

                        aria-hidden="true"
                      />

                      <span className="font-medium text-foreground">
                        {item.name}
                      </span>
                    </span>

                    <span className="font-bold tabular-nums text-foreground">
                      {item.value}{" "}
                      <span className="text-xs font-normal text-muted-foreground">
                        ({percentage}%)
                      </span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border-t border-border bg-muted/20 px-4 py-2.5 text-xs text-muted-foreground sm:px-5">
            Priority helps guide review. It is not a psychological diagnosis.
          </div>
        </section>
      </div>

      {/* Cases Needing Attention & Workflow Sections */}

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
        {/* Cases Needing Attention */}

        <section
          aria-label="Cases needing immediate attention"

          className="self-start overflow-hidden rounded-xl border border-border bg-card shadow-xs"
        >
          <SectionHeading
            title="Cases Needing Attention"

            caption="Cases that may need a closer look"

            action={
              <Button
                variant="outline"

                size="sm"

                onClick={() => onNavigate("Case Management")}

                className="gap-1.5 text-xs font-semibold focus-visible:ring-2 focus-visible:ring-primary"
              >
                <span>Full queue</span>

                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Button>
            }
          />

          {needsAttention.length > 0 ? (
            <div className="divide-y divide-border">
              {needsAttention.map((item) => {
                return (
                  <button
                    key={item.id}

                    type="button"

                    onClick={() => onOpenCase(item.id)}

                    className="group flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset sm:gap-4 sm:px-5"
                  >
                    <span
                      className={`grid size-9 shrink-0 place-items-center rounded-xl ring-1 ring-inset ${
                        item.status === "New"
                          ? "bg-muted/50 text-muted-foreground ring-border"
                          : item.priority === "Urgent review"
                            ? "bg-status-urgent/10 text-status-urgent ring-status-urgent/25"
                            : "bg-status-moderate/10 text-status-moderate ring-status-moderate/25"
                      }`}
                      aria-hidden="true"
                    >
                      {item.status === "New" ? (
                        <BriefcaseBusiness className="size-4" />
                      ) : (
                        <ShieldAlert className="size-4" />
                      )}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <strong className="text-xs font-bold text-foreground group-hover:text-primary">
                          {item.id}
                        </strong>

                        {item.status === "New" ? (
                          <span className="text-xs text-muted-foreground">
                            Not assessed
                          </span>
                        ) : (
                          <PriorityBadge
                            priority={item.priority}
                            showIcon={false}
                          />
                        )}
                      </div>

                      <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                        {getCaseDescription(item)}
                      </p>

                      <div className="mt-1 flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
                        <span>{item.date}</span>

                        <span aria-hidden="true">·</span>

                        <span>{item.language}</span>

                        <span aria-hidden="true">·</span>

                        <span>{item.assigned}</span>
                      </div>
                    </div>

                    <div className="hidden shrink-0 sm:block">
                      <StatusBadge status={item.status} />
                    </div>

                    <div className="grid size-8 shrink-0 place-items-center rounded-lg text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary">
                      <ChevronRight className="size-4" aria-hidden="true" />
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="px-5 py-10 text-center">
              <CheckCircle2
                className="mx-auto size-10 text-status-low"
                aria-hidden="true"
              />

              <p className="mt-2 text-sm font-bold text-foreground">
                All high-priority cases have been reviewed
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Check the complete case management table for non-urgent records.
              </p>
            </div>
          )}
        </section>

        {/* Workflow Guidance Card */}

        <section
          aria-label="Assessment workflow steps"

          className="self-start overflow-hidden rounded-xl border border-border bg-card shadow-xs"
        >
          <SectionHeading
            title="How we respond"

            caption="A simple guide for handling each request"
          />

          <div className="space-y-3 p-4 sm:p-5">
            <div className="flex items-start gap-3 rounded-lg border border-border/60 bg-muted/20 p-3">
              <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                1
              </span>

              <div>
                <p className="text-sm font-semibold text-foreground">
                  Listen and document
                </p>

                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Record the person’s concerns clearly and respectfully.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-border/60 bg-muted/20 p-3">
              <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                2
              </span>

              <div>
                <p className="text-sm font-semibold text-foreground">
                  Review indicators together
                </p>

                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Consider screening indicators alongside the person’s account;
                  a responder makes the decision.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-border/60 bg-muted/20 p-3">
              <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                3
              </span>

              <div>
                <p className="text-sm font-semibold text-foreground">
                  Offer support and follow up
                </p>

                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  With their agreement, connect them with relevant services and
                  arrange follow-up.
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-[#318c85]/20 bg-[#e8f4f0]/60 p-3 text-xs text-[#1a5f57]">
              <div className="flex items-center gap-2 font-bold">
                <ShieldCheck
                  className="size-4 shrink-0 text-primary"
                  aria-hidden="true"
                />

                <span>Human review</span>
              </div>

              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Screening indicators support, but never replace, a responder’s
                judgment.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Recent Cases Section */}

      <section
        aria-label="Recent cases table"

        className="overflow-hidden rounded-xl border border-border bg-card shadow-xs"
      >
        <SectionHeading
          title="Recent Intake Cases"

          caption="The most recently received cases"

          action={
            <Button
              variant="outline"

              size="sm"

              onClick={() => onNavigate("Case Management")}

              className="gap-1.5 text-xs font-semibold focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span>View all ({totalCases})</span>

              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Button>
          }
        />

        <CaseTable cases={overviewCases} onOpenCase={onOpenCase} compact />

        <div className="border-t border-border bg-muted/10 p-3 text-center sm:hidden">
          <Button
            variant="outline"

            size="sm"

            onClick={() => onNavigate("Case Management")}

            className="w-full text-xs font-semibold"
          >
            <span>View all cases ({totalCases})</span>

            <ArrowRight className="ml-1.5 size-3.5" aria-hidden="true" />
          </Button>
        </div>
      </section>
    </div>
  );
}
