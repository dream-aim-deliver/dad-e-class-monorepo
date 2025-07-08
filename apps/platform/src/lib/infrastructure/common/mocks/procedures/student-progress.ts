import { useCaseModels } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';

const getStudentProgressMock: useCaseModels.TGetStudentProgressSuccessResponse['data'] =
    {
        progressPercent: 75,
        isCompleted: false,
    };

export const getStudentProgress = t.procedure
    .input(useCaseModels.GetStudentProgressRequestSchema)
    .query(
        async (): Promise<useCaseModels.TGetStudentProgressUseCaseResponse> => {
            return {
                success: true,
                data: getStudentProgressMock,
            };
        },
    );
