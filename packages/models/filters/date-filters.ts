import { z } from "zod";
import { FilterOperatorEQSchema, FilterOperatorGTSchema, FilterOperatorGTESchema, FilterOperatorLTSchema, FilterOperatorLTESchema, FilterOperatorNESchema, TFilterOperatorMultiValue, TFilterOperatorSingleValue, FilterOperatorBETWEENSchema, FilterOperatorINSchema, FilterOperatorNINSchema } from "./base-filters";

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
