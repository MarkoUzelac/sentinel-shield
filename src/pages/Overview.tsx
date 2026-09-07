import {
  Activity,
  Globe2,
  MapPin,
  Radio,
  ShieldCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EvidenceCard } from "@/components/ui/EvidenceCard";

const telemetry = [
  {
    label: "Security",
    value: "UNAVAILABLE",
    detail: "No live security evidence source is connected to the web UI.",
    icon: ShieldCheck,
  },
  {
    label: "Network",
    value: "UNAVAILABLE",
    detail: "Live connectivity telemetry is not available.",
    icon: Globe2,
  },
  {
    label: "Cellular",
    value: "UNAVAILABLE",
    detail: "Native Android telephony evidence is required.",
    icon: Radio,
  },
  {
    label: "Location",
    value: "UNAVAILABLE",
    detail: "No verified device location is available.",
    icon: MapPin,
  },
] as const;

export default function Overview() {
  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6">
      <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="label-mono">Security Intelligence</div>
          <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">Overview</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Evidence-first device, network and cellular intelligence. Only verified source data is rendered as telemetry.
          </p>
        </div>
        <div className="flex items-center gap-3 self-start rounded-lg border border-border/70 bg-card/60 px-3 py-2 text-xs md:self-auto">
          <Activity className="h-4 w-4 text-primary" />
          <span className="text-muted-foreground">Last evidence</span>
          <span className="font-mono text-foreground">UNAVAILABLE</span>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {telemetry.map(({ label, value, detail, icon: Icon }) => (
          <Card key={label} className="overflow-hidden border-border/80 bg-card/80">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="rounded-lg border border-primary/20 bg-primary/10 p-2.5">
                  <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                </div>
                <StatusBadge status="UNAVAILABLE" />
              </div>
              <div className="mt-5 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">{label}</div>
              <div className="mt-1 text-2xl font-semibold tracking-tight">{value}</div>
              <p className="mt-2 min-h-10 text-xs leading-relaxed text-muted-foreground">{detail}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.55fr)]">
        <Card className="border-border/80 bg-card/80">
          <CardHeader className="border-b border-border/70 px-5 py-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardTitle className="text-base">Security Map</CardTitle>
                <p className="mt-1 text-xs text-muted-foreground">Verified device, cellular and security evidence</p>
              </div>
              <StatusBadge status="UNAVAILABLE" />
            </div>
          </CardHeader>
          <CardContent className="p-5">
            <div className="relative flex min-h-[360px] items-center justify-center overflow-hidden rounded-lg border border-border/70 bg-background/70">
              <div className="pointer-events-none absolute inset-0 opacity-50 [background-image:linear-gradient(hsl(var(--border)/0.35)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--border)/0.35)_1px,transparent_1px)] [background-size:42px_42px]" />
              <div className="relative max-w-sm px-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-primary/25 bg-primary/10">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <h2 className="mt-4 text-sm font-semibold">Location evidence unavailable</h2>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  The map must only display markers backed by real coordinates. No device or cellular coordinates are currently available to this web surface.
                </p>
                <div className="mt-4 flex justify-center">
                  <StatusBadge status="UNAVAILABLE" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/80 bg-card/80">
          <CardHeader className="px-5 py-4">
            <CardTitle className="text-base">System State</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 px-5 pb-5">
            <div className="rounded-lg border border-border/70 bg-secondary/20 p-4">
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Overall security</span>
                <StatusBadge status="UNAVAILABLE" />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">A confirmed security state requires current evidence.</p>
            </div>
            <div className="rounded-lg border border-border/70 bg-secondary/20 p-4">
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Connectivity</span>
                <StatusBadge status="UNAVAILABLE" />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">No live network probe result is available here.</p>
            </div>
            <div className="rounded-lg border border-border/70 bg-secondary/20 p-4">
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Cellular telemetry</span>
                <StatusBadge status="UNAVAILABLE" />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">Native Android telemetry is the authoritative source.</p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <div className="text-base font-semibold">Recent Evidence</div>
            <div className="text-xs text-muted-foreground">Latest verified observations available to this surface</div>
          </div>
          <StatusBadge status="UNAVAILABLE" />
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <EvidenceCard
            title="Live telemetry feed"
            source="UNAVAILABLE"
            provenance="UNAVAILABLE"
            status="UNAVAILABLE"
            description="No current telemetry record is exposed by the web surface. Do not infer values from UI state."
          />
          <EvidenceCard
            title="Device evidence"
            source="UNAVAILABLE"
            provenance="UNAVAILABLE"
            status="UNAVAILABLE"
            description="Connect the native evidence bridge before rendering device-specific security results."
          />
        </div>
      </section>
    </div>
  );
}
