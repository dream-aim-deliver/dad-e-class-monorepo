import { z } from "zod";
import { StringEqFilterFactory } from "./string-filters";
import { NumberEqFilterFactory } from "./number-filters";
import { TBaseExternalModel, TBaseModelCreated } from "../cats-core";
import { RelationFilterSchemaFactory } from "./relation-filters";
import { FilterGroupAndFactory } from "./filter-group";


export const IDFieldFilterSchema = NumberEqFilterFactory<TBaseModelCreated<z.ZodRawShape>, "id">("id");
export type TIDFieldFilter = z.infer<typeof IDFieldFilterSchema>;

export const ExternalIdFieldFilterSchema = StringEqFilterFactory<TBaseExternalModel, "externalId">("externalId");
export type TExternalIdFieldFilter = z.infer<typeof ExternalIdFieldFilterSchema>;

export const ProviderFieldFilterSchema = StringEqFilterFactory<TBaseExternalModel, "provider">("provider");
export type TProviderFieldFilter = z.infer<typeof ProviderFieldFilterSchema>;


export const ExternalProviderRelationFilterSchema = RelationFilterSchemaFactory(
    z.object({
        externalProviders: z.array(z.any())
    }).strict(),
    "externalProviders",
    z.any(),
    FilterGroupAndFactory(
        z.union([
            ExternalIdFieldFilterSchema,
            ProviderFieldFilterSchema,
        ])
    )
)

export type TExternalProviderRelationFilter = z.infer<typeof ExternalProviderRelationFilterSchema>;