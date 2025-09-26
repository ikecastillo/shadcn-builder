import { useFormBuilderStore } from "@/stores/form-builder-store";
import { formatHistoryUsage, getHistoryLimitInfo, getHistoryLimitWarning } from "@/lib/history-utils";

/**
 * Custom hook for managing undo/redo functionality
 * Provides easy access to history methods and state with subscription-aware limits
 */
export const useHistory = () => {
  const {
    undo,
    redo,
    canUndo,
    canRedo,
    saveSnapshot,
    clearHistory,
    jumpToSnapshot,
    history,
    subscriptionInfo
  } = useFormBuilderStore();

  const historyUsage = formatHistoryUsage(history.snapshots.length, subscriptionInfo || { tier: 'free', historySize: 5, isUnlimited: false });
  const limitInfo = getHistoryLimitInfo(subscriptionInfo || { tier: 'free', historySize: 5, isUnlimited: false });
  const warningMessage = getHistoryLimitWarning(history.snapshots.length, subscriptionInfo || { tier: 'free', historySize: 5, isUnlimited: false });

  return {
    // Methods
    undo,
    redo,
    saveSnapshot,
    clearHistory,
    jumpToSnapshot,
    
    // State
    canUndo: canUndo(),
    canRedo: canRedo(),
    historyLength: history.snapshots.length,
    currentIndex: history.currentIndex,
    snapshots: history.snapshots,
    
    // Subscription info
    subscriptionInfo,
    historyUsage,
    limitInfo,
    warningMessage,
    
    // Computed properties
    hasHistory: history.snapshots.length > 1,
    isAtBeginning: history.currentIndex === 0,
    isAtEnd: history.currentIndex === history.snapshots.length - 1
  };
};
