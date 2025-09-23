import { useCaseModels } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';

const sendAssignmentReplyMock: useCaseModels.TSendAssignmentReplySuccessResponse['data'] =
    {};

export const sendAssignmentReply = t.procedure
    .input(useCaseModels.SendAssignmentReplyRequestSchema)
    .mutation(
        async (): Promise<useCaseModels.TSendAssignmentReplyUseCaseResponse> => {
            return {
                success: true,
                data: sendAssignmentReplyMock,
            };
        },
    );
