import { useCaseModels } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';

const getAssignmentMock: useCaseModels.TGetAssignmentSuccessResponse['data'] =
    {};

export const getAssignment = t.procedure
    .input(useCaseModels.GetAssignmentRequestSchema)
    .query(
        async (): Promise<useCaseModels.TGetAssignmentUseCaseResponse> => {
            return {
                success: true,
                data: getAssignmentMock,
            };
        },
    );

const passAssignmentMock: useCaseModels.TPassAssignmentSuccessResponse['data'] =
    {};

export const passAssignment = t.procedure
    .input(useCaseModels.PassAssignmentRequestSchema)
    .query(
        async (): Promise<useCaseModels.TPassAssignmentUseCaseResponse> => {
            return {
                success: true,
                data: passAssignmentMock,
            };
        },
    );

