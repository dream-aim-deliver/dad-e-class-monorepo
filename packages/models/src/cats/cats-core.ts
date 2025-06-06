/* eslint-disable no-unused-vars */
import { z } from "zod";

export function makeDiscriminatedUnion<
    Discriminator extends string,
    SchemaMap extends Record<string, z.ZodDiscriminatedUnionOption<Discriminator>>
>(
    discriminator: Discriminator,
    schemaMap: SchemaMap
): z.ZodDiscriminatedUnion<Discriminator, [SchemaMap[keyof SchemaMap], ...SchemaMap[keyof SchemaMap][]]> {
    const schemas = Object.values(schemaMap) as [SchemaMap[keyof SchemaMap], ...SchemaMap[keyof SchemaMap][]];
    return z.discriminatedUnion(discriminator, schemas);
}

const BaseModelDraftSchema = z.object({
    state: z.literal("draft"),
}).strict();

const BaseModelCreatedSchema = z.object({
    state: z.literal("created"),
    id: z.string().or(z.number()),
    createdAt: z.date(),
    updatedAt: z.date(),
}).strict();

const BaseModelDeletedSchema = z.object({
    state: z.literal("deleted"),
    id: z.string().or(z.number()),
    createdAt: z.date(),
    updatedAt: z.date(),
    deletedAt: z.date(),
}).strict();

export const BaseModelDraftSchemaFactory = <TModelShape extends z.ZodRawShape>(
    modelSchema: z.ZodObject<TModelShape>
) => {
    return BaseModelDraftSchema.merge(modelSchema)
}

export type TBaseModelDraft<TModelShape extends z.ZodRawShape> = z.infer<ReturnType<typeof BaseModelDraftSchemaFactory<TModelShape>>>;

export const BaseModelCreatedSchemaFactory = <TModelShape extends z.ZodRawShape>(
    modelSchema: z.ZodObject<TModelShape>
) => {
    return BaseModelCreatedSchema.merge(modelSchema)
}

export type TBaseModelCreated<TModelShape extends z.ZodRawShape> = z.infer<ReturnType<(typeof BaseModelCreatedSchemaFactory<TModelShape>)>>;

export const BaseModelDeletedSchemaFactory = <TModelShape extends z.ZodRawShape>(
    modelSchema: z.ZodObject<TModelShape>
) => {
    return BaseModelDeletedSchema.merge(modelSchema)
}

export type TBaseModelDeleted<TModelShape extends z.ZodRawShape> = z.infer<ReturnType<typeof BaseModelDeletedSchemaFactory<TModelShape>>>;


export const BaseStatefulModelSchemaFactory = <TModelShape extends z.ZodRawShape>(
    modelDraftSchema: z.ZodObject<{ state: z.ZodLiteral<"draft"> } & TModelShape>,
    modelCreatedSchema: z.ZodObject<{ state: z.ZodLiteral<"created">; id: z.ZodString | z.ZodNumber; createdAt: z.ZodDate; updatedAt: z.ZodDate } & TModelShape>,
    modelDeletedSchema: z.ZodObject<{ state: z.ZodLiteral<"deleted">; id: z.ZodString | z.ZodNumber; createdAt: z.ZodDate; updatedAt: z.ZodDate; deletedAt: z.ZodDate } & TModelShape>
) => {
    return z.discriminatedUnion("state", [
        modelDraftSchema,
        modelCreatedSchema,
        modelDeletedSchema,
    ]);
}

// External Models
const BaseExternalModelSchema = z.object({
    provider: z.string(),
    externalID: z.string(),
}).strict();

export const BaseExternalModelSchemaFactory = <TModelShape extends z.ZodRawShape>(
    modelSchema: z.ZodObject<TModelShape>,
) => {
    return BaseExternalModelSchema.merge(modelSchema);
}

export type TBaseExternalModel = z.infer<typeof BaseExternalModelSchema>

// BASE MODELS Factories

export const BaseSuccessSchemaFactory = <TSuccessDataShape extends z.ZodRawShape>(
    dataSchema: z.ZodObject<TSuccessDataShape>,
) => {
    return z.object({
        success: z.literal(true),
        data: dataSchema,
    });
}

export type TBaseSuccess<TSuccessDataShape extends z.ZodRawShape> = z.infer<
    ReturnType<typeof BaseSuccessSchemaFactory<TSuccessDataShape>>
>;

export const BaseErrorContextSchema = z.object({
    digest: z.string().optional(), // Ensure "digest" is required
}).strict();

export const BaseErrorContextSchemaFactory = <TErrorContextShape extends z.ZodRawShape>(
    errorContextSchema?: z.ZodObject<TErrorContextShape>,
) => {
    if (!errorContextSchema) {
        return z.object({
            digest: z.string().optional(), // Ensure "digest" is required
        });
    }
    const errorContext = z.object({
        digest: z.string().optional(), // Ensure "digest" is required
    }).merge(
        errorContextSchema,
    )
    return errorContext;
}

export type TBaseErrorContext<TErrorContextShape extends z.ZodRawShape> = z.infer<
    ReturnType<typeof BaseErrorContextSchemaFactory<TErrorContextShape>>
>;

export const BaseErrorDataSchemaFactory = <TErrorDataShape extends z.ZodRawShape, TErrorContextShape extends z.ZodRawShape>(
    errorDataSchema?: z.ZodObject<TErrorDataShape>,
    errorContextSchema?: z.ZodObject<TErrorContextShape>,
) => {
    const baseErrorData = z.object({
        operation: z.string(),
        message: z.string(),
        context: BaseErrorContextSchemaFactory(errorContextSchema),
    });
    if (errorDataSchema) {
        // Merge the error data schema with the base error data schema
        return baseErrorData.merge(errorDataSchema);
    }
    // If no error data schema is provided, use the base error data schema
    return baseErrorData;
}
export const BaseErrorSchemaFactory = <TErrorDataShape extends z.ZodRawShape, TErrorContextShape extends z.ZodRawShape>(
    errorDataSchema?: z.ZodObject<TErrorDataShape>,
    errorContextSchema?: z.ZodObject<TErrorContextShape>,
) => {
    return z.object({
        success: z.literal(false),
        data: BaseErrorDataSchemaFactory<TErrorDataShape, TErrorContextShape>(
            errorDataSchema,
            errorContextSchema
        ),
    });
}
export type TBaseError<TErrorDataShape extends z.ZodRawShape, TErrorContextShape extends z.ZodRawShape> = z.infer<
    ReturnType<typeof BaseErrorSchemaFactory<TErrorDataShape, TErrorContextShape>>
>;

export const BaseDiscriminatedErrorTypeSchemaFactory = <TErrorType extends string, TErrorShape extends z.ZodRawShape>(config: {
    type: TErrorType;
    schema: z.ZodObject<TErrorShape>;
}) => {
    const errorDataSchema = z.object({
        success: z.literal(false),
        errorType: z.literal(config.type),
        data: BaseErrorDataSchemaFactory(config.schema),
    })
    return errorDataSchema;
};
export const CommonErrorSchemaMap = {
    UnknownError: BaseDiscriminatedErrorTypeSchemaFactory({
        type: 'UnknownError',
        schema: z.object({
            message: z.string(),
            trace: z.string().optional(),
        }),
    }),
    AuthenticationError: BaseDiscriminatedErrorTypeSchemaFactory({
        type: 'AuthenticationError',
        schema: z.object({
            statusCode: z.number(),
            message: z.string(),
            trace: z.string().optional(),
        }),
    }),
    ValidationError: BaseDiscriminatedErrorTypeSchemaFactory({
        type: 'ValidationError',
        schema: z.object({
            message: z.string(),
            trace: z.string().optional(),
        }),
    }),
}

export const BaseErrorDiscriminatedUnionSchemaFactory = <
    TErrorSchemaMap extends Record<string, z.ZodDiscriminatedUnionOption<"errorType">>
>(
    errorSchemasMap: TErrorSchemaMap
) => {
    return makeDiscriminatedUnion("errorType", { ...errorSchemasMap, ...CommonErrorSchemaMap });
};


export const BaseProgressStepContextSchema = z.object({
    // TODO: Define the context schema based on your requirements
})
export const BaseProgressDataSchema = z.object({
    operation: z.string(),
    message: z.string(),
    step: z.string(),
})


export const BaseDiscriminatedProgressStepSchemaFactory = <
    TProgressStep extends string,
    TProgressData extends z.ZodRawShape,
    TProgressContext extends z.ZodRawShape
>(config: {
    step: TProgressStep,
    progressDataSchema?: z.ZodObject<TProgressData>,
    progressContextSchema?: z.ZodObject<TProgressContext>
}
) => {
    const progressDataSchema = config.progressDataSchema || BaseProgressDataSchema;
    const progressContextSchema = config.progressContextSchema || BaseProgressStepContextSchema;

    return z.object({
        success: z.literal("progress"),
        data: progressDataSchema.merge(
            z.object({
                step: z.literal(config.step),
                context: progressContextSchema,
            })
        )
    });
}

export const BaseProgressDiscriminatedUnionSchemaFactory = <
    TErrorSchemaMap extends Record<string, z.ZodDiscriminatedUnionOption<"step">>
>(
    progressStepSchemaMap: TErrorSchemaMap
) => {
    const progressSchemas = makeDiscriminatedUnion("step", progressStepSchemaMap);
    return progressSchemas
}

export const BasePartialSchemaFactory = <TSuccessModel extends z.ZodRawShape, TErrorSchemaMap extends Record<string, z.ZodDiscriminatedUnionOption<"errorType">>>(
    successDataSchema: z.ZodObject<TSuccessModel>,
    errorSchemaMap: TErrorSchemaMap
) => {
    const errorSchemas = makeDiscriminatedUnion("errorType", errorSchemaMap);
    return z.object({
        success: z.literal("partial"),
        data: z.object({
            success: z.array(successDataSchema),
            error: z.array(errorSchemas),
        }),
    });
}

export const BasePartialProgressSchemaFactory = <
    TSuccessModel extends z.ZodRawShape,
    TErrorSchemaMap extends Record<string, z.ZodDiscriminatedUnionOption<"errorType">>,
    TProgressStepSchemaMap extends Record<string, z.ZodDiscriminatedUnionOption<"step">>
>(
    successDataSchema: z.ZodObject<TSuccessModel>,
    errorSchemaMap: TErrorSchemaMap,
    progressStepSchemaMap: TProgressStepSchemaMap
) => {
    const errorSchemas = makeDiscriminatedUnion("errorType", errorSchemaMap);
    const progressSchemas = makeDiscriminatedUnion("step", progressStepSchemaMap);
    return z.object({
        success: z.literal("partial-progress"),
        data: z.object({
            success: z.array(successDataSchema),
            error: z.array(errorSchemas),
            progress: z.array(progressSchemas),
        }),
    });
}

export const BaseStatusDiscriminatedUnionSchemaFactory = <
    TStatusSchemaTuple extends [z.ZodDiscriminatedUnionOption<"success">, ...z.ZodDiscriminatedUnionOption<"success">[]]
>(
    statusSchemaTuple: TStatusSchemaTuple
) => {
    return z.discriminatedUnion("success", statusSchemaTuple);
}

export type TBaseStatusDiscriminatedUnion<TStatusSchemaTuple extends [z.ZodDiscriminatedUnionOption<"success">, ...z.ZodDiscriminatedUnionOption<"success">[]]> = z.infer<
    ReturnType<typeof BaseStatusDiscriminatedUnionSchemaFactory<TStatusSchemaTuple>>
>;

// END : BASE MODELS



// VIEW MODELS (Infrastructure Layer)
export const BaseDiscriminatedViewModeSchemaFactory = <TMode extends string, TModelShape extends z.ZodRawShape>(
    mode: TMode,
    modelSchema: z.ZodObject<TModelShape>,
) => {
    return z.object({
        mode: z.literal(mode),
        data: modelSchema,
    });
}

export const BaseViewModelDiscriminatedUnionSchemaFactory = <
    TViewModesSchemaMap extends Record<string, z.ZodDiscriminatedUnionOption<"mode">>
>(
    viewModesSchemaMap: TViewModesSchemaMap
) => {
    return makeDiscriminatedUnion("mode", viewModesSchemaMap);
}

export type TBaseDiscriminatedViewModel<ViewModesSchemaMap extends Record<string, z.ZodDiscriminatedUnionOption<"mode">>> = z.infer<
    ReturnType<typeof BaseViewModelDiscriminatedUnionSchemaFactory<ViewModesSchemaMap>>
>;
// END : VIEW MODELS (Infrastructure Layer)


// PRIMARY OUTPUT PORTS
export type TBasePresenterConfig<
    TErrorTypes extends string | undefined,
    TProgressSteps extends string | undefined,
    TViewActionConfigMap extends { [key: string]: unknown },
    TViewModel
> = {
    schemas: {
        responseModel: z.ZodDiscriminatedUnion<"success", [z.ZodDiscriminatedUnionOption<"success">, ...z.ZodDiscriminatedUnionOption<"success">[]]>,
        viewModel: z.ZodDiscriminatedUnion<"mode", [z.ZodDiscriminatedUnionOption<"mode">, ...z.ZodDiscriminatedUnionOption<"mode">[]]>,
    },
    eventConfig?: (
        TErrorTypes extends string
        ? { [K in TErrorTypes as `errorType:${K}`]?: keyof TViewActionConfigMap }
        : object
    ) & (
        TProgressSteps extends string
        ? { [K in TProgressSteps as `step:${K}`]?: keyof TViewActionConfigMap }
        : object
    ),
    callbacks: {
        [K in keyof TViewActionConfigMap]: (data: TViewActionConfigMap[K]) => Promise<void> | void;
    },
    setViewModel: (viewModel: TViewModel) => void,
}

export type ExtractStatusModel<TResponseModel, TSuccess = boolean | "partial" | "progress" | "partial-progress"> = Extract<TResponseModel, { success: TSuccess }>;

export type ExtractHandledErrorTypes<
    TErrorTypes extends string | undefined,
    TMap extends object
> = TErrorTypes extends string
    ? {
        [K in TErrorTypes]: `errorType:${K}` extends keyof TMap ? K : never
    }[TErrorTypes]
    : never;

export type UnhandledErrorResponse<
    TErrorTypes extends string | undefined,
    TResponseModel,
    TMap extends object
> = Extract<
    TResponseModel,
    {
        success: false;
        errorType: Exclude<TErrorTypes, ExtractHandledErrorTypes<TErrorTypes, TMap>>;
    }
>;


export type TBaseResponseActionHandlerConfig<
    TErrorTypes extends string | undefined,
    TProgressSteps extends string | undefined,
    TViewModeActionConfigMap extends { [key: string]: unknown }
> = {
        [K in TErrorTypes as `errorType:${K}`]?: keyof TViewModeActionConfigMap
    } & {
        [K in TProgressSteps as `step:${K}`]?: keyof TViewModeActionConfigMap
    } 

export abstract class BasePresenter<
    TViewModes extends string,
    TViewModel extends { mode: TViewModes },
    TErrorTypes extends string | undefined,
    TProgressSteps extends string | undefined,
    TResponseModel extends { success: boolean | "partial" | "partial-progress" | "progress", errorType?: TErrorTypes, step?: TProgressSteps },
    TViewActionConfigMap extends { [key: string]: unknown }
> {
    config: TBasePresenterConfig<TErrorTypes, TProgressSteps, TViewActionConfigMap, TViewModel>;
    constructor(
        config: TBasePresenterConfig<TErrorTypes, TProgressSteps, TViewActionConfigMap, TViewModel>,
    ) {
        this.config = config;
    }

    abstract presentSuccess(response: Extract<TResponseModel, { success: true }>, currentViewModel: TViewModel): TViewModel;

    abstract presentError(
        response: UnhandledErrorResponse<TErrorTypes, TResponseModel, NonNullable<TBasePresenterConfig<TErrorTypes, TProgressSteps, TViewActionConfigMap, TViewModel>['eventConfig']>>,
        currentViewModel: TViewModel
    ): TViewModel;

    abstract getViewActionInputForError<K extends keyof TViewActionConfigMap, E extends Extract<TResponseModel, { success: false }>>(
        error: Extract<TResponseModel, { success: false }>,
        errorType: NonNullable<E['errorType']>,
        action: K
    ): TViewActionConfigMap[K];

    async present(response: TResponseModel, currentViewModel: TViewModel): Promise<void> {
        if (response.success === true) {
            const viewModel = this.presentSuccess(response as Extract<TResponseModel, { success: true }>, currentViewModel);
            this.config.setViewModel(viewModel);
        } else if (response.success === "partial") {
            // Handle partial response
            throw new Error("Partial response not implemented");
        } else if (response.success === "partial-progress") {
            // Handle partial progress response
            throw new Error("Partial progress response not implemented");
        } else if (response.success === "progress") {
            // Handle progress response
            throw new Error("Progress response not implemented");
        } else {
            // Handle error response
            const errorType = (response).errorType;
            const eventConfig = this.config?.eventConfig as Record<string, keyof TViewActionConfigMap | undefined>;
            if (errorType && eventConfig?.[`errorType:${errorType}`]) {
                const eventKey = eventConfig[`errorType:${errorType}`];
                if (eventKey === undefined) {
                    throw new Error(`Action key for error type ${String(errorType)} not found`);
                }
                const callback = this.config.callbacks?.[eventKey];

                if (!callback) {
                    throw new Error(`Callback for action ${String(eventKey)} not found`);
                }

                const input = this.getViewActionInputForError(
                    response as Extract<TResponseModel, { success: false }>,
                    errorType,
                    eventKey
                );

                await callback(input);
                const viewModel = this.presentError(response as Extract<TResponseModel, {
                    success: false;
                    errorType: Exclude<TErrorTypes, ExtractHandledErrorTypes<TErrorTypes, NonNullable<TBasePresenterConfig<TErrorTypes, TProgressSteps, TViewActionConfigMap, TViewModel>['eventConfig']>>>;
                }>,
                    currentViewModel);
                this.config.setViewModel(viewModel);
            } else {
                throw new Error("Error response not handled");
            }
        }
    }
}


