/* eslint-disable no-unused-vars */
import { z } from "zod";
import deepEqual from 'deep-equal-js';


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
    const errorDataSchema = BaseErrorDataSchemaFactory(config.schema).merge(
        z.object({
            errorType: z.literal(config.type),
        })
    )
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
    return z.object({
        success: z.literal(false),
        data: makeDiscriminatedUnion("errorType", { ...errorSchemasMap, ...CommonErrorSchemaMap })
    });
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

    return progressDataSchema.merge(
        z.object({
            step: z.literal(config.step),
            context: progressContextSchema,
        })
    )
}

export const BaseProgressDiscriminatedUnionSchemaFactory = <
    TErrorSchemaMap extends Record<string, z.ZodDiscriminatedUnionOption<"step">>
>(
    progressStepSchemaMap: TErrorSchemaMap
) => {
    const progressSchemas = makeDiscriminatedUnion("step", progressStepSchemaMap);
    return z.object({
        success: z.literal("progress"),
        data: progressSchemas
    });
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

export type TBarebonesStatusDiscriminatedUnion = {
    success: true
    data: object;
} | {
    success: false
    data: {
        operation: string;
        message: string;
        context: object;
        errorType: string;
    }
} | {
    success: "partial"
    data: {
        success: object[];
        error: {
            operation: string;
            message: string;
            context: object;
            errorType: string;
        }[]
    }
} | {
    success: "partial-progress"
    data: {
        success: object[];
        error: {
            operation: string;
            message: string;
            context: object;
            errorType: string;
        }[];
        progress: {
            step: string;
            context: object;
        }[];
    }
} | {
    success: "progress"
    data: {
        step: string;
        context: object;
    }
};
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

export type TBaseViewUtilities = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: (...args: any[]) => Promise<void> | void;
}
// PRIMARY OUTPUT PORTS
export type TBasePresenterConfig<
    TResponseModel extends TBarebonesStatusDiscriminatedUnion,
    TViewModel,
    TPageUtilities extends TBaseViewUtilities,
    TResponseMiddleware extends TBaseResponseResponseMiddleware<
        TResponseModel,
        TViewModel,
        TPageUtilities
    >,
> = {
    schemas: {
        responseModel: z.ZodDiscriminatedUnion<"success", [z.ZodDiscriminatedUnionOption<"success">, ...z.ZodDiscriminatedUnionOption<"success">[]]>,
        viewModel: z.ZodDiscriminatedUnion<"mode", [z.ZodDiscriminatedUnionOption<"mode">, ...z.ZodDiscriminatedUnionOption<"mode">[]]>,
    },
    middleware?: TResponseMiddleware,
    viewUtilities?: TBaseViewUtilities,
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
    TResponseModel extends ExtractStatusModel<TBarebonesStatusDiscriminatedUnion, false>,
    TMap extends object
> = {
    success: false;
    data: Exclude<
        Extract<TResponseModel, { success: false }>['data'],
        {
            errorType: ExtractHandledErrorTypes<Extract<TResponseModel, { success: false }>['data']['errorType'], TMap>;
        }>;
}

type ViewUtilityContext<TResponseModel, TViewModel> = {
    response: TResponseModel;
    currentViewModel: TViewModel;
    setViewModel: (currentViewModel: TViewModel, viewModel: TViewModel) => void;
};

type InjectContext<
    Fn,
    Context
> = Fn extends (...args: infer Args) => infer R
    ? (context: Context, callback: Fn) => R
    : never;

export type TBaseResponseResponseMiddleware<
    TResponseModel extends TBarebonesStatusDiscriminatedUnion,
    TViewModel,
    TResponseMiddleware extends { [key: string]: CallableFunction }
> = {
    [K in ExtractStatusModel<TResponseModel, false>['data']['errorType']as `errorType:${K}`]?: {
        [A in keyof TResponseMiddleware]?: InjectContext<TResponseMiddleware[A], ViewUtilityContext<ExtractStatusModel<TResponseModel, false>, TViewModel>>;
    }
} & {
        [K in ExtractStatusModel<TResponseModel, 'progress'>['data']['step']as `step:${K}`]?: {
            [A in keyof TResponseMiddleware]?: InjectContext<TResponseMiddleware[A], ViewUtilityContext<TResponseModel, TViewModel>>;
        }
    }

export abstract class BasePresenter<
    TResponseModel extends TBarebonesStatusDiscriminatedUnion,
    TViewModel,
    TPageUtilities extends TBaseViewUtilities,
    TResponseMiddleware extends TBaseResponseResponseMiddleware<
        TResponseModel,
        TViewModel,
        TPageUtilities
    >,
> {
    config: TBasePresenterConfig<TResponseModel, TViewModel, TPageUtilities, TResponseMiddleware>;
    setViewModel: (currentViewMode: TViewModel, viewModel: TViewModel) => Promise<void> | void;
    constructor(
        config: TBasePresenterConfig<TResponseModel, TViewModel, TPageUtilities, TResponseMiddleware>
    ) {
        this.config = config;
        this.setViewModel = (currentViewModel: TViewModel, viewModel: TViewModel) => {
            if (!deepEqual(currentViewModel, viewModel)) {
                this.config.setViewModel(viewModel);
            }
        };
    }

    abstract presentSuccess(
        response: ExtractStatusModel<TResponseModel, true>,
        currentViewModel: TViewModel | undefined
    ): TViewModel;


    abstract presentError(
        response: UnhandledErrorResponse<
            ExtractStatusModel<TResponseModel, false>,
            TResponseMiddleware
        >,
        currentViewModel: TViewModel | undefined
    ): TViewModel;


    async present(response: TResponseModel, currentViewModel: TViewModel | undefined): Promise<void> {
        let newViewModel: TViewModel | undefined = currentViewModel;
        if (response.success === true) {
            newViewModel = this.presentSuccess(response as Extract<TResponseModel, { success: true }>, currentViewModel);
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
            const errorType = response.data.errorType;
            const middleware = this.config?.middleware;
            if (middleware && errorType && middleware[`errorType:${errorType}`]) {
                const middlewareMapElement: Record<string, InjectContext<TPageUtilities[keyof TPageUtilities], ViewUtilityContext<TResponseModel, TViewModel>>> = middleware[`errorType:${errorType}`];
                if (middlewareMapElement !== undefined) {
                    // Execute the middleware actions for the error type
                    for (const actionKey in middlewareMapElement) {
                        const action = middlewareMapElement[actionKey];
                        const context: ViewUtilityContext<TResponseModel, TViewModel> = {
                            response: response as Extract<TResponseModel, { success: false }>,
                            currentViewModel: currentViewModel as TViewModel,
                            setViewModel: this.setViewModel
                        };
                        const fn = this.config.viewUtilities?.[actionKey];
                        if (!fn) {
                            console.error(`Callback for action ${String(actionKey)} not found`);
                            continue;
                        }
                        await action(context, fn);
                    }
                }
            } else {
            newViewModel = this.presentError(
                    response as UnhandledErrorResponse<Extract<TResponseModel, { success: false }>, TResponseMiddleware>,
                    currentViewModel
                );
            }
        }
        this.setViewModel(currentViewModel as TViewModel, newViewModel as TViewModel);
    }
}


