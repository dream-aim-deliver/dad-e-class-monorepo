import { z } from "zod";
import { FilterOperatorEQSchema, FilterOperatorGTSchema, FilterOperatorGTESchema, FilterOperatorLTSchema, FilterOperatorLTESchema, FilterOperatorNESchema, FilterOperatorBETWEENSchema, FilterOperatorINSchema, FilterOperatorNINSchema } from "./filter-operators";
import { ExtractAllFieldsOfType } from "./model-utils";

// Operators
export const DateFilterOperatorSingleValueSchema = z.union([
    FilterOperatorEQSchema,
    FilterOperatorEQSchema,
    FilterOperatorNESchema,
    FilterOperatorGTSchema,
    FilterOperatorGTESchema,
    FilterOperatorLTSchema,
    FilterOperatorLTESchema,
]);

export type TDateFilterOperatorSingleValue = z.infer<typeof DateFilterOperatorSingleValueSchema>;

export const DateFilterOperatorTwoValuesSchema = FilterOperatorBETWEENSchema;
export type TDateFilterOperatorTwoValues = z.infer<typeof DateFilterOperatorTwoValuesSchema>;

export const DateFilterOperatorMultiValueSchema = z.union([
    FilterOperatorINSchema,
    FilterOperatorNINSchema
]);
export type TDateFilterOperatorMultiValue = z.infer<typeof DateFilterOperatorMultiValueSchema>;
// Type Utilities
export const DateSingleValueFilterSchema = z.object({
    field: z.string().describe('Field name to filter on, must be a non-empty string'),
    type: z.literal("date").describe('Type of the field, must be "date"'),
    op: DateFilterOperatorSingleValueSchema.describe('Operation to perform on the field, such as "eq", "ne", "gt", etc.'),
    value: z.union([z.date(), z.string()]).describe('Value to filter the field against, must be a date or a string representing a date')
}).describe('Single value filter for date fields');

export type TDateSingleValueFilter = z.infer<typeof DateSingleValueFilterSchema>;
export const DateTwoValueFilterSchema = z.object({
    field: z.string().describe('Field name to filter on, must be a non-empty string'),
    type: z.literal("date").describe('Type of the field, must be "date"'),
    op: z.literal("between").describe('Operation to perform on the field, must be "between"'),
    value: z.tuple([z.union([z.date(), z.string()]), z.union([z.date(), z.string()])]).describe('Tuple of two dates or strings representing dates to filter the field between')
}).describe('Two value filter for date fields');
export type TDateTwoValueFilter = z.infer<typeof DateTwoValueFilterSchema>;

export const DateMultiValueFilterSchema = z.object({
    field: z.string().describe('Field name to filter on, must be a non-empty string'),
    type: z.literal("date").describe('Type of the field, must be "date"'),
    op: DateFilterOperatorMultiValueSchema.describe('Operation to perform on the field, such as "in", "nin"'),
    value: z.array(z.union([z.date(), z.string()])).describe('Array of dates or strings representing dates to filter the field against')
}).describe('Multi value filter for date fields');
export type TDateMultiValueFilter = z.infer<typeof DateMultiValueFilterSchema>;

export const DateFilterSchema = z.union([
    DateSingleValueFilterSchema,
    DateTwoValueFilterSchema,
    DateMultiValueFilterSchema
]).describe('Comprehensive filter schema for date fields that includes single value, two value, and multi value filters');

export type TDateFilter = z.infer<typeof DateFilterSchema>;

// Builder Utility Types
export type BuildDateSingleValueFilters<TModel> = {
    field: ExtractAllFieldsOfType<TModel, Date | string, Date | string | undefined>;
    type: "date";
    op: TDateFilterOperatorSingleValue;
    value: Date | string;
}

export type BuildDateTwoValueFilters<TModel> = {
    field: ExtractAllFieldsOfType<TModel, Date | string, Date | string | undefined>;
    type: "date";
    op: TDateFilterOperatorTwoValues;
    value: [Date | string, Date | string];
}

export type BuildDateMultiValueFilters<TModel> = {
    field: ExtractAllFieldsOfType<TModel, Date | string, Date | string | undefined>;
    type: "date";
    op: TDateFilterOperatorMultiValue;
    value: (Date | string)[];
}

export type BuildZodDateSingleValueFilters<TModel extends z.ZodRawShape> = {
    field: ExtractAllFieldsOfType<TModel, z.ZodDate | z.ZodString, z.ZodOptional<z.ZodDate | z.ZodString>>;
    type: "date";
    op: TDateFilterOperatorSingleValue;
    value: z.infer<TModel[keyof TModel]>;
}
export type BuildZodDateTwoValueFilters<TModel extends z.ZodRawShape> = {
    field: ExtractAllFieldsOfType<TModel, z.ZodDate | z.ZodString, z.ZodOptional<z.ZodDate | z.ZodString>>;
    type: "date";
    op: TDateFilterOperatorTwoValues;
    value: [z.infer<TModel[keyof TModel]>, z.infer<TModel[keyof TModel]>];
}
export type BuildZodDateMultiValueFilters<TModel extends z.ZodRawShape> = {
    field: ExtractAllFieldsOfType<TModel, z.ZodDate | z.ZodString, z.ZodOptional<z.ZodDate | z.ZodString>>;
    type: "date";
    op: TDateFilterOperatorMultiValue;
    value: z.infer<TModel[keyof TModel]>[];
}

export type BuildDateFilters<TModel> = TModel extends z.ZodRawShape ?
    | BuildZodDateSingleValueFilters<TModel>
    | BuildZodDateTwoValueFilters<TModel>
    | BuildZodDateMultiValueFilters<TModel>
    : BuildDateSingleValueFilters<TModel>
    | BuildDateTwoValueFilters<TModel>
    | BuildDateMultiValueFilters<TModel>;

// Filter factories
export const DateSingleValueFilterFactory = <TModel, TOperator extends TDateFilterOperatorSingleValue>(
    field: keyof TModel,
    op: TOperator[]
) => {
    return z.object({
        field: z.literal(field),
        type: z.literal("date"),
        op: z.enum(op as [TOperator, ...TOperator[]]),
        value: z.union([z.date(), z.string()])
    });
}

export type TFilterDateSingleValue<TModel, TOperator extends TDateFilterOperatorSingleValue> = z.infer<ReturnType<typeof DateSingleValueFilterFactory<keyof TModel, TOperator>>>;

export const DateTwoValueFilterFactory = <TModel>(field: keyof TModel) => {
    return z.object({
        field: z.literal(field),
        type: z.literal("date"),
        op: z.literal("between"),
        value: z.tuple([z.union([z.date(), z.string()]), z.union([z.date(), z.string()])])
    });
}
export type TFilterDateTwoValue<TModel> = z.infer<ReturnType<typeof DateTwoValueFilterFactory<keyof TModel>>>;

export const DateMultiValueFilterFactory = <TModel, TOperator extends TDateFilterOperatorMultiValue>(field: keyof TModel, op: TOperator[]) => {
    return z.object({
        field: z.literal(field),
        type: z.literal("date"),
        op: z.enum(op as [TOperator, ...TOperator[]]),
        value: z.array(z.union([z.date(), z.string()]))
    });
}
export type TFilterDateMultiValue<TModel, TOperator extends TDateFilterOperatorMultiValue> = z.infer<ReturnType<typeof DateMultiValueFilterFactory<keyof TModel, TOperator>>>;

// Utility types

export const DateEqFilterFactory = <TModel>(
    field: keyof TModel,
) => {
    return DateSingleValueFilterFactory(field, ["eq"]);
}

export const DateNeFilterFactory = <TModel>(
    field: keyof TModel,
) => {
    return DateSingleValueFilterFactory(field, ["ne"]);
}

export const DateGtFilterFactory = <TModel>(
    field: keyof TModel,
) => {
    return DateSingleValueFilterFactory(field, ["gt"]);
}

export const DateGteFilterFactory = <TModel>(
    field: keyof TModel,
) => {
    return DateSingleValueFilterFactory(field, ["gte"]);
}

export const DateLtFilterFactory = <TModel>(
    field: keyof TModel,
) => {
    return DateSingleValueFilterFactory(field, ["lt"]);
}

export const DateLteFilterFactory = <TModel>(
    field: keyof TModel,
) => {
    return DateSingleValueFilterFactory(field, ["lte"]);
}

export const DateBetweenFilterFactory = <TModel>(
    field: keyof TModel,
) => {
    return DateTwoValueFilterFactory(field);
}

export const DateInFilterFactory = <TModel>(
    field: keyof TModel,
) => {
    return DateMultiValueFilterFactory(field, ["in"]);
}

export const DateNinFilterFactory = <TModel>(
    field: keyof TModel,
) => {
    return DateMultiValueFilterFactory(field, ["nin"]);
}
