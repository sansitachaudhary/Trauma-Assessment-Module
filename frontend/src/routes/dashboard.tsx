import { createFileRoute } from "@tanstack/react-router";
import "./dashboard.css";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
  Activity,
  ArrowDownUp,
  ArrowLeft,
  ArrowRight,
  Bell,
  BookOpen,
  BrainCircuit,
  BriefcaseBusiness,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  ClipboardList,
  FileChartColumnIncreasing,
  FilePlus2,
  Filter,
  HeartHandshake,
  Home,
  Info,
  Languages,
  LifeBuoy,
  LockKeyhole,
  Menu,
  MessageSquareText,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Search,
  Settings2,
  ShieldAlert,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  UsersRound,
  X,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { createComplaint } from "../lib/complaint-api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  assessDemonstration,
  type AssessmentOutcome,
} from "@/lib/assessment-service";
import {
  defaultScoreSettings,
  initialCases,
  initialReferrals,
  preparedScenarios,
  referralCategories,
  updateScoreThreshold,
  type DemoCase,
  type DemoReferral,
  type Priority,
  type ReferralCategory,
  type ReferralStatus,
  type ReviewStatus,
  type ScoreSettings,
  type ThresholdKey,
} from "@/lib/demo-data";
import { useRef } from "react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "SAHYOG AI — Distress Assessment & Human Support" },
      {
        name: "description",
        content:
          "A fictional, human-led case management prototype for support services. Illustrative demonstration data only.",
      },
      {
        property: "og:title",
        content: "SAHYOG AI — Distress Assessment & Human Support",
      },
      {
        property: "og:description",
        content:
          "A fictional, human-led case management prototype for support services. Illustrative demonstration data only.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SahyogApp,
});

type View =
  | "Overview"
  | "New Assessment"
  | "Case Management"
  | "Referrals"
  | "Reports"
  | "Settings"
  | "Case detail";
const navigation: {
  label: Exclude<View, "Case detail">;
  icon: typeof Home;
  group: "WORKSPACE" | "ADMINISTRATION";
}[] = [
  { label: "Overview", icon: Home, group: "WORKSPACE" },
  { label: "New Assessment", icon: FilePlus2, group: "WORKSPACE" },
  { label: "Case Management", icon: BriefcaseBusiness, group: "WORKSPACE" },
  { label: "Referrals", icon: HeartHandshake, group: "WORKSPACE" },
  {
    label: "Reports",
    icon: FileChartColumnIncreasing,
    group: "ADMINISTRATION",
  },
  { label: "Settings", icon: Settings2, group: "ADMINISTRATION" },
];

function SahyogApp() {
  const [view, setView] = useState<View>("Overview");
  const [cases, setCases] = useState(initialCases);
  const [referrals, setReferrals] = useState(initialReferrals);
  const [settings, setSettings] = useState<ScoreSettings>(defaultScoreSettings);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mobileNav, setMobileNav] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const [assessment, setAssessment] = useState<AssessmentOutcome | null>(null);
  const [assessmentNarrative, setAssessmentNarrative] = useState("");
  const [toast, setToast] = useState("");

  const selectedCase = cases.find((item) => item.id === selectedId) ?? null;
  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 3000);
  };
  const navigate = (next: View) => {
    setView(next);
    setMobileNav(false);
    if (next !== "New Assessment") setAssessment(null);
  };
  const openCase = (id: string) => {
    setSelectedId(id);
    setView("Case detail");
    setMobileNav(false);
  };
  const addCase = (item: DemoCase) =>
    setCases((existing) => [item, ...existing]);
  const updateCase = (
    id: string,
    updates: Partial<DemoCase>,
    historyMessage?: string,
  ) => {
    setCases((existing) =>
      existing.map((item) =>
        item.id === id
          ? {
              ...item,
              ...updates,
              history: historyMessage
                ? [
                    `${new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })} · ${historyMessage}`,
                    ...item.history,
                  ]
                : item.history,
            }
          : item,
      ),
    );
  };
  const addReferral = (referral: DemoReferral) =>
    setReferrals((existing) => [referral, ...existing]);

  return (
    <div className="sahyog-app flex min-h-screen bg-background text-foreground">
      <aside
        className={`sahyog-sidebar fixed inset-y-0 left-0 z-30 hidden flex-col transition-[width] duration-200 lg:flex ${desktopCollapsed ? "w-20" : "w-[258px]"}`}
      >
        <BrandBlock
          collapsed={desktopCollapsed}
          onToggle={() => setDesktopCollapsed((value) => !value)}
        />
        <div className="px-4 pt-7">
          {!desktopCollapsed && (
            <p className="px-3 text-[10px] font-semibold tracking-[0.16em] text-sidebar-foreground/55">
              WORKSPACE
            </p>
          )}
          <nav className="mt-3 space-y-1" aria-label="Main navigation">
            {navigation
              .filter((item) => item.group === "WORKSPACE")
              .map((item) => (
                <NavItem
                  key={item.label}
                  item={item}
                  active={view === item.label}
                  onClick={() => navigate(item.label)}
                  collapsed={desktopCollapsed}
                  caseCount={cases.length}
                />
              ))}
          </nav>
          {!desktopCollapsed && (
            <p className="mb-3 mt-8 px-3 text-[10px] font-semibold tracking-[0.16em] text-sidebar-foreground/55">
              ADMINISTRATION
            </p>
          )}
          <nav className="space-y-1" aria-label="Administration navigation">
            {navigation
              .filter((item) => item.group === "ADMINISTRATION")
              .map((item) => (
                <NavItem
                  key={item.label}
                  item={item}
                  active={view === item.label}
                  onClick={() => navigate(item.label)}
                  collapsed={desktopCollapsed}
                  caseCount={cases.length}
                />
              ))}
          </nav>
        </div>
        <div
          className={`mt-auto border-t border-sidebar-foreground/10 p-4 ${desktopCollapsed ? "px-3" : ""}`}
        >
          <div className="flex items-center gap-3 rounded-md bg-sidebar-foreground/5 px-3 py-3">
            <div
              className="grid size-9 shrink-0 place-items-center rounded-md bg-sidebar-foreground/10 text-xs font-semibold"
              title="Demo Responder"
            >
              DR
            </div>
            {!desktopCollapsed && (
              <>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">Demo Responder</p>
                  <p className="mt-0.5 text-xs text-sidebar-foreground/60">
                    Prototype workspace
                  </p>
                </div>
                <ChevronDown className="size-4 shrink-0 text-sidebar-foreground/50" />
              </>
            )}
          </div>
        </div>
      </aside>

      <main
        className={`min-w-0 flex-1 transition-[margin] duration-200 ${desktopCollapsed ? "lg:ml-20" : "lg:ml-[258px]"}`}
      >
        <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:px-7 lg:flex lg:h-[68px] lg:justify-between lg:px-9 lg:py-0">
            <div className="flex min-w-0 items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open navigation"
                className="lg:hidden"
                onClick={() => setMobileNav((open) => !open)}
              >
                <Menu />
              </Button>
              <div className="min-w-0">
                <p className="truncate text-[11px] text-muted-foreground">
                  SAHYOG AI <span className="px-1">/</span>{" "}
                  {view === "Case detail" ? "Case details" : view}
                </p>
                <h1 className="mt-0.5 truncate text-lg font-semibold">
                  {view === "Case detail"
                    ? (selectedCase?.id ?? "Case details")
                    : view}
                </h1>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <a
                href="/"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-semibold text-foreground transition hover:border-[#328B86] hover:bg-[#EAF5F1]"
                title="Return to Public Homepage"
              >
                <Home className="size-3.5 text-muted-foreground" />
                <span className="hidden md:inline">Homepage</span>
              </a>

              {view !== "New Assessment" && (
                <Button
                  size="sm"
                  onClick={() => navigate("New Assessment")}
                  className="h-8 gap-1.5 rounded-lg bg-[#123052] px-3 text-xs font-semibold text-white shadow-xs hover:bg-[#1A406D]"
                >
                  <FilePlus2 className="size-3.5" />
                  <span className="hidden sm:inline">New Assessment</span>
                </Button>
              )}

              <Badge
                variant="outline"
                className="inline-flex gap-1 border-status-moderate/30 bg-status-moderate/10 px-2 py-1 text-[10px] text-status-moderate"
              >
                <span className="size-1.5 shrink-0 rounded-full bg-status-moderate" />
                <span>NHAAS 14566 DEMO</span>
              </Badge>

              <Button
                variant="ghost"
                size="icon"
                aria-label="Notifications"
                className="size-8"
                onClick={() =>
                  notify(
                    "Triage alert: All pending cases synchronized. 14566 Protocol active.",
                  )
                }
              >
                <Bell className="size-4 text-muted-foreground" />
              </Button>

              <div className="hidden h-7 w-px bg-border sm:block" />

              <div className="hidden text-right sm:block">
                <p className="text-xs font-bold text-foreground">
                  Demo Responder
                </p>
                <p className="text-[10px] text-muted-foreground">
                  Trained Social Responder
                </p>
              </div>

              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#EAF5F1] text-xs font-bold text-[#123052]">
                DR
              </div>
            </div>
          </div>
          {mobileNav && (
            <div className="border-t border-border bg-background px-4 py-3 lg:hidden">
              <nav className="grid grid-cols-2 gap-1 sm:grid-cols-3">
                {navigation.map((item) => (
                  <NavItem
                    key={item.label}
                    item={item}
                    active={view === item.label}
                    onClick={() => navigate(item.label)}
                    mobile
                    caseCount={cases.length}
                  />
                ))}
              </nav>
            </div>
          )}
        </header>

        <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-7 sm:py-8 lg:px-9">
          {view === "Overview" && (
            <OverviewPage
              cases={cases}
              referrals={referrals}
              onNavigate={navigate}
              onOpenCase={openCase}
            />
          )}
          {view === "New Assessment" && (
            <AssessmentPage
              cases={cases}
              settings={settings}
              onSubmitCase={addCase}
              onUpdateCase={updateCase}
              onNavigate={navigate}
              onOpenCase={openCase}
              onNotify={notify}
              result={assessment}
              setResult={setAssessment}
              narrative={assessmentNarrative}
              setNarrative={setAssessmentNarrative}
            />
          )}
          {view === "Case Management" && (
            <CasesPage cases={cases} onOpenCase={openCase} />
          )}
          {view === "Case detail" && selectedCase && (
            <CaseDetailPage
              item={selectedCase}
              referrals={referrals.filter(
                (referral) => referral.caseId === selectedCase.id,
              )}
              onBack={() => navigate("Case Management")}
              onUpdate={updateCase}
              onNavigate={navigate}
              onNotify={notify}
            />
          )}
          {view === "Referrals" && (
            <ReferralsPage
              referrals={referrals}
              cases={cases}
              onAdd={addReferral}
              onUpdate={(id, status) => {
                setReferrals((items) =>
                  items.map((item) =>
                    item.id === id ? { ...item, status } : item,
                  ),
                );
                notify(
                  `Mock referral status updated to ${status}. No external service was contacted.`,
                );
              }}
              onNotify={notify}
            />
          )}
          {view === "Reports" && (
            <ReportsPage cases={cases} referrals={referrals} />
          )}
          {view === "Settings" && (
            <SettingsPage settings={settings} setSettings={setSettings} />
          )}
        </div>
      </main>
      {toast && (
        <div
          role="status"
          className="fixed bottom-5 right-5 z-50 flex max-w-sm items-center gap-2 border border-border bg-background px-4 py-3 text-sm shadow-lg"
        >
          <CheckCircle2 className="size-4 shrink-0 text-status-low" />
          {toast}
        </div>
      )}
    </div>
  );
}

function BrandBlock({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={`flex items-center border-b border-sidebar-foreground/10 py-[19px] ${collapsed ? "justify-center px-2" : "gap-3 px-6"}`}
    >
      <div className="grid size-9 shrink-0 place-items-center rounded-md bg-sidebar-foreground text-brand-ink">
        <HeartHandshake className="size-[19px]" />
      </div>
      {!collapsed && (
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-bold tracking-[0.1em]">
            SAHYOG{" "}
            <span className="font-medium text-sidebar-foreground/70">AI</span>
          </p>
          <p className="mt-0.5 text-[10px] text-sidebar-foreground/55">
            Human support workspace
          </p>
        </div>
      )}
      <Button
        variant="ghost"
        size="icon"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        aria-expanded={!collapsed}
        onClick={onToggle}
        className={`size-8 shrink-0 text-sidebar-foreground/70 hover:bg-sidebar-foreground/10 hover:text-sidebar-foreground ${collapsed ? "absolute right-1 top-[60px]" : ""}`}
      >
        {collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
      </Button>
    </div>
  );
}

function NavItem({
  item,
  active,
  onClick,
  mobile = false,
  collapsed = false,
  caseCount = 0,
}: {
  item: { label: Exclude<View, "Case detail">; icon: typeof Home };
  active: boolean;
  onClick: () => void;
  mobile?: boolean;
  collapsed?: boolean;
  caseCount?: number;
}) {
  const Icon = item.icon;
  const labelHidden = collapsed && !mobile;
  const buttonStyle = mobile
    ? active
      ? "bg-primary text-primary-foreground hover:bg-primary/90"
      : "text-muted-foreground hover:bg-muted"
    : active
      ? "sahyog-nav-active"
      : "text-sidebar-foreground/75 hover:bg-sidebar-foreground/10 hover:text-sidebar-foreground";
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      title={labelHidden ? item.label : undefined}
      className={`h-10 w-full justify-start gap-3 rounded-md px-3 text-left text-[13px] font-medium ${buttonStyle} ${labelHidden ? "justify-center px-0" : ""}`}
    >
      <Icon className="size-[17px] shrink-0" />
      <span className={labelHidden ? "sr-only" : ""}>{item.label}</span>
      {item.label === "Case Management" && !mobile && !collapsed && (
        <span className="ml-auto rounded bg-sidebar-foreground/10 px-1.5 py-0.5 text-[10px] text-sidebar-foreground/70">
          {caseCount}
        </span>
      )}
    </Button>
  );
}

function PageIntro({
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
    <div className="mb-7 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
      <div className="min-w-0">
        <p className="mb-2 text-[10px] font-semibold tracking-[0.16em] text-primary">
          {eyebrow}
        </p>
        <h2 className="text-[25px] font-semibold leading-tight tracking-normal sm:text-[29px]">
          {title}
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

function DemoNotice({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-2.5 border border-status-moderate/25 bg-status-moderate/5 px-3.5 py-3 text-xs leading-5 text-foreground">
      <Info className="mt-0.5 size-4 shrink-0 text-status-moderate" />
      <p>{children}</p>
    </div>
  );
}

function StatCard({
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
    brand: "bg-brand-soft text-brand-ink",
    amber: "bg-status-moderate/10 text-status-moderate",
    red: "bg-status-urgent/10 text-status-urgent",
    green: "bg-status-low/10 text-status-low",
  };
  return (
    <div className="border border-border bg-card px-4 py-4 sm:px-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="mt-2 text-[27px] font-semibold tabular-nums leading-none">
            {value}
          </p>
        </div>
        <div
          className={`grid size-9 shrink-0 place-items-center rounded-md ${toneClasses[tone]}`}
        >
          <Icon className="size-[17px]" />
        </div>
      </div>
      <p className="mt-3 text-[11px] text-muted-foreground">{sub}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const cls =
    status === "Reviewed" || status === "Completed"
      ? "border-status-low/20 bg-status-low/10 text-status-low"
      : status === "In review" || status === "Initiated"
        ? "border-primary/20 bg-primary/5 text-primary"
        : status === "Follow-up requested"
          ? "border-status-moderate/25 bg-status-moderate/10 text-status-moderate"
          : "border-status-high/20 bg-status-high/10 text-status-high";
  return (
    <Badge
      variant="outline"
      className={`whitespace-nowrap rounded-sm font-medium ${cls}`}
    >
      <span className="mr-1.5 size-1.5 rounded-full bg-current" />
      {status}
    </Badge>
  );
}

function PriorityBadge({ priority }: { priority: Priority }) {
  const cls =
    priority === "Urgent review"
      ? "border-status-urgent/25 bg-status-urgent/10 text-status-urgent"
      : priority === "High"
        ? "border-status-high/25 bg-status-high/10 text-status-high"
        : priority === "Moderate"
          ? "border-status-moderate/25 bg-status-moderate/10 text-status-moderate"
          : "border-status-low/25 bg-status-low/10 text-status-low";
  return (
    <Badge
      variant="outline"
      className={`whitespace-nowrap rounded-sm font-medium ${cls}`}
    >
      {priority}
    </Badge>
  );
}

function SectionHeading({
  title,
  caption,
  action,
}: {
  title: string;
  caption?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3.5 sm:px-5">
      <div>
        <h3 className="text-sm font-semibold">{title}</h3>
        {caption && (
          <p className="mt-1 text-[11px] text-muted-foreground">{caption}</p>
        )}
      </div>
      {action}
    </div>
  );
}

function CaseTable({
  cases,
  onOpenCase,
  compact = false,
}: {
  cases: DemoCase[];
  onOpenCase: (id: string) => void;
  compact?: boolean;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[690px] text-left text-xs">
        <thead>
          <tr className="border-b border-border text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
            <th className="px-4 py-3 font-medium sm:px-5">Case ID</th>
            <th className="px-4 py-3 font-medium">Date</th>
            <th className="px-4 py-3 font-medium">Language</th>
            <th className="px-4 py-3 font-medium">Review status</th>
            <th className="px-4 py-3 font-medium">Assigned responder</th>
            <th className="px-4 py-3 font-medium">Priority</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {cases.slice(0, compact ? 5 : undefined).map((item) => (
            <tr key={item.id} className="transition-colors hover:bg-muted/30">
              <td className="px-4 py-3.5 sm:px-5">
                <Button
                  variant="link"
                  className="h-auto p-0 font-semibold text-primary"
                  onClick={() => onOpenCase(item.id)}
                >
                  {item.id}
                </Button>
              </td>
              <td className="whitespace-nowrap px-4 py-3.5 text-muted-foreground">
                {item.date}
              </td>
              <td className="px-4 py-3.5 text-foreground">{item.language}</td>
              <td className="px-4 py-3.5">
                <StatusBadge status={item.status} />
              </td>
              <td className="px-4 py-3.5 text-muted-foreground">
                {item.assigned}
              </td>
              <td className="px-4 py-3.5">
                <PriorityBadge priority={item.priority} />
              </td>
              <td className="px-4 py-3.5">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Open case ${item.id}`}
                  onClick={() => onOpenCase(item.id)}
                  className="size-7"
                >
                  <ArrowRight />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {cases.length === 0 && (
        <div className="px-5 py-12 text-center text-sm text-muted-foreground">
          No matching cases found.
        </div>
      )}
    </div>
  );
}

function OverviewPage({
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
  const pendingCases = cases.filter((item) => item.status === "Pending review");
  const urgentCases = cases.filter(
    (item) => item.priority === "Urgent review" && item.status !== "Reviewed",
  );
  const activeReferrals = referrals.filter(
    (item) => item.status !== "Completed",
  );
  const needsAttention = [
    ...urgentCases,
    ...pendingCases.filter(
      (item) => !urgentCases.some((urgentCase) => urgentCase.id === item.id),
    ),
  ].slice(0, 4);

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
      name: "Low",
      value: cases.filter((item) => item.priority === "Low").length,
      fill: "#24856f",
    },
    {
      name: "Moderate",
      value: cases.filter((item) => item.priority === "Moderate").length,
      fill: "#c58a22",
    },
    {
      name: "High",
      value: cases.filter((item) => item.priority === "High").length,
      fill: "#d86f43",
    },
    {
      name: "Urgent review",
      value: cases.filter((item) => item.priority === "Urgent review").length,
      fill: "#c74755",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl border border-[#d6e7e3] bg-gradient-to-br from-white via-[#f3faf8] to-[#eaf4f5] p-5 shadow-sm sm:p-7">
        <div className="pointer-events-none absolute -right-12 -top-20 size-64 rounded-full border-[28px] border-white/70" />
        <div className="pointer-events-none absolute right-24 top-24 size-24 rounded-full bg-[#d9efea]/70 blur-2xl" />
        <div className="relative flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold tracking-tight text-[#153653] sm:text-3xl">
              A clearer view of the support queue.
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#526b80]">
              Review the current workload, spot cases awaiting a human response,
              and coordinate follow-up—all in one place.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-medium text-[#355a70]">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/90 px-3 py-2">
                <ShieldCheck className="size-4 text-[#24856f]" /> Human-led
                decisions
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/90 px-3 py-2">
                <LockKeyhole className="size-4 text-[#24856f]" /> Respectful by
                design
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/90 px-3 py-2">
                <Activity className="size-4 text-[#24856f]" /> Illustrative demo
                data
              </span>
            </div>
          </div>
          <div className="relative flex shrink-0 flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => onNavigate("Case Management")}
              className="gap-2 border-[#c8dcd8] bg-white text-[#183b56] hover:bg-[#f3faf8]"
            >
              <ClipboardList className="size-4" /> View case queue
            </Button>
          </div>
        </div>
      </div>

      <section
        aria-label="Workspace statistics"
        className="grid grid-cols-1 gap-3 sm:grid-cols-2 2xl:grid-cols-4"
      >
        <div className="group rounded-xl border border-[#d9e7e5] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-[#607589]">
                Active cases
              </p>
              <p className="mt-3 text-3xl font-bold tracking-tight text-[#153653]">
                {cases.length}
              </p>
            </div>
            <span className="grid size-11 place-items-center rounded-xl bg-[#e5f4ef] text-[#167d70]">
              <BriefcaseBusiness className="size-5" />
            </span>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-[#edf2f1] pt-3">
            <span className="text-[11px] text-[#6a7f90]">
              Across the demo queue
            </span>
            <button
              className="text-[11px] font-bold text-[#167d70] hover:underline"
              onClick={() => onNavigate("Case Management")}
            >
              View queue <ArrowRight className="ml-1 inline size-3.5" />
            </button>
          </div>
        </div>
        <div className="group rounded-xl border border-[#eadfbe] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-[#607589]">
                Pending human reviews
              </p>
              <p className="mt-3 text-3xl font-bold tracking-tight text-[#153653]">
                {pendingCases.length}
              </p>
            </div>
            <span className="grid size-11 place-items-center rounded-xl bg-[#fff4d9] text-[#a76c0d]">
              <UsersRound className="size-5" />
            </span>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-[#edf2f1] pt-3">
            <span className="text-[11px] text-[#6a7f90]">
              Awaiting responder attention
            </span>
            <span className="rounded-full bg-[#fff4d9] px-2 py-1 text-[10px] font-bold text-[#94600d]">
              Needs review
            </span>
          </div>
        </div>
        <div className="group rounded-xl border border-[#f0d6d8] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-[#607589]">
                High-priority reviews
              </p>
              <p className="mt-3 text-3xl font-bold tracking-tight text-[#153653]">
                {urgentCases.length}
              </p>
            </div>
            <span className="grid size-11 place-items-center rounded-xl bg-[#ffebed] text-[#c74755]">
              <ShieldAlert className="size-5" />
            </span>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-[#edf2f1] pt-3">
            <span className="text-[11px] text-[#6a7f90]">
              Human review required
            </span>
            <span className="rounded-full bg-[#ffebed] px-2 py-1 text-[10px] font-bold text-[#b53b49]">
              Prioritise
            </span>
          </div>
        </div>
        <div className="group rounded-xl border border-[#d9e7e5] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-[#607589]">
                Referrals in progress
              </p>
              <p className="mt-3 text-3xl font-bold tracking-tight text-[#153653]">
                {activeReferrals.length}
              </p>
            </div>
            <span className="grid size-11 place-items-center rounded-xl bg-[#e8f5ed] text-[#24805b]">
              <HeartHandshake className="size-5" />
            </span>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-[#edf2f1] pt-3">
            <span className="text-[11px] text-[#6a7f90]">
              Mock referrals only
            </span>
            <button
              className="text-[11px] font-bold text-[#167d70] hover:underline"
              onClick={() => onNavigate("Referrals")}
            >
              View referrals <ArrowRight className="ml-1 inline size-3.5" />
            </button>
          </div>
        </div>
      </section>

      <div className="grid gap-5 2xl:grid-cols-[minmax(0,1.5fr)_minmax(330px,0.85fr)]">
        <section className="overflow-hidden rounded-xl border border-[#dce7e5] bg-white shadow-sm">
          <SectionHeading
            title="Case activity"
            caption="Illustrative case volumes · May–October 2026"
            action={
              <Badge
                variant="outline"
                className="border-[#d8e6e3] bg-[#f4faf8] text-[10px] text-[#427064]"
              >
                DEMO DATA
              </Badge>
            }
          />
          <div className="px-3 pb-4 pt-2 sm:px-5">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs text-[#61788a]">Volume overview</p>
              <p className="text-[10px] text-[#8092a0]">
                Illustrative values, not live operational metrics
              </p>
            </div>
            <div className="h-[245px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={trend}
                  margin={{ top: 10, right: 8, left: -18, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="volumeFill" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor="#238b80"
                        stopOpacity={0.28}
                      />
                      <stop
                        offset="95%"
                        stopColor="#238b80"
                        stopOpacity={0.02}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    vertical={false}
                    stroke="#e6eeec"
                    strokeDasharray="4 5"
                  />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#718697", fontSize: 11 }}
                    tickMargin={10}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#718697", fontSize: 11 }}
                    width={34}
                  />
                  <Tooltip
                    contentStyle={{
                      borderColor: "#dce7e5",
                      borderRadius: 10,
                      fontSize: 12,
                      boxShadow: "0 8px 24px rgba(20,50,70,.08)",
                    }}
                  />
                  <Area
                    dataKey="count"
                    name="Illustrative cases"
                    type="monotone"
                    stroke="#238b80"
                    strokeWidth={3}
                    fill="url(#volumeFill)"
                    activeDot={{ r: 5, strokeWidth: 0, fill: "#153653" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-xl border border-[#dce7e5] bg-white shadow-sm">
          <SectionHeading
            title="Priority distribution"
            caption="Rule-based categories across mock cases"
            action={
              <span className="rounded-lg bg-[#f2f8f6] px-2.5 py-1 text-[10px] font-semibold text-[#507366]">
                {cases.length} total
              </span>
            }
          />
          <div className="grid grid-cols-[138px_minmax(0,1fr)] items-center gap-1 px-3 py-3 sm:grid-cols-[155px_minmax(0,1fr)] sm:px-4">
            <div className="relative h-[175px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categories}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={49}
                    outerRadius={70}
                    paddingAngle={3}
                    stroke="#fff"
                    strokeWidth={3}
                  >
                    {categories.map((item) => (
                      <Cell key={item.name} fill={item.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
                <div>
                  <p className="text-2xl font-bold text-[#153653]">
                    {cases.length}
                  </p>
                  <p className="mt-0.5 text-[9px] font-semibold tracking-[0.12em] text-[#738797]">
                    CASES
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-3 pr-1">
              {categories.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between gap-2"
                >
                  <span className="flex min-w-0 items-center gap-2 text-[11px] text-[#536d80]">
                    <span
                      className="size-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: item.fill }}
                    />
                    {item.name}
                  </span>
                  <span className="text-sm font-bold tabular-nums text-[#183b56]">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="border-t border-[#edf2f1] bg-[#f8fbfa] px-4 py-3 text-[10px] leading-5 text-[#718697]">
            These categories are illustrative indicators only. They do not
            represent a validated model score or clinical judgement.
          </div>
        </section>
      </div>

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <section className="self-start overflow-hidden rounded-2xl border border-[#dce9e6] bg-white shadow-[0_8px_28px_rgba(21,54,83,0.045)]">
          <SectionHeading
            title="Cases needing attention"
            caption="A focused queue for the next human review"
            action={
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 rounded-lg border-[#d6e5e2] text-[#24566a] hover:bg-[#f2faf7]"
                onClick={() => onNavigate("Case Management")}
              >
                Open queue <ArrowRight className="size-3.5" />
              </Button>
            }
          />
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#edf2f1] bg-[#f8fbfa] px-4 py-3 sm:px-5">
            <span className="text-xs text-[#607789]">
              Prioritise these records for review
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#f3d4d7] bg-white px-2.5 py-1 text-[10px] font-bold text-[#b94350]">
              <span className="size-1.5 rounded-full bg-[#cf5260]" />{" "}
              {needsAttention.length} requiring attention
            </span>
          </div>
          {needsAttention.length > 0 ? (
            <div className="divide-y divide-[#edf2f1]">
              {needsAttention.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onOpenCase(item.id)}
                  className="group flex w-full items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-[#f6fbf9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#2b9a87] sm:gap-4 sm:px-5"
                >
                  <span
                    className={`grid size-10 shrink-0 place-items-center rounded-xl ring-1 ring-inset ${item.priority === "Urgent review" ? "bg-[#fff0f1] text-[#c74755] ring-[#f6d8dc]" : "bg-[#fff7e5] text-[#a76c0d] ring-[#f1e1b8]"}`}
                  >
                    <ShieldAlert className="size-[18px]" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <strong className="text-sm font-bold tracking-[-0.01em] text-[#183b56] group-hover:text-[#147c76]">
                        {item.id}
                      </strong>
                      <PriorityBadge priority={item.priority} />
                    </span>
                    <span className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#718697]">
                      <span>{item.language}</span>
                      <span className="text-[#bdc9c8]">•</span>
                      <span>{item.assigned}</span>
                    </span>
                  </span>
                  <span className="hidden sm:block">
                    <StatusBadge status={item.status} />
                  </span>
                  <span className="grid size-8 shrink-0 place-items-center rounded-full text-[#76908f] transition group-hover:bg-white group-hover:text-[#167d70] group-hover:shadow-sm">
                    <ChevronRight className="size-4" />
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="px-5 py-10 text-center">
              <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-[#e8f6ef] text-[#24856f]">
                <CheckCircle2 className="size-6" />
              </span>
              <p className="mt-3 text-sm font-semibold text-[#183b56]">
                No cases in this attention list
              </p>
              <p className="mt-1 text-xs text-[#718697]">
                Check the full queue for the latest case status.
              </p>
            </div>
          )}
          <div className="border-t border-[#edf2f1] px-4 py-3 text-[10px] leading-5 text-[#718697] sm:px-5">
            Priority labels are illustrative. Review each case's context and
            follow your organisation's protocols.
          </div>
        </section>

        <section className="self-start overflow-hidden rounded-2xl border border-[#dce9e6] bg-white shadow-[0_8px_28px_rgba(21,54,83,0.045)]">
          <SectionHeading
            title="Workflow at a glance"
            caption="From listening to coordinated support"
          />
          <div className="px-4 py-3 sm:px-5">
            <div className="relative space-y-1">
              <div className="flex gap-3 rounded-xl p-3 transition-colors hover:bg-[#f7fbfa]">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#e5f4ef] text-[#167d70]">
                  <MessageSquareText className="size-[18px]" />
                </span>
                <div className="min-w-0 flex-1 pt-0.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold tracking-[0.12em] text-[#24856f]">
                      STEP 01
                    </span>
                    <p className="text-sm font-bold text-[#183b56]">
                      Listen and document
                    </p>
                  </div>
                  <p className="mt-1 text-xs leading-5 text-[#6a7f90]">
                    Capture reported concerns respectfully and keep the person's
                    context in view.
                  </p>
                </div>
              </div>
              <div className="ml-8 h-4 border-l-2 border-dotted border-[#c8dcd8]" />
              <div className="flex gap-3 rounded-xl p-3 transition-colors hover:bg-[#f7fbfa]">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#edf0ff] text-[#6556a8]">
                  <BrainCircuit className="size-[18px]" />
                </span>
                <div className="min-w-0 flex-1 pt-0.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold tracking-[0.12em] text-[#6556a8]">
                      STEP 02
                    </span>
                    <p className="text-sm font-bold text-[#183b56]">
                      Organise for human review
                    </p>
                  </div>
                  <p className="mt-1 text-xs leading-5 text-[#6a7f90]">
                    Structure information to support responders—not to make
                    automatic decisions.
                  </p>
                </div>
              </div>
              <div className="ml-8 h-4 border-l-2 border-dotted border-[#c8dcd8]" />
              <div className="flex gap-3 rounded-xl p-3 transition-colors hover:bg-[#f7fbfa]">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#fff1e7] text-[#b9683f]">
                  <LifeBuoy className="size-[18px]" />
                </span>
                <div className="min-w-0 flex-1 pt-0.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold tracking-[0.12em] text-[#b9683f]">
                      STEP 03
                    </span>
                    <p className="text-sm font-bold text-[#183b56]">
                      Coordinate appropriate support
                    </p>
                  </div>
                  <p className="mt-1 text-xs leading-5 text-[#6a7f90]">
                    Track follow-up and referrals with trained people remaining
                    responsible.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-3 rounded-xl border border-[#d7ebe3] bg-gradient-to-br from-[#f0faf6] to-[#f8fbfa] p-3.5">
              <div className="flex items-start gap-2.5">
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-white text-[#24856f] shadow-sm">
                  <ShieldCheck className="size-4" />
                </span>
                <div>
                  <p className="text-xs font-bold text-[#1c5d55]">
                    Human judgement stays central
                  </p>
                  <p className="mt-1 text-[11px] leading-5 text-[#5e7b76]">
                    SAHYOG AI supports a prototype workflow; it does not
                    diagnose, validate risk, or contact external services.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="overflow-hidden rounded-xl border border-[#dce7e5] bg-white shadow-sm">
        <SectionHeading
          title="Recent cases"
          caption="Fictional case records · open a record to review its details"
          action={
            <Button
              variant="outline"
              size="sm"
              className="hidden gap-2 border-[#d6e5e2] text-[#24566a] sm:inline-flex"
              onClick={() => onNavigate("Case Management")}
            >
              All cases <ArrowRight className="size-4" />
            </Button>
          }
        />
        <CaseTable cases={cases} onOpenCase={onOpenCase} compact />
        <div className="border-t border-[#edf2f1] bg-[#fbfdfc] px-4 py-3 sm:hidden">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => onNavigate("Case Management")}
          >
            View all cases <ArrowRight className="size-4" />
          </Button>
        </div>
      </section>
    </div>
  );
}

function AssessmentPage({
  cases,
  settings,
  onSubmitCase,
  onOpenCase,
  onNavigate,
  onNotify,
  result,
  setResult,
  narrative,
  setNarrative,
}: {
  cases: DemoCase[];
  settings: ScoreSettings;
  onSubmitCase: (item: DemoCase) => void;
  onUpdateCase: (
    id: string,
    updates: Partial<DemoCase>,
    history?: string,
  ) => void;
  onNavigate: (view: View) => void;
  onOpenCase: (id: string) => void;
  onNotify: (message: string) => void;
  result: ReturnType<typeof assessDemonstration> | null;
  setResult: (result: ReturnType<typeof assessDemonstration> | null) => void;
  narrative: string;
  setNarrative: (text: string) => void;
}) {
  const [language, setLanguage] = useState("English");
  const [mode, setMode] = useState<"Text" | "Transcript">("Text");
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const voiceRecognitionRef = useRef<any>(null);
  const voiceBaseTextRef = useRef("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [createdId, setCreatedId] = useState<string | null>(null);
  const sourceText = mode === "Transcript" ? transcript : narrative;
  const selectScenario = (text: string) => {
    setNarrative(text);
    setTranscript(text);
    setResult(null);
    setError("");
    setCreatedId(null);
  };

  const startVoiceInput = () => {
    const speechWindow = window as any;
    const SpeechRecognition =
      speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError(
        "Voice input is not supported by this browser. Please use Google Chrome or type your narrative instead.",
      );
      return;
    }

    setError("");
    setMode("Transcript");
    setResult(null);
    setCreatedId(null);

    voiceBaseTextRef.current = transcript.trim()
      ? `${transcript.trim()} `
      : narrative.trim()
        ? `${narrative.trim()} `
        : "";

    const recognition = new SpeechRecognition();
    voiceRecognitionRef.current = recognition;

    recognition.lang = language === "Hindi" ? "hi-IN" : "en-US";

    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      let recognizedText = "";

      for (let i = 0; i < event.results.length; i++) {
        recognizedText += event.results[i][0].transcript;
      }

      setTranscript(`${voiceBaseTextRef.current}${recognizedText}`.trim());
    };

    recognition.onerror = (event: any) => {
      setIsListening(false);

      if (event.error !== "no-speech") {
        setError(
          `Voice input error: ${event.error}. You can continue by typing.`,
        );
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
    } catch {
      setIsListening(false);
      setError("Could not start voice input. Please try again.");
    }
  };

  const stopVoiceInput = () => {
    voiceRecognitionRef.current?.stop();
    setIsListening(false);
  };

  const clearNarrative = () => {
    stopVoiceInput();
    setNarrative("");
    setTranscript("");
    setResult(null);
    setCreatedId(null);
    setError("");
  };
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (sourceText.trim().length < 12) {
      setError(
        "Please enter at least 12 characters so the demonstration can produce an illustrative result.",
      );
      return;
    }
    if (!consent) {
      setError(
        "Please confirm that you understand this fictional prototype does not process real reports.",
      );
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);
    setCreatedId(null);

    try {
      const savedComplaint = await createComplaint({
        description: sourceText,
        language,
      });

      const mock = assessDemonstration(sourceText, settings);
      const id = String(savedComplaint.id);

      const date = new Date(savedComplaint.created_at).toLocaleDateString(
        "en-GB",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        },
      );

      const created: DemoCase = {
        id,
        date,
        language: savedComplaint.language,
        status: "Pending review",
        assigned: "Unassigned",
        score: mock.score,
        priority: mock.priority,
        summary:
          sourceText.slice(0, 110) + (sourceText.length > 110 ? "…" : ""),
        narrative: sourceText,
        indicators: mock.indicators,
        notes: "",
        followUpDate: "",
        history: [
          `${date} · Rule-based demonstration run · Human review required`,
        ],
      };

      onSubmitCase(created);
      setResult(mock);
      setCreatedId(id);
    } catch (error) {
      console.error("Failed to save complaint:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Could not save the complaint. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <PageIntro
        eyebrow="CASE INTAKE"
        title="New Assessment"
        description="Record the person's concerns, review the available information, and identify appropriate next steps for support."
      />

      <div className="mt-4 grid items-start gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <form
          onSubmit={submit}
          className="space-y-5 rounded-2xl border border-[#DCE7E2] bg-white p-5 sm:p-7 shadow-xs"
        >
          <div className="flex items-center gap-2 border-b border-border pb-4">
            <span className="grid size-7 place-items-center rounded-full bg-[#EAF5F1] text-xs font-bold text-[#123052]">
              1
            </span>
            <h3 className="text-sm font-bold text-[#123052]">
              Case & Intake details
            </h3>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-xs font-medium">
              Language
              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
                className="mt-2 h-10 w-full rounded-md border border-input bg-background px-3 text-sm font-normal focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option>English</option>
                <option>Hindi</option>
                <option>Other</option>
              </select>
            </label>
            <fieldset>
              <legend className="text-xs font-semibold text-[#183B56]">
                Input method
              </legend>

              <div className="mt-2 grid h-11 grid-cols-2 gap-1 rounded-xl border border-[#DCE7E2] bg-[#F4F8F7] p-1">
                <button
                  type="button"
                  onClick={() => {
                    stopVoiceInput();
                    setMode("Text");
                    setNarrative(transcript || narrative);
                    setError("");
                  }}
                  className={`rounded-lg text-sm font-medium transition ${
                    mode === "Text"
                      ? "bg-white text-[#123052] shadow-sm"
                      : "text-[#62778A] hover:text-[#123052]"
                  }`}
                >
                  Type narrative
                </button>

                <button
                  type="button"
                  onClick={() => {
                    stopVoiceInput();
                    setMode("Transcript");
                    setTranscript(narrative || transcript);
                    setError("");
                  }}
                  className={`rounded-lg text-sm font-medium transition ${
                    mode === "Transcript"
                      ? "bg-white text-[#123052] shadow-sm"
                      : "text-[#62778A] hover:text-[#123052]"
                  }`}
                >
                  Voice / transcript
                </button>
              </div>
            </fieldset>
          </div>
          <div>
            <div className="flex items-center justify-between gap-3">
              <label htmlFor="narrative" className="text-xs font-medium">
                {mode === "Text" ? "complaint narrative" : "Transcript"}{" "}
                <span className="text-status-urgent">*</span>
              </label>
              <span className="text-[10px] text-muted-foreground">
                {sourceText.length} characters
              </span>
            </div>
            <Textarea
              id="narrative"
              value={sourceText}
              onChange={(event) => {
                if (mode === "Text") setNarrative(event.target.value);
                else setTranscript(event.target.value);
                setResult(null);
                setCreatedId(null);
              }}
              placeholder="Type a fictional narrative here…"
              rows={7}
              className="mt-2 resize-y text-sm leading-6"
              required
              minLength={12}
            />
            <p className="mt-1.5 text-[10px] text-muted-foreground">
              Use invented example wording only. A minimum of 12 characters is
              required.
            </p>
          </div>
          <div className="rounded-xl border border-[#DCE7E2] bg-[#F7FAF9] p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#E4F3EF] text-[#168477]">
                  <Activity className="size-5" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#183B56]">
                    Voice-assisted entry
                  </p>
                  <p className="mt-1 max-w-md text-xs leading-5 text-[#62778A]">
                    Dictate a fictional example, then review and edit the
                    transcript before analysis. Microphone permission may be
                    required.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {!isListening ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={startVoiceInput}
                    className="gap-2 border-[#BBDCD5] text-[#147E76]"
                  >
                    <Activity className="size-4" />
                    Start speaking
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={stopVoiceInput}
                    className="gap-2 border-red-200 text-red-600"
                  >
                    <span className="size-2 animate-pulse rounded-full bg-red-500" />
                    Stop listening
                  </Button>
                )}

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearNarrative}
                >
                  Clear
                </Button>
              </div>
            </div>

            {isListening && (
              <p
                role="status"
                className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700"
              >
                Listening… Speak clearly. Select Stop listening when finished.
              </p>
            )}

            <p className="mt-3 text-[11px] leading-5 text-[#62778A]">
              Voice recognition depends on browser support and may use a browser
              provider's speech service. Do not dictate real names, contact
              details, or sensitive personal reports in this demonstration.
            </p>
          </div>
          <label className="flex cursor-pointer items-start gap-3 border-t border-border pt-4">
            <input
              type="checkbox"
              className="mt-0.5 size-4 shrink-0 accent-primary"
              checked={consent}
              onChange={(event) => setConsent(event.target.checked)}
            />
          </label>
          {error && (
            <p
              role="alert"
              className="border border-status-urgent/25 bg-status-urgent/5 px-3 py-2 text-xs text-status-urgent"
            >
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="mt-4 w-full justify-center gap-2 sm:w-auto"
          >
            {loading ? "Submitting..." : "Submit Assessment"}
          </Button>
        </form>
        <div className="space-y-5">
          <section className="rounded-2xl border border-[#DCE7E2] bg-white shadow-xs overflow-hidden">
            <SectionHeading
              title="Prepared scenarios"
              caption="Load a fictional narrative"
            />
            <div className="divide-y divide-[#DCE7E2]">
              {preparedScenarios.map((scenario, index) => (
                <button
                  type="button"
                  key={scenario.id}
                  onClick={() => selectScenario(scenario.narrative)}
                  className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-[#EAF5F1]/50"
                >
                  <span className="grid size-7 shrink-0 place-items-center rounded-lg border border-[#DCE7E2] bg-[#FCFBF8] text-[10px] font-semibold text-[#123052]">
                    0{index + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-semibold text-[#123052]">
                      {scenario.title}
                    </span>
                    <span className="mt-0.5 block truncate text-[11px] text-[#5A6E82]">
                      {scenario.narrative}
                    </span>
                  </span>
                  <ArrowRight className="size-4 shrink-0 text-[#328B86]" />
                </button>
              ))}
            </div>
          </section>
          <section className="rounded-2xl border border-[#DCE7E2] bg-white shadow-xs overflow-hidden">
            <SectionHeading title="Transparent demonstration rules" />
            <div className="space-y-3 p-4">
              <p className="text-[11px] leading-5 text-muted-foreground">
                Simple phrase matching highlights only the following observable
                text. It does not infer intent, severity, or whether a person is
                safe.
              </p>
              <div className="grid grid-cols-2 gap-2">
                {(["fear", "duration", "safety", "overwhelm"] as const).map(
                  (key) => (
                    <div
                      key={key}
                      className="flex items-center gap-2 border border-[#DCE7E2] rounded-lg px-2.5 py-2 text-[10px]"
                    >
                      <span className="size-1.5 rounded-full bg-primary" />
                      {key === "fear"
                        ? "Expressed fear"
                        : key === "duration"
                          ? "Prolonged distress"
                          : key === "safety"
                            ? "Stated safety concern"
                            : "Emotional overwhelm"}
                    </div>
                  ),
                )}
              </div>
              <div className="border-l-2 border-status-moderate pl-3 text-[10px] leading-4 text-muted-foreground">
                No indicator found does not mean that a person is safe. Human
                review is always required.
              </div>
            </div>
          </section>
        </div>
      </div>
      {result && createdId && (
        <AssessmentResult
          result={result}
          narrative={sourceText}
          onOpen={() => onOpenCase(createdId)}
          onNotify={onNotify}
        />
      )}
    </>
  );
}

function AssessmentResult({
  result,
  narrative,
  onOpen,
  onNotify,
}: {
  result: ReturnType<typeof assessDemonstration>;
  narrative: string;
  onOpen: () => void;
  onNotify: (message: string) => void;
}) {
  const displayEvidence: { label: string; evidence: string }[] = result
    .indicators.length
    ? result.indicators
    : [
        {
          label: "No configured phrase match",
          evidence: "No matching phrase found in the fictional text.",
        },
      ];
  return (
    <section
      className="mt-6 rounded-2xl border border-[#DCE7E2] bg-white shadow-xs overflow-hidden"
      aria-live="polite"
    >
      <SectionHeading
        title="Illustrative assessment result"
        caption="Generated from transparent demonstration rules only"
        action={
          <Badge
            variant="outline"
            className="rounded-sm border-status-high/25 bg-status-high/10 text-status-high"
          >
            HUMAN REVIEW REQUIRED
          </Badge>
        }
      />
      <div className="grid gap-0 lg:grid-cols-[240px_minmax(0,1fr)]">
        <div className="border-b border-border p-5 lg:border-b-0 lg:border-r">
          <p className="text-[10px] font-semibold tracking-[0.12em] text-muted-foreground">
            ILLUSTRATIVE SVI
          </p>
          <div className="mt-3 flex items-end gap-2">
            <span className="text-5xl font-semibold tabular-nums leading-none">
              {result.score}
            </span>
            <span className="pb-1 text-sm text-muted-foreground">/ 100</span>
          </div>
          <p className="mt-3 text-[10px] leading-4 text-muted-foreground">
            Demonstration score only. Not clinically meaningful or validated.
          </p>
          <div className="mt-4">
            <PriorityBadge priority={result.priority} />
          </div>
          <div className="mt-5 h-1.5 w-full bg-muted">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${result.score}%` }}
            />
          </div>
        </div>
        <div className="p-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <h4 className="text-xs font-semibold">
                Observed text indicators
              </h4>
              <div className="mt-3 space-y-3">
                {displayEvidence.map((item, index) => (
                  <div
                    key={`${item.label}-${index}`}
                    className="border-l-2 border-primary/40 pl-3"
                  >
                    <p className="text-xs font-medium">{item.label}</p>
                    <p className="mt-1 break-words text-[11px] leading-5 text-muted-foreground">
                      {item.evidence}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold">Source narrative</h4>
              <blockquote className="mt-3 border border-border bg-muted/20 p-3 text-[11px] leading-5 text-muted-foreground">
                “{narrative}”
              </blockquote>
              <div className="mt-3 flex items-start gap-2 text-[10px] leading-4 text-muted-foreground">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-status-moderate" />
                Preliminary phrase-match indicators only. Not a diagnosis, risk
                determination, or substitute for a trained responder.
              </div>
            </div>
          </div>

          {result.suggestedQuestions &&
            result.suggestedQuestions.length > 0 && (
              <div className="mt-5 border-t border-border pt-4">
                <h4 className="flex items-center gap-2 text-xs font-bold text-primary">
                  <HeartHandshake className="size-4 text-teal-600" />
                  Suggested Responder Follow-up Questions
                </h4>
                <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
                  {result.suggestedQuestions.map((q, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 rounded-xl border border-border/70 bg-muted/20 p-3 text-xs leading-relaxed"
                    >
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                        {idx + 1}
                      </span>
                      <span className="text-foreground">{q}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {result.missingInformation &&
            result.missingInformation.length > 0 && (
              <div className="mt-4 rounded-xl border border-[#DCE7E2] bg-[#FCFBF8] p-3.5 text-xs text-[#5A6E82]">
                <p className="font-bold text-[#123052] text-[11px] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Info className="size-3.5 text-[#328B86]" />
                  Assessment Context & Limitations
                </p>
                <ul className="list-disc pl-4 space-y-1 text-[11px]">
                  {result.missingInformation.map((info, idx) => (
                    <li key={idx}>{info}</li>
                  ))}
                </ul>
              </div>
            )}

          <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-4">
            <Button size="sm" onClick={onOpen}>
              Open case <ArrowRight />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                const summary = `SAHYOG AI Assessment\nPriority: ${result.priority} (SVI: ${result.score}/100)\nIndicators: ${result.indicators.map((i) => i.label).join(", ") || "No matches"}\nNarrative: "${narrative}"`;
                navigator.clipboard?.writeText(summary);
                onNotify("Clinical summary copied to clipboard.");
              }}
            >
              Copy Summary
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                onNotify(
                  "Follow-up noted for responder review; no message was sent.",
                )
              }
            >
              Request follow-up
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                onNotify(
                  "Referral options are available in the Referral Center. No action was taken.",
                )
              }
            >
              View referral options
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function CasesPage({
  cases,
  onOpenCase,
}: {
  cases: DemoCase[];
  onOpenCase: (id: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [language, setLanguage] = useState("all");
  const [sortNewest, setSortNewest] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const filtered = useMemo(
    () =>
      cases
        .filter((item) => {
          const matches = `${item.id} ${item.assigned} ${item.summary}`
            .toLocaleLowerCase()
            .includes(search.toLocaleLowerCase());
          return (
            matches &&
            (status === "all" || item.status === status) &&
            (language === "all" || item.language === language)
          );
        })
        .sort((a, b) =>
          sortNewest ? b.id.localeCompare(a.id) : a.id.localeCompare(b.id),
        ),
    [cases, search, status, language, sortNewest],
  );
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);
  return (
    <>
      <PageIntro
        eyebrow="WORKSPACE / RECORDS"
        title="Case management"
        description="Search and review fictional cases. Select a record to inspect the narrative, history, and responder notes."
        action={
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => window.print()}
          >
            <FileChartColumnIncreasing />{" "}
            <span className="hidden sm:inline">Print list</span>
          </Button>
        }
      />
      <section className="mt-5 border border-border bg-card">
        <div className="grid gap-3 border-b border-border p-4 sm:grid-cols-[minmax(200px,1fr)_170px_150px_auto] sm:items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              aria-label="Search cases"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search ID, responder or summary"
              className="pl-9"
            />
          </div>
          <Select
            value={status}
            onValueChange={(value) => {
              setStatus(value);
              setPage(1);
            }}
          >
            <SelectTrigger aria-label="Filter by status">
              <Filter className="mr-2 size-3.5" />
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="Pending review">Pending review</SelectItem>
              <SelectItem value="In review">In review</SelectItem>
              <SelectItem value="Reviewed">Reviewed</SelectItem>
              <SelectItem value="Follow-up requested">
                Follow-up requested
              </SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={language}
            onValueChange={(value) => {
              setLanguage(value);
              setPage(1);
            }}
          >
            <SelectTrigger aria-label="Filter by language">
              <Languages className="mr-2 size-3.5" />
              <SelectValue placeholder="All languages" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All languages</SelectItem>
              <SelectItem value="English">English</SelectItem>
              <SelectItem value="Hindi">Hindi</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => setSortNewest((value) => !value)}
          >
            <ArrowDownUp />
            {sortNewest ? "Newest first" : "Oldest first"}
          </Button>
        </div>
        <CaseTable cases={pageItems} onOpenCase={onOpenCase} />
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3">
          <p className="text-[11px] text-muted-foreground">
            Showing {filtered.length ? (page - 1) * pageSize + 1 : 0}–
            {Math.min(page * pageSize, filtered.length)} of {filtered.length}{" "}
            fictional cases
          </p>
          <div className="flex items-center gap-1">
            <Button
              size="icon"
              variant="outline"
              aria-label="Previous page"
              disabled={page === 1}
              onClick={() => setPage((current) => current - 1)}
              className="size-8"
            >
              <ChevronLeft />
            </Button>
            <span className="min-w-14 text-center text-xs">
              Page {page} / {pages}
            </span>
            <Button
              size="icon"
              variant="outline"
              aria-label="Next page"
              disabled={page >= pages}
              onClick={() => setPage((current) => current + 1)}
              className="size-8"
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

function CaseDetailPage({
  item,
  referrals,
  onBack,
  onUpdate,
  onNavigate,
  onNotify,
}: {
  item: DemoCase;
  referrals: DemoReferral[];
  onBack: () => void;
  onUpdate: (id: string, updates: Partial<DemoCase>, history?: string) => void;
  onNavigate: (view: View) => void;
  onNotify: (message: string) => void;
}) {
  const [notes, setNotes] = useState(item.notes);
  return (
    <>
      <div className="mb-5">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="-ml-2 gap-2 text-muted-foreground"
        >
          <ArrowLeft /> Back to case management
        </Button>
      </div>
      <PageIntro
        eyebrow={`CASE RECORD / ${item.id}`}
        title="Case details"
        description="Fictional complaint summary, human review record, and responder notes."
        action={<StatusBadge status={item.status} />}
      />
      <DemoNotice>
        <strong>Synthetic case record.</strong> The illustrative score and
        matched text are not a clinical assessment. Human review is required; no
        indicator means a person is safe.
      </DemoNotice>
      <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(300px,0.75fr)]">
        <div className="space-y-4">
          <section className="border border-border bg-card">
            <SectionHeading
              title="Complaint summary"
              caption={`${item.date} · ${item.language} · Assigned ${item.assigned}`}
            />
            <div className="p-5">
              <p className="text-sm leading-6">{item.summary}</p>
              <div className="mt-4 border-l-2 border-border pl-3">
                <p className="text-[10px] font-semibold tracking-[0.1em] text-muted-foreground">
                  FICTIONAL NARRATIVE
                </p>
                <p className="mt-2 text-xs leading-6 text-muted-foreground">
                  “{item.narrative}”
                </p>
              </div>
            </div>
          </section>
          <section className="border border-border bg-card">
            <SectionHeading
              title="Observable text indicators"
              caption="Phrase matches only · no diagnosis or safety determination"
            />
            {item.indicators.length ? (
              <div className="divide-y divide-border">
                {item.indicators.map((indicator, index) => (
                  <div
                    key={`${indicator.key}-${index}`}
                    className="grid gap-1 px-5 py-3 sm:grid-cols-[220px_minmax(0,1fr)] sm:gap-5"
                  >
                    <p className="text-xs font-medium">{indicator.label}</p>
                    <p className="text-xs leading-5 text-muted-foreground">
                      {indicator.evidence}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="px-5 py-5 text-xs leading-5 text-muted-foreground">
                No configured phrase was matched. This does not mean the person
                is safe or does not need support.
              </p>
            )}
          </section>
          <section className="border border-border bg-card">
            <SectionHeading
              title="Responder notes"
              caption="Editable local demonstration notes"
            />
            <div className="space-y-3 p-5">
              <Textarea
                aria-label="Responder notes"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Add a fictional responder note…"
                rows={3}
              />
              <Button
                size="sm"
                onClick={() =>
                  onUpdate(item.id, { notes }, "Responder notes updated")
                }
              >
                Save notes
              </Button>
            </div>
          </section>
        </div>
        <div className="space-y-4">
          <section className="border border-border bg-card">
            <SectionHeading title="Review actions" />
            <div className="space-y-3 p-4">
              <label className="block text-xs font-medium">
                Review status
                <select
                  aria-label="Review status"
                  value={item.status}
                  onChange={(event) =>
                    onUpdate(
                      item.id,
                      { status: event.target.value as ReviewStatus },
                      `Status changed to ${event.target.value}`,
                    )
                  }
                  className="mt-2 h-10 w-full rounded-md border border-input bg-background px-3 text-sm font-normal"
                >
                  <option>Pending review</option>
                  <option>In review</option>
                  <option>Reviewed</option>
                  <option>Follow-up requested</option>
                </select>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2"
                  onClick={() => {
                    onUpdate(
                      item.id,
                      { status: "Reviewed" },
                      "Marked reviewed by responder",
                    );
                    onNotify("Marked reviewed in the demonstration case.");
                  }}
                >
                  <Check /> Mark reviewed
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2"
                  onClick={() => {
                    onUpdate(
                      item.id,
                      { status: "Follow-up requested" },
                      "Follow-up requested by responder",
                    );
                    onNotify(
                      "Follow-up noted for responder review. No message was sent.",
                    );
                  }}
                >
                  <MessageSquareText /> Follow-up
                </Button>
              </div>
              <Button
                size="sm"
                variant="secondary"
                className="w-full"
                onClick={() => onNavigate("Referrals")}
              >
                View referral options <ArrowRight />
              </Button>
            </div>
          </section>
          <section className="border border-border bg-card">
            <SectionHeading title="Assessment snapshot" />
            <div className="p-4">
              <div className="flex items-end justify-between">
                <span className="text-xs text-muted-foreground">
                  Illustrative SVI
                </span>
                <span className="text-2xl font-semibold tabular-nums">
                  {item.score}
                  <span className="text-xs font-normal text-muted-foreground">
                    {" "}
                    / 100
                  </span>
                </span>
              </div>
              <div className="mt-3 h-1.5 bg-muted">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${item.score}%` }}
                />
              </div>
              <div className="mt-3 flex items-center justify-between">
                <PriorityBadge priority={item.priority} />
                <span className="text-[10px] text-muted-foreground">
                  Not clinically validated
                </span>
              </div>
              <div className="mt-4 border-t border-border pt-3">
                <p className="flex items-center gap-2 text-[10px] text-status-high">
                  <ShieldAlert className="size-3.5" /> HUMAN REVIEW REQUIRED
                </p>
              </div>
            </div>
          </section>
          <section className="border border-border bg-card">
            <SectionHeading title="Assessment history" />
            <div className="p-4">
              <ul className="space-y-3">
                {item.history.map((event, index) => (
                  <li
                    key={`${event}-${index}`}
                    className="flex gap-3 text-[11px] leading-5 text-muted-foreground"
                  >
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                    {event}
                  </li>
                ))}
              </ul>
            </div>
          </section>
          <section className="border border-border bg-card">
            <SectionHeading title="Related referrals" />
            <div className="divide-y divide-border">
              {referrals.length ? (
                referrals.map((referral) => (
                  <div
                    key={referral.id}
                    className="flex items-center justify-between gap-2 px-4 py-3 text-[11px]"
                  >
                    <span>{referral.category}</span>
                    <StatusBadge status={referral.status} />
                  </div>
                ))
              ) : (
                <p className="px-4 py-4 text-[11px] text-muted-foreground">
                  No mock referrals for this case.
                </p>
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

function ReferralsPage({
  referrals,
  cases,
  onAdd,
  onUpdate,
  onNotify,
}: {
  referrals: DemoReferral[];
  cases: DemoCase[];
  onAdd: (referral: DemoReferral) => void;
  onUpdate: (id: string, status: DemoReferral["status"]) => void;
  onNotify: (message: string) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [caseId, setCaseId] = useState(cases[0]?.id ?? "");
  const [category, setCategory] = useState<ReferralCategory>("Counselling");
  const [error, setError] = useState("");
  const create = (event: FormEvent) => {
    event.preventDefault();
    if (!caseId) {
      setError("Select a fictional case before creating a mock referral.");
      return;
    }
    const id = `RF-${String(26009 + referrals.length).padStart(5, "0")}`;
    onAdd({
      id,
      caseId,
      category,
      status: "Awaiting human approval",
      service: "Support referral intake",
      followUpDate: "",
      notes: "Initiated via referral center",
      outcome: "Awaiting responder review",
      date: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    });
    setShowForm(false);
    setError("");
    onNotify("Mock referral created. Awaiting human responder review.");
  };
  return (
    <>
      <PageIntro
        eyebrow="WORKSPACE / HUMAN-LED SUPPORT"
        title="Referral center"
        description="Review available categories and record mock referrals for responder follow-up. Nothing is sent to an external service."
        action={
          <Button
            onClick={() => setShowForm((value) => !value)}
            className="gap-2"
          >
            <Plus />
            <span className="hidden sm:inline">Create mock referral</span>
            <span className="sm:hidden">Create</span>
          </Button>
        }
      />
      {showForm && (
        <form
          onSubmit={create}
          className="mt-5 border border-primary/30 bg-card p-4 sm:p-5"
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">Create a mock referral</h3>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Record a fictional request for responder review.
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Close form"
              onClick={() => setShowForm(false)}
            >
              <X />
            </Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-xs font-medium">
              Fictional case
              <select
                value={caseId}
                onChange={(event) => setCaseId(event.target.value)}
                className="mt-2 h-10 w-full rounded-md border border-input bg-background px-3 text-sm font-normal"
              >
                {cases.map((item) => (
                  <option value={item.id} key={item.id}>
                    {item.id} · {item.language}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-xs font-medium">
              Referral category
              <select
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value as ReferralCategory)
                }
                className="mt-2 h-10 w-full rounded-md border border-input bg-background px-3 text-sm font-normal"
              >
                {referralCategories.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
          </div>
          {error && (
            <p role="alert" className="mt-3 text-xs text-status-urgent">
              {error}
            </p>
          )}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button size="sm" type="submit">
              Create pending referral
            </Button>
            <span className="text-[10px] text-muted-foreground">
              Human confirmation required · no service contacted
            </span>
          </div>
        </form>
      )}
      <section className="mt-5 border border-border bg-card">
        <SectionHeading
          title="Referral queue"
          caption={`${referrals.length} fictional referrals · local demonstration state`}
        />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-xs">
            <thead>
              <tr className="border-b border-border text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
                <th className="px-5 py-3 font-medium">Referral ID</th>
                <th className="px-4 py-3 font-medium">Case ID</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Created</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {referrals.map((item) => (
                <tr key={item.id}>
                  <td className="px-5 py-4 font-semibold">{item.id}</td>
                  <td className="px-4 py-4 text-primary">{item.caseId}</td>
                  <td className="px-4 py-4">{item.category}</td>
                  <td className="px-4 py-4 text-muted-foreground">
                    {item.date}
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-4 py-4">
                    <select
                      aria-label={`Update status for ${item.id}`}
                      value={item.status}
                      onChange={(event) =>
                        onUpdate(
                          item.id,
                          event.target.value as DemoReferral["status"],
                        )
                      }
                      className="h-8 rounded border border-input bg-background px-2 text-[11px]"
                    >
                      <option>Pending</option>
                      <option>Initiated</option>
                      <option>Completed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {referrals.length === 0 && (
            <p className="px-5 py-12 text-center text-sm text-muted-foreground">
              No mock referrals yet.
            </p>
          )}
        </div>
      </section>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {referralCategories.map((item) => {
          const Icon = referralCategoryIcons[item];
          return (
            <div
              key={item}
              className="flex items-start gap-3 border border-border bg-card px-4 py-4"
            >
              <div className="grid size-8 shrink-0 place-items-center rounded-sm bg-brand-soft text-brand-ink">
                <Icon className="size-4" />
              </div>
              <div>
                <p className="text-xs font-semibold">{item}</p>
                <p className="mt-1 text-[10px] leading-4 text-muted-foreground">
                  Review availability with the person and confirm choices
                  directly.
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

const referralCategoryIcons: Record<ReferralCategory, typeof HeartHandshake> = {
  Counselling: HeartHandshake,
  "Legal aid": BookOpen,
  "Medical assistance": Activity,
  "Police intervention": ShieldAlert,
  "Witness protection": ShieldCheck,
  "Emergency support": LifeBuoy,
};

function ReportsPage({
  cases,
  referrals,
}: {
  cases: DemoCase[];
  referrals: DemoReferral[];
}) {
  const statusData = [
    "Pending review",
    "In review",
    "Reviewed",
    "Follow-up requested",
  ].map((name) => ({
    name,
    count: cases.filter((item) => item.status === name).length,
  }));
  const languageData = ["English", "Hindi", "Other"].map((name) => ({
    name,
    count: cases.filter((item) => item.language === name).length,
  }));
  const referralData = ["Pending", "Initiated", "Completed"].map((name) => ({
    name,
    count: referrals.filter((item) => item.status === name).length,
  }));
  const volume = [
    { month: "May", cases: 18 },
    { month: "Jun", cases: 24 },
    { month: "Jul", cases: 21 },
    { month: "Aug", cases: 30 },
    { month: "Sep", cases: 26 },
    { month: "Oct", cases: cases.length + 8 },
  ];
  return (
    <>
      <PageIntro
        eyebrow="ADMINISTRATION / REPORTS"
        title="Reports & insights"
        description="Explore fictional case volumes, review queues, language distribution, and referral outcomes."
        action={
          <Badge
            variant="outline"
            className="rounded-sm border-status-moderate/30 bg-status-moderate/10 text-status-moderate"
          >
            MOCK DATA ONLY
          </Badge>
        }
      />
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {[
          {
            title: "Case volumes",
            caption: "Illustrative cases by month",
            data: volume,
            key: "cases",
          },
          {
            title: "Review status",
            caption: "Current synthetic case queue",
            data: statusData,
            key: "count",
          },
          {
            title: "Language distribution",
            caption: "Language selected in mock cases",
            data: languageData,
            key: "count",
          },
          {
            title: "Referral outcomes",
            caption: "Local demonstration referral states",
            data: referralData,
            key: "count",
          },
        ].map((chart) => (
          <section key={chart.title} className="border border-border bg-card">
            <SectionHeading title={chart.title} caption={chart.caption} />
            <div className="h-[240px] p-4 pt-5">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chart.data}
                  margin={{ top: 5, right: 8, left: -20, bottom: 0 }}
                >
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
                      fontSize: 11,
                    }}
                  />
                  <YAxis
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={false}
                    tick={{
                      fill: "var(--color-muted-foreground)",
                      fontSize: 11,
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderColor: "var(--color-border)",
                      borderRadius: 4,
                      fontSize: 12,
                    }}
                  />
                  <Area
                    dataKey={chart.key}
                    type="monotone"
                    stroke="var(--color-primary)"
                    strokeWidth={2}
                    fill="var(--color-brand-soft)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>
        ))}
      </div>
      <p className="mt-4 flex items-center gap-2 text-[11px] text-muted-foreground">
        <Info className="size-4 shrink-0" />
        All metrics above are mock data, not validated model performance.
      </p>
    </>
  );
}

function SettingsPage({
  settings,
  setSettings,
}: {
  settings: ScoreSettings;
  setSettings: (value: ScoreSettings) => void;
}) {
  const updateWeight = (key: keyof ScoreSettings["weights"], value: number) =>
    setSettings({
      ...settings,
      weights: { ...settings.weights, [key]: value },
    });
  const updateThreshold = (
    key: keyof ScoreSettings["thresholds"],
    value: number,
  ) =>
    setSettings({
      ...settings,
      thresholds: { ...settings.thresholds, [key]: value },
    });
  return (
    <>
      <PageIntro
        eyebrow="ADMINISTRATION / PREFERENCES"
        title="Settings"
        description="Configure language preference and transparent demonstration scoring rules for this browser session."
      />
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <section className="border border-border bg-card">
          <SectionHeading
            title="Interface preference"
            caption="Affects labels in the interface only"
          />
          <div className="space-y-4 p-5">
            <label className="block text-xs font-medium">
              Preferred interface language
              <select
                defaultValue="English"
                className="mt-2 h-10 w-full rounded-md border border-input bg-background px-3 text-sm font-normal"
              >
                <option>English</option>
                <option>Hindi</option>
              </select>
            </label>
            <div className="flex items-start gap-3 border-t border-border pt-4">
              <Languages className="mt-0.5 size-4 text-muted-foreground" />
              <p className="text-[11px] leading-5 text-muted-foreground">
                Language preference is illustrative. This demonstration
                interface currently displays in English.
              </p>
            </div>
          </div>
        </section>
        <section className="border border-border bg-card">
          <SectionHeading
            title="Demonstration weights"
            caption="Maximum illustrative score: 100"
          />
          <div className="space-y-5 p-5">
            {(["fear", "duration", "safety", "overwhelm"] as const).map(
              (key) => (
                <label
                  key={key}
                  className="grid grid-cols-[minmax(0,1fr)_54px] items-center gap-x-4 gap-y-2 text-xs font-medium"
                >
                  <span>
                    {key === "fear"
                      ? "Expressed fear"
                      : key === "duration"
                        ? "Prolonged distress"
                        : key === "safety"
                          ? "Stated safety concern"
                          : "Emotional overwhelm"}
                  </span>
                  <span className="text-right tabular-nums text-muted-foreground">
                    {settings.weights[key]}
                  </span>
                  <input
                    aria-label={`${key} weight`}
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={settings.weights[key]}
                    onChange={(event) =>
                      updateWeight(key, Number(event.target.value))
                    }
                    className="col-span-2 h-1.5 w-full cursor-pointer accent-primary"
                  />
                </label>
              ),
            )}
            <p className="border-t border-border pt-3 text-[10px] leading-4 text-muted-foreground">
              Scores are simple rule-based sums capped at 100. Weights do not
              represent risk, clinical significance, or likelihood.
            </p>
          </div>
        </section>
        <section className="border border-border bg-card lg:col-span-2">
          <SectionHeading
            title="Demonstration thresholds"
            caption="Adjust illustrative category cutoffs · 0–100"
          />
          <div className="grid gap-5 p-5 sm:grid-cols-3">
            {(["moderate", "high", "urgent"] as const).map((key) => (
              <label key={key} className="block text-xs font-medium">
                <span className="flex items-center justify-between gap-2">
                  {key === "moderate"
                    ? "Moderate"
                    : key === "high"
                      ? "High"
                      : "Urgent review"}
                  <span className="font-semibold tabular-nums">
                    {settings.thresholds[key]}
                  </span>
                </span>
                <input
                  aria-label={`${key} threshold`}
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={settings.thresholds[key]}
                  onChange={(event) =>
                    updateThreshold(key, Number(event.target.value))
                  }
                  className="mt-4 h-1.5 w-full cursor-pointer accent-primary"
                />
              </label>
            ))}
          </div>
        </section>
        <section className="border border-status-urgent/25 bg-status-urgent/5 p-5 lg:col-span-2">
          <div className="flex items-start gap-3">
            <ShieldAlert className="mt-0.5 size-5 shrink-0 text-status-urgent" />
            <div></div>
          </div>
        </section>
      </div>
    </>
  );
}
