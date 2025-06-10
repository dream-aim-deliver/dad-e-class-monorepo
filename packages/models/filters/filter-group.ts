import { z } from "zod";
import { BuildFilters } from "./filter-generator";

// ----- Types -----

export type TFilterGroupAnd<TFilter> = {
    type: "group";
    op: "and";
    filters: Array<TFilter | TFilterGroup<TFilter>>;
}

export type TFilterGroupOr<TFilter> = {
    type: "group";
    op: "or";
    filters: Array<TFilter | TFilterGroup<TFilter>>;
}

export type TFilterGroupNot<TFilter> = {
    type: "group";
    op: "not";
    filters: Array<TFilter | TFilterGroup<TFilter>>;
}

export type TFilterGroup<TFilter> = 
    | TFilterGroupAnd<TFilter> 
    | TFilterGroupOr<TFilter> 
    | TFilterGroupNot<TFilter>;

// Builders

export type BuildFilterGroups<TModel, TModelRelations> = {
    type: "group";
    op: "and" | "or" | "not";
    filters: Array<BuildFilters<TModel, TModelRelations> | BuildFilterGroups<TModel, TModelRelations>>;
};

// ----- Factories -----

export const FilterGroupAndFactory = <TFilter>(filterSchema: z.ZodSchema<TFilter>) => {
    const groupSchema: z.ZodType<TFilterGroupAnd<TFilter>> = z.lazy(() =>
        z.object({
            type: z.literal("group"),
            op: z.literal("and"),
            filters: z.array(z.union([filterSchema, groupSchema]))
        })
    );
    return groupSchema;
}

export const FilterGroupOrFactory = <TFilter>(filterSchema: z.ZodSchema<TFilter>) => {
    const groupSchema: z.ZodType<TFilterGroupOr<TFilter>> = z.lazy(() =>
        z.object({
            type: z.literal("group"),
            op: z.literal("or"),
            filters: z.array(z.union([filterSchema, groupSchema]))
        })
    );
    return groupSchema;
}

export const FilterGroupNotFactory = <TFilter>(filterSchema: z.ZodSchema<TFilter>) => {
    const groupSchema: z.ZodType<TFilterGroupNot<TFilter>> = z.lazy(() =>
        z.object({
            type: z.literal("group"),
            op: z.literal("not"),
            filters: z.array(z.union([filterSchema, groupSchema]))
        })
    );
    return groupSchema;
}
