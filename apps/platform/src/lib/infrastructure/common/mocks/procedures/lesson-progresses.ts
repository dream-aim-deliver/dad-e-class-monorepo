import { useCaseModels } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';

const submitLessonProgressesMock: useCaseModels.TSubmitLessonProgressesSuccessResponse['data'] =
    {};

export const submitLessonProgresses = t.procedure
    .input(useCaseModels.SubmitLessonProgressesRequestSchema)
    .mutation(
        async (): Promise<useCaseModels.TSubmitLessonProgressesUseCaseResponse> => {
            return {
                success: true,
                data: submitLessonProgressesMock,
            };
        },
    );
