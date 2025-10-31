// Re-export from backend package - these are the source of truth
export {
    CreateCoachingSessionReviewRequestSchema,
    type TCreateCoachingSessionReviewRequest,
    CreateCoachingSessionReviewSuccessResponseSchema,
    type TCreateCoachingSessionReviewSuccessResponse,
    CreateCoachingSessionReviewErrorResponseSchema as CreateCoachingSessionReviewUseCaseErrorResponseSchema,
    type TCreateCoachingSessionReviewErrorResponse as TCreateCoachingSessionReviewUseCaseErrorResponse,
    CreateCoachingSessionReviewUseCaseResponseSchema,
    type TCreateCoachingSessionReviewUseCaseResponse,
} from '@dream-aim-deliver/e-class-cms-rest';