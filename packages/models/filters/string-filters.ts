import { z } from "zod";
import { ExtractAllFieldsOfType, FilterOperatorBETWEENSchema, FilterOperatorCONTAINSSchema, FilterOperatorENDSWITHSchema, FilterOperatorEQSchema, FilterOperatorGTESchema, FilterOperatorGTSchema, FilterOperatorINSchema, FilterOperatorLTESchema, FilterOperatorLTSchema, FilterOperatorNESchema, FilterOperatorNINSchema, FilterOperatorSTARTSWITHSchema } from "./base-filters";

// Operators
export const StringFilterOperatorSingleValueSchema = z.union([
    FilterOperatorEQSchema,
    FilterOperatorNESchema,
    FilterOperatorGTSchema,
    FilterOperatorGTESchema,
    FilterOperatorLTSchema,
    FilterOperatorLTESchema,
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

// Build Utility Types
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

// Type Utilities
export const  StringSingleValueFilterSchema = z.object({
    field: z.string(),
    op: StringFilterOperatorSingleValueSchema,
    type: z.literal('string'),
    value: z.string()
}).describe('Filter schema for a single string value with operations eq and contains');

// Filter factories
export const StringSingleValueFilterFactory = <TModel extends z.ZodRawShape, TOperator extends TStringFilterOperatorSingleValue>(field: keyof TModel, op: TOperator[]) => {
    return z.object({
        field: z.literal(field),
        type: z.literal("string"),
        op: z.enum(op as [TOperator, ...TOperator[]]),
        value: z.string()
    });
}

export const StringTwoValueFilterFactory = <TModel>(field: keyof TModel) => {
    return z.object({
        field: z.literal(field),
        type: z.literal("string"),
        op: z.literal("between"),
        value: z.tuple([z.string(), z.string()])
    });
}

export const StringMultiValueFilterFactory = <TModel, TOperator extends TStringFilterOperatorMultiValue>(field: keyof TModel, op: TOperator[]) => {
    return z.object({
        field: z.literal(field),
        type: z.literal("string"),
        op: z.enum(op as [TOperator, ...TOperator[]]),
        value: z.array(z.string())
    });
}

// Filter Building Utils

export const StringEqFilterFactory = <TModel extends z.ZodRawShape, TField extends {
    [K in keyof TModel]: TModel[K] extends z.ZodString ? K : never
}[keyof TModel]>(field: TField) => {
    return StringSingleValueFilterFactory<TModel, "eq">(field, ["eq"]);
}

export const StringNeFilterFactory = <TModel extends z.ZodRawShape, TField extends {
    [K in keyof TModel]: TModel[K] extends z.ZodString ? K : never
}[keyof TModel]>(field: TField) => {
    return StringSingleValueFilterFactory<TModel, "ne">(field, ["ne"]);
}

export const StringGtFilterFactory = <TModel extends z.ZodRawShape, TField extends {
    [K in keyof TModel]: TModel[K] extends z.ZodString ? K : never
}[keyof TModel]>(field: TField) => {
    return StringSingleValueFilterFactory<TModel, "gt">(field, ["gt"]);
}

export const StringGteFilterFactory = <TModel extends z.ZodRawShape>(field: keyof TModel) => {
    return StringSingleValueFilterFactory<TModel, "gte">(field, ["gte"]);
}

export const StringLtFilterFactory = <TModel extends z.ZodRawShape>(field: keyof TModel) => {
    return StringSingleValueFilterFactory<TModel, "lt">(field, ["lt"]);
}

export const StringLteFilterFactory = <TModel extends z.ZodRawShape>(field: keyof TModel) => {
    return StringSingleValueFilterFactory<TModel, "lte">(field, ["lte"]);
}

export const StringContainsFilterFactory = <TModel extends z.ZodRawShape>(field: keyof TModel) => {
    return StringSingleValueFilterFactory<TModel, "contains">(field, ["contains"]);
}

export const StringStartsWithFilterFactory = <TModel extends z.ZodRawShape>(field: keyof TModel) => {
    return StringSingleValueFilterFactory<TModel, "startsWith">(field, ["startsWith"]);
}

export const StringEndsWithFilterFactory = <TModel extends z.ZodRawShape>(field: keyof TModel) => {
    return StringSingleValueFilterFactory<TModel, "endsWith">(field, ["endsWith"]);
}

export const StringInFilterFactory = <TModel extends z.ZodRawShape>(field: keyof TModel) => {
    return StringMultiValueFilterFactory<TModel, "in">(field, ["in"]);
}

export const StringBetweenFilterFactory = <TModel extends z.ZodRawShape>(field: keyof TModel) => {
    return StringTwoValueFilterFactory<TModel>(field);
}

export const StringNinFilterFactory = <TModel extends z.ZodRawShape>(field: keyof TModel) => {
    return StringMultiValueFilterFactory<TModel, "nin">(field, ["nin"]);
}
