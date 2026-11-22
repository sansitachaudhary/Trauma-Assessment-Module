import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DemoCase } from "@/lib/demo-data";
import { StatusBadge } from "./StatusBadge";
import { PriorityBadge } from "./PriorityBadge";

export interface CaseTableProps {
  cases: DemoCase[];
  onOpenCase: (id: string) => void;
  compact?: boolean;
}

export function CaseTable({
  cases,
  onOpenCase,
  compact = false,
}: CaseTableProps) {
  const displayCases = compact ? cases.slice(0, 5) : cases;

  return (
    <div className="relative overflow-hidden">
      <div
        className="overflow-x-auto"
        tabIndex={0}
        role="region"
        aria-label="Case records table"
      >
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/20 text-xs uppercase tracking-[0.06em] text-muted-foreground">
              <th scope="col" className="px-4 py-3.5 font-semibold sm:px-5">
                Case ID
              </th>
              <th scope="col" className="px-4 py-3.5 font-semibold">
                Date
              </th>
              <th scope="col" className="px-4 py-3.5 font-semibold">
                Language
              </th>
              <th scope="col" className="px-4 py-3.5 font-semibold">
                Review Status
              </th>
              <th scope="col" className="px-4 py-3.5 font-semibold">
                Assigned Responder
              </th>
              <th scope="col" className="px-4 py-3.5 font-semibold">
                Priority
              </th>
              <th scope="col" className="px-4 py-3.5 text-right font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {displayCases.map((item) => {
              return (
                <tr
                  key={item.id}
                  className="transition-colors hover:bg-muted/40 focus-within:bg-muted/30"
                >
                  <td className="px-4 py-3.5 sm:px-5">
                    <div className="flex flex-col gap-1">
                      <button
                        type="button"
                        onClick={() => onOpenCase(item.id)}
                        className="text-left font-bold text-foreground transition-colors hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 rounded-sm"
                      >
                        {item.id}
                      </button>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-muted-foreground">
                    {item.date}
                  </td>
                  <td className="px-4 py-3.5 font-medium text-foreground">
                    {item.language}
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-4 py-3.5 text-muted-foreground">
                    {item.assigned}
                  </td>
                  <td className="px-4 py-3.5">
                    {item.status === "New" ? (
                      <span className="text-sm text-muted-foreground">
                        Not assessed
                      </span>
                    ) : (
                      <PriorityBadge priority={item.priority} />
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      aria-label={`Open and review case ${item.id}`}
                      onClick={() => onOpenCase(item.id)}
                      className="h-8 gap-1.5 rounded-lg px-2.5 text-xs font-semibold text-primary hover:bg-primary/10 hover:text-primary focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <span>Review</span>
                      <ArrowRight className="size-3.5" aria-hidden="true" />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {cases.length === 0 && (
        <div className="px-5 py-12 text-center text-sm text-muted-foreground">
          No matching case records found.
        </div>
      )}
    </div>
  );
}
