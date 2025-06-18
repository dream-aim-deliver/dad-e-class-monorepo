import { z } from "zod";
import { BuildFilters, InferModel } from "./model-utils";
import { TFilterGroup } from "./filter-group";

// ----- Types -----
export type TRelationFilter<TFilter> = {
    type: "relation";
    relationship: string;
    filter: TFilter | TFilterGroup<TFilter>;
}

// Builders
export type BuildRelationFilter<
    TModelRelations,
    TKey extends keyof TModelRelations = keyof TModelRelations
> = TModelRelations[TKey] extends Array<infer TRelatedModel>
    ? {
        type: "relation";
        relationship: TKey;
        filter: BuildFilters<TRelatedModel, undefined>;
    }
    : TModelRelations[TKey] extends object
    ? {
        type: "relation";
        relationship: TKey;
        filter: BuildFilters<InferModel<TModelRelations[TKey]>, undefined>;
    }
    : never;
    
// Factories

export const RelationFilterSchemaFactory = <
  TModelRelations extends z.ZodRawShape,
  RelationshipKey extends keyof TModelRelations,
  TFilter,
  TRelatedModel = TModelRelations[RelationshipKey],
>(
  modelRelationsSchema: z.ZodObject<TModelRelations>,
  relationship: RelationshipKey,
  relatedModelSchema: z.Schema<TRelatedModel>,
  relatedFieldFilterSchema: z.ZodSchema<TFilter>
) => {
  return z.object({
    type: z.literal("relation"),
    relationship: z.literal(relationship),
    filter: relatedFieldFilterSchema,
  });
};