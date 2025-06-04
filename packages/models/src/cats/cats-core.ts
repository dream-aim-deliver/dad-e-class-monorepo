                                                               /* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { z } from "zod";

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

export const BaseModelDraftSchemaFactory = <TModel extends z.ZodRawShape>(
    modelSchema: z.ZodObject<TModel>
) => {
    return BaseModelDraftSchema.merge(modelSchema)
}

export type TBaseModelDraft<TModel extends z.ZodRawShape> = z.infer<ReturnType<typeof BaseModelDraftSchemaFactory<TModel>>>;

export const BaseModelCreatedSchemaFactory = <TModel extends z.ZodRawShape>(
    modelSchema: z.ZodObject<TModel>
) => {
    return BaseModelCreatedSchema.merge(modelSchema)
}

export type TBaseModelCreated<TModel extends z.ZodRawShape> = z.infer<ReturnType<typeof BaseModelCreatedSchemaFactory<TModel>>>;

export const BaseModelDeletedSchemaFactory = <TModel extends z.ZodRawShape>(
    modelSchema: z.ZodObject<TModel>
) => {
    return BaseModelDeletedSchema.merge(modelSchema)
}

export type TBaseModelDeleted<TModel extends z.ZodRawShape> = z.infer<ReturnType<typeof BaseModelDeletedSchemaFactory<TModel>>>;


export const BaseStatefulModelSchemaFactory = <TModel extends z.ZodRawShape>(
    modelDraftSchema: z.ZodObject<{ state: z.ZodLiteral<"draft"> } & TModel>,
    modelCreatedSchema: z.ZodObject<{ state: z.ZodLiteral<"created">; id: z.ZodString | z.ZodNumber; createdAt: z.ZodDate; updatedAt: z.ZodDate } & TModel>,
    modelDeletedSchema: z.ZodObject<{ state: z.ZodLiteral<"deleted">; id: z.ZodString | z.ZodNumber; createdAt: z.ZodDate; updatedAt: z.ZodDate; deletedAt: z.ZodDate } & TModel>
) => {
    return z.discriminatedUnion("state", [
        modelDraftSchema,
        modelCreatedSchema,
        modelDeletedSchema,
    ]);
}



// BASE MODELS 

export const BaseSuccessSchemaFactory = <TData extends z.ZodRawShape>(
    dataSchema: z.ZodObject<TData>,
) => {
    return z.object({
        success: z.literal(true),
        data: dataSchema,
    });
}

export type TBaseSuccess<TData extends z.ZodRawShape> = z.infer<
    ReturnType<typeof BaseSuccessSchemaFactory<TData>>
>;


export const BaseErrorContextSchemaFactory = <TErrorContext extends z.ZodRawShape>(
    errorContextSchema?: z.ZodObject<TErrorContext>,
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

export type TBaseErrorContext<TErrorContext extends z.ZodRawShape> = z.infer<
    ReturnType<typeof BaseErrorContextSchemaFactory<TErrorContext>>
>;


export const BaseErrorSchemaFactory = <TErrorData extends z.ZodRawShape, TErrorContext extends z.ZodRawShape>(
    errorDataSchema?: z.ZodObject<TErrorData>,
    errorContextSchema?: z.ZodObject<TErrorContext>,
) => {
    const errorContext = BaseErrorContextSchemaFactory(errorContextSchema);

    const baseErrorData = z.object({
        operation: z.string(),
        message: z.string(),
        context: errorContext
    })
    if (errorDataSchema) {
        // Merge the error data schema with the base error data schema
        return z.object({
            success: z.literal(false),
            data: baseErrorData.merge(errorDataSchema),
        })
    }
    // If no error data schema is provided, use the base error data schema
    return z.object({
        success: z.literal(false),
        data: baseErrorData,
    });
}


export type TBaseError<TErrorData extends z.ZodRawShape, TErrorContext extends z.ZodRawShape> = z.infer<
    ReturnType<typeof BaseErrorSchemaFactory<TErrorData, TErrorContext>>
>;

export const BaseErrorContextSchema = BaseErrorContextSchemaFactory();
export const BaseErrorSchema = BaseErrorSchemaFactory(BaseErrorContextSchema)


export const BaseProgressSchemaFactory = <TProgressSteps extends string>(
    config: Record<keyof TProgressSteps, z.ZodRawShape>
) => {
    const progressSteps = Object.keys(config) as TProgressSteps[];
    return z.object({
        success: z.literal("progress"),
        data: z.object({
            operation: z.string(),
            message: z.string(),
            step: z.enum(progressSteps as [TProgressSteps, ...TProgressSteps[]]),
            progress: z.number().int().min(0).max(100).optional(),
            context: BaseErrorContextSchema,
        }),
    });
}

export const BasePartialResponseSchemaFactory = <TSuccessModel extends z.ZodRawShape, TErrorModel extends z.ZodRawShape>(
    successModelSchema: z.ZodObject<TSuccessModel>,
    errorModelSchema: z.ZodObject<TErrorModel>
) => {
    return z.object({
        success: z.literal("partial"),
        data: z.object({
            success: z.array(successModelSchema),
            error: z.array(errorModelSchema).optional(),
        }),
    });
}

// END : BASE MODELS


// Usecase Models
export const BaseUseCaseErrorResponseTypesSchema = z.enum([
    "AuthError",
    "UnknownError",
    "ValidationError",
    "InternalError",
    "NotFoundError",
]);

export type TBaseUseCaseErrorResponseTypes = z.infer<typeof BaseUseCaseErrorResponseTypesSchema>;

export const UsecaseResponseModelSchemaFactory = <
    TSuccessModel extends z.ZodRawShape,
    TErrorTypes extends string = TBaseUseCaseErrorResponseTypes,
    TProgressSteps extends string = "initializing"
>(
    successModelSchema: z.ZodObject<TSuccessModel>,
    errorTypes: TErrorTypes[],
    progressTypes?: TProgressSteps[]
) => {
    const successSchema = z.object({
        success: z.literal(true),
        data: successModelSchema,
    });
    const errorDataSchema = z.object({
        type: z.enum(errorTypes as [TErrorTypes, ...TErrorTypes[]]),
    })
    const errorSchema = BaseErrorSchemaFactory<typeof errorDataSchema.shape, typeof BaseErrorContextSchema.shape>(errorDataSchema, BaseErrorContextSchema);
    
    const progressSchema = z.object({
        success: z.literal("progress"),
        data: z.object({
            operation: z.string(),
            message: z.string(),
            step: z.enum(progressTypes as [TProgressSteps, ...TProgressSteps[]]),
            progress: z.number().int().min(0).max(100).optional(),
            context: BaseErrorContextSchema,
        }),
    });

    const partialSchema = z.object({
        success: z.literal("partial"),
        data: z.object({
            success: z.array(successSchema["shape"].data),
            error: z.array(errorSchema["shape"].data),
        }),
    });

    const partialProgressSchema = z.object({
        success: z.literal("partial-progress"),
        data: z.object({
            success: z.array(successSchema["shape"].data),
            error: z.array(errorSchema["shape"].data),
            progress: z.array(progressSchema["shape"].data),
        }),
    });
    
    return z.discriminatedUnion("success", [
        successSchema,
        errorSchema,
        progressSchema,
        partialSchema,
        partialProgressSchema,
    ]);
}

export type TUsecaseResponseModel<TSuccessModel extends z.ZodRawShape, TErrorTypes extends string = TBaseUseCaseErrorResponseTypes, TProgressSteps extends string = "initializing"> = 
    ReturnType<typeof UsecaseResponseModelSchemaFactory<TSuccessModel, TErrorTypes, TProgressSteps>>

const testModel = z.object({
    id: z.string(),
    name: z.string(),
    createdAt: z.date(),
})
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const testUsecaseResponse = UsecaseResponseModelSchemaFactory<typeof testModel.shape, "AuthError" | "UnknownError" | "ValidationError", "checking-status" | "finalizing-payment">(
    testModel,
    ["AuthError", "UnknownError", "ValidationError"],
    ["checking-status", "finalizing-payment"]
);
type TTestUsecaseResponse = z.infer<typeof testUsecaseResponse>;

// Example usage
export const exampleResponse: TTestUsecaseResponse = {
    success: true,
    data: {
        id: "12345",
        name: "Test Usecase",
        createdAt: new Date(),
    },
};
// Example error response
export const exampleErrorResponse: TTestUsecaseResponse = {
    success: false,
    data: {
        operation: "test-operation",
        message: "An error occurred",
        type: "ValidationError",
        context: {
            digest: "error-digest",
        },
    },
};
// Example progress response
export const exampleProgressResponse: TTestUsecaseResponse = {
    success: "progress",
    data: {
        operation: "test-operation",
        message: "Operation is in progress",
        step: "checking-status",
        progress: 50,
        context: {
            digest: "progress-digest",
            additionalInfo: "Some additional info",
            requestId: "req-12345",
        },
    },
};
// End of example usage

// VIEW MODELS (Infrastructure Layer)
// export const ReactViewModelSchemaFactory = <TResponseModel extends z.ZodRawShape>(
//     responseModelSchema: z.ZodObject<TResponseModel>
// ) => {

// }
// END : VIEW MODELS (Infrastructure Layer)


// PRIMARY OUTPUT PORTS
export interface BasePresenterOutputPort<TSuccessModel extends z.ZodRawShape, TErrorModel extends z.ZodRawShape, TProgressModel extends z.ZodRawShape>  {
    presentSuccess: (response: { success: true; data: TSuccessModel }) => void;
    presentError: (response: { success: false; data: TErrorModel }) => void;
    presentProgress: (response: { success: "progress"; data: TProgressModel }) => void;
    presentPartial: (response: { success: "partial"; data: { success: TSuccessModel[]; error: TErrorModel[] } }) => void;
    presentPartialProgress: (response: { success: "partial-progress"; data: { success: TSuccessModel[]; error: TErrorModel[]; progress: TProgressModel[] } }) => void;
}

// End: PRIMARY OUTPUT PORTS



