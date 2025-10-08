import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useFormBuilderStore } from "@/stores/form-builder-store";
import { useAuthState } from "@/hooks/use-auth";
import { isConvexConfigured } from "@/lib/convex-config";

export function useSaveForm() {
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuthState();
  const components = useFormBuilderStore((state) => state.components);
  const formTitle = useFormBuilderStore((state) => state.formTitle);
  const formId = useFormBuilderStore((state) => state.formId);

  if (!isConvexConfigured) {
    return {
      saveCurrentForm: async () => {
        throw new Error(
          "Saving forms requires configuring Convex (NEXT_PUBLIC_CONVEX_URL)."
        );
      },
      isSaving: false,
      canSave: components.length > 0,
    };
  }

  const saveForm = useMutation(api.forms.saveForm);
  const updateForm = useMutation(api.forms.updateForm);

  const saveCurrentForm = async (options?: {
    title?: string;
    description?: string;
    tags?: string[];
    category?: string;
    forceNew?: boolean;
  }) => {
    if (components.length === 0) {
      throw new Error("Please add some components before saving.");
    }

    setIsSaving(true);
    try {
      // Convert FormComponentModel instances to plain objects for storage
      const componentsData = components.map(component => component.toJSON());

      // If formId exists and forceNew is not true, update the existing form
      if (formId && !options?.forceNew) {
        await updateForm({
          id: formId as any, // Type assertion needed for Convex ID
          title: options?.title || formTitle,
          description: options?.description || "Form created with Form Builder",
          components: componentsData,
          tags: options?.tags || [],
          category: options?.category || "custom",
        });

        return formId;
      } else {
        // Create a new form
        const newFormId = await saveForm({
          title: options?.title || formTitle,
          description: options?.description || "Form created with Form Builder",
          components: componentsData,
          tags: options?.tags || [],
          category: options?.category || "custom",
          userId: user?.id,
        });

        return newFormId;
      }
    } finally {
      setIsSaving(false);
    }
  };

  return {
    saveCurrentForm,
    isSaving,
    canSave: components.length > 0,
  };
}
