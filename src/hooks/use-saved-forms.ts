import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuthState } from "@/hooks/use-auth";
import { isConvexConfigured } from "@/lib/convex-config";

export function useSavedForms() {
  const { user } = useAuthState();

  if (!isConvexConfigured) {
    return {
      userForms: [],
      allForms: [],
      isLoading: false,
    };
  }

  const userForms = useQuery(api.forms.getUserForms, {
    userId: user?.id,
  });

  const allForms = useQuery(api.forms.getAllForms);

  return {
    userForms: userForms || [],
    allForms: allForms || [],
    isLoading: userForms === undefined || allForms === undefined,
  };
}
