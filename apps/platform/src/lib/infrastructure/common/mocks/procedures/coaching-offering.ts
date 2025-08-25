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

const offeringsMockGerman: useCaseModels.TListCoachingOfferingsSuccessResponse['data'] =
    {
        offerings: [
            {
                id: 1,
                name: 'Schnelles Feedback',
                duration: 10,
                price: 10,
                currency: 'CHF',
                description:
                    'Eine schnelle Feedback-Sitzung, um Ihre aktuellen Herausforderungen zu besprechen und sofortige Beratung zu erhalten.',
            },
            {
                id: 2,
                name: 'Kurzer Sprint',
                duration: 20,
                price: 20,
                currency: 'CHF',
                description:
                    'Ein kurzer Sprint, um Ihnen den Einstieg in Ihr Projekt zu erleichtern oder ein spezifisches Hindernis zu überwinden.',
            },
            {
                id: 3,
                name: 'Normaler Sprint',
                duration: 30,
                price: 30,
                currency: 'CHF',
                description:
                    'Eine Standard-Coaching-Sitzung, um Ihnen beim Fortschritt Ihres Projekts oder der Verbesserung Ihrer Fähigkeiten zu helfen.',
            },
            {
                id: 4,
                name: 'Vollständige Vertiefung',
                duration: 60,
                price: 60,
                currency: 'CHF',
                description:
                    'Eine tiefgreifende Coaching-Sitzung, um sich vollständig in ein Thema, Projekt oder die Entwicklung von Fähigkeiten zu vertiefen.',
            },
            {
                id: 5,
                name: 'Halbtägiger Workshop',
                duration: 240,
                price: 240,
                currency: 'CHF',
                description:
                    'Ein halbtägiger Workshop, um tief in ein spezifisches Thema einzutauchen und praktische Erfahrungen sowie Einblicke zu sammeln.',
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
