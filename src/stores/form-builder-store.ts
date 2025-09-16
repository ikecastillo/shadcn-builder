import { create } from "zustand";
import { persist } from "zustand/middleware";
import { FormBuilderStore, TemplateData, Viewports } from "@/types/form-builder.types";
import { FormComponentModel } from "@/models/FormComponent";
import { Editor } from "@tiptap/react";

const generateComponentId = (
  component: FormComponentModel,
  components: FormComponentModel[]
): string => {
  const existingTypes = components.filter((comp) =>
    comp.getField("type").startsWith(component.getField("type"))
  );

  let counter = existingTypes.length;
  let newId = `${component.getField("id")}-${counter}`;

  return newId;
};

// Template loading function
const loadTemplate = async (templateName: string, templateKey?: string): Promise<TemplateData | null> => {
  try {    
    const response = await fetch(`/templates/${templateName}.json`);
    if (!response.ok) {
      throw new Error(`Failed to load template: ${templateName} - Status: ${response.status}`);
    }
    
    const templateData = await response.json();
    
    // If templateKey is provided, look for that specific template within the file
    const template = templateKey ? templateData[templateKey] : Object.values(templateData)[0];
    
    if (!template || !template.components) {
      throw new Error(`Template not found: ${templateKey || 'default'} in ${templateName}.json`);
    }
        
    // Convert template components to FormComponentModel instances
    const components = template.components.map((component: any) => {
      return new FormComponentModel(component);
    });
    
    return {
      components,
      formTitle: template.formTitle || "generatedForm",
      formDescription: template.formDescription || "generatedForm",
      tags: template.tags || [],
      category: template.category || "generatedForm"
    };
  } catch (error) {
    console.error('Error loading template:', (error as Error).message);
    throw error;
  }
};

export const useFormBuilderStore = create<FormBuilderStore>()(
  persist(
    (set, get) => ({
      mode: "editor",
      components: [],
      selectedRow: null,
      selectedComponent: null,
      viewport: "sm",
      showJson: false,
      formTitle: "generatedForm",
      loadedTemplateId: null,
      loadedTemplate: null,
      editor: null,
      enableDragging: true,
      updateMode: (mode: FormBuilderStore['mode']) => set({ mode }),
      updateViewport: (viewport: Viewports) => set({ viewport }),
      toggleJsonPreview: () => set((state) => ({ showJson: !state.showJson })),
      updateFormTitle: (title: string) => set({ formTitle: title }),
      updateEnableDragging: (enableDragging: boolean) =>
        set({ enableDragging }),
      setEditor: (editor: Editor | null) => set({ editor }),
      addComponent: (component: FormComponentModel) => {
        const newComponent = new FormComponentModel({ ...component });
        let newId = generateComponentId(newComponent, get().components);
        newComponent.id = newId;
        newComponent.attributes = {
          ...newComponent.attributes,
          id: newComponent.id,
        };
        set((state) => {
          return { components: [...state.components, newComponent] };
        });

        return newComponent;
      },
      removeComponent: (componentId: string) => {
        set((state) => {
          return {
            components: state.components.filter(
              (component) => component.id !== componentId
            ),
            selectedComponent: state.selectedComponent?.id === componentId ? null : state.selectedComponent,
          };
        });
      },
      updateComponent: (
        componentId: string,
        field: string,
        value: any,
        isValidForAllViewports: boolean = false,
        isDragging: boolean = false
      ) => {
        set((state) => {
          const updateNestedField = (
            obj: any,
            path: string[],
            value: any
          ): any => {
            if (path.length === 1) {
              return { ...obj, [path[0]]: value };
            }
            const [current, ...rest] = path;
            return {
              ...obj,
              [current]: updateNestedField(obj[current] || {}, rest, value),
            };
          };

          const fieldPath = field.split(".");
          const viewport = state.viewport;
          let updatedComponent = null;

          return {
            components: state.components.map((component) => {
              if (component.id !== componentId) return component;

              updatedComponent = component;

              // If viewport is not 'sm', update the overrides
              if (viewport !== "sm" && !isValidForAllViewports) {
                const overrides =
                  component.overrides || ({} as Record<Viewports, any>);
                const viewportOverrides = overrides[viewport] || {};

                updatedComponent = new FormComponentModel({
                  ...component,
                  overrides: {
                    ...overrides,
                    [viewport]: updateNestedField(
                      viewportOverrides,
                      fieldPath,
                      value
                    ),
                  },
                });
                return updatedComponent;
              }

              // For 'sm' viewport, update the base component

              const nestedField = updateNestedField(
                component,
                fieldPath,
                value
              );

              updatedComponent = new FormComponentModel({
                ...component,
                ...nestedField,
              });
              return updatedComponent;
            }),
            selectedComponent: isDragging ? null : updatedComponent,
          };
        });
      },
      updateComponents: (components: FormComponentModel[]) =>
        set({ components }),
      selectComponent: (component: FormComponentModel | null) =>
        set(() => {
          return {
            selectedComponent: component
              ? new FormComponentModel(component)
              : null,
            editor: component === null || component.category === "form" ? null : get().editor,
          };
        }),
      moveComponent: (oldIndex: number, newIndex: number) =>
        set((state) => {
          const components = [...state.components];

          if (oldIndex === undefined) {
            oldIndex = components.length - 1;
          }

          const [movedComponent] = components.splice(oldIndex, 1);
          components.splice(newIndex, 0, movedComponent);

          return { components, selectedComponent: null };
        }),
      loadTemplate: async (templateName: string, templateKey?: string) => {
        const templateData = await loadTemplate(templateName, templateKey);
        if (templateData) {
          set({
            components: templateData.components,
            formTitle: templateData.formTitle,
            selectedComponent: null,
            mode: "editor",
            loadedTemplateId: templateKey || null,
            loadedTemplate: templateData
          });
          return true;
        }
        return false;
      },
    }),
    {
      name: "form-builder-storage",
      partialize: (state) => {
        // Only persist if no template is selected
        if (state.loadedTemplateId !== null) {
          return {};
        }
        
        return {
          components: state.components,
          viewport: state.viewport,
          formTitle: state.formTitle,
        };
      },
      onRehydrateStorage: () => (state) => {
        if (state?.components) {
          state.components = state.components.map((component) => {
            return new FormComponentModel(component);
          });
        }
      },
    }
  )
);
