import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { DesignPropertiesViews } from "@/types/form-builder.types";
import { FormComponentModel } from "@/models/FormComponent";
import { GridGroup } from "../sidebar/groups/grid-group";
import { HtmlGroup } from "../sidebar/groups/html-group";
import { LabelGroup } from "../sidebar/groups/label-group";
import { InputGroup } from "../sidebar/groups/input-group";
import { OptionsGroup } from "../sidebar/groups/options-group";
import { cn, escapeHtml } from "@/lib/utils";
import {
  UseFormReturn,
  FieldValues,
  ControllerRenderProps,
} from "react-hook-form";
import { ValidationGroup } from "../sidebar/groups/validation-group";
import {
  FormField,
  FormLabel,
  FormItem,
  FormControl,
} from "@/components/ui/form";

export function FormCheckboxGroup(
  component: FormComponentModel,
  form: UseFormReturn<FieldValues, undefined>,
  field: ControllerRenderProps
) {
  const oneOptionHasLabelDescription = component.options?.some((option) => option.labelDescription);

  return (
    <div className={cn("flex flex-col gap-2")}>
      {component.options?.map((option) => (
        <FormField
          name={component.id}
          key={option.value}
          control={form.control}
          render={({ field: OptionField }) => {
            return (
              <FormItem key={option.value} className="flex items-start gap-2">
                <FormControl>
                  <Checkbox
                    checked={OptionField.value?.includes(option.value)}
                    onCheckedChange={(checked) => {
                      return checked
                        ? OptionField.onChange([
                            ...OptionField.value,
                            option.value,
                          ])
                        : OptionField.onChange(
                            OptionField.value?.filter(
                              (value: string) => value !== option.value
                            )
                          );
                    }}
                  />
                </FormControl>
                <div className="grid gap-2 leading-none">
                  <FormLabel className={cn("text-sm leading-tight font-normal", oneOptionHasLabelDescription && "font-medium")}>
                    {option.label}
                  </FormLabel>
                  {option.labelDescription && (
                    <p className="text-sm text-muted-foreground">
                      {option.labelDescription}
                    </p>
                  )}
                </div>
              </FormItem>
            );
          }}
        />
      ))}
    </div>
  );
}

type ReactCode = {
  code: string;
  dependencies: Record<string, string[]>;
};

export function getReactCode(component: FormComponentModel): ReactCode {
  const oneOptionHasLabelDescription = component.options?.some((option) => option.labelDescription);

  return {
    code: `
    <div className="flex flex-col gap-2">
      ${component.options
        ?.map(
          (option) => `
        <FormField
          name="${component.id}"
          control={form.control}
          render={({ field: OptionField }) => {
            return (
              <FormItem key="${option.value}" className="flex items-start gap-3">
                <FormControl>
                  <Checkbox
                    checked={OptionField.value?.includes("${option.value}")}
                    onCheckedChange={(checked) => {
                      return checked
                        ? OptionField.onChange([
                            ...OptionField.value,
                            "${option.value}",
                          ])
                        : OptionField.onChange(
                            OptionField.value?.filter(
                              (value: string) => value !== "${option.value}"
                            )
                          );
                    }}
                  />
                </FormControl>
                <div className="grid gap-2 leading-none">
                  <FormLabel className="${oneOptionHasLabelDescription ? "font-medium" : "font-normal"}">
                    ${option.label}
                  </FormLabel>
                  ${option.labelDescription ? `<p className="text-sm text-muted-foreground">${escapeHtml(option.labelDescription)}</p>` : ""}
                </div>
              </FormItem>
            );
          }}
        />
      `).join("\n")}
    </div>
    `,
    dependencies: {
      "@/components/ui/checkbox": ["Checkbox"],
      "@/components/ui/form": ["FormLabel"],
    },
  };
}

export const CheckboxGroupDesignProperties: DesignPropertiesViews = {
  base: null,
  grid: <GridGroup />,
  html: <HtmlGroup />,
  label: <LabelGroup whitelist={["label"]} />,
  input: <InputGroup whitelist={["description", "asCard"]} />,
  options: <OptionsGroup />,
  button: null,
  validation: <ValidationGroup />,
};
