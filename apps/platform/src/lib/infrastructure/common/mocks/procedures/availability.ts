import { useCaseModels } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';

const addAvailabilityMock: useCaseModels.TAddAvailabilitySuccessResponse['data'] =
    {};

export const addAvailability = t.procedure
    .input(useCaseModels.AddAvailabilityRequestSchema)
    .mutation(
        async (): Promise<useCaseModels.TAddAvailabilityUseCaseResponse> => {
            return {
                success: true,
                data: addAvailabilityMock,
            };
        },
    );

const deleteAvailabilityMock: useCaseModels.TDeleteAvailabilitySuccessResponse['data'] =
    {};

export const deleteAvailability = t.procedure
    .input(useCaseModels.DeleteAvailabilityRequestSchema)
    .mutation(
        async (): Promise<useCaseModels.TDeleteAvailabilityUseCaseResponse> => {
            return {
                success: true,
                data: deleteAvailabilityMock,
            };
        },
    );