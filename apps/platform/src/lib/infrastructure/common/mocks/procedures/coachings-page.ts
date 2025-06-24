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
