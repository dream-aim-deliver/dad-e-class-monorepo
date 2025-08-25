import { useCaseModels } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';

const coachingPageMock: useCaseModels.TGetCoachingPageSuccessResponse['data'] =
    {
        title: 'Coachings tailored to you.',
        description:
            'Are you looking for someone to exchange ideas with on equal footing, or do you want to learn new skills?  Do you need support in choosing the right tools or advice for your project? Our industry experts are ready to help you succeed.  Choose the right coaching for you: for example, an Action Sprint if you want our professionals to handle the implementation, or a Ping-Pong for quick, targeted feedback.',
        banner: {
            title: 'Share Your Skills and Earn: Start Coaching Now',
            description:
                'Are you passionate about sharing your expertise and helping others advance their careers while earning income? Join our community of coaches and make a real impact—whether you want to create your own course or offer one-on-one coaching, you have the freedom to choose how you contribute and grow. Take the leap and turn your skills into a rewarding opportunity today!',
            buttonText: 'Become a coach',
            buttonLink: '/become-a-coach',
            imageUrl:
                'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
        },
    };

const coachingPageMockGerman: useCaseModels.TGetCoachingPageSuccessResponse['data'] = 
    {
        title: 'Auf Sie zugeschnittene Coachings.',
        description:
            'Suchen Sie einen Austausch auf Augenhöhe oder möchten Sie neue Fähigkeiten erlernen? Benötigen Sie Unterstützung bei der Auswahl der richtigen Tools oder Beratung für Ihr Projekt? Unsere Branchenexperten unterstützen Sie gerne beim Erfolg. Wählen Sie das passende Coaching für sich: zum Beispiel einen Action Sprint, wenn unsere Profis die Umsetzung übernehmen, oder ein Ping-Pong für schnelles, zielgerichtetes Feedback.',
        banner: {
            title: 'Teilen Sie Ihre Fähigkeiten und verdienen Sie: Beginnen Sie jetzt mit dem Coaching',
            description:
                'Teilen Sie Ihr Fachwissen leidenschaftlich gerne und unterstützen Sie andere dabei, ihre Karriere voranzutreiben und gleichzeitig Geld zu verdienen? Werden Sie Teil unserer Coach-Community und leisten Sie einen echten Beitrag – ob Sie Ihren eigenen Kurs erstellen oder Einzelcoaching anbieten möchten – Sie haben die Freiheit, Ihren Beitrag zu leisten und sich weiterzuentwickeln. Wagen Sie den Sprung und nutzen Sie Ihre Fähigkeiten noch heute!',
            buttonText: 'Werden Sie Trainer',
            buttonLink: '/become-a-coach',
            imageUrl:
                'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
        },
    };

export const getCoachingPage = t.procedure
    .input(useCaseModels.GetCoachingPageRequestSchema)
    .query<useCaseModels.TGetCoachingPageSuccessResponse>(() => {
        return {
            success: true,
            data: coachingPageMock,
        };
    });
