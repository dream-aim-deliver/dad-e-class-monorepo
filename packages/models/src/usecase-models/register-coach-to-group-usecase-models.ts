import { z } from 'zod';

// TODO: Replace with actual schema from @dream-aim-deliver/e-class-cms-rest when backend is ready
export const RegisterCoachToGroupRequestSchema = z.object({
    groupId: z.string(),
    coachId: z.string(),
});

export const RegisterCoachToGroupSuccessResponseSchema = z.object({
    success: z.literal(true),
    data: z.object({
        groupId: z.string(),
        coachId: z.string(),
        registeredAt: z.string(),
    }),
    message: z.string(),
});

export const RegisterCoachToGroupErrorResponseSchema = z.object({
    success: z.literal(false),
    data: z.object({
        message: z.string(),
        context: z.record(z.any()).optional(),
    }),
});

export const RegisterCoachToGroupResponseSchema = z.union([
    RegisterCoachToGroupSuccessResponseSchema,
    RegisterCoachToGroupErrorResponseSchema,
]);

export type TRegisterCoachToGroupRequest = z.infer<typeof RegisterCoachToGroupRequestSchema>;
export type TRegisterCoachToGroupSuccessResponse = z.infer<typeof RegisterCoachToGroupSuccessResponseSchema>;
export type TRegisterCoachToGroupErrorResponse = z.infer<typeof RegisterCoachToGroupErrorResponseSchema>;
export type TRegisterCoachToGroupResponse = z.infer<typeof RegisterCoachToGroupResponseSchema>;