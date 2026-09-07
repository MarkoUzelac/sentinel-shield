export type Plan = "FREE" | "PRO" | "ENTERPRISE";

export type Entitlement =
  | "basic_dashboard"
  | "basic_cellular"
  | "basic_network_audit"
  | "basic_map"
  | "evidence_view"
  | "advanced_map"
  | "historical_telemetry"
  | "advanced_rf"
  | "advanced_threats"
  | "evidence_export"
  | "security_reports"
  | "custom_alerts"
  | "multi_device"
  | "team_access"
  | "api_access";

const PLAN_RANK: Record<Plan, number> = {
  FREE: 0,
  PRO: 1,
  ENTERPRISE: 2,
};

const ENTITLEMENT_MINIMUM_PLAN: Record<Entitlement, Plan> = {
  basic_dashboard: "FREE",
  basic_cellular: "FREE",
  basic_network_audit: "FREE",
  basic_map: "FREE",
  evidence_view: "FREE",
  advanced_map: "PRO",
  historical_telemetry: "PRO",
  advanced_rf: "PRO",
  advanced_threats: "PRO",
  evidence_export: "PRO",
  security_reports: "PRO",
  custom_alerts: "PRO",
  multi_device: "ENTERPRISE",
  team_access: "ENTERPRISE",
  api_access: "ENTERPRISE",
};

export class EntitlementService {
  static canUse(plan: Plan, entitlement: Entitlement): boolean {
    return PLAN_RANK[plan] >= PLAN_RANK[ENTITLEMENT_MINIMUM_PLAN[entitlement]];
  }

  static requiredPlan(entitlement: Entitlement): Plan {
    return ENTITLEMENT_MINIMUM_PLAN[entitlement];
  }

  static getEntitlements(plan: Plan): Entitlement[] {
    return (Object.keys(ENTITLEMENT_MINIMUM_PLAN) as Entitlement[]).filter((entitlement) =>
      this.canUse(plan, entitlement),
    );
  }
}

export default EntitlementService;
