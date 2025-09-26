"use client";

import { useUser, useAuth } from "@clerk/nextjs";
import { useConvexAuth } from "convex/react";
import { getSubscriptionInfo } from "@/lib/subscription";
import { SubscriptionInfo, SubscriptionTier } from "@/types/subscription.types";

export function useAuthState() {
  const { isSignedIn, user, isLoaded: clerkLoaded } = useUser();
  const { has } = useAuth();
  const { isLoading: convexLoading, isAuthenticated } = useConvexAuth();
  var tier = "free";

  if (has) {
    if (has({ plan: "advanced" })) {
      tier = "advanced";
    } else if (has({ plan: "pro" })) {
      tier = "pro";
    }
  }

  // Get subscription information from user metadata
  const subscriptionInfo: SubscriptionInfo = user ? getSubscriptionInfo(tier as SubscriptionTier) : {
    tier: tier as SubscriptionTier,
    historySize: 5,
    isUnlimited: false
  };

  return {
    isSignedIn: isSignedIn && isAuthenticated,
    user,
    isLoading: !clerkLoaded || convexLoading,
    subscriptionInfo,
  };
}
