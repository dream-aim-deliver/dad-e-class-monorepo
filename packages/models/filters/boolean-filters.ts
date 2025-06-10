import { z } from "zod";
import { FilterOperatorEQSchema, FilterOperatorNESchema, TFilterOperatorEQ, TFilterOperatorNE } from "./base-filters";

export const BooleanFilterOperatorSingleValueSchema = z.union([
    FilterOperatorEQSchema,
    FilterOperatorNESchema,
]);
export type TBooleanFilterOperatorSingleValue = z.infer<typeof BooleanFilterOperatorSingleValueSchema>;


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
