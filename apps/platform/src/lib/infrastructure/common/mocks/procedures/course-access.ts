import {
    GetCourseAccessRequestSchema,
    GetCourseAccessSuccessResponseSchema,
    TGetCourseAccessErrorResponse,
    TGetCourseAccessUseCaseResponse,
} from '@dream-aim-deliver/e-class-cms-rest';
import { t } from '../trpc-setup';
import { z } from 'zod';

type TGetCourseAccessSuccessResponse = z.infer<
    typeof GetCourseAccessSuccessResponseSchema
>;

const getCourseAccessMock: TGetCourseAccessSuccessResponse['data'] =
{
    roles: ['visitor'],
    isAssessmentCompleted: null,
};

const getCourseAccessErrorMock: TGetCourseAccessErrorResponse =
{
    success: false,
    data: {
        errorType: 'NotFoundError',
        message: 'Course not found',
        operation: 'getCourseAccess',
        context: {},
    },
};

export const getCourseAccess = t.procedure
    .input(GetCourseAccessRequestSchema)
    .query(
        async (
            opts,
        ): Promise<TGetCourseAccessUseCaseResponse> => {
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
                        statusCode: 403,
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

            if (slug === 'coach-course') {
                return {
                    success: true,
                    data: {
                        roles: ['visitor', 'student', 'coach'],
                        isAssessmentCompleted: null,
                    },
                };
            }

            if (slug === 'admin-course') {
                return {
                    success: true,
                    data: {
                        roles: ['visitor', 'student', 'coach', 'admin'],
                        isAssessmentCompleted: null,
                    },
                };
            }

            return {
                success: true,
                data: getCourseAccessMock,
            };
        },
    );
