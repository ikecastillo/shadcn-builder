"use client";

import { useUser, useAuth } from "@clerk/nextjs";
import { useConvexAuth } from "convex/react";

export function useAuthState() {
  const { isSignedIn, user, isLoaded: clerkLoaded } = useUser();
  const { isLoading: convexLoading, isAuthenticated } = useConvexAuth();

  return {
    isSignedIn: isSignedIn && isAuthenticated,
    user,
    isLoading: !clerkLoaded || convexLoading,
  };
}
