import { z } from "zod";
import { FilterOperatorBETWEENSchema, FilterOperatorCONTAINSSchema, FilterOperatorEQSchema, FilterOperatorGTESchema, FilterOperatorGTSchema, FilterOperatorINSchema, FilterOperatorLTESchema, FilterOperatorLTSchema, FilterOperatorNESchema, FilterOperatorNINSchema } from "./filter-operators";
import { ExtractAllFieldsOfType } from "./model-utils";

// Operators
export const NumberFilterOperatorSingleValueSchema = z.union([
    FilterOperatorEQSchema,
    FilterOperatorNESchema,
    FilterOperatorGTSchema,
    FilterOperatorGTESchema,
    FilterOperatorLTSchema,
    FilterOperatorLTESchema,
    FilterOperatorCONTAINSSchema,
]);
export type TNumberFilterOperatorSingleValue = z.infer<typeof NumberFilterOperatorSingleValueSchema>;

export const NumberFilterOperatorTwoValuesSchema = FilterOperatorBETWEENSchema;
export type TNumberFilterOperatorTwoValues = z.infer<typeof NumberFilterOperatorTwoValuesSchema>;

export const NumberFilterOperatorMultiValueSchema = z.union([
    FilterOperatorINSchema,
    FilterOperatorNINSchema,
]);
export type TNumberFilterOperatorMultiValue = z.infer<typeof NumberFilterOperatorMultiValueSchema>;

// Zod Schemas
export const NumberSingleValueFilterSchema = z.object({
    field: z.string().describe('Field name to filter on, must be a non-empty string'),
    type: z.literal("number").describe('Type of the field, must be "number"'),
    op: NumberFilterOperatorSingleValueSchema.describe('Operation to perform on the field, such as "eq", "ne", "gt", etc.'),
    value: z.number().describe('Value to filter the field against, must be a number'),
}).describe('Single value filter for number fields');
export type TNumberSingleValueFilter = z.infer<typeof NumberSingleValueFilterSchema>;

export const NumberTwoValueFilterSchema = z.object({
    field: z.string().describe('Field name to filter on, must be a non-empty string'),
    type: z.literal("number").describe('Type of the field, must be "number"'),
    op: z.literal("between").describe('Operation to perform on the field, must be "between"'),
    value: z.tuple([z.number(), z.number()]).describe('Tuple of two numbers to filter the field between'),
}).describe('Two value filter for number fields');
export type TNumberTwoValueFilter = z.infer<typeof NumberTwoValueFilterSchema>;

export const NumberMultiValueFilterSchema = z.object({
    field: z.string().describe('Field name to filter on, must be a non-empty string'),
    type: z.literal("number").describe('Type of the field, must be "number"'),
    op: NumberFilterOperatorMultiValueSchema.describe('Operation to perform on the field, such as "in", "nin"'),
    value: z.array(z.number()).describe('Array of numbers to filter the field against'),
}).describe('Multi value filter for number fields');

export type TNumberMultiValueFilter = z.infer<typeof NumberMultiValueFilterSchema>;

export const NumberFilterSchema = z.union([
    NumberSingleValueFilterSchema,
    NumberTwoValueFilterSchema,
    NumberMultiValueFilterSchema
]).describe('Comprehensive filter schema for number fields that includes single value, two value, and multi value filters');

export type TNumberFilter = z.infer<typeof NumberFilterSchema>;

// Type Builders
type BuildNumberSingleValueFilters<TModel> = {
    field: ExtractAllFieldsOfType<TModel, number, number | undefined>;
    type: "number";
    op: TNumberFilterOperatorSingleValue;
    value: number;
}

type BuildZodNumberSingleValueFilters<TModel extends z.ZodRawShape> = {
    field: ExtractAllFieldsOfType<TModel, z.ZodNumber, z.ZodOptional<z.ZodNumber>>;
    type: "number";
    op: TNumberFilterOperatorSingleValue;
    value: z.infer<TModel[keyof TModel]>;
}

type BuildNumberTwoValueFilters<TModel> = {
    field: ExtractAllFieldsOfType<TModel, number, number | undefined>;
    type: "number";
    op: "between";
    value: [number, number];
}

type BuildZodNumberTwoValueFilters<TModel extends z.ZodRawShape> = {
    field: ExtractAllFieldsOfType<TModel, z.ZodNumber, z.ZodOptional<z.ZodNumber>>;
    type: "number";
    op: "between";
    value: [z.infer<TModel[keyof TModel]>, z.infer<TModel[keyof TModel]>];
}

type BuildNumberMultiValueFilters<TModel> = {
    field: ExtractAllFieldsOfType<TModel, number, number | undefined>;
    type: "number";
    op: TNumberFilterOperatorMultiValue;
    value: number[];
}

type BuildZodNumberMultiValueFilters<TModel extends z.ZodRawShape> = {
    field: ExtractAllFieldsOfType<TModel, z.ZodNumber, z.ZodOptional<z.ZodNumber>>;
    type: "number";
    op: TNumberFilterOperatorMultiValue;
    value: z.infer<TModel[keyof TModel]>[];
}

export type BuildNumberFilters<TModel> =
    TModel extends z.ZodRawShape ?
    | BuildZodNumberSingleValueFilters<TModel>
    | BuildZodNumberTwoValueFilters<TModel>
    | BuildZodNumberMultiValueFilters<TModel>
    : BuildNumberSingleValueFilters<TModel>
    | BuildNumberTwoValueFilters<TModel>
    | BuildNumberMultiValueFilters<TModel>;


// Schema Factories
export const NumberSingleValueFilterFactory = <
    TModel,
    TField extends ExtractAllFieldsOfType<TModel, number, number | undefined>,
    TOperator extends TNumberFilterOperatorSingleValue
>(
    field: TField,
    op: TOperator[]
) => {
    return z.object({
        field: z.literal(field),
        type: z.literal("number"),
        op: z.enum(op as [TOperator, ...TOperator[]]),
        value: z.number()
    });
}


export const NumberTwoValueFilterFactory = <
    TModel,
    TField extends ExtractAllFieldsOfType<TModel, number, number | undefined>,
    TOperator extends TNumberFilterOperatorTwoValues
>(
    field: TField,
    op: TOperator[]
) => {
    return z.object({
        field: z.literal(field),
        type: z.literal("number"),
        op: z.enum(op as [TOperator, ...TOperator[]]),
        value: z.tuple([z.number(), z.number()])
    });
}


export const NumberMultiValueFilterFactory = <
    TModel, 
    TField extends ExtractAllFieldsOfType<TModel, number, number | undefined>, 
    TOperator extends TNumberFilterOperatorMultiValue
>(
    field: TField,
    op: TOperator[]
) => {
    return z.object({
        field: z.literal(field),
        type: z.literal("number"),
        op: z.enum(op as [TOperator, ...TOperator[]]),
        value: z.array(z.number())
    });
}

// Utility Factories 
export const NumberEqFilterFactory = <TModel, TField extends ExtractAllFieldsOfType<TModel, number, number | undefined>>(
    field: TField,
) => {
    return NumberSingleValueFilterFactory<TModel, TField, "eq">(field, ["eq"]);
}

export const NumberNeFilterFactory = <TModel, TField extends ExtractAllFieldsOfType<TModel, number, number | undefined>>(
    field: TField,
) => {
    return NumberSingleValueFilterFactory<TModel, TField, "ne">(field, ["ne"]);
}

export const NumberGtFilterFactory = <TModel, TField extends ExtractAllFieldsOfType<TModel, number, number | undefined>>(
    field: TField,
) => {
    return NumberSingleValueFilterFactory<TModel, TField, "gt">(field, ["gt"]);
}

export const NumberGteFilterFactory = <TModel, TField extends ExtractAllFieldsOfType<TModel, number, number | undefined>>(
    field: TField,
) => {
    return NumberSingleValueFilterFactory<TModel, TField, "gte">(field, ["gte"]);
}

export const NumberLtFilterFactory = <TModel, TField extends ExtractAllFieldsOfType<TModel, number, number | undefined>>(
    field: TField,
) => {
    return NumberSingleValueFilterFactory<TModel, TField, "lt">(field, ["lt"]);
}

export const NumberLteFilterFactory = <TModel, TField extends ExtractAllFieldsOfType<TModel, number, number | undefined>>(
    field: TField,
) => {
    return NumberSingleValueFilterFactory<TModel, TField, "lte">(field, ["lte"]);
}

export const NumberBetweenFilterFactory = <TModel, TField extends ExtractAllFieldsOfType<TModel, number, number | undefined>>(
    field: TField,
) => {
    return NumberTwoValueFilterFactory<TModel, TField, "between">(field, ["between"]);
}

export const NumberInFilterFactory = <TModel, TField extends ExtractAllFieldsOfType<TModel, number, number | undefined>>(
    field: TField,
) => {
    return NumberMultiValueFilterFactory<TModel, TField, "in">(field, ["in"]);
}

export const NumberNinFilterFactory = <TModel, TField extends ExtractAllFieldsOfType<TModel, number, number | undefined>>(
    field: TField,
) => {
    return NumberMultiValueFilterFactory<TModel, TField, "nin">(field, ["nin"]);
}

export const NumberContainsFilterFactory = <TModel, TField extends ExtractAllFieldsOfType<TModel, number, number | undefined>>(
    field: TField,
) => {
    return NumberSingleValueFilterFactory<TModel, TField, "contains">(field, ["contains"]);
}