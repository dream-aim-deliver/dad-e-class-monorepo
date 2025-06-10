import { z } from "zod";
import { BuildFilters } from "./filter-generator";
import { InferModel} from "./base-filters";

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
    : never;
    
// Factories
export const RelationFilterFactory = <
  TModelRelations extends z.ZodRawShape,
  RelationshipKey extends keyof InferModel<TModelRelations>,
  TRelatedModel = InferModel<TModelRelations>[RelationshipKey] extends Array<infer U> ? U : never
>(
  relationship: RelationshipKey,
  relatedFieldFilterSchema: z.ZodType<BuildFilters<TRelatedModel, undefined>>
) => {
  return z.object({
    type: z.literal("relation"),
    relationship: z.literal(relationship as string), // cast for runtime Zod compatibility
    filter: relatedFieldFilterSchema,
  });
};