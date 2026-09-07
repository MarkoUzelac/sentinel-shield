import * as React from "react";
import { CheckCircle2, CircleAlert, CircleDot, CircleX, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type Status = "ACTIVE" | "STALE" | "UNAVAILABLE" | "CONFIRMED" | "ACTIVE_UNVERIFIED" | "UNVERIFIED" | "ERROR" | "INSUFFICIENT EVIDENCE" | "PASS" | "FAIL";

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  status: Status;
  showIcon?: boolean;
}

const statusConfig: Record<Status, { label: string; className: string; Icon: React.ComponentType<{ className?: string }> }> = {
  ACTIVE: { label: "ACTIVE", className: "border-success/30 bg-success/10 text-success", Icon: CircleDot },
  STALE: { label: "STALE", className: "border-warning/30 bg-warning/10 text-warning", Icon: CircleAlert },
  UNAVAILABLE: { label: "UNAVAILABLE", className: "border-muted-foreground/20 bg-muted text-muted-foreground", Icon: CircleX },
  CONFIRMED: { label: "CONFIRMED", className: "border-success/30 bg-success/10 text-success", Icon: ShieldCheck },
  ACTIVE_UNVERIFIED: { label: "ACTIVE_UNVERIFIED", className: "border-primary/30 bg-primary/10 text-primary", Icon: CircleAlert },
  UNVERIFIED: { label: "UNVERIFIED", className: "border-warning/30 bg-warning/10 text-warning", Icon: CircleAlert },
  ERROR: { label: "ERROR", className: "border-destructive/30 bg-destructive/10 text-destructive", Icon: CircleX },
  "INSUFFICIENT EVIDENCE": { label: "INSUFFICIENT EVIDENCE", className: "border-border bg-secondary text-muted-foreground", Icon: CircleAlert },
  PASS: { label: "PASS", className: "border-success/30 bg-success/10 text-success", Icon: CheckCircle2 },
  FAIL: { label: "FAIL", className: "border-destructive/30 bg-destructive/10 text-destructive", Icon: CircleX },
};

export function StatusBadge({ status, showIcon = true, className, ...props }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.Icon;

  return (
    <Badge
      variant="outline"
      className={cn("gap-1.5 border px-2 py-0.5 text-[10px] tracking-[0.12em]", config.className, className)}
      {...props}
    >
      {showIcon && <Icon className="h-3 w-3" aria-hidden="true" />}
      {config.label}
    </Badge>
  );
}
