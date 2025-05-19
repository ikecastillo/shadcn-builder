import { Button } from "@/components/ui/button";
import { DesignPropertiesViews } from "@/types/form-builder.types";
import { FormComponentModel } from "@/models/FormComponent";
import { GridGroup } from "../sidebar/groups/grid-group";
import { HtmlGroup } from "../sidebar/groups/html-group";
import { ButtonGroup } from "../sidebar/groups/button-group";
import { cn, escapeHtml } from "@/lib/utils";
import { UseFormReturn, FieldValues, ControllerRenderProps } from "react-hook-form";
import { Icon } from "../helpers/icon-render";
import { icons, Rows } from "lucide-react";

export function FormButton(component: FormComponentModel, form: UseFormReturn<FieldValues, undefined>, field: ControllerRenderProps) {
  return (
    <Button
      key={component.id}
      id={component.getField("attributes.id")}
      name={component.getField("attributes.name")}
      className={cn("w-full", component.getField("attributes.class"))}
      type={component.getField("attributes.type")}
      variant={component.getField("properties.variant")}
    >
      {component.getField("properties.style.icon") && <Icon name={component.getField("properties.style.icon")} className="size-4" />}
      {component.getField("content")}
    </Button>
  );
}

type ReactCode = {
  code: string;
  dependencies: Record<string, string[]>;
};

export function getReactCode(component: FormComponentModel): ReactCode {
  return {
    code: `
    <Button
      key="${component.id}"
      id="${escapeHtml(component.getField("attributes.id"))}"
      name="${escapeHtml(component.getField("attributes.name"))}"
      className="${escapeHtml(cn("w-full", component.getField("attributes.class")))}"
      type="${component.getField("attributes.type")}"
      variant="${component.getField("properties.variant")}"
    >
      ${component.getField("properties.style.icon") && `<${component.getField("properties.style.icon")} className="size-4" />`}
      ${escapeHtml(component.getField("content"))}
    </Button>
  `,
    dependencies: {
      "@/components/ui/button": ["Button"],
      ...(component.getField("properties.style.icon") && {
        [`lucide-react`]: [component.getField("properties.style.icon")],
      }),
    },
  };
}

export const ButtonDesignProperties: DesignPropertiesViews = {
  base: null,
  grid: <GridGroup />,
  html: <HtmlGroup />,
  label: null,
  input: null,
  button: <ButtonGroup />,
  options: null,
  validation: null,
};
