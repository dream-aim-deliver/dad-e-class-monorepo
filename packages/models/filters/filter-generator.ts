import { z } from "zod";
import { BuildStringFilters } from './string-filters';
import { BuildNumberFilters } from './number-filters';
import { BuildFilterGroups } from './filter-group';
import { BuildRelationFilter } from './relation-filters';
import { BaseModelCreatedSchemaFactory } from '../models/stateful-model';
import { ExtractAllFieldsOfType, InferModel } from "./base-filters";



// DO NOT PASS ZOD SHAPES OR ZOD SHCEMAS DIRECTLY, USE INFERRED TYPES
export type BuildFilters<TModel, TModelRelations> =
    | BuildStringFilters<TModel>
    | BuildNumberFilters<TModel>
    | BuildRelationFilter<TModelRelations>
    | BuildFilterGroups<TModel, TModelRelations>

export const SimpleFilterSchema = z.object({
    field: z.string(),
    op: z.string(),
    type: z.string(),
    value: z.union([
        z.string(), z.number(), z.boolean(), z.date()]
    ).or(
        z.tuple([z.string(), z.string()])
    ).or(
        z.tuple([z.number(), z.number()])
    ).or(
        z.tuple([z.boolean(), z.boolean()])
    ).or(
        z.tuple([z.date(), z.date()])
    ).or(
        z.array(z.string())
    ).or(
        z.array(z.number())
    ).or(
        z.array(z.boolean())
    ).or(
        z.array(z.date())
    )
})

export const FilterGroupSchema = z.object({
    type: z.literal('group'),
    op: z.enum(['and', 'or', 'not']),
    filters: z.array(z.union([
        SimpleFilterSchema,
        z.lazy((): z.ZodTypeAny => FilterGroupSchema), // Recursive definition for nested groups
    ]))
}).describe('Filter group schema for combining multiple filters with logical operations');

export const FilterRelationSchema = z.object({
    type: z.literal('relation'),
    relationship: z.string(),
    filter: z.union([
        SimpleFilterSchema,
        z.lazy((): z.ZodTypeAny => FilterGroupSchema), // Recursive definition for nested groups
    ])
}).describe('Filter schema for relations, allowing nested filters within a relationship');


type TPrimitive = string | number | boolean | Date;

function isPrimitive(val: unknown): val is TPrimitive {
    return (
        typeof val === 'string' ||
        typeof val === 'number' ||
        typeof val === 'boolean' ||
        val instanceof Date
    );
}

function getPrimitiveType(val: unknown): 'string' | 'number' | 'boolean' | 'date' | 'unknown' {
    if (typeof val === 'string') return 'string';
    if (typeof val === 'number') return 'number';
    if (typeof val === 'boolean') return 'boolean';
    if (val instanceof Date) return 'date';
    return 'unknown';
}

export const StringSingleValueFilterSchema = z.object({
    field: z.string(),
    op: z.enum(['eq', 'contains']),
    type: z.literal('string'),
    value: z.string()
}).describe('Filter schema for a single string value with operations eq and contains');


type PrimitiveFilter<T extends TPrimitive> = {
    field: string;
    op: string;
    type: 'string' | 'number' | 'boolean' | 'date';
    value: T | [T, T] | T[];
}
export const FilterSchema = z.union([
    SimpleFilterSchema,
    FilterGroupSchema,
    FilterRelationSchema
])
    .describe('Comprehensive filter schema that includes simple filters, filter groups, and relation filters')
    .superRefine((data: any, ctx) => {
        const type = data.type;
        if (!type) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Filter must have a type (simple, group, or relation).',
            });
            return;
        }
        const _validateGroup = (data: { type: 'group', op: 'and' | 'or' | 'not', filters: any[] }) => {
            if (!data.op || !['and', 'or', 'not'].includes(data.op)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: `Invalid group operation: ${data.op}. Must be 'and', 'or', or 'not'.`,
                });
                return;
            }
            if (!Array.isArray(data.filters) || data.filters.length === 0) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Group filters must be a non-empty array.',
                });
                return;
            }
            // Validate each filter in the group
            for (const filter of data.filters) {
                if (typeof filter !== 'object' || filter === null) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: `Invalid filter in group: ${JSON.stringify(filter)}. Must be an object.`,
                    });
                }
            }
        }

        const _validateRelation = (data: { type: 'relation', relationship: string, filter: any }) => {
            if (!data.relationship || typeof data.relationship !== 'string') {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: `Invalid relationship: ${data.relationship}. Must be a non-empty string.`,
                });
                return;
            }
            if (!data.filter || typeof data.filter !== 'object' || data.filter === null) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: `Invalid filter in relation: ${JSON.stringify(data.filter)}. Must be an object.`,
                });
                return;
            }
        }

        const _validate = (data: {

        })
        switch (type) {
            case 'group':
                // Validate group filters
                if (!data.op || !['and', 'or', 'not'].includes(data.op)) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: `Invalid group operation: ${data.op}. Must be 'and', 'or', or 'not'.`,
                    });
                    return;
                }
                if (!Array.isArray(data.filters) || data.filters.length === 0) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'Group filters must be a non-empty array.',
                    });
                    return;
                }
                // Validate each filter in the group
                for (const filter of data.filters) {
                    if (typeof filter !== 'object' || filter === null) {
                        ctx.addIssue({
                            code: z.ZodIssueCode.custom,
                            message: `Invalid filter in group: ${JSON.stringify(filter)}. Must be an object.`,
                        });
                    }
                }
                break;
            case 'relation':
                // Validate relation filters
                if (!data.relationship || typeof data.relationship !== 'string') {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: `Invalid relationship: ${data.relationship}. Must be a non-empty string.`,
                    });
                    return;
                }
                if (!data.filter || typeof data.filter !== 'object' || data.filter === null) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: `Invalid filter in relation: ${JSON.stringify(data.filter)}. Must be an object.`,
                    });
                    return;
                }
                break;
            default:
                if (!data.field || typeof data.field !== 'string') {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: `Invalid field: ${data.field}. Must be a non-empty string.`,
                    });
                    return;
                }
                if (!data.op || typeof data.op !== 'string') {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: `Invalid operation: ${data.op}. Must be a non-empty string.`,
                    });
                    return;
                }
                if (!data.type || typeof data.type !== 'string') {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: `Invalid type: ${data.type}. Must be a non-empty string.`,
                    });
                    return;
                }
        }

    })


// Example
// const DemoUserDraftSchema = z.object({
//     name: z.string().optional(),
//     description: z.string(),
//     age: z.number(),
// })

// const DemoUserCreatedModel = BaseModelCreatedSchemaFactory(DemoUserDraftSchema);

// const DemoRoleDraftModelSchema = z.object({
//     title: z.string(),
// })
// const DemoUserRelationsModel = z.object({
//     roles: z.array(DemoRoleDraftModelSchema)
// });
// type TUserFilters = BuildFilters<z.infer<typeof DemoUserCreatedModel>, z.infer<typeof DemoUserRelationsModel>>

// const TestFilter: TUserFilters = {
//     type: "group",
//     op: "and",
//     filters: [

//         {
//             type: "group",
//             op: "or",
//             filters: [
//                 {
//                     field: "age",
//                     type: "number",
//                     op: "contains",
//                     value: 1
//                 },
//                 {
//                     field: "description",
//                     type: "string",
//                     op: "contains",
//                     value: "test"
//                 },
//                 {
//                     type: "relation",
//                     relationship: "roles",
//                     filter:
//                     {
//                         field: "title",
//                         type: "string",
//                         op: "contains",
//                         value: "admin"
//                     }

//                 }
//             ]
//         }
//     ]
// }
