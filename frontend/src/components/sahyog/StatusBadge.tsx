import {
  Ban,
  CheckCircle2,
  Clock,
  MessageSquare,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface StatusBadgeProps {
  status: string;
  showIcon?: boolean;
}

export function StatusBadge({ status, showIcon = true }: StatusBadgeProps) {
  let cls = "border-border bg-muted/30 text-muted-foreground";
  let Icon = Clock;

  switch (status) {
    case "Reviewed":
    case "Completed":
    case "Approved":
      cls = "border-status-low/30 bg-status-low/10 text-status-low";
      Icon = CheckCircle2;
      break;
    case "In review":
    case "Initiated":
    case "In progress":
      cls = "border-primary/25 bg-primary/10 text-primary";
      Icon = RefreshCw;
      break;
    case "Follow-up requested":
      cls = "border-status-moderate/30 bg-status-moderate/10 text-status-moderate";
      Icon = MessageSquare;
      break;
    case "Pending review":
    case "Awaiting human approval":
    case "Suggested":
      cls = "border-status-high/25 bg-status-high/10 text-status-high";
      Icon = Clock;
      break;
    case "New":
      cls = "border-[#318c85]/30 bg-[#e8f4f0] text-[#1c5d55]";
      Icon = Sparkles;
      break;
    case "Closed":
    case "Cancelled":
      cls = "border-muted bg-muted/30 text-muted-foreground";
      Icon = Ban;
      break;
  }

  return (
    <Badge
      variant="outline"
      aria-label={`Status: ${status}`}
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-sm px-2 py-0.5 text-xs font-medium ${cls}`}
    >
      {showIcon && <Icon className="size-3 shrink-0" aria-hidden="true" />}
      <span>{status}</span>
    </Badge>
  );
}
