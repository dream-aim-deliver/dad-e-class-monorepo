import { useCaseModels } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';

const submitAssessmentProgressMock: useCaseModels.TSubmitAssessmentProgressSuccessResponse['data'] =
    {};

export const submitAssessmentProgress = t.procedure
    .input(useCaseModels.SubmitAssessmentProgressRequestSchema)
    .mutation(
        async (
            opts,
        ): Promise<useCaseModels.TSubmitAssessmentProgressUseCaseResponse> => {
            return {
                success: true,
                data: submitAssessmentProgressMock,
            };
        },
    );
