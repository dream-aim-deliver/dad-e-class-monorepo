import { z } from "zod";

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