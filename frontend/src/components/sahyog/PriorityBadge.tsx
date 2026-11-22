import { AlertTriangle, CheckCircle2, Clock, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Priority } from "@/lib/demo-data";

export interface PriorityBadgeProps {
  priority: Priority;
  showIcon?: boolean;
}

export function PriorityBadge({ priority, showIcon = true }: PriorityBadgeProps) {
  const config = {
    "Urgent review": {
      cls: "border-status-urgent/30 bg-status-urgent/10 text-status-urgent",
      icon: ShieldAlert,
      ariaLabel: "Priority: Urgent review",
    },
    High: {
      cls: "border-status-high/30 bg-status-high/10 text-status-high",
      icon: AlertTriangle,
      ariaLabel: "Priority: High",
    },
    Moderate: {
      cls: "border-status-moderate/30 bg-status-moderate/10 text-status-moderate",
      icon: Clock,
      ariaLabel: "Priority: Moderate",
    },
    Low: {
      cls: "border-status-low/30 bg-status-low/10 text-status-low",
      icon: CheckCircle2,
      ariaLabel: "Priority: Low",
    },
  }[priority] ?? {
    cls: "border-border bg-muted/40 text-muted-foreground",
    icon: Clock,
    ariaLabel: `Priority: ${priority}`,
  };

  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      aria-label={config.ariaLabel}
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-sm px-2 py-0.5 text-xs font-semibold ${config.cls}`}
    >
      {showIcon && <Icon className="size-3 shrink-0" aria-hidden="true" />}
      <span>{priority}</span>
    </Badge>
  );
}
