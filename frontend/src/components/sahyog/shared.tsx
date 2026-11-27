import type { ReactNode } from "react";
import {
  Activity,
  BookOpen,
  BriefcaseBusiness,
   ClipboardCheck,
  FileChartColumnIncreasing,
  FilePlus2,
  HeartHandshake,
  Home,
  Info,
  LifeBuoy,
  Settings2,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import type { DemoReferral, ReferralCategory } from "@/lib/demo-data";
import { BrandBlock, type BrandBlockProps } from "./BrandBlock";
import { NavItem, type NavItemProps } from "./NavItem";
import { StatCard, type StatCardProps } from "./StatCard";
import { StatusBadge, type StatusBadgeProps } from "./StatusBadge";
import { PriorityBadge, type PriorityBadgeProps } from "./PriorityBadge";
import { CaseTable, type CaseTableProps } from "./CaseTable";

export type View =
  | "Overview"
  | "New Assessment"
  | "Case Management"
  | "Referrals"
  | "Review Queue"
  | "Reports"
  | "Settings"
  | "Case detail";


export type UserRole = "admin" | "assessor" | "reviewer";

type NavigationItem = {
  label: Exclude<View, "Case detail">;
  icon: typeof Home;
  group: "WORKSPACE" | "ADMINISTRATION";
};

const assessorNavigation: NavigationItem[] = [
  { label: "Overview", icon: Home, group: "WORKSPACE" },
  { label: "New Assessment", icon: FilePlus2, group: "WORKSPACE" },
  { label: "Case Management", icon: BriefcaseBusiness, group: "WORKSPACE" },
  { label: "Referrals", icon: HeartHandshake, group: "WORKSPACE" },
  { label: "Reports", icon: FileChartColumnIncreasing, group: "ADMINISTRATION" },
  { label: "Settings", icon: Settings2, group: "ADMINISTRATION" },
];

const reviewerNavigation: NavigationItem[] = [
  { label: "Overview", icon: Home, group: "WORKSPACE" },
  { label: "Review Queue", icon: ClipboardCheck, group: "WORKSPACE" },
  { label: "Case Management", icon: BriefcaseBusiness, group: "WORKSPACE" },
  { label: "Reports", icon: FileChartColumnIncreasing, group: "ADMINISTRATION" },
  { label: "Settings", icon: Settings2, group: "ADMINISTRATION" },
];

const adminNavigation: NavigationItem[] = [
  { label: "Overview", icon: Home, group: "WORKSPACE" },
  { label: "Case Management", icon: BriefcaseBusiness, group: "WORKSPACE" },
  { label: "Reports", icon: FileChartColumnIncreasing, group: "ADMINISTRATION" },
  { label: "Settings", icon: Settings2, group: "ADMINISTRATION" },
];

export function getNavigationForRole(role?: string): NavigationItem[] {
  switch (role?.toLowerCase()) {
    case "assessor":
      return assessorNavigation;
    case "reviewer":
      return reviewerNavigation;
    case "admin":
      return adminNavigation;
    default:
      return [];
  }
}
// Temporary default navigation for existing dashboard compatibility
export const navigation: NavigationItem[] = assessorNavigation;

export const referralCategoryIcons: Record<
  ReferralCategory,
  typeof HeartHandshake
> = {
  Counselling: HeartHandshake,
  "Legal aid": BookOpen,
  "Medical assistance": Activity,
  "Police intervention": ShieldAlert,
  "Witness protection": ShieldCheck,
  "Emergency support": LifeBuoy,
};

export function PageIntro({
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
    <div className="mb-8 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
      <div className="min-w-0">
        <p className="mb-2 text-xs font-semibold tracking-wide text-primary">
          {eyebrow}
        </p>
        <h2 className="text-2xl font-semibold leading-tight tracking-normal sm:text-3xl">
          {title}
        </h2>
        <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
          {description}
        </p>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function DemoNotice({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-2.5 border border-status-moderate/25 bg-status-moderate/5 px-3.5 py-3 text-xs leading-5 text-foreground">
      <Info className="mt-0.5 size-4 shrink-0 text-status-moderate" />
      <p>{children}</p>
    </div>
  );
}

export function SectionHeading({
  title,
  caption,
  action,
}: {
  title: string;
  caption?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4 sm:px-6">
      <div className="min-w-0">
        <h3 className="text-base font-semibold leading-6">{title}</h3>
        {caption && (
          <p className="mt-1.5 text-sm leading-5 text-muted-foreground">
            {caption}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
  icon: Icon = Info,
}: {
  title: string;
  description: string;
  action?: ReactNode;
  icon?: typeof Info;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#DCE7E2] bg-white px-6 py-14 text-center">
      <div className="flex size-12 items-center justify-center rounded-2xl bg-[#EAF5F1] text-[#328B86]">
        <Icon className="size-6" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-[#123052]">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-6 text-[#5A6E82]">
        {description}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function ReferralMiniList({ referrals }: { referrals: DemoReferral[] }) {
  return (
    <div className="divide-y divide-border">
      {referrals.length ? (
        referrals.map((referral) => (
          <div
            key={referral.id}
            className="flex items-center justify-between gap-2 px-4 py-3 text-sm"
          >
            <span>{referral.category}</span>
            <StatusBadge status={referral.status} />
          </div>
        ))
      ) : (
        <p className="px-4 py-4 text-sm text-muted-foreground">
          No active referrals for this case.
        </p>
      )}
    </div>
  );
}

// Re-export modular components for seamless consumer access
export { BrandBlock, NavItem, StatCard, StatusBadge, PriorityBadge, CaseTable };
export type {
  BrandBlockProps,
  NavItemProps,
  StatCardProps,
  StatusBadgeProps,
  PriorityBadgeProps,
  CaseTableProps,
};
