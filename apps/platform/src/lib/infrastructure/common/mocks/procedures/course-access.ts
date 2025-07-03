import { useCaseModels } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';

const getCourseAccessMock: useCaseModels.TGetCourseAccessSuccessResponse['data'] =
    {
        roles: ['visitor'],
        isAssessmentCompleted: null,
    };

const getCourseAccessErrorMock: useCaseModels.TGetCourseAccessUseCaseErrorResponse =
    {
        success: false,
        data: {
            errorType: 'NotFound',
            message: 'Course not found',
            operation: 'getCourseAccess',
            context: {},
        },
    };

export const getCourseAccess = t.procedure
    .input(useCaseModels.GetCourseAccessRequestSchema)
    .query(async (): Promise<useCaseModels.TGetCourseAccessUseCaseResponse> => {
        return {
            success: true,
            data: getCourseAccessMock,
        };
    });
