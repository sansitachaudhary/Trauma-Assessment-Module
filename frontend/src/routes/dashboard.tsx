import { createFileRoute } from "@tanstack/react-router";
import "./dashboard.css";
import { useEffect, useState } from "react";
import {
  Bell,
  CheckCircle2,
  ChevronDown,
  FilePlus2,
  Home,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getComplaints } from "../lib/complaint-api";
import type { AssessmentOutcome } from "@/lib/assessment-service";
import {
  defaultScoreSettings,
  initialCases,
  initialReferrals,
  type DemoCase,
  type DemoReferral,
  type ScoreSettings,
} from "@/lib/demo-data";
import {
  BrandBlock,
  NavItem,
  navigation,
  type View,
} from "@/components/sahyog/shared";
import { OverviewPage } from "@/pages/sahyog/OverviewPage";
import { AssessmentPage } from "@/pages/sahyog/AssessmentPage";
import { CasesPage } from "@/pages/sahyog/CasesPage";
import { CaseDetailPage } from "@/pages/sahyog/CaseDetailPage";
import { ReferralsPage } from "@/pages/sahyog/ReferralsPage";
import { ReportsPage } from "@/pages/sahyog/ReportsPage";
import { SettingsPage } from "@/pages/sahyog/SettingsPage";

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

  useEffect(() => {
    let active = true;

    getComplaints()
      .then((complaints) => {
        if (!active) return;
        console.log(
          "Complaints loaded from API:",
          complaints.map((complaint) => complaint.id),
        );

        const savedCases: DemoCase[] = complaints.map((complaint) => {
          const description =
            typeof complaint.description === "string"
              ? complaint.description
              : "";

          return {
            id: `DB-${complaint.id}`,
            date: new Date(complaint.created_at).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
            language:
              complaint.language === "en"
                ? "English"
                : complaint.language === "hi"
                  ? "Hindi"
                  : complaint.language,
            status: "New",
            assigned: "Unassigned",
            score: 0,
            priority: "Low",
            summary: description.slice(0, 100),
            narrative: description,
            indicators: [],
            notes:
              "New complaint received via API. Awaiting human responder review.",
            followUpDate: "Not scheduled",
            history: ["Complaint submitted via API"],
          };
        });

        setCases((existing) => {
          const demoCases = existing.filter(
            (item) => !item.id.startsWith("DB-"),
          );

          return [...savedCases, ...demoCases];
        });
      })
      .catch((error) => {
        console.error("Failed to load saved complaints:", error);
      });

    return () => {
      active = false;
    };
  }, []);

  const selectedCase = cases.find((item) => item.id === selectedId) ?? null;

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 3200);
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
      {/* Sidebar - Preserved exactly as existing */}
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
              title="Responder"
            >
              R
            </div>
            {!desktopCollapsed && (
              <>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">Responder</p>
                  <p className="mt-0.5 text-xs text-sidebar-foreground/60">
                    Support workspace
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
          <div className="flex items-center gap-3 px-4 py-3 sm:px-7 lg:h-[68px] lg:px-9 lg:py-0">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open navigation"
              className="lg:hidden"
              onClick={() => setMobileNav((open) => !open)}
            >
              <Menu />
            </Button>

            <h1 className="truncate text-lg font-semibold">
              {view === "Case detail"
                ? (selectedCase?.id ?? "Case details")
                : view}
            </h1>
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

        {/* Content Area */}
        <div className="mx-auto max-w-[1440px] px-3.5 py-5 sm:px-7 sm:py-8 lg:px-9">
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

          {view === "Case detail" &&
            (selectedCase ? (
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
            ) : (
              <div className="rounded-2xl border border-border bg-card p-12 text-center">
                <p className="text-base font-bold text-foreground">
                  Case Record Not Found
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  The requested case record could not be located in the current
                  triage queue.
                </p>
                <Button
                  className="mt-4"
                  size="sm"
                  onClick={() => navigate("Case Management")}
                >
                  Return to Case Management
                </Button>
              </div>
            ))}

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
                notify(`Referral status updated to ${status}.`);
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

      {/* Toast Notification */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 flex max-w-sm items-center gap-2.5 rounded-xl border border-border bg-background px-4 py-3 text-xs font-semibold text-foreground shadow-lg transition-all animate-in fade-in slide-in-from-bottom-2"
        >
          <CheckCircle2
            className="size-4 shrink-0 text-status-low"
            aria-hidden="true"
          />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
