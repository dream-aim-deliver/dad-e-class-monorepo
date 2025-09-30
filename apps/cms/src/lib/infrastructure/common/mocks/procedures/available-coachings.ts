import { useCaseModels } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';

const availableCoachings: useCaseModels.TListAvailableCoachingsSuccessResponse['data'] =
    {
        offerings: [
            {
                id: 1,
                name: 'Quick feedback',
                duration: 10,
            },
            {
                id: 2,
                name: 'Quick sprint',
                duration: 20,
            },
            {
                id: 4,
                name: 'Full immersion',
                duration: 60,
            },
            {
                id: 5,
                name: '1/2 day workshop',
                duration: 240,
            },
        ],
    };

const availableCoachingsGerman: useCaseModels.TListAvailableCoachingsSuccessResponse['data'] =
    {
        offerings: [
            {
                id: 1,
                name: 'Schnelle Rückmeldung',
                duration: 10,
            },
            {
                id: 2,
                name: 'Schneller Sprint',
                duration: 20,
            },
            {
                id: 4,
                name: 'Volles Eintauchen',
                duration: 60,
            },
            {
                id: 5,
                name: '1/2-tägiger Workshop',
                duration: 240,
            },
        ],
    };

export const listAvailableCoachings = t.procedure
    .input(useCaseModels.ListAvailableCoachingsRequestSchema)
    .query(
        async (): Promise<useCaseModels.TListAvailableCoachingsUseCaseResponse> => {
            return {
                success: true,
                data: availableCoachings,
            };
        },
    );
