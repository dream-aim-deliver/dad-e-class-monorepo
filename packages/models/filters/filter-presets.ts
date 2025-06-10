import { z } from "zod";
import { StringEqFilterFactory } from "./string-filters";
import { TBaseExternalModel } from "../models/external-model";
import { TBaseModelCreated } from "../models/stateful-model";
import { NumberEqFilterFactory } from "./number-filters";


export const ExternalIDFieldFilterSchema = StringEqFilterFactory<TBaseExternalModel>("externalID");
export type TExternalIDFieldFilter = z.infer<typeof ExternalIDFieldFilterSchema>;
export const IDFieldFilterSchemaFactory = <TModel extends z.ZodRawShape>(
    modelCreatedSchema: z.ZodObject<TModel>
) => {
    return StringEqFilterFactory<TBaseModelCreated<TModel>>("id").or(
        NumberEqFilterFactory<TBaseModelCreated<TModel>>("id")
    );
};

export type TIDFieldFilter<TModel extends z.ZodRawShape> = z.infer<ReturnType<typeof IDFieldFilterSchemaFactory<TModel>>>;
export const ProviderFieldFilterSchema = StringEqFilterFactory<TBaseExternalModel>("provider");
export type TProviderFieldFilter = z.infer<typeof ProviderFieldFilterSchema>;

