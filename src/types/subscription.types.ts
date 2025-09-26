export type SubscriptionTier = 'free' | 'advanced' | 'pro';

export interface SubscriptionInfo {
  tier: SubscriptionTier;
  historySize: number;
  isUnlimited: boolean;
}

export const SUBSCRIPTION_LIMITS: Record<SubscriptionTier, { historySize: number; isUnlimited: boolean }> = {
  free: { historySize: 5, isUnlimited: false },
  advanced: { historySize: 20, isUnlimited: false },
  pro: { historySize: 0, isUnlimited: true }
};

export const DEFAULT_HISTORY_SIZE = 50; // Fallback for when subscription info is not available
