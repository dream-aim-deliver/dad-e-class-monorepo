// Re-export from backend package - these are the source of truth
export {
    ListCoachesRequestSchema,
    type TListCoachesRequest,
    ListCoachesSuccessResponseSchema,
    type TListCoachesSuccessResponse,
    ListCoachesErrorResponseSchema as ListCoachesUseCaseErrorResponseSchema,
    type TListCoachesErrorResponse as TListCoachesUseCaseErrorResponse,
    ListCoachesUseCaseResponseSchema,
    type TListCoachesUseCaseResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
