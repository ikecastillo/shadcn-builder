"use client";

import { useEffect } from "react";
import { useFormBuilderStore } from "@/stores/form-builder-store";
import { useAuthState } from "@/hooks/use-auth";

/**
 * Provider component that syncs subscription information with the form builder store
 * This ensures the history limits are always up-to-date based on the user's subscription
 */
export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const { subscriptionInfo } = useAuthState();
  const updateSubscriptionInfo = useFormBuilderStore((state) => state.updateSubscriptionInfo);

  useEffect(() => {
    if (subscriptionInfo) {
      updateSubscriptionInfo(subscriptionInfo);
    }
  }, [subscriptionInfo, updateSubscriptionInfo]);

  return <>{children}</>;
}
