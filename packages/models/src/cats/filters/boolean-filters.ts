import { z } from "zod";
import { FilterOperatorEQSchema, FilterOperatorNESchema } from "./filter-operators";
import { ExtractAllFieldsOfType } from "./model-utils";

export const BooleanFilterOperatorSingleValueSchema = z.union([
    FilterOperatorEQSchema,
    FilterOperatorNESchema,
]);
export type TBooleanFilterOperatorSingleValue = z.infer<typeof BooleanFilterOperatorSingleValueSchema>;

// Type Utilities
export const BooleanFilterSchema = z.object({
    field: z.string().describe('Field name to filter on, must be a non-empty string'),
    type: z.literal("boolean").describe('Type of the field, must be "boolean"'),
    op: BooleanFilterOperatorSingleValueSchema.describe('Operation to perform on the field, such as "eq", "ne"'),
    value: z.boolean().describe('Value to filter the field against, must be a boolean')
}).describe('Single value filter for boolean fields');
export type TBooleanFilter = z.infer<typeof BooleanFilterSchema>;

// Builder Utility Types
export type BuildBooleanSingleValueFilters<TModel> = {
    field: ExtractAllFieldsOfType<TModel, boolean, boolean | undefined>;
    type: "boolean";
    op: TBooleanFilterOperatorSingleValue;
    value: boolean;
}

export type BuildZodBooleanSingleValueFilters<TModel extends z.ZodRawShape> = {
    field: ExtractAllFieldsOfType<TModel, z.ZodBoolean, z.ZodOptional<z.ZodBoolean>>;
    type: "boolean";
    op: TBooleanFilterOperatorSingleValue;
    value: z.infer<TModel[keyof TModel]>;
}

export type BuildBooleanFilters<TModel> = TModel extends z.ZodRawShape ?
    BuildZodBooleanSingleValueFilters<TModel>
    : BuildBooleanSingleValueFilters<TModel>;

// Factories
export const BooleanSingleValueFilterFactory = <TModel, TOperator extends TBooleanFilterOperatorSingleValue>(
    field: keyof TModel,
    op: TOperator[]
) => {
    return z.object({
        field: z.literal(field),
        type: z.literal("boolean"),
        op: z.enum(op as [TOperator, ...TOperator[]]),
        value: z.boolean()
    });
}

// Filter Building Utilties
export const BooleanEqFilterFactory = <TModel>(
    field: keyof TModel,
) => {
    return BooleanSingleValueFilterFactory(field, ["eq"]);
}

export const BooleanNeFilterFactory = <TModel>(
    field: keyof TModel,
) => {
    return BooleanSingleValueFilterFactory(field, ["ne"]);
}
