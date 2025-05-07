import { FormComponentModel } from "@/models/FormComponent";
import { FormComponentValidationTypes } from "@/types/FormComponent.types";
import { z } from "zod";

const shouldForceRequired = (
  validations: FormComponentValidationTypes
): boolean => {
  if (!validations) return false;

  // If required is explicitly set to "no", check for min/max validations
  if (validations.required === "no") {
    return (
      validations.min !== undefined ||
      validations.max !== undefined ||
      validations.minLength !== undefined ||
      validations.maxLength !== undefined
    );
  }

  return validations.required === "yes";
};

export const getZodSchemaForComponents = (components: FormComponentModel[]) => {
  const schema: Record<string, z.ZodSchema> = {};

  components.forEach((component) => {
    const validations = component.getField("validations");
    const isRequired = shouldForceRequired(validations);
    const componentId = component.getField("attributes.id");

    if (!validations) {
      if (component.type === "number") {
        schema[componentId] = z.coerce.number();
      } else {
        schema[componentId] = z.string().optional();
      }
    } else {
      if (component.type === "number") {
        if (isRequired) {
          schema[componentId] = z.coerce
            .number()
            .min(1, { message: "This field is required" });
        }
        if (validations.min) {
          schema[componentId] = z.coerce.number().min(validations.min, {
            message: `Must be at least ${validations.min}`,
          });
        }
        if (validations.max) {
          schema[componentId] = z.coerce.number().max(validations.max, {
            message: `Must be at most ${validations.max}`,
          });
        }
      } else {
        if (isRequired) {
          schema[componentId] = z.string().min(1, { message: "This field is required" });
        } else {
          schema[componentId] = z.string().optional();
        }
      }
    }
  });

  const formSchema = z.object(schema);

  return formSchema;
};

export const getZodDefaultValues = (
  components: FormComponentModel[]
): Record<string, string> => {
  const defaultValues: Record<string, string> = {};

  components.forEach((component) => {
    const componentId = component.getField("attributes.id");
    const defaultValue = component.getField("value") || "";
    defaultValues[componentId] = defaultValue;
  });

  return defaultValues;
};
