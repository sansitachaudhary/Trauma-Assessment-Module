import type { ElementType } from "react";
import type { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { View } from "./shared";

export interface NavItemProps {
  item: { label: Exclude<View, "Case detail">; icon: typeof Home | ElementType };
  active: boolean;
  onClick: () => void;
  mobile?: boolean;
  collapsed?: boolean;
  caseCount?: number;
}

export function NavItem({
  item,
  active,
  onClick,
  mobile = false,
  collapsed = false,
  caseCount = 0,
}: NavItemProps) {
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
