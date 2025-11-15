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
    course: {
        id: 1,
        slug: 'mock-course',
        title: 'Mock Course',
        language: {
            id: 1,
            code: 'en',
            name: 'English',
            state: 'created' as const,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    },
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
                        course: {
                            id: 2,
                            slug: 'student-course',
                            title: 'Student Course',
                            language: {
                                id: 1,
                                code: 'en',
                                name: 'English',
                                state: 'created' as const,
                                createdAt: new Date(),
                                updatedAt: new Date(),
                            },
                        },
                        roles: ['visitor', 'student'],
                        isAssessmentCompleted: false,
                    },
                };
            }

            if (slug === 'progress-course') {
                return {
                    success: true,
                    data: {
                        course: {
                            id: 3,
                            slug: 'progress-course',
                            title: 'Progress Course',
                            language: {
                                id: 1,
                                code: 'en',
                                name: 'English',
                                state: 'created' as const,
                                createdAt: new Date(),
                                updatedAt: new Date(),
                            },
                        },
                        roles: ['visitor', 'student'],
                        isAssessmentCompleted: true,
                    },
                };
            }

            if (slug === 'coach-course') {
                return {
                    success: true,
                    data: {
                        course: {
                            id: 4,
                            slug: 'coach-course',
                            title: 'Coach Course',
                            language: {
                                id: 1,
                                code: 'en',
                                name: 'English',
                                state: 'created' as const,
                                createdAt: new Date(),
                                updatedAt: new Date(),
                            },
                        },
                        roles: ['visitor', 'student', 'coach'],
                        isAssessmentCompleted: null,
                    },
                };
            }

            if (slug === 'admin-course') {
                return {
                    success: true,
                    data: {
                        course: {
                            id: 5,
                            slug: 'admin-course',
                            title: 'Admin Course',
                            language: {
                                id: 1,
                                code: 'en',
                                name: 'English',
                                state: 'created' as const,
                                createdAt: new Date(),
                                updatedAt: new Date(),
                            },
                        },
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
