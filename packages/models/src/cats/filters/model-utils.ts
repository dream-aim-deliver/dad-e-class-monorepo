import { z } from "zod";
import { BuildBooleanFilters } from "./boolean-filters";
import { BuildDateFilters } from "./date-filters";
import { BuildFilterGroups } from "./filter-group";
import { BuildNumberFilters } from "./number-filters";
import { BuildRelationFilter } from "./relation-filters";
import { BuildStringFilters } from "./string-filters";

export type InferModel<T> =
    T extends z.ZodType<infer U> ? U :
    T extends z.ZodRawShape ? z.infer<z.ZodObject<T>> :
    T extends object ? T :
    never;

export type ExtractAllFieldsOfType<TModel, TType, TOptionalType> = Extract<{
    [K in keyof TModel]: TModel[K] extends TType ? K :
    TModel[K] extends TOptionalType ? K : never
}[keyof TModel], string>;

// DO NOT PASS ZOD SHAPES OR ZOD SHCEMAS DIRECTLY, USE INFERRED TYPES
export type BuildFilters<TModel, TModelRelations> =
    | BuildStringFilters<TModel>
    | BuildNumberFilters<TModel>
    | BuildBooleanFilters<TModel>
    | BuildDateFilters<TModel>
    | BuildRelationFilter<TModelRelations>
    | BuildFilterGroups<TModel, TModelRelations>