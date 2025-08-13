import { useCaseModels } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';

const createCourseMockSuccess: useCaseModels.TCreateCourseSuccessResponse['data'] =
    {};

const createCourseMockInvalid: useCaseModels.TCreateCourseUseCaseErrorResponse =
    {
        success: false,
        data: {
            errorType: 'ValidationError',
            message: 'Invalid course data provided',
            operation: 'createCourse',
            context: {},
            trace: undefined,
        },
    };

const createCourseMockKaboom: useCaseModels.TCreateCourseUseCaseErrorResponse =
    {
        success: false,
        data: {
            errorType: 'UnknownError',
            message: 'An unexpected error occurred while creating the course',
            operation: 'createCourse',
            context: {},
            trace: undefined,
        },
    };

export const createCourse = t.procedure
    .input(useCaseModels.CreateCourseRequestSchema)
    .mutation(async (): Promise<useCaseModels.TCreateCourseUseCaseResponse> => {
        return {
            success: true,
            data: createCourseMockSuccess,
        };
    });
