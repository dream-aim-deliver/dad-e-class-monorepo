import { useCaseModels } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';

const offersPageOutlineMock: useCaseModels.TGetOffersPageOutlineSuccessResponse['data'] =
    {
        title: 'Offers Tailored to You',
        description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    };

export const getOffersPageOutline = t.procedure
    .input(useCaseModels.GetOffersPageOutlineRequestSchema)
    .query(
        async (
            opts,
        ): Promise<useCaseModels.TGetOffersPageOutlineUseCaseResponse> => {
            return {
                success: true,
                data: offersPageOutlineMock,
            };
        },
    );
