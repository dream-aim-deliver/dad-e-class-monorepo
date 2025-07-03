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
    .query(
        async (
            opts,
        ): Promise<useCaseModels.TGetCourseAccessUseCaseResponse> => {
            const slug = opts.input.courseSlug;

            if (slug === 'missing-course') {
                return getCourseAccessErrorMock;
            }

            if (slug === 'private-course') {
                return {
                    success: false,
                    data: {
                        errorType: 'AuthenticationError',
                        message:
                            'Could not authenticate user for course access',
                        operation: 'getCourseAccess',
                        context: {},
                    },
                };
            }

            if (slug === 'student-course') {
                return {
                    success: true,
                    data: {
                        roles: ['visitor', 'student'],
                        isAssessmentCompleted: false,
                    },
                };
            }

            if (slug === 'progress-course') {
                return {
                    success: true,
                    data: {
                        roles: ['visitor', 'student'],
                        isAssessmentCompleted: true,
                    },
                };
            }

            return {
                success: true,
                data: getCourseAccessMock,
            };
        },
    );
