import { z } from 'zod';
import { auth } from "@maany_shr/e-class-models";

export const GetSessionSuccessDTO = z.object({
    success: z.literal(true),
    data: auth.SessionSchema 
})

export const GetSessionErrorDTO = z.object({
    success: z.literal(false),
    data: z.object({
        name: z.string(),
        code: z.number(),
        message: z.string(),
        context: z.object({
            
        }),
    })
})

export const GetSessionDTOSchema = z.discriminatedUnion("success", [
    GetSessionSuccessDTO,
    GetSessionErrorDTO,
])

export type TGetSessionDTO = z.infer<typeof GetSessionDTOSchema>


export const ExtractJWTSuccessDTO = z.object({
    success: z.literal(true),
    data: z.object({
        idToken: z.string(),
        accessToken: z.string(),
    })
})

export const ExtractJWTErrorDTO = z.object({
    success: z.literal(false),
    data: z.object({
        name: z.string(),
        code: z.number(),
        message: z.string(),
        context: z.any(),
    })
})

export const ExtractJWTDTOSchema = z.discriminatedUnion("success", [
    ExtractJWTSuccessDTO,
    ExtractJWTErrorDTO,
])

export type TExtractJWTDTO = z.infer<typeof ExtractJWTDTOSchema>