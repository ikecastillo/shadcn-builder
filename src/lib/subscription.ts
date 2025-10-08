import { SubscriptionTier, SubscriptionInfo, SUBSCRIPTION_LIMITS } from '@/types/subscription.types';

/** Get subscription information for the provided subscription tier */
export function getSubscriptionInfo(tier: SubscriptionTier): SubscriptionInfo {
  // Check if user has subscription metadata
  const subscriptionTier = tier;
  
  if (subscriptionTier && SUBSCRIPTION_LIMITS[subscriptionTier]) {
    return {
      tier: subscriptionTier,
      ...SUBSCRIPTION_LIMITS[subscriptionTier]
    };
  }
  
  // Default to free tier if no subscription info is found
  return {
    tier: 'free',
    ...SUBSCRIPTION_LIMITS.free
  };
}

/**
 * Get the maximum history size for a given subscription tier
 */
export function getHistorySizeForTier(tier: SubscriptionTier): number {
  const limits = SUBSCRIPTION_LIMITS[tier];
  return limits.isUnlimited ? Number.MAX_SAFE_INTEGER : limits.historySize;
}

/**
 * Check if a user has reached their history limit
 */
export function hasReachedHistoryLimit(currentHistorySize: number, subscriptionInfo: SubscriptionInfo): boolean {
  if (subscriptionInfo.isUnlimited) {
    return false;
  }
  return currentHistorySize >= subscriptionInfo.historySize;
}

/**
 * Get remaining history slots for a user
 */
export function getRemainingHistorySlots(currentHistorySize: number, subscriptionInfo: SubscriptionInfo): number {
  if (subscriptionInfo.isUnlimited) {
    return Number.MAX_SAFE_INTEGER;
  }
  return Math.max(0, subscriptionInfo.historySize - currentHistorySize);
}
