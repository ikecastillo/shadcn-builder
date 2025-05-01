"use client";

import { useFormBuilderStore } from "@/stores/form-builder-store";

import { Button } from "@/components/ui/button";
import * as Icons from "lucide-react";
import {
  FormField,
  FormItem,
  FormControl,
  FormDescription,
  FormLabel,
} from "@/components/ui/form";
import { FieldValues, UseFormReturn } from "react-hook-form";
import { cn } from "@/lib/utils";
import { getComponentViews } from "@/config/available-components";
import { FormComponentModel } from "@/models/FormComponent";
import { FormWysiwygEditor } from "../form-components/wysiwyg/form-wysiwyg-editor";

export interface FormComponentProps {
  form: UseFormReturn<FieldValues, undefined>;
  component: FormComponentModel;
}

export function RenderEditorComponent({ form, component }: FormComponentProps) {
  const { selectedComponent, viewport, updateComponent, updateEnableDragging } = useFormBuilderStore();
  const mode = useFormBuilderStore((state) => state.mode);
  const componentViews = getComponentViews(component);

  return component.category === "form" ? (
    <FormField
      key={component.id}
      control={form.control}
      name={component.id}
        render={({ field }) => (
          <FormItem className={cn(mode === "editor" && "group/component")} data-item-id={component.id}>
            <div className="flex items-center select-none">
              <FormLabel
                className={cn(
                  "shrink-0 flex items-center gap-2 ",
                  mode === "editor" && "cursor-pointer"
                )}
                htmlFor={component.id}
              >
                {component.getField("properties.style.showLabel", viewport) ===
                  "yes" && component.getField("label", viewport)}
              </FormLabel>
            </div>
            <FormControl>{componentViews?.render}</FormControl>
            {component.description && (
              <FormDescription>{component.description}</FormDescription>
            )}
          </FormItem>
        )}
      />
  ) : (
    <div className={cn("relative flex flex-col h-full", (selectedComponent?.id === component.id && mode === "editor") && "cursor-text bg-white")} key={component.id} data-item-id={component.id}>
      <FormWysiwygEditor
        value={component.content || ""}
        onChange={(content) => {
          updateComponent(component.id, "content", content, true);
        }}
        isEditable={selectedComponent?.id === component.id && mode === "editor"}
        onFocus={() => updateEnableDragging(false)}
        onBlur={() => updateEnableDragging(true)}
      />
    </div>
  );
}
