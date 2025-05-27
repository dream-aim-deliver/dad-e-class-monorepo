import { homePage } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';

const homePageMock: homePage.THomePage = {
    banner: {
        description:
            'Platform introduction. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis tellus. Nullam quis imperdiet augue. Vestibulum auctor ornare leo, non suscipit magna interdum eu.',
        title: "Platform's Title, short and powerful",
        videoId: 'o017yCZbw87zC9xDoy1Bl02FsbCBXuSdx6xPbkF01sW02IU',
        thumbnailUrl:
            'https://res.cloudinary.com/dnhiejjyu/image/upload/v1748006627/hb-thumb_eabema.png',
    },
    carousel: [
        {
            description:
                'Du hast ein Konzept und konkrete Vorstellungen davon, was du umsetzen möchtest. Entwickle mit uns dein Branding, dein CI/CD, deine Website oder dein Werbefilm für Social Media. Wähle nur die Massnahmen, die du wirklich brauchst.',
            title: 'Visualisierung',
            imageUrl:
                'https://images.unsplash.com/photo-1543269866-8cd2dfe969d6?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            buttonText: 'from CHF 3140',
            buttonUrl: '',
            badge: 'Package',
        },
        {
            description:
                'Ideal für Firmen oder Stellen, die einen freien und individuellen Zugang zu unserer Plattform brauchen und diese für einen längere Zeit nutzten wollen.',
            title: 'Enterprise',
            imageUrl:
                'https://images.unsplash.com/photo-1580742432710-d3c3703559a9?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            buttonText: 'Inquiries',
            buttonUrl: '',
            badge: undefined,
        },
        {
            description:
                'Our professionals provide support where they are needed. With workshops, tips and “learning by doing” we can reach our goals together more quickly.',
            title: 'Coaching on Demand',
            imageUrl:
                'https://images.unsplash.com/photo-1626105985445-6430a31f6f96?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            buttonText: 'Find a coach (ab CHF 90)',
            buttonUrl: '',
            badge: undefined,
        },
        {
            description:
                'Ideal für Firmen oder Stellen, die einen freien und individuellen Zugang zu unserer Plattform brauchen und diese für einen längere Zeit nutzten wollen.',
            title: 'Enterprise',
            imageUrl:
                'https://images.unsplash.com/photo-1580742432710-d3c3703559a9?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            buttonText: 'Inquiries',
            buttonUrl: '',
            badge: undefined,
        },
        {
            description:
                'Our professionals provide support where they are needed. With workshops, tips and “learning by doing” we can reach our goals together more quickly.',
            title: 'Coaching on Demand',
            imageUrl:
                'https://images.unsplash.com/photo-1626105985445-6430a31f6f96?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            buttonText: 'Find a coach (ab CHF 90)',
            buttonUrl: '',
            badge: undefined,
        },
    ],
    coachingOnDemand: {
        description: '',
        title: '',
        desktopImageUrl: '',
        tabletImageUrl: '',
        mobileImageUrl: '',
    },
    accordion: {
        title: '',
        showNumbers: false,
        items: [],
    },
};

export const getHomePage = t.procedure.query(
    async (opts): Promise<homePage.THomePage> => {
        // Locale will be received from context
        await new Promise((resolve) => setTimeout(resolve, 250));
        return homePageMock;
    },
);
