import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
  Activity,
  ArrowDownUp,
  ArrowLeft,
  ArrowRight,
  Bell,
  BookOpen,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  assessDemonstration,
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
  type ReviewStatus,
  type ScoreSettings,
  type ThresholdKey,
} from "@/lib/demo-data";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "SAHYOG AI — Distress Assessment & Human Support" },
      {
        name: "description",
        content:
          "A fictional, human-led case management prototype for support services. Illustrative demonstration data only.",
      },
      { property: "og:title", content: "SAHYOG AI — Distress Assessment & Human Support" },
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
  { label: "Reports", icon: FileChartColumnIncreasing, group: "ADMINISTRATION" },
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
  const [assessment, setAssessment] = useState<{
    score: number;
    priority: Priority;
    indicators: DemoCase["indicators"];
    humanReviewRequired: true;
  } | null>(null);
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
  const addCase = (item: DemoCase) => setCases((existing) => [item, ...existing]);
  const updateCase = (id: string, updates: Partial<DemoCase>, historyMessage?: string) => {
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
                  <p className="mt-0.5 text-xs text-sidebar-foreground/60">Prototype workspace</p>
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
                  {view === "Case detail" ? (selectedCase?.id ?? "Case details") : view}
                </h1>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <Badge
                variant="outline"
                className="inline-flex gap-1 border-status-moderate/30 bg-status-moderate/10 px-1.5 text-[9px] text-status-moderate sm:gap-1.5 sm:px-2 sm:text-[10px]"
              >
                <span className="size-1.5 shrink-0 rounded-full bg-status-moderate" />
                <span className="sm:hidden">DEMO</span>
                <span className="hidden sm:inline">DEMONSTRATION</span>
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Notifications"
                onClick={() => notify("You are viewing a fictional demonstration workspace.")}
              >
                <Bell />
              </Button>
              <div className="hidden h-7 w-px bg-border sm:block" />
              <div className="hidden text-right sm:block">
                <p className="text-xs font-medium">Demo Responder</p>
                <p className="text-[11px] text-muted-foreground">Support team</p>
              </div>
              <div className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-soft text-xs font-semibold text-brand-ink">
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
          {view === "Case Management" && <CasesPage cases={cases} onOpenCase={openCase} />}
          {view === "Case detail" && selectedCase && (
            <CaseDetailPage
              item={selectedCase}
              referrals={referrals.filter((referral) => referral.caseId === selectedCase.id)}
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
                  items.map((item) => (item.id === id ? { ...item, status } : item)),
                );
                notify(
                  `Mock referral status updated to ${status}. No external service was contacted.`,
                );
              }}
              onNotify={notify}
            />
          )}
          {view === "Reports" && <ReportsPage cases={cases} referrals={referrals} />}
          {view === "Settings" && <SettingsPage settings={settings} setSettings={setSettings} />}
        </div>
        <footer className="mx-4 border-t border-border py-5 text-center text-[11px] text-muted-foreground sm:mx-7 lg:mx-9">
          <span className="font-medium text-foreground">Prototype only.</span> Fictional records and
          rule-based illustrative indicators—not clinical advice or a validated assessment.
        </footer>
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

function BrandBlock({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
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
            SAHYOG <span className="font-medium text-sidebar-foreground/70">AI</span>
          </p>
          <p className="mt-0.5 text-[10px] text-sidebar-foreground/55">Human support workspace</p>
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
        <p className="mb-2 text-[10px] font-semibold tracking-[0.16em] text-primary">{eyebrow}</p>
        <h2 className="text-[25px] font-semibold leading-tight tracking-normal sm:text-[29px]">
          {title}
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
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
          <p className="mt-2 text-[27px] font-semibold tabular-nums leading-none">{value}</p>
        </div>
        <div className={`grid size-9 shrink-0 place-items-center rounded-md ${toneClasses[tone]}`}>
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
    <Badge variant="outline" className={`whitespace-nowrap rounded-sm font-medium ${cls}`}>
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
    <Badge variant="outline" className={`whitespace-nowrap rounded-sm font-medium ${cls}`}>
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
        {caption && <p className="mt-1 text-[11px] text-muted-foreground">{caption}</p>}
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
              <td className="whitespace-nowrap px-4 py-3.5 text-muted-foreground">{item.date}</td>
              <td className="px-4 py-3.5 text-foreground">{item.language}</td>
              <td className="px-4 py-3.5">
                <StatusBadge status={item.status} />
              </td>
              <td className="px-4 py-3.5 text-muted-foreground">{item.assigned}</td>
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
  const pending = cases.filter((item) => item.status === "Pending review").length;
  const urgent = cases.filter(
    (item) => item.priority === "Urgent review" && item.status !== "Reviewed",
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
      name: "Low",
      value: cases.filter((item) => item.priority === "Low").length,
      fill: "var(--color-status-low)",
    },
    {
      name: "Moderate",
      value: cases.filter((item) => item.priority === "Moderate").length,
      fill: "var(--color-status-moderate)",
    },
    {
      name: "High",
      value: cases.filter((item) => item.priority === "High").length,
      fill: "var(--color-status-high)",
    },
    {
      name: "Urgent review",
      value: cases.filter((item) => item.priority === "Urgent review").length,
      fill: "var(--color-status-urgent)",
    },
  ];
  return (
    <>
      <PageIntro
        eyebrow="MONDAY, 19 OCTOBER 2026 · WORKSPACE OVERVIEW"
        title="Good morning, responder"
        description="A clear view of the support queue and the people who need a human response."
        action={
          <Button onClick={() => onNavigate("New Assessment")} className="gap-2">
            <Plus /> <span className="hidden sm:inline">New assessment</span>
            <span className="sm:hidden">New</span>
          </Button>
        }
      />
      <DemoNotice>
        <strong>Synthetic demonstration data.</strong> Every figure and case shown is fictional and
        for interface demonstration only—not validated assessment results.
      </DemoNotice>
      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <StatCard
          label="Active cases"
          value={cases.length}
          sub="Across the demonstration queue"
          icon={BriefcaseBusiness}
        />
        <StatCard
          label="Pending human reviews"
          value={pending}
          sub="Awaiting responder attention"
          icon={UsersRound}
          tone="amber"
        />
        <StatCard
          label="High-priority reviews"
          value={urgent}
          sub="Human review is always required"
          icon={ShieldAlert}
          tone="red"
        />
        <StatCard
          label="Referrals in progress"
          value={referrals.filter((item) => item.status !== "Completed").length}
          sub="Mock referrals only · no external action"
          icon={HeartHandshake}
          tone="green"
        />
      </div>
      <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1.55fr)_minmax(300px,0.8fr)]">
        <section className="border border-border bg-card">
          <SectionHeading
            title="Case volumes"
            caption="Illustrative number of cases · May–October 2026"
            action={
              <Badge variant="outline" className="rounded-sm text-[10px]">
                MOCK DATA
              </Badge>
            }
          />
          <div className="h-[235px] p-4 pt-5">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend} margin={{ top: 5, right: 6, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="volumeFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.17} />
                    <stop offset="90%" stopColor="var(--color-primary)" stopOpacity={0} />
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
                  tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    borderColor: "var(--color-border)",
                    borderRadius: 4,
                    fontSize: 12,
                  }}
                />
                <Area
                  dataKey="count"
                  type="monotone"
                  stroke="var(--color-primary)"
                  strokeWidth={2}
                  fill="url(#volumeFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="border border-border bg-card">
          <SectionHeading
            title="Illustrative indicators"
            caption="Rule-based categories across mock cases"
          />
          <div className="grid grid-cols-[130px_minmax(0,1fr)] items-center gap-2 px-3 py-2 sm:grid-cols-[145px_minmax(0,1fr)]">
            <div className="relative h-[160px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categories}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={47}
                    outerRadius={66}
                    paddingAngle={2}
                    strokeWidth={0}
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
                  <p className="text-xl font-semibold">{cases.length}</p>
                  <p className="text-[9px] text-muted-foreground">CASES</p>
                </div>
              </div>
            </div>
            <div className="space-y-2 pr-2">
              {categories.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between gap-2 text-[11px]"
                >
                  <span className="flex min-w-0 items-center gap-2 text-muted-foreground">
                    <span
                      className="size-2 shrink-0 rounded-sm"
                      style={{ backgroundColor: item.fill }}
                    />
                    {item.name}
                  </span>
                  <span className="font-medium tabular-nums">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="border-t border-border px-4 py-2.5 text-[10px] text-muted-foreground">
            Categories are illustrative—not validated model performance.
          </div>
        </section>
      </div>
      <section className="mt-5 border border-border bg-card">
        <SectionHeading
          title="Recent cases"
          caption="Fictional case records · review state is editable"
          action={
            <Button
              variant="outline"
              size="sm"
              className="hidden gap-2 sm:inline-flex"
              onClick={() => onNavigate("Case Management")}
            >
              All cases <ArrowRight />
            </Button>
          }
        />
        <CaseTable cases={cases} onOpenCase={onOpenCase} compact />
        <div className="border-t border-border px-4 py-3 sm:hidden">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => onNavigate("Case Management")}
          >
            View all cases <ArrowRight />
          </Button>
        </div>
      </section>
    </>
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
  onUpdateCase: (id: string, updates: Partial<DemoCase>, history?: string) => void;
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
  const submit = (event: FormEvent) => {
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
    window.setTimeout(() => {
      const mock = assessDemonstration(sourceText, settings);
      const id = `SY-${String(26020 + cases.length - 10).padStart(5, "0")}`;
      const date = new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      const created: DemoCase = {
        id,
        date,
        language,
        status: "Pending review",
        assigned: "Unassigned",
        score: mock.score,
        priority: mock.priority,
        summary: sourceText.slice(0, 110) + (sourceText.length > 110 ? "…" : ""),
        narrative: sourceText,
        indicators: mock.indicators,
        notes: "",
        history: [`${date} · Rule-based demonstration run · Human review required`],
      };
      onSubmitCase(created);
      setResult(mock);
      setCreatedId(id);
      setLoading(false);
    }, 700);
  };
  return (
    <>
      <PageIntro
        eyebrow="WORKSPACE / INTAKE"
        title="New assessment"
        description="Capture a fictional complaint narrative for a transparent, rule-based demonstration. A human responder remains responsible for every decision."
      />
      <DemoNotice>
        <strong>Demonstration only.</strong> Do not enter real names, contact details, or personal
        reports. This prototype does not use AI and does not provide clinical assessment.
      </DemoNotice>
      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(310px,0.85fr)]">
        <form onSubmit={submit} className="space-y-5 border border-border bg-card p-4 sm:p-6">
          <div className="flex items-center gap-2 border-b border-border pb-4">
            <span className="grid size-7 place-items-center rounded-full bg-brand-soft text-xs font-semibold text-brand-ink">
              1
            </span>
            <h3 className="text-sm font-semibold">Complaint details</h3>
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
              <legend className="text-xs font-medium">Input mode</legend>
              <div className="mt-2 grid h-10 grid-cols-2 border border-border bg-muted/40 p-0.5">
                <Button
                  type="button"
                  variant={mode === "Text" ? "secondary" : "ghost"}
                  className="h-full rounded-sm text-xs"
                  onClick={() => setMode("Text")}
                >
                  Text
                </Button>
                <Button
                  type="button"
                  variant={mode === "Transcript" ? "secondary" : "ghost"}
                  className="h-full rounded-sm text-xs"
                  onClick={() => setMode("Transcript")}
                >
                  Transcript
                </Button>
              </div>
            </fieldset>
          </div>
          <div>
            <div className="flex items-center justify-between gap-3">
              <label htmlFor="narrative" className="text-xs font-medium">
                {mode === "Text" ? "Fictional complaint narrative" : "Fictional transcript"}{" "}
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
              Use invented example wording only. A minimum of 12 characters is required.
            </p>
          </div>
          <div className="border border-dashed border-border bg-muted/20 p-4">
            <div className="flex items-start gap-3">
              <div className="grid size-8 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground">
                <Activity className="size-4" />
              </div>
              <div>
                <p className="text-xs font-medium">
                  Voice input{" "}
                  <Badge variant="outline" className="ml-1 rounded-sm text-[9px]">
                    FUTURE PLACEHOLDER
                  </Badge>
                </p>
                <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
                  Voice recording and speech transcription are not available in this prototype.
                </p>
              </div>
            </div>
          </div>
          <label className="flex cursor-pointer items-start gap-3 border-t border-border pt-4">
            <input
              type="checkbox"
              className="mt-0.5 size-4 shrink-0 accent-primary"
              checked={consent}
              onChange={(event) => setConsent(event.target.checked)}
            />
            <span className="text-[11px] leading-5 text-muted-foreground">
              I understand that this is a fictional interface demonstration. No real complaint is
              submitted or stored, and the displayed indicators do not establish a diagnosis or
              determine safety.
            </span>
          </label>
          {error && (
            <p
              role="alert"
              className="border border-status-urgent/25 bg-status-urgent/5 px-3 py-2 text-xs text-status-urgent"
            >
              {error}
            </p>
          )}
          <Button type="submit" disabled={loading} className="w-full gap-2 sm:w-auto">
            {loading ? (
              <>
                <span className="size-3 animate-spin rounded-full border-2 border-current border-r-transparent" />{" "}
                Producing illustrative result…
              </>
            ) : (
              <>
                <Sparkles /> Analyze Indicators
              </>
            )}
          </Button>
        </form>
        <div className="space-y-5">
          <section className="border border-border bg-card">
            <SectionHeading title="Prepared scenarios" caption="Load a fictional narrative" />
            <div className="divide-y divide-border">
              {preparedScenarios.map((scenario, index) => (
                <button
                  type="button"
                  key={scenario.id}
                  onClick={() => selectScenario(scenario.narrative)}
                  className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-muted/30"
                >
                  <span className="grid size-7 shrink-0 place-items-center rounded-sm border border-border text-[10px] font-semibold text-muted-foreground">
                    0{index + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-medium">{scenario.title}</span>
                    <span className="mt-1 block truncate text-[10px] text-muted-foreground">
                      {scenario.narrative}
                    </span>
                  </span>
                  <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
                </button>
              ))}
            </div>
          </section>
          <section className="border border-border bg-card">
            <SectionHeading title="Transparent demonstration rules" />
            <div className="space-y-3 p-4">
              <p className="text-[11px] leading-5 text-muted-foreground">
                Simple phrase matching highlights only the following observable text. It does not
                infer intent, severity, or whether a person is safe.
              </p>
              <div className="grid grid-cols-2 gap-2">
                {(["fear", "duration", "safety", "overwhelm"] as const).map((key) => (
                  <div
                    key={key}
                    className="flex items-center gap-2 border border-border px-2.5 py-2 text-[10px]"
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
                ))}
              </div>
              <div className="border-l-2 border-status-moderate pl-3 text-[10px] leading-4 text-muted-foreground">
                No indicator found does not mean that a person is safe. Human review is always
                required.
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
  const displayEvidence = result.indicators.length
    ? result.indicators
    : [
        {
          label: "No configured phrase match",
          evidence: "No matching phrase found in the fictional text.",
        },
      ];
  return (
    <section className="mt-6 border border-border bg-card" aria-live="polite">
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
            <span className="text-5xl font-semibold tabular-nums leading-none">{result.score}</span>
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
              <h4 className="text-xs font-semibold">Observed text indicators</h4>
              <div className="mt-3 space-y-3">
                {displayEvidence.map((item, index) => (
                  <div key={`${item.label}-${index}`} className="border-l-2 border-primary/40 pl-3">
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
                Preliminary phrase-match indicators only. Not a diagnosis, risk determination, or
                substitute for a trained responder.
              </div>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-4">
            <Button size="sm" onClick={onOpen}>
              Open case <ArrowRight />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onNotify("Follow-up noted for responder review; no message was sent.")}
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

function CasesPage({ cases, onOpenCase }: { cases: DemoCase[]; onOpenCase: (id: string) => void }) {
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
        .sort((a, b) => (sortNewest ? b.id.localeCompare(a.id) : a.id.localeCompare(b.id))),
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
          <Button variant="outline" className="gap-2" onClick={() => window.print()}>
            <FileChartColumnIncreasing /> <span className="hidden sm:inline">Print list</span>
          </Button>
        }
      />
      <DemoNotice>
        All records below are synthetic demonstration cases. Avoid entering personal information; no
        real case records are held in this prototype.
      </DemoNotice>
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
              <SelectItem value="Follow-up requested">Follow-up requested</SelectItem>
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
            {Math.min(page * pageSize, filtered.length)} of {filtered.length} fictional cases
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
        <strong>Synthetic case record.</strong> The illustrative score and matched text are not a
        clinical assessment. Human review is required; no indicator means a person is safe.
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
                <p className="mt-2 text-xs leading-6 text-muted-foreground">“{item.narrative}”</p>
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
                    <p className="text-xs leading-5 text-muted-foreground">{indicator.evidence}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="px-5 py-5 text-xs leading-5 text-muted-foreground">
                No configured phrase was matched. This does not mean the person is safe or does not
                need support.
              </p>
            )}
          </section>
          <section className="border border-border bg-card">
            <SectionHeading title="Responder notes" caption="Editable local demonstration notes" />
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
                onClick={() => onUpdate(item.id, { notes }, "Responder notes updated")}
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
                    onUpdate(item.id, { status: "Reviewed" }, "Marked reviewed by responder");
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
                    onNotify("Follow-up noted for responder review. No message was sent.");
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
                <span className="text-xs text-muted-foreground">Illustrative SVI</span>
                <span className="text-2xl font-semibold tabular-nums">
                  {item.score}
                  <span className="text-xs font-normal text-muted-foreground"> / 100</span>
                </span>
              </div>
              <div className="mt-3 h-1.5 bg-muted">
                <div className="h-full bg-primary" style={{ width: `${item.score}%` }} />
              </div>
              <div className="mt-3 flex items-center justify-between">
                <PriorityBadge priority={item.priority} />
                <span className="text-[10px] text-muted-foreground">Not clinically validated</span>
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
      status: "Pending",
      date: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    });
    setShowForm(false);
    setError("");
    onNotify("Mock referral created as Pending. No external service was contacted.");
  };
  return (
    <>
      <PageIntro
        eyebrow="WORKSPACE / HUMAN-LED SUPPORT"
        title="Referral center"
        description="Review available categories and record mock referrals for responder follow-up. Nothing is sent to an external service."
        action={
          <Button onClick={() => setShowForm((value) => !value)} className="gap-2">
            <Plus />
            <span className="hidden sm:inline">Create mock referral</span>
            <span className="sm:hidden">Create</span>
          </Button>
        }
      />
      <DemoNotice>
        <strong>Human action only.</strong> Referrals in this prototype are local records. Police
        intervention, emergency support, and every other service are never initiated automatically.
      </DemoNotice>
      {showForm && (
        <form onSubmit={create} className="mt-5 border border-primary/30 bg-card p-4 sm:p-5">
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
                onChange={(event) => setCategory(event.target.value as ReferralCategory)}
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
                  <td className="px-4 py-4 text-muted-foreground">{item.date}</td>
                  <td className="px-4 py-4">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-4 py-4">
                    <select
                      aria-label={`Update status for ${item.id}`}
                      value={item.status}
                      onChange={(event) =>
                        onUpdate(item.id, event.target.value as DemoReferral["status"])
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
                  Review availability with the person and confirm choices directly.
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

function ReportsPage({ cases, referrals }: { cases: DemoCase[]; referrals: DemoReferral[] }) {
  const statusData = ["Pending review", "In review", "Reviewed", "Follow-up requested"].map(
    (name) => ({ name, count: cases.filter((item) => item.status === name).length }),
  );
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
      <DemoNotice>
        <strong>Illustrative metrics only.</strong> These mock figures are not validated model
        performance, official statistics, or evidence of clinical effectiveness.
      </DemoNotice>
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
                <AreaChart data={chart.data} margin={{ top: 5, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid
                    vertical={false}
                    stroke="var(--color-border)"
                    strokeDasharray="3 4"
                  />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
                  />
                  <YAxis
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
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
    setSettings({ ...settings, weights: { ...settings.weights, [key]: value } });
  const updateThreshold = (key: keyof ScoreSettings["thresholds"], value: number) =>
    setSettings({ ...settings, thresholds: { ...settings.thresholds, [key]: value } });
  return (
    <>
      <PageIntro
        eyebrow="ADMINISTRATION / PREFERENCES"
        title="Settings"
        description="Configure language preference and transparent demonstration scoring rules for this browser session."
      />
      <DemoNotice>
        These controls are for interface prototyping only. Thresholds and weights are not clinically
        validated, and the settings are not production security configuration.
      </DemoNotice>
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
                Language preference is illustrative. This demonstration interface currently displays
                in English.
              </p>
            </div>
          </div>
        </section>
        <section className="border border-border bg-card">
          <SectionHeading title="Demonstration weights" caption="Maximum illustrative score: 100" />
          <div className="space-y-5 p-5">
            {(["fear", "duration", "safety", "overwhelm"] as const).map((key) => (
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
                  onChange={(event) => updateWeight(key, Number(event.target.value))}
                  className="col-span-2 h-1.5 w-full cursor-pointer accent-primary"
                />
              </label>
            ))}
            <p className="border-t border-border pt-3 text-[10px] leading-4 text-muted-foreground">
              Scores are simple rule-based sums capped at 100. Weights do not represent risk,
              clinical significance, or likelihood.
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
                  {key === "moderate" ? "Moderate" : key === "high" ? "High" : "Urgent review"}
                  <span className="font-semibold tabular-nums">{settings.thresholds[key]}</span>
                </span>
                <input
                  aria-label={`${key} threshold`}
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={settings.thresholds[key]}
                  onChange={(event) => updateThreshold(key, Number(event.target.value))}
                  className="mt-4 h-1.5 w-full cursor-pointer accent-primary"
                />
              </label>
            ))}
          </div>
        </section>
        <section className="border border-status-urgent/25 bg-status-urgent/5 p-5 lg:col-span-2">
          <div className="flex items-start gap-3">
            <ShieldAlert className="mt-0.5 size-5 shrink-0 text-status-urgent" />
            <div>
              <h3 className="text-xs font-semibold">Prototype disclaimer</h3>
              <p className="mt-1.5 text-[11px] leading-5 text-muted-foreground">
                SAHYOG AI is a frontend demonstration. Phrase matching and scores are fictional,
                preliminary indicators—not a clinical diagnosis or validated screening tool. Human
                review is required for every case. No personal data, actual user management,
                external AI, production security, or real helpline services are configured.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
