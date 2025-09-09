import { useCaseModels } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';

const togglePreCourseAssessmentMock: useCaseModels.TTogglePreCourseAssessmentSuccessResponse['data'] =
    {};

export const togglePreCourseAssessment = t.procedure
    .input(useCaseModels.TogglePreCourseAssessmentRequestSchema)
    .query(
        async (): Promise<useCaseModels.TTogglePreCourseAssessmentUseCaseResponse> => {
            return {
                success: true,
                data: togglePreCourseAssessmentMock,
            };
        },
    );
