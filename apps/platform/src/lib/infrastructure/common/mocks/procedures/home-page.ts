import { homePage, topic } from '@maany_shr/e-class-models';
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
        description:
            'Are you looking for someone to exchange ideas with on equal footing, or do you want to learn new skills? Do you need support in choosing the right tools or advice for your project? Our industry experts are ready to help you succeed.',
        title: 'Coaching on demand',
        desktopImageUrl:
            'https://res.cloudinary.com/dnhiejjyu/image/upload/v1748364855/Frame_4353_zxdyos.png',
        tabletImageUrl:
            'https://res.cloudinary.com/dnhiejjyu/image/upload/v1748364854/tablet_rdfwwe.png',
        mobileImageUrl:
            'https://res.cloudinary.com/dnhiejjyu/image/upload/v1748364853/mobile_s5v6sk.png',
    },
    accordion: {
        title: '',
        showNumbers: false,
        items: [],
    },
};

const topicsMock: topic.TTopic[] = [
    {
        name: 'Branding and Identity',
        url: '/topics/branding-and-identity',
    },
    {
        name: 'Graphic and Visual Design',
        url: '/topics/graphic-and-visual-design',
    },
    {
        name: 'Motion Design and Animation',
        url: '/topics/motion-design-and-animation',
    },
    {
        name: 'Sound Design and Editing',
        url: '/topics/sound-design-and-editing',
    },
    {
        name: 'Digital Content and Social Media Strategy',
        url: '/topics/digital-content-and-social-media-strategy',
    },
    {
        name: 'Web Design and Development',
        url: '/topics/web-design-and-development',
    },
    {
        name: 'UI/UX Design',
        url: '/topics/ui-ux-design',
    },
    {
        name: 'Visual Storytelling',
        url: '/topics/visual-storytelling',
    },
    {
        name: 'Advertising Campaigns',
        url: '/topics/advertising-campaigns',
    },
    {
        name: 'Key Visual Creation',
        url: '/topics/key-visual-creation',
    },
    {
        name: 'Holistic Concept Development',
        url: '/topics/holistic-concept-development',
    },
    {
        name: 'Photography and Editing',
        url: '/topics/photography-and-editing',
    },
    {
        name: 'Prompting and AI Tools',
        url: '/topics/prompting-and-ai-tools',
    },
    {
        name: 'Idea Generation and Brainstorming',
        url: '/topics/idea-generation-and-brainstorming',
    },
    {
        name: 'Copywriting and Content Creation',
        url: '/topics/copywriting-and-content-creation',
    },
    {
        name: 'Strategy and Concept Development',
        url: '/topics/strategy-and-concept-development',
    },
    {
        name: 'Creative and Art Direction',
        url: '/topics/creative-and-art-direction',
    },
    {
        name: 'Business Planning and Financing',
        url: '/topics/business-planning-and-financing',
    },
    {
        name: 'Pitching and Presentation Skills',
        url: '/topics/pitching-and-presentation-skills',
    },
    {
        name: 'Typography, Layout, and Composition',
        url: '/topics/typography-layout-and-composition',
    },
    {
        name: 'Cross-Channel Marketing',
        url: '/topics/cross-channel-marketing',
    },
    {
        name: 'Campaign Development',
        url: '/topics/campaign-development',
    },
    {
        name: 'Infographics and Data Visualization',
        url: '/topics/infographics-and-data-visualization',
    },
    {
        name: 'Packaging and Print Design',
        url: '/topics/packaging-and-print-design',
    },
    {
        name: 'Film and Cinematography',
        url: '/topics/film-and-cinematography',
    },
];

export const getHomePage = t.procedure.query(
    async (opts): Promise<homePage.THomePage> => {
        // Locale will be received from context
        await new Promise((resolve) => setTimeout(resolve, 250));
        return homePageMock;
    },
);

export const getHomePageTopics = t.procedure.query(
    async (opts): Promise<topic.TTopic[]> => {
        // The real implementation might build URLs from topic names (kebab-case)
        await new Promise((resolve) => setTimeout(resolve, 250));
        return topicsMock;
    },
);
