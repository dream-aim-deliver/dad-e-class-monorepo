import { z } from "zod";
import { ExtractAllFieldsOfType, FilterOperatorBETWEENSchema, FilterOperatorCONTAINSSchema, FilterOperatorEQSchema, FilterOperatorGTESchema, FilterOperatorGTSchema, FilterOperatorINSchema, FilterOperatorLTESchema, FilterOperatorLTSchema, FilterOperatorNESchema, FilterOperatorNINSchema } from "./base-filters";

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

// Build Utility Types
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


// Factories

export const NumberSingleValueFilterFactory = <TModel, TOperator extends TNumberFilterOperatorSingleValue>(
    field: keyof TModel,
    op: TOperator[]
) => {
    return z.object({
        field: z.literal(field),
        type: z.literal("number"),
        op: z.enum(op as [TOperator, ...TOperator[]]),
        value: z.number()
    });
}
export type TFilterNumberSingleValue<TModel, TOperator extends TNumberFilterOperatorSingleValue> = z.infer<ReturnType<typeof NumberSingleValueFilterFactory<keyof TModel, TOperator>>>;


export const NumberTwoValueFilterFactory = <TModel>(field: keyof TModel) => {
    return z.object({
        field: z.literal(field),
        type: z.literal("number"),
        op: z.literal("between"),
        value: z.tuple([z.number(), z.number()])
    });
}
export type TFilterNumberTwoValue<TModel> = z.infer<ReturnType<typeof NumberTwoValueFilterFactory<keyof TModel>>>;


export const NumberMultiValueFilterFactory = <TModel, TOperator extends TNumberFilterOperatorMultiValue>(field: keyof TModel, op: TOperator[]) => {
    return z.object({
        field: z.literal(field),
        type: z.literal("number"),
        op: z.enum(op as [TOperator, ...TOperator[]]),
        value: z.array(z.number())
    });
}
export type TFilterNumberMultiValue<TModel, TOperator extends TNumberFilterOperatorMultiValue> = z.infer<ReturnType<typeof NumberMultiValueFilterFactory<keyof TModel, TOperator>>>;

// Utility types
export const NumberEqFilterFactory = <TModel>(
    field: keyof TModel,
) => {
    return NumberSingleValueFilterFactory(field, ["eq"]);
}

export const NumberNeFilterFactory = <TModel>(
    field: keyof TModel,
) => {
    return NumberSingleValueFilterFactory(field, ["ne"]);
}

export const NumberGtFilterFactory = <TModel>(
    field: keyof TModel,
) => {
    return NumberSingleValueFilterFactory(field, ["gt"]);
}

export const NumberGteFilterFactory = <TModel>(
    field: keyof TModel,
) => {
    return NumberSingleValueFilterFactory(field, ["gte"]);
}

export const NumberLtFilterFactory = <TModel>(
    field: keyof TModel,
) => {
    return NumberSingleValueFilterFactory(field, ["lt"]);
}

export const NumberLteFilterFactory = <TModel>(
    field: keyof TModel,
) => {
    return NumberSingleValueFilterFactory(field, ["lte"]);
}

export const NumberContainsFilterFactory = <TModel>(
    field: keyof TModel,
) => {
    return NumberSingleValueFilterFactory(field, ["contains"]);
}

export const NumberBetweenFilterFactory = <TModel>(
    field: keyof TModel,
) => {
    return NumberTwoValueFilterFactory(field);
}

export const NumberInFilterFactory = <TModel>(
    field: keyof TModel,
) => {
    return NumberMultiValueFilterFactory(field, ["in"]);
}

export const NumberNinFilterFactory = <TModel>(
    field: keyof TModel,
) => {
    return NumberMultiValueFilterFactory(field, ["nin"]);
}
