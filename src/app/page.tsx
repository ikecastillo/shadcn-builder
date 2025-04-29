"use client";

import {
  closestCenter,
  DndContext,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
} from "@dnd-kit/core";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarLeft } from "@/components/form-builder/sidebar/sidebarLeft";
import { SidebarRight } from "@/components/form-builder/sidebar/sidebarRight";
import { MainCanvas } from "@/components/form-builder/mainCanvas";
import {
  EyeIcon,
  Monitor,
  Tablet,
  Smartphone,
  BlocksIcon,
  CodeIcon,
} from "lucide-react";
import { PencilRulerIcon } from "lucide-react";
import { useFormBuilderStore } from "@/stores/form-builder-store";
import { Button } from "@/components/ui/button";
import { ToggleGroupNav } from "@/components/form-builder/ui/toggle-group-nav";
import { useCallback, useMemo, useState } from "react";
import {
  DependenciesImports,
  generateFormCode,
} from "@/components/form-builder/helpers/generate-react-code";
import { GenerateCodeDialog } from "@/components/form-builder/dialogs/generate-code-dialog";
import { MobileNotification } from "@/components/form-builder/ui/mobile-notification";
import { useIsMobile } from "@/hooks/use-mobile";
import SocialLinks from "@/components/form-builder/sidebar/socialLinks";
import { OpenJsonDialog } from "@/components/form-builder/dialogs/open-json-dialog";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useForm } from "react-hook-form";
import { FormComponentModel } from "@/models/FormComponent";
import { Viewports } from "@/types/form-builder.types";
import { RenderEditorComponent } from "@/components/form-builder/helpers/render-editor-component";

const getGridRows = (
  items: FormComponentModel[],
  viewport: Viewports
): FormComponentModel[][] => {
  const rows: FormComponentModel[][] = [];
  let currentRow: FormComponentModel[] = [];
  let currentRowSpan = 0;

  items.forEach((item) => {
    const colSpan = +item.getField("properties.style.colSpan", viewport) || 12;

    // If adding this item would exceed 12 columns, start a new row
    if (currentRowSpan + colSpan > 12) {
      if (currentRow.length > 0) {
        rows.push([...currentRow]);
      }
      currentRow = [item];
      currentRowSpan = colSpan;
    } else {
      currentRow.push(item);
      currentRowSpan += colSpan;
    }
  });

  // Add the last row if it has items
  if (currentRow.length > 0) {
    rows.push(currentRow);
  }

  return rows;
};

export function updateColSpans(
  updateItems: FormComponentModel[]
): { id: string; span: number }[] {
  if (!updateItems.length) return [];

  const totalColumns = 12;
  const itemCount = updateItems.length;

  // Calculate base span and remainder
  const baseSpan = Math.floor(totalColumns / itemCount);
  const remainder = totalColumns % itemCount;

  const adjustedSpans: { id: string; span: number }[] = [];

  // Distribute spans equally, with remainder distributed to first few items
  updateItems.forEach((item, index) => {
    if (!item) return;
    // Add one extra column to the first 'remainder' items
    const span = index < remainder ? baseSpan + 1 : baseSpan;
    adjustedSpans.push({ id: item.id, span });
  });

  return adjustedSpans;
}

export default function FormBuilderPage() {
  const isMobile = useIsMobile();
  // Split the store selectors to only subscribe to what we need
  const viewport = useFormBuilderStore((state) => state.viewport);
  const mode = useFormBuilderStore((state) => state.mode);
  const showJson = useFormBuilderStore((state) => state.showJson);
  const formTitle = useFormBuilderStore((state) => state.formTitle);
  const updateViewport = useFormBuilderStore((state) => state.updateViewport);
  const updateMode = useFormBuilderStore((state) => state.updateMode);
  const updateFormTitle = useFormBuilderStore((state) => state.updateFormTitle);
  const toggleJsonPreview = useFormBuilderStore(
    (state) => state.toggleJsonPreview
  );
  const components = useFormBuilderStore((state) => state.components);
  const selectComponent = useFormBuilderStore((state) => state.selectComponent);
  const [showCodeDialog, setShowCodeDialog] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<{
    code: string;
    dependenciesImports: DependenciesImports;
  }>({ code: "", dependenciesImports: {} });
  const [activeId, setActiveId] = useState<string | null>(null);
  const form = useForm();

  // Memoize static values
  const viewportItems = useMemo(
    () => [
      { value: "lg", icon: Monitor },
      { value: "md", icon: Tablet },
      { value: "sm", icon: Smartphone },
    ],
    []
  );

  const modeItems = useMemo(
    () => [
      { value: "editor", icon: PencilRulerIcon },
      { value: "preview", icon: EyeIcon },
    ],
    []
  );

  const updateComponent = useFormBuilderStore((state) => state.updateComponent);
  const moveComponent = useFormBuilderStore((state) => state.moveComponent);
  const addComponent = useFormBuilderStore((state) => state.addComponent);
  const gridRows = getGridRows(components, viewport);

  const handleGenerateCode = async () => {
    const generatedCode = await generateFormCode(components);
    setGeneratedCode(generatedCode);
    setShowCodeDialog(true);
  };

  // Create sensors outside of callback
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 20,
    },
  });


  // Memoize sensors array
  const sensors = useMemo(
    () => [pointerSensor],
    [pointerSensor]
  );

  // Memoize drag end handler
  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (!over) {
      return;
    }

    const action: "move" | "add" = active.data.current.action;
    let activeComponent = active.data.current.component;
    const overComponent = over.data.current.component;
    const position = over.data.current.position;
    const activeIndex = active.data.current.index;
    const overIndex = over.data.current.index;

    if (action === "add") {
      activeComponent = addComponent(active.data.current.component);
    }

    if (
      (activeIndex === overIndex &&
        (position === "left" || position === "right")) ||
      // Or the diff between active and over is 1
      (activeIndex - overIndex === 1 && position === "bottom") ||
      (overIndex - activeIndex === 1 && position === "top")
    ) {
      return;
    }

    if (activeComponent && overComponent) {
      const overRowItems =
        gridRows.find((row) =>
          row.some((item) => item.id === over.data.current?.component.id)
        ) || [];

      const overRowFirstItemIndex = components.findIndex(
        (component) => component.id === overRowItems[0].id
      );

      const overRowLastItemIndex = components.findIndex(
        (component) => component.id === overRowItems[overRowItems.length - 1].id
      );

      let activeRowItems =
        gridRows.find((row) =>
          row.some((item) => item.id === active.data.current?.component.id)
        ) || [];

      let draggingInSameRow = overRowItems === activeRowItems;

      // Don´t update the spans if the component is being dragged in the same row
      activeRowItems = activeRowItems.filter(
        (item) => item.id !== activeComponent.id
      );
      let updatedOverItems = [];

      if (position === "top" || position === "bottom") {
        updatedOverItems = updateColSpans([activeComponent]);
      } else {
        updatedOverItems = updateColSpans([...overRowItems, activeComponent]);
      }

      if (
        (!draggingInSameRow && (position === "left" || position === "right")) ||
        position === "top" ||
        position === "bottom"
      ) {
        updatedOverItems.forEach((item) => {
          updateComponent(
            item.id,
            "properties.style.colSpan",
            `${item.span}`,
            false
          );
        });

        const updatedActiveItems = updateColSpans([...activeRowItems]);

        updatedActiveItems.forEach((item) => {
          updateComponent(
            item.id,
            "properties.style.colSpan",
            `${item.span}`,
            false
          );
        });
      }

      const oldIndex = active.data.current.index;
      let newIndex =
        position === "left"
          ? overIndex
          : activeIndex < overIndex
            ? overIndex
            : overIndex + 1;

      if (position === "top") {
        newIndex =
          activeIndex < overIndex
            ? overRowFirstItemIndex - 1
            : overRowFirstItemIndex;
      }

      if (position === "bottom") {
        newIndex =
          activeIndex < overIndex
            ? overRowLastItemIndex
            : overRowLastItemIndex + 1;
      }

      moveComponent(oldIndex, newIndex);
    }
  };

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      selectComponent(null);
      setActiveId(event.active.id as string);
    },
    [selectComponent]
  );

  return (
    <div>
      <div className="fixed top-0 w-full flex flex-row gap-2 justify-between bg-white border-b z-10">
        <div className="flex flex-row gap-2 items-center justify-center md:justify-start p-2 px-4 border-r w-full md:w-[300px]">
          <BlocksIcon className="h-6 w-6" strokeWidth={2} />
          <h2 className="text-lg font-semibold">
            shadcn/ui <span className="font-normal">Builder</span>
            <sup className="text-xs text-muted-foreground font-normal ml-1">
              Beta
            </sup>
          </h2>
        </div>
        <div className="p-2 flex-1 grid-cols-2 xl:grid-cols-3 hidden md:grid">
          <div className="hidden xl:block col-span-1">
            {process.env.NODE_ENV === "development" && <OpenJsonDialog />}
          </div>
          <div className="col-span-1 flex xl:justify-center">
            <div className=" text-center flex flex-row items-center justify-center gap-1 border rounded-md h-9 px-4">
              <div
                className="max-w-80 overflow-y-hidden whitespace-nowrap text-sm outline-none scrollbar-hide"
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => updateFormTitle(e.target.innerText)}
              >
                {formTitle}
              </div>
              <span className="text-muted-foreground text-xs">.tsx</span>
            </div>
          </div>
          <div className="col-span-1 hidden md:flex justify-end gap-4 ">
            {process.env.NODE_ENV === "development" && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleJsonPreview}
                className={showJson ? "bg-slate-100" : ""}
              >
                <CodeIcon className="h-4 w-4" />
              </Button>
            )}
            <ToggleGroupNav
              items={viewportItems}
              defaultValue={viewport}
              onValueChange={(value) =>
                updateViewport(value as "sm" | "md" | "lg")
              }
            />
            <ToggleGroupNav
              items={modeItems}
              defaultValue={mode}
              onValueChange={(value) => {
                if (value === "preview") {
                  selectComponent(null);
                }
                updateMode(value as "editor" | "preview");
              }}
            />
          </div>
        </div>
        <div className="hidden md:flex flex-row gap-2 justify-between border-l py-2 px-4 w-[300px]">
          <Button
            variant="default"
            size="sm"
            className="w-full cursor-pointer"
            onClick={handleGenerateCode}
            disabled={components.length === 0}
          >
            Generate Code
          </Button>
        </div>
      </div>

      {isMobile ? (
        <>
          <MobileNotification />
          <div className="fixed bottom-0 w-full p-4 border-t">
            <SocialLinks />
          </div>
        </>
      ) : (
        <>
          <SidebarProvider
            className="relative hidden md:block"
            style={{ "--sidebar-width": "300px" } as React.CSSProperties}
            open={mode === "editor"}
          >
            <DndContext
              id="form-builder"
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
              onDragStart={handleDragStart}
            >
              <div className="flex w-full h-screen justify-between">
                <SidebarLeft />

                <main className="flex-1 overflow-auto relative bg-slate-50 bg-dotted pt-14 scrollbar-hide">
                  <MainCanvas />
                </main>
                <SidebarRight />
              </div>
              <DragOverlay>
                <div>
                  Form element
                </div>
              </DragOverlay>
            </DndContext>
          </SidebarProvider>
          <GenerateCodeDialog
            open={showCodeDialog}
            onOpenChange={setShowCodeDialog}
            generatedCode={generatedCode}
          />
        </>
      )}
    </div>
  );
}
