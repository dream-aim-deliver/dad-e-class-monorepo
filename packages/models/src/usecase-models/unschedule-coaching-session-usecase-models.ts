// Re-export from backend package - these are the source of truth
export {
    UnscheduleCoachingSessionRequestSchema,
    type TUnscheduleCoachingSessionRequest,
    UnscheduleCoachingSessionSuccessResponseSchema,
    type TUnscheduleCoachingSessionSuccessResponse,
    UnscheduleCoachingSessionErrorResponseSchema as UnscheduleCoachingSessionUseCaseErrorResponseSchema,
    type TUnscheduleCoachingSessionErrorResponse as TUnscheduleCoachingSessionUseCaseErrorResponse,
    UnscheduleCoachingSessionUseCaseResponseSchema,
    type TUnscheduleCoachingSessionUseCaseResponse,
} from '@dream-aim-deliver/e-class-cms-rest';