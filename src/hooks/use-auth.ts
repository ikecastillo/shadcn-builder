"use client";

import { getSubscriptionInfo } from "@/lib/subscription";
import { SubscriptionInfo, SubscriptionTier } from "@/types/subscription.types";

export function useAuthState() {
  const tier: SubscriptionTier = "free";
  const subscriptionInfo: SubscriptionInfo = getSubscriptionInfo(tier);

  return {
    isSignedIn: true,
    user: null,
    isLoading: false,
    subscriptionInfo,
  };
}
