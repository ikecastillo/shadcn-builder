import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FormBuilderStore, FormRow, Viewports } from '@/types/form-builder.types';
import { FormComponentModel } from '@/models/FormComponent';

const generateComponentId = (component: FormComponentModel, components: FormComponentModel[]): string => {
  const existingTypes = components.filter(comp => comp.getField("type").startsWith(component.getField("type")));

  console.log(existingTypes);

  let counter = existingTypes.length;
  let newId = `${component.getField("id")}-${counter}`;

  return newId;
};

export const useFormBuilderStore = create<FormBuilderStore>()(
  persist(
    (set, get) => ({
      mode: 'editor',
      components: [],
      selectedRow: null,
      selectedComponent: null,    
      viewport: 'sm',
      showJson: false,
      formTitle: 'generatedForm',
      updateMode: (mode: 'editor' | 'preview') => set({ mode }),
      updateViewport: (viewport: Viewports) => set({ viewport }),
      toggleJsonPreview: () => set((state) => ({ showJson: !state.showJson })),
      updateFormTitle: (title: string) => set({ formTitle: title }),
      addComponent: (component: FormComponentModel) => {
        set((state) => {
          const newComponent = new FormComponentModel({...component});
          newComponent.id = generateComponentId(newComponent, state.components);
          newComponent.attributes = {
            ...newComponent.attributes,
            id: newComponent.id
          };

          return { components: [...state.components, newComponent] };
        });
      },
      removeComponent: (componentId: string) => {
        set((state) => {
          return { components: state.components.filter((component) => component.id !== componentId) };
        });
      },
      updateComponent: (componentId: string, field: string, value: any, isValidForAllViewports: boolean = false) => {   
        set((state) => {
          const updateNestedField = (obj: any, path: string[], value: any): any => {
            if (path.length === 1) {
              return { ...obj, [path[0]]: value };
            }
            const [current, ...rest] = path;
            return {
              ...obj,
              [current]: updateNestedField(obj[current] || {}, rest, value)
            };
          };

          const fieldPath = field.split('.');
          const viewport = state.viewport;
          let updatedComponent = null;

          return {
            components: state.components.map((component) => {
                if (component.id !== componentId) return component;

                updatedComponent = component;
                
                // If viewport is not 'sm', update the overrides
                if (viewport !== 'sm' && !isValidForAllViewports) {
                  const overrides = component.overrides || {} as Record<Viewports, any>;
                  const viewportOverrides = overrides[viewport] || {};
                  
                  updatedComponent = new FormComponentModel({
                    ...component,
                    overrides: {
                      ...overrides,
                      [viewport]: updateNestedField(viewportOverrides, fieldPath, value)
                    }
                  });
                  return updatedComponent;
                }
                
                // For 'sm' viewport, update the base component

                const nestedField = updateNestedField(component, fieldPath, value);

                updatedComponent = new FormComponentModel({
                  ...component,
                  ...nestedField
                });
                return updatedComponent;
              }),
            selectedComponent: updatedComponent,
          };
        });
      },
      updateComponents: (components: FormComponentModel[]) => set({ components }),
      selectComponent: (component: FormComponentModel | null) => set(() => ({ selectedComponent: component ? new FormComponentModel(component) : null })),
      moveComponent: (oldIndex: number, newIndex: number) => set((state) => {
        const components = [...state.components];

        const [movedComponent] = components.splice(oldIndex, 1);
        components.splice(newIndex, 0, movedComponent);

        console.log(components);

        return { components };
      }),
    }),
    {
      name: 'form-builder-storage',
      partialize: (state) => ({ components: state.components, viewport: state.viewport, formTitle: state.formTitle }),
      onRehydrateStorage: () => (state) => {
        if (state?.components) {

          state.components = state.components.map(component => {
            return new FormComponentModel(component);
          });
        }
      }
    }
  )
); 
