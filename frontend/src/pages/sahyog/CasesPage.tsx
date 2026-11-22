import { useMemo, useState } from "react";
import {
  ArrowDownUp,
  ChevronLeft,
  ChevronRight,
  Database,
  FileChartColumnIncreasing,
  Filter,
  Languages,
  RotateCcw,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CaseTable, PageIntro } from "@/components/sahyog/shared";
import type { DemoCase } from "@/lib/demo-data";

export interface CasesPageProps {
  cases: DemoCase[];
  onOpenCase: (id: string) => void;
}

export function CasesPage({ cases, onOpenCase }: CasesPageProps) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [language, setLanguage] = useState("all");
  const [sourceFilter, setSourceFilter] = useState<"all" | "db" | "demo">("all");
  const [sortNewest, setSortNewest] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const filtered = useMemo(() => {
    return cases
      .filter((item) => {
        const matchesSearch = `${item.id} ${item.assigned} ${item.summary} ${item.narrative}`
          .toLocaleLowerCase()
          .includes(search.toLocaleLowerCase());

        const matchesStatus = status === "all" || item.status === status;
        const matchesLanguage = language === "all" || item.language === language;

        const isReal = item.id.startsWith("DB-");
        const matchesSource =
          sourceFilter === "all"
            ? true
            : sourceFilter === "db"
              ? isReal
              : !isReal;

        return matchesSearch && matchesStatus && matchesLanguage && matchesSource;
      })
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortNewest ? dateB - dateA : dateA - dateB;
      });
  }, [cases, search, status, language, sourceFilter, sortNewest]);

  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, pages);
  const pageItems = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const resetFilters = () => {
    setSearch("");
    setStatus("all");
    setLanguage("all");
    setSourceFilter("all");
    setSortNewest(true);
    setPage(1);
  };

  const hasActiveFilters =
    search.trim() !== "" || status !== "all" || language !== "all" || sourceFilter !== "all" || !sortNewest;

  const realComplaintsCount = cases.filter((c) => c.id.startsWith("DB-")).length;
  const demoCasesCount = cases.filter((c) => !c.id.startsWith("DB-")).length;

  return (
    <>
      <PageIntro
        eyebrow="WORKSPACE / RECORD TRIAGE"
        title="Case Management"
        description="Search, filter, and review submitted helpline complaints and demonstration cases. Select any record to inspect narrative context and manage care follow-up."
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 focus-visible:ring-2 focus-visible:ring-primary"
              onClick={() => window.print()}
            >
              <FileChartColumnIncreasing className="size-4" aria-hidden="true" />
              <span className="hidden sm:inline">Print / Export Queue</span>
            </Button>
          </div>
        }
      />

      <section
        aria-label="Case records directory"
        className="mt-5 overflow-hidden rounded-xl border border-border bg-card shadow-xs"
      >
        {/* Source Pills / Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/20 px-4 py-3 sm:px-5">
          <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Filter cases by data source">
            <button
              type="button"
              role="tab"
              aria-selected={sourceFilter === "all"}
              onClick={() => {
                setSourceFilter("all");
                setPage(1);
              }}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                sourceFilter === "all"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-card text-muted-foreground hover:bg-muted"
              }`}
            >
              All Records ({cases.length})
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={sourceFilter === "db"}
              onClick={() => {
                setSourceFilter("db");
                setPage(1);
              }}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                sourceFilter === "db"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-card text-muted-foreground hover:bg-muted"
              }`}
            >
              <Database className="size-3" aria-hidden="true" />
              <span>Submitted Complaints ({realComplaintsCount})</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={sourceFilter === "demo"}
              onClick={() => {
                setSourceFilter("demo");
                setPage(1);
              }}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                sourceFilter === "demo"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-card text-muted-foreground hover:bg-muted"
              }`}
            >
              <Sparkles className="size-3" aria-hidden="true" />
              <span>Demo Scenarios ({demoCasesCount})</span>
            </button>
          </div>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="h-8 gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="size-3" aria-hidden="true" />
              <span>Reset Filters</span>
            </Button>
          )}
        </div>

        {/* Filter Toolbar */}
        <div className="grid gap-3 border-b border-border p-4 sm:grid-cols-[minmax(200px,1.4fr)_160px_150px_auto] sm:items-center sm:px-5">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              aria-label="Search case ID, assigned responder or narrative summary"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search ID, responder, narrative..."
              className="pl-9 pr-8 text-xs focus-visible:ring-2 focus-visible:ring-primary"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search input"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="size-3.5" aria-hidden="true" />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <Select
            value={status}
            onValueChange={(val) => {
              setStatus(val);
              setPage(1);
            }}
          >
            <SelectTrigger aria-label="Filter by review status" className="text-xs">
              <Filter className="mr-2 size-3.5 text-muted-foreground" aria-hidden="true" />
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="New">New</SelectItem>
              <SelectItem value="Pending review">Pending review</SelectItem>
              <SelectItem value="In review">In review</SelectItem>
              <SelectItem value="Reviewed">Reviewed</SelectItem>
              <SelectItem value="Follow-up requested">Follow-up requested</SelectItem>
              <SelectItem value="Closed">Closed</SelectItem>
            </SelectContent>
          </Select>

          {/* Language Filter */}
          <Select
            value={language}
            onValueChange={(val) => {
              setLanguage(val);
              setPage(1);
            }}
          >
            <SelectTrigger aria-label="Filter by intake language" className="text-xs">
              <Languages className="mr-2 size-3.5 text-muted-foreground" aria-hidden="true" />
              <SelectValue placeholder="All Languages" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Languages</SelectItem>
              <SelectItem value="English">English</SelectItem>
              <SelectItem value="Hindi">Hindi</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort Order Toggle */}
          <Button
            variant="outline"
            size="sm"
            className="h-10 gap-1.5 text-xs font-semibold focus-visible:ring-2 focus-visible:ring-primary"
            onClick={() => setSortNewest((val) => !val)}
            aria-label={`Sort by date: currently ${sortNewest ? "newest first" : "oldest first"}`}
          >
            <ArrowDownUp className="size-3.5" aria-hidden="true" />
            <span>{sortNewest ? "Newest First" : "Oldest First"}</span>
          </Button>
        </div>

        {/* Case Table */}
        <CaseTable cases={pageItems} onOpenCase={onOpenCase} />

        {/* Pagination & Status Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3.5 sm:px-5">
          <p className="text-xs text-muted-foreground">
            Showing <strong className="text-foreground">{filtered.length ? (safePage - 1) * pageSize + 1 : 0}</strong>–
            <strong className="text-foreground">{Math.min(safePage * pageSize, filtered.length)}</strong> of{" "}
            <strong className="text-foreground">{filtered.length}</strong> matching records
            {filtered.length !== cases.length && ` (filtered from ${cases.length} total)`}
          </p>

          <div className="flex items-center gap-1.5">
            <Button
              size="sm"
              variant="outline"
              aria-label="Go to previous page"
              disabled={safePage <= 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              className="size-8 p-0 focus-visible:ring-2 focus-visible:ring-primary"
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
            </Button>

            <span className="px-2 text-xs font-semibold text-foreground">
              Page {safePage} of {pages}
            </span>

            <Button
              size="sm"
              variant="outline"
              aria-label="Go to next page"
              disabled={safePage >= pages}
              onClick={() => setPage((current) => Math.min(pages, current + 1))}
              className="size-8 p-0 focus-visible:ring-2 focus-visible:ring-primary"
            >
              <ChevronRight className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
