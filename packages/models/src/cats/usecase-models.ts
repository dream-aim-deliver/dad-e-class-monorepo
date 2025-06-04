/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { z, ZodDiscriminatedUnion, ZodDiscriminatedUnionOption } from "zod";

export const ErrorResponseModelSchemaFactory = <TErrorType extends string, TErrorShape extends z.ZodRawShape>(config: {
    type: TErrorType;
    schema: z.ZodObject<TErrorShape>;
}) => {
    const errorDataSchema = z.object({
        success: z.literal(false),
        errorType: z.literal(config.type),
    }).merge(z.object({
        data: z.object({
            operation: z.string(),
            message: z.string(),
            context: z.record(z.any()).optional(),
        }).merge(config.schema),
    }));
    return errorDataSchema;
};


export function makeDiscriminatedUnion<
    Discriminator extends string,
    SchemaMap extends Record<string, ZodDiscriminatedUnionOption<Discriminator>>
>(
    discriminator: Discriminator,
    schemaMap: SchemaMap
): ZodDiscriminatedUnion<Discriminator, [SchemaMap[keyof SchemaMap], ...SchemaMap[keyof SchemaMap][]]> {
    const schemas = Object.values(schemaMap) as [SchemaMap[keyof SchemaMap], ...SchemaMap[keyof SchemaMap][]];
    return z.discriminatedUnion(discriminator, schemas);
}

// Example usage
export const ValidationErrorSchema = ErrorResponseModelSchemaFactory({
    type: "ValidationError",
    schema: z.object({
        message: z.string(),
        field: z.string().optional(),
    }),
});

export const AuthErrorSchema = ErrorResponseModelSchemaFactory({
    type: "AuthError",
    schema: z.object({
        message: z.string(),
        code: z.string().optional(),
    }),
});

const errorSchemasMap = {
    ValidationError: ValidationErrorSchema,
    AuthError: AuthErrorSchema,
};

export const UseCaseErrorResponseFactory = <
    SchemaMap extends Record<string, ZodDiscriminatedUnionOption<"errorType">>
>(
    errorSchemasMap: SchemaMap
) => {
    return makeDiscriminatedUnion("errorType", errorSchemasMap);
};