import { z } from "zod";
import { FilterOperatorBETWEENSchema, FilterOperatorCONTAINSSchema, FilterOperatorENDSWITHSchema, FilterOperatorEQSchema, FilterOperatorINSchema, FilterOperatorNESchema, FilterOperatorNINSchema, FilterOperatorSTARTSWITHSchema } from "./filter-operators";
import { ExtractAllFieldsOfType } from "./model-utils";

// Operators
export const StringFilterOperatorSingleValueSchema = z.union([
    FilterOperatorEQSchema,
    FilterOperatorNESchema,
    FilterOperatorCONTAINSSchema,
    FilterOperatorSTARTSWITHSchema,
    FilterOperatorENDSWITHSchema,
]);
export type TStringFilterOperatorSingleValue = z.infer<typeof StringFilterOperatorSingleValueSchema>;

export const StringFilterOperatorTwoValuesSchema = FilterOperatorBETWEENSchema;
export type TStringFilterOperatorTwoValues = z.infer<typeof StringFilterOperatorTwoValuesSchema>;

export const StringFilterOperatorMultiValueSchema = z.union([
    FilterOperatorINSchema,
    FilterOperatorNINSchema,
]);
export type TStringFilterOperatorMultiValue = z.infer<typeof StringFilterOperatorMultiValueSchema>;

// Zod Schemas
export const StringSingleValueFilterSchema = z.object({
    field: z.string(),
    op: StringFilterOperatorSingleValueSchema,
    type: z.literal('string'),
    value: z.string()
}).describe('Filter schema for a single string value with operations eq and contains');

export const StringTwoValueFilterSchema = z.object({
    field: z.string(),
    op: z.literal("between"),
    type: z.literal('string'),
    value: z.tuple([z.string(), z.string()])
}).describe('Filter schema for a two-value string filter with operation "between"');

export const StringMultiValueFilterSchema = z.object({
    field: z.string(),
    op: StringFilterOperatorMultiValueSchema,
    type: z.literal('string'),
    value: z.array(z.string())
}).describe('Filter schema for a multi-value string filter with operations in and nin');

export const StringFilterSchema = z.union([
    StringSingleValueFilterSchema,
    StringTwoValueFilterSchema,
    StringMultiValueFilterSchema
]).describe('Comprehensive filter schema for string fields, including single value, two value, and multi-value filters');


// Type Builders
type BuildStringSingleValueFilters<TModel> = {
    field: ExtractAllFieldsOfType<TModel, string, string | undefined>;
    type: "string";
    op: TStringFilterOperatorSingleValue;
    value: string;
}

type BuildZodStringSingleValueFilters<TModel extends z.ZodRawShape> = {
    field:ExtractAllFieldsOfType<TModel, z.ZodString, z.ZodOptional<z.ZodString>>;
    type: "string";
    op: TStringFilterOperatorSingleValue;
    value: z.infer<TModel[keyof TModel]>;
}

type BuildStringTwoValueFilters<TModel> = {
    field: ExtractAllFieldsOfType<TModel, string, string | undefined>;
    type: "string";
    op: "between";
    value: [string, string];
}

type BuildZodStringTwoValueFilters<TModel extends z.ZodRawShape> = {
    field: ExtractAllFieldsOfType<TModel, z.ZodString, z.ZodOptional<z.ZodString>>;
    type: "string";
    op: "between";
    value: [z.infer<TModel[keyof TModel]>, z.infer<TModel[keyof TModel]>];
}

type BuildStringMultiValueFilters<TModel> = {
    field: ExtractAllFieldsOfType<TModel, string, string | undefined>;
    type: "string";
    op: TStringFilterOperatorMultiValue;
    value: string[];
}

type BuildZodStringMultiValueFilters<TModel extends z.ZodRawShape> = {
    field: ExtractAllFieldsOfType<TModel, z.ZodString, z.ZodOptional<z.ZodString>>;
    type: "string";
    op: TStringFilterOperatorMultiValue;
    value: z.infer<TModel[keyof TModel]>[];
}
export type BuildStringFilters<TModel> = TModel extends z.ZodRawShape ?
    | BuildZodStringSingleValueFilters<TModel>
    | BuildZodStringTwoValueFilters<TModel>
    | BuildZodStringMultiValueFilters<TModel>
    : BuildStringSingleValueFilters<TModel>
    | BuildStringTwoValueFilters<TModel>
    | BuildStringMultiValueFilters<TModel>;

// Schema factories
export const StringSingleValueFilterFactory = <
    TModel,
    TField extends ExtractAllFieldsOfType<TModel, string, string | undefined>,
    TOperator extends TStringFilterOperatorSingleValue
>(
    field: TField,
    op: TOperator[]
) => {
    return z.object({
        field: z.literal(field),
        type: z.literal("string"),
        op: z.enum(op as [TOperator, ...TOperator[]]),
        value: z.string()
    });
}

export const StringTwoValueFilterFactory = <
    TModel,
    TField extends ExtractAllFieldsOfType<TModel, string, string | undefined>,
    TOperator extends TStringFilterOperatorTwoValues = "between"
>(
    field: TField,
    op: TOperator[]
) => {
    return z.object({
        field: z.literal(field),
        type: z.literal("string"),
        op: z.literal("between"),
        value: z.tuple([z.string(), z.string()])
    });
}

export const StringMultiValueFilterFactory = <
    TModel,
    TField extends ExtractAllFieldsOfType<TModel, string, string | undefined>,
    TOperator extends TStringFilterOperatorMultiValue
>(
    field: TField, 
    op: TOperator[]
) => {
    return z.object({
        field: z.literal(field),
        type: z.literal("string"),
        op: z.enum(op as [TOperator, ...TOperator[]]),
        value: z.array(z.string())
    });
}

// Filter Building Utils

export const StringEqFilterFactory = <TModel, TField extends ExtractAllFieldsOfType<TModel, string, string | undefined>>(
    field: TField,
) => {
    return StringSingleValueFilterFactory<TModel, TField, "eq">(field, ["eq"]);
}

export const StringNeFilterFactory = <TModel, TField extends ExtractAllFieldsOfType<TModel, string, string | undefined>>(
    field: TField,
) => {
    return StringSingleValueFilterFactory<TModel, TField, "ne">(field, ["ne"]);
}

export const StringContainsFilterFactory = <TModel, TField extends ExtractAllFieldsOfType<TModel, string, string | undefined>>(
    field: TField,
) => {
    return StringSingleValueFilterFactory<TModel, TField, "contains">(field, ["contains"]);
}

export const StringStartsWithFilterFactory = <TModel, TField extends ExtractAllFieldsOfType<TModel, string, string | undefined>>(
    field: TField,
) => {
    return StringSingleValueFilterFactory<TModel, TField, "startsWith">(field, ["startsWith"]);
}

export const StringEndsWithFilterFactory = <TModel, TField extends ExtractAllFieldsOfType<TModel, string, string | undefined>>(
    field: TField,
) => {
    return StringSingleValueFilterFactory<TModel, TField, "endsWith">(field, ["endsWith"]);
}

export const StringBetweenFilterFactory = <TModel, TField extends ExtractAllFieldsOfType<TModel, string, string | undefined>>(
    field: TField,
) => {
    return StringTwoValueFilterFactory<TModel, TField>(field, ["between"]);
}

export const StringInFilterFactory = <TModel, TField extends ExtractAllFieldsOfType<TModel, string, string | undefined>>(
    field: TField,
) => {
    return StringMultiValueFilterFactory<TModel, TField, "in">(field, ["in"]);
}

export const StringNinFilterFactory = <TModel, TField extends ExtractAllFieldsOfType<TModel, string, string | undefined>>(
    field: TField,
) => {
    return StringMultiValueFilterFactory<TModel, TField, "nin">(field, ["nin"]);
}
