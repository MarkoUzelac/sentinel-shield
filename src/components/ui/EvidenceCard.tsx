import * as React from "react";
import { Clock3, Database, FileCheck2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge, type StatusBadgeProps } from "@/components/ui/StatusBadge";
import { cn } from "@/lib/utils";

export interface EvidenceCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  source: string;
  provenance?: string;
  observedAt?: string;
  freshness?: string;
  status: StatusBadgeProps["status"];
  description?: string;
}

export function EvidenceCard({
  title,
  source,
  provenance,
  observedAt,
  freshness,
  status,
  description,
  className,
  ...props
}: EvidenceCardProps) {
  return (
    <Card className={cn("border-border/80 bg-card/80", className)} {...props}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 gap-3">
            <div className="mt-0.5 rounded-md border border-primary/20 bg-primary/10 p-2">
              <FileCheck2 className="h-4 w-4 text-primary" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="truncate text-sm font-semibold text-foreground">{title}</h3>
                <StatusBadge status={status} />
              </div>
              {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-3 text-xs sm:grid-cols-2">
          <div className="flex items-start gap-2">
            <Database className="mt-0.5 h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
            <div>
              <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Source</div>
              <div className="mt-0.5 break-words font-medium text-foreground">{source}</div>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Clock3 className="mt-0.5 h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
            <div>
              <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Observed</div>
              <div className="mt-0.5 font-medium text-foreground">{observedAt ?? "UNAVAILABLE"}</div>
            </div>
          </div>
        </div>

        <div className="mt-3 grid gap-2 border-t border-border/70 pt-3 text-[10px] uppercase tracking-[0.12em] text-muted-foreground sm:grid-cols-2">
          <span>Provenance: {provenance ?? "UNAVAILABLE"}</span>
          <span className="sm:text-right">Freshness: {freshness ?? "UNAVAILABLE"}</span>
        </div>
      </CardContent>
    </Card>
  );
}
