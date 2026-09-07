import { NavLink, Outlet } from "react-router-dom";
import {
  Activity,
  Bell,
  CircleGauge,
  Database,
  FileSearch,
  Gauge,
  Map,
  Radio,
  ScanSearch,
  Settings,
  ShieldCheck,
  Smartphone,
  TerminalSquare,
  Wifi,
} from "lucide-react";
import { cn } from "@/lib/utils";

const primaryNav = [
  { label: "Overview", to: "/overview", icon: CircleGauge },
  { label: "Security Map", to: "/map", icon: Map },
  { label: "Cellular", to: "/cellular", icon: Radio },
  { label: "Network", to: "/network", icon: Wifi },
  { label: "RF Audit", to: "/rf", icon: Activity },
  { label: "Threats", to: "/threats", icon: ShieldCheck },
  { label: "Evidence", to: "/evidence", icon: FileSearch },
  { label: "Diagnostics", to: "/diagnostics", icon: Gauge },
  { label: "MMI / USSD", to: "/mmi", icon: TerminalSquare },
];

const secondaryNav = [
  { label: "Device", to: "/device", icon: Smartphone },
  { label: "Notifications", to: "/notifications", icon: Bell },
  { label: "Settings", to: "/settings", icon: Settings },
];

export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[248px] border-r border-border/80 bg-background/95 backdrop-blur-xl lg:flex lg:flex-col">
        <div className="flex h-16 items-center gap-3 border-b border-border/70 px-5">
          <div className="rounded-lg border border-primary/30 bg-primary/10 p-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight">SENTINEL SHIELD</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Security Intelligence</div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
          <div className="mb-3 px-2 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">Platform</div>
          {primaryNav.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  "group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors",
                  isActive
                    ? "border border-primary/25 bg-primary/10 text-foreground shadow-[inset_2px_0_0_hsl(var(--primary))]"
                    : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                )
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{label}</span>
            </NavLink>
          ))}

          <div className="mb-3 mt-7 px-2 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">System</div>
          {secondaryNav.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  "group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors",
                  isActive
                    ? "border border-primary/25 bg-primary/10 text-foreground shadow-[inset_2px_0_0_hsl(var(--primary))]"
                    : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                )
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="m-3 rounded-lg border border-primary/20 bg-primary/5 p-3">
          <div className="flex items-center gap-2 text-xs font-medium">
            <Database className="h-4 w-4 text-primary" />
            Evidence-first mode
          </div>
          <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
            No synthetic production telemetry is permitted.
          </p>
        </div>
      </aside>

      <div className="min-h-screen lg:pl-[248px]">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/70 bg-background/85 px-4 backdrop-blur-xl sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="lg:hidden rounded-md border border-border p-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
            </div>
            <div className="hidden min-w-0 sm:block">
              <div className="truncate text-sm font-semibold">Sentinel Shield</div>
              <div className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">Live device intelligence</div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="hidden items-center gap-2 rounded-md border border-border/70 bg-secondary/30 px-3 py-2 sm:flex">
              <span className="h-2 w-2 rounded-full bg-muted-foreground" />
              <span className="text-muted-foreground">Network</span>
              <span className="font-medium text-foreground">UNAVAILABLE</span>
            </div>
            <div className="hidden items-center gap-2 rounded-md border border-border/70 bg-secondary/30 px-3 py-2 md:flex">
              <span className="h-2 w-2 rounded-full bg-muted-foreground" />
              <span className="text-muted-foreground">Cellular</span>
              <span className="font-medium text-foreground">UNAVAILABLE</span>
            </div>
            <button className="rounded-md border border-border/70 p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground" aria-label="Notifications">
              <Bell className="h-4 w-4" />
            </button>
          </div>
        </header>

        <main className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
