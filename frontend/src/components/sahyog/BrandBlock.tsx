import { HeartHandshake, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface BrandBlockProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function BrandBlock({ collapsed, onToggle }: BrandBlockProps) {
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
