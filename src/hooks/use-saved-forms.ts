import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuthState } from "@/hooks/use-auth";

export function useSavedForms() {
  const { user } = useAuthState();
  
  const userForms = useQuery(api.forms.getUserForms, { 
    userId: user?.id 
  });
  
  const allForms = useQuery(api.forms.getAllForms);
  
  return {
    userForms: userForms || [],
    allForms: allForms || [],
    isLoading: userForms === undefined || allForms === undefined,
  };
}
