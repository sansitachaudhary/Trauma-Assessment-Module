import type { ElementType, ReactNode } from "react";
import type { Activity } from "lucide-react";

export interface StatCardProps {
  label: string;
  value: string | number;
  sub: string;
  icon: typeof Activity | ElementType;
  tone?: "brand" | "amber" | "red" | "green";
  badge?: ReactNode;
  action?: ReactNode;
}

export function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  tone = "brand",
  badge,
  action,
}: StatCardProps) {
  const toneClasses = {
    brand: "bg-[#e5f4ef] text-[#167d70] border-[#cbe6df]",
    amber: "bg-[#fff4d9] text-[#a76c0d] border-[#f4dfac]",
    red: "bg-[#ffebed] text-[#c74755] border-[#fcd0d5]",
    green: "bg-[#e8f5ed] text-[#24805b] border-[#cbe8d9]",
  };

  return (
    <div className="group flex h-full min-h-[176px] flex-col justify-between rounded-xl border border-border bg-card p-4 shadow-xs transition-all duration-150 hover:-translate-y-0.5 hover:shadow-sm sm:p-5">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-muted-foreground">
                {label}
              </p>
              {badge}
            </div>
            <p className="mt-2 text-3xl font-bold tracking-tight tabular-nums text-foreground sm:text-4xl">
              {value}
            </p>
          </div>
          <div
            className={`grid size-11 shrink-0 place-items-center rounded-xl border ${toneClasses[tone]} shadow-xs`}
            aria-hidden="true"
          >
            <Icon className="size-5" />
          </div>
        </div>
        <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
          {sub}
        </p>
      </div>

      {action && (
        <div className="mt-4 flex items-center justify-between border-t border-border/80 pt-3 text-sm">
          {action}
        </div>
      )}
    </div>
  );
}
