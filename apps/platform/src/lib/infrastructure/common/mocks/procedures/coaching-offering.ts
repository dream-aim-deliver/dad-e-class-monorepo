import { useCaseModels } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';

const offeringsMock: useCaseModels.TListCoachingOfferingsSuccessResponse['data'] =
    {
        offerings: [
            {
                id: 1,
                name: 'Quick feedback',
                duration: 10,
                price: 10,
                currency: 'CHF',
                description:
                    'A quick feedback session to discuss your current challenges and get some immediate advice.',
            },
            {
                id: 2,
                name: 'Quick sprint',
                duration: 20,
                price: 20,
                currency: 'CHF',
                description:
                    'A short sprint to help you get started on your project or overcome a specific obstacle.',
            },
            {
                id: 3,
                name: 'Normal Sprint',
                duration: 30,
                price: 30,
                currency: 'CHF',
                description:
                    'A standard coaching session to help you make progress on your project or improve your skills.',
            },
            {
                id: 4,
                name: 'Full immersion',
                duration: 60,
                price: 60,
                currency: 'CHF',
                description:
                    'An in-depth coaching session to fully immerse yourself in a topic, project, or skill development.',
            },
            {
                id: 5,
                name: '1/2 day workshop',
                duration: 240,
                price: 240,
                currency: 'CHF',
                description:
                    'A half-day workshop to dive deep into a specific topic, providing hands-on experience and practical insights.',
            },
        ],
    };

export const listCoachingOfferings = t.procedure
    .input(useCaseModels.ListCoachingOfferingsRequestSchema)
    .query(
        async (
            opts,
        ): Promise<useCaseModels.TListCoachingOfferingsUseCaseResponse> => {
            return {
                success: true,
                data: offeringsMock,
            };
        },
    );
