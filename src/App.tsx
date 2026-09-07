import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import Overview from "./pages/Overview";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const modules = {
  map: "Security Map",
  cellular: "Cellular Intelligence",
  network: "Network Audit",
  rf: "RF Audit",
  threats: "Threat Center",
  evidence: "Evidence Explorer",
  diagnostics: "Diagnostics",
  mmi: "MMI / USSD",
  device: "Device Intelligence",
  notifications: "Notifications",
  settings: "Settings",
  billing: "Billing & Pro",
} as const;

type ModuleKey = keyof typeof modules;

function ModulePlaceholder({ module }: { module: ModuleKey }) {
  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-6">
        <div className="label-mono">Sentinel Shield</div>
        <h1 className="mt-2 text-3xl font-extrabold">{modules[module]}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Premium application shell is active. This module is ready to be connected to its authoritative evidence source.
        </p>
      </div>
      <Card className="border-border/80 bg-card/80">
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <CardTitle className="text-base">Live module state</CardTitle>
            <StatusBadge status="UNAVAILABLE" />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No production telemetry is fabricated here. Connect the existing native/data service and the module will render real evidence with provenance and freshness.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<DashboardLayout />}>
              <Route index element={<Navigate to="/overview" replace />} />
              <Route path="overview" element={<Overview />} />
              <Route path="map" element={<ModulePlaceholder module="map" />} />
              <Route path="cellular" element={<ModulePlaceholder module="cellular" />} />
              <Route path="network" element={<ModulePlaceholder module="network" />} />
              <Route path="rf" element={<ModulePlaceholder module="rf" />} />
              <Route path="threats" element={<ModulePlaceholder module="threats" />} />
              <Route path="evidence" element={<ModulePlaceholder module="evidence" />} />
              <Route path="diagnostics" element={<ModulePlaceholder module="diagnostics" />} />
              <Route path="mmi" element={<ModulePlaceholder module="mmi" />} />
              <Route path="device" element={<ModulePlaceholder module="device" />} />
              <Route path="notifications" element={<ModulePlaceholder module="notifications" />} />
              <Route path="settings" element={<ModulePlaceholder module="settings" />} />
              <Route path="billing" element={<ModulePlaceholder module="billing" />} />
            </Route>

            <Route path="/landing" element={<Index />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
