import { useMemo } from "react";
import { EntitlementService, type Entitlement, type Plan } from "@/services/EntitlementService";

/**
 * Central React hook for product entitlement checks.
 * Billing/auth can later replace the plan resolver without changing consumers.
 */
export function useEntitlements(plan: Plan = "FREE") {
  return useMemo(
    () => ({
      plan,
      isFree: plan === "FREE",
      isPro: plan === "PRO",
      isEnterprise: plan === "ENTERPRISE",
      canUse: (entitlement: Entitlement) => EntitlementService.canUse(plan, entitlement),
      requiredPlan: (entitlement: Entitlement) => EntitlementService.requiredPlan(entitlement),
      entitlements: EntitlementService.getEntitlements(plan),
    }),
    [plan],
  );
}
