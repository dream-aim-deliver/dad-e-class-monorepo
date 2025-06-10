import { z } from "zod";


export const FilterOperatorEQSchema = z.literal("eq");
export type TFilterOperatorEQ = z.infer<typeof FilterOperatorEQSchema>;
export const FilterOperatorNESchema = z.literal("ne");
export type TFilterOperatorNE = z.infer<typeof FilterOperatorNESchema>;
export const FilterOperatorGTSchema = z.literal("gt");
export type TFilterOperatorGT = z.infer<typeof FilterOperatorGTSchema>;
export const FilterOperatorGTESchema = z.literal("gte");
export type TFilterOperatorGTE = z.infer<typeof FilterOperatorGTESchema>;
export const FilterOperatorLTSchema = z.literal("lt");
export type TFilterOperatorLT = z.infer<typeof FilterOperatorLTSchema>;
export const FilterOperatorLTESchema = z.literal("lte");
export type TFilterOperatorLTE = z.infer<typeof FilterOperatorLTESchema>;

export const FilterOperatorCONTAINSSchema = z.literal("contains");
export type TFilterOperatorCONTAINS = z.infer<typeof FilterOperatorCONTAINSSchema>;
export const FilterOperatorSTARTSWITHSchema = z.literal("startsWith");
export type TFilterOperatorSTARTSWITH = z.infer<typeof FilterOperatorSTARTSWITHSchema>;
export const FilterOperatorENDSWITHSchema = z.literal("endsWith");
export type TFilterOperatorENDSWITH = z.infer<typeof FilterOperatorENDSWITHSchema>;

export const FilterOperatorBETWEENSchema = z.literal("between");
export type TFilterOperatorBETWEEN = z.infer<typeof FilterOperatorBETWEENSchema>;

export const FilterOperatorINSchema = z.literal("in");
export type TFilterOperatorIN = z.infer<typeof FilterOperatorINSchema>;
export const FilterOperatorNINSchema = z.literal("nin");
export type TFilterOperatorNIN = z.infer<typeof FilterOperatorNINSchema>;


// single value operators
export const FilterOperatorSingleValueSchema = z.union([
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

export type TFilterOperatorSingleValue = z.infer<typeof FilterOperatorSingleValueSchema>;

// 2 value operators
export const FilterOperatorTwoValuesSchema = FilterOperatorBETWEENSchema
export type TFilterOperatorTwoValues = z.infer<typeof FilterOperatorTwoValuesSchema>;

// multi value operators
export const FilterOperatorMultiValueSchema = z.union([
    FilterOperatorINSchema,
    FilterOperatorNINSchema,
]);
export type TFilterOperatorMultiValue = z.infer<typeof FilterOperatorMultiValueSchema>;

export const FilterRelationSchemaFactory = <TModelRelations extends z.ZodRawShape>(
    modelRelationsSchema: z.ZodObject<TModelRelations>,
) => {
    const validRelationships = Object.keys(modelRelationsSchema.shape) as [string, ...string[]];
    return z.object({
        type: z.literal("relation"),
        relationship: z.enum(validRelationships),
        filter: z.object({}).catchall(z.any()).superRefine((data, ctx) => {
            const relationship = data.relationship;
            if (!validRelationships.includes(relationship)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: `Invalid relationship: expected one of ${validRelationships.join(", ")}, got ${relationship}`,
                });
            }
        })
    })
}
export const FilterSelectorModelSchemaFactory = <TFilter extends z.ZodRawShape>(TFilterSchema: z.ZodObject<TFilter>) =>
    z.object({
        filter: TFilterSchema
    }).superRefine((data, ctx) => {
        const filterValue = data.filter;

        // Support both Zod object instances and raw JS objects
        const filterKeys = typeof filterValue === 'object' && filterValue !== null
            // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
            ? Object.entries(filterValue).filter(([_, v]) => v !== undefined && v !== null)
            : [];

        if (filterKeys.length === 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "At least one index should be specified in the filter.",
                path: ['filter'],
            });
        }

        if (filterKeys.length > 1) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Exactly one index should be specified in the filter.",
                path: ['filter'],
            });
        }
    })

export type TFilterSelectorModel<TFilter extends z.ZodRawShape> = z.infer<
    ReturnType<typeof FilterSelectorModelSchemaFactory<TFilter>>
>;

export type InferModel<T> =
    T extends z.ZodType<infer U> ? U :
    T extends z.ZodRawShape ? z.infer<z.ZodObject<T>> :
    T extends object ? T :
    never;

export type ExtractAllFieldsOfType<TModel, TType, TOptionalType> = Extract<{
    [K in keyof TModel]: TModel[K] extends TType ? K :
    TModel[K] extends TOptionalType ? K : never
}[keyof TModel], string>;


// const TestModel  = z.object({
//     id: z.string(),
// });

// export type TTestModel = z.infer<typeof TestModel>;

// type  TestInferModel = InferModel<{
//     id: string
//     name: string | undefined;
//     age: number[];
// }>;