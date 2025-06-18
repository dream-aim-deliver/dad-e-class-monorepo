import { z } from "zod";
import { StringFilterSchema } from './string-filters';
import { NumberFilterSchema } from './number-filters';
import { BooleanFilterSchema } from "./boolean-filters";
import { DateFilterSchema } from "./date-filters";
import { BuildFilters, InferModel } from "./model-utils";


export const SimpleFilterSchema = z.union([
    StringFilterSchema,
    NumberFilterSchema,
    DateFilterSchema,
    BooleanFilterSchema
]).describe('Simple filter schema that includes string, number, date, and boolean filters');

type TSimpleFilter = z.infer<typeof SimpleFilterSchema>;

export const FilterRelationSchema = z.object({
    type: z.literal('relation'),
    relationship: z.string(),
    filter: z.union([
        SimpleFilterSchema,
        z.lazy((): z.ZodTypeAny => FilterGroupSchema), // Recursive definition for nested groups
    ])
}).describe('Filter schema for relations, allowing nested filters within a relationship');
type TFilterRelation = z.infer<typeof FilterRelationSchema>;


export const FilterGroupSchema = z.object({
    type: z.literal('group'),
    op: z.enum(['and', 'or', 'not']),
    filters: z.array(z.union([
        SimpleFilterSchema,
        FilterRelationSchema,
        z.lazy((): z.ZodTypeAny => FilterGroupSchema), // Recursive definition for nested groups
    ]))
}).describe('Filter group schema for combining multiple filters with logical operations');
type TFilterGroup = z.infer<typeof FilterGroupSchema>;


export const FilterUnionSchema = z.union([
    SimpleFilterSchema,
    FilterGroupSchema,
    FilterRelationSchema
]).describe('Comprehensive filter schema that includes simple filters, filter groups, and relation filters');

export type TFilterUnion = z.infer<typeof FilterUnionSchema>;

export const FilterSchema = FilterUnionSchema
    .describe('Comprehensive filter schema that includes simple filters, filter groups, and relation filters')
    .superRefine((data: any, ctx) => {

        const _validateGroup = (data: TFilterGroup) => {
            for (const filter of data.filters) {
                _validate(filter);
            }
        }

        const _validateRelation = (data: TFilterRelation) => {
            _validate(data.filter);
        }


        const _validateSimpleFilter = (data: TSimpleFilter) => {
            const type = data.type;

            if (type === 'string') {
                StringFilterSchema.parse(data);
            }
            else if (type === 'number') {
                NumberFilterSchema.parse(data);
            }
            else if (type === 'boolean') {
                BooleanFilterSchema.parse(data);
            }
            else if (type === 'date') {
                DateFilterSchema.parse(data);
            }
            else {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: `Invalid filter type: ${type}`,
                });
                return;
            }
        }

        const _validate = (data: TFilterUnion) => {
            if (data.type === 'group') {
                _validateGroup(data as TFilterGroup);
            }
            else if (data.type === 'relation') {
                _validateRelation(data as TFilterRelation)
            }
            else if (data.type === 'string' || data.type === 'number' || data.type === 'boolean' || data.type === 'date') {
                _validateSimpleFilter(data);
            }
        }

        _validate(data);
        return data;

    })

export type TFilter = z.infer<typeof FilterSchema>;

/**
 * Checks if the fields in the filter object are present in model. Checks if the relationships in the filter object are present in relations.
 * Validates the filter object against the FilterSchema.
 * @param data - The filter object to validate.
 * @returns {boolean} - Returns true if the filter is valid, false otherwise.
 */
export class ModelFilterValidator<TModelShape extends z.ZodRawShape, TModelRelationsShape extends z.ZodRawShape> {
    private validFields: string[];
    private validRelations: string[];

    constructor(
        modelSchema: z.ZodObject<TModelShape>,
        relationsSchema: z.ZodObject<TModelRelationsShape>
    ) {
        this.validFields = Object.keys(modelSchema.shape);
        this.validRelations = Object.keys(relationsSchema.shape);
    }

    private _validateFields(filter: TFilterUnion): void {
        if (filter.type === 'group') {
            for (const subFilter of filter.filters) {
                this._validateFields(subFilter);
            }
        } else if (filter.type === 'relation') {
            if (!this.validRelations.includes(filter.relationship)) {
                throw new Error(`Invalid relationship: ${filter.relationship}. Valid relationships are: ${this.validRelations.join(', ')}`);
            }
            this._validateFields(filter.filter);
        } else {
            // Check if the field is valid
            if (!this.validFields.includes(filter.field)) {
                throw new Error(`Invalid field: ${filter.field}. Valid fields are: ${this.validFields.join(', ')}`);
            }
        }
    }

    public parse(data: TFilter): true {
        try {
            this._validateFields(data);
        } catch (error) {
            throw new Error(`Filter validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
        return true;
    }
}

export const ModelFilterSchemaFactory = <
    TModelShape extends z.ZodRawShape,
    TModelRelationsShape extends z.ZodRawShape
>(
    modelSchema: z.ZodObject<TModelShape>,
    relationsSchema: z.ZodObject<TModelRelationsShape>
) => {
    const modelFilterValidator = new ModelFilterValidator<TModelShape, TModelRelationsShape>(
        modelSchema,
        relationsSchema
    );
    return FilterUnionSchema
        .superRefine((data, ctx) => {
            try {
                modelFilterValidator.parse(data);
            } catch (error) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: error instanceof Error ? error.message : 'Unknown error',
                });
            }
            FilterSchema.parse(data); // Validate against the base filter schema
        }
    ).describe('Model filter schema that validates fields against model schema and relationships against relations schema');
}

export type TModelFilter<TModelShape extends z.ZodRawShape, TModelRelationsShape extends z.ZodRawShape> =
    BuildFilters<InferModel<TModelShape>, InferModel<TModelRelationsShape>>
