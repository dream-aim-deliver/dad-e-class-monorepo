import { useCaseModels } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';

const topicsMock: useCaseModels.TListTopicsSuccessResponse['data'] = {
    topics: [
        {
            id: 1,
            name: 'Branding and Identity',
            slug: 'branding-and-identity',
        },
        {
            id: 2,
            name: 'Graphic and Visual Design',
            slug: 'graphic-and-visual-design',
        },
        {
            id: 3,
            name: 'Motion Design and Animation',
            slug: 'motion-design-and-animation',
        },
        {
            id: 4,
            name: 'Sound Design and Editing',
            slug: 'sound-design-and-editing',
        },
        {
            id: 5,
            name: 'Digital Content and Social Media Strategy',
            slug: 'digital-content-and-social-media-strategy',
        },
        {
            id: 6,
            name: 'Web Design and Development',
            slug: 'web-design-and-development',
        },
        {
            id: 7,
            name: 'UI/UX Design',
            slug: 'ui-ux-design',
        },
        {
            id: 8,
            name: 'Visual Storytelling',
            slug: 'visual-storytelling',
        },
        {
            id: 9,
            name: 'Advertising Campaigns',
            slug: 'advertising-campaigns',
        },
        {
            id: 10,
            name: 'Key Visual Creation',
            slug: 'key-visual-creation',
        },
        {
            id: 11,
            name: 'Holistic Concept Development',
            slug: 'holistic-concept-development',
        },
        {
            id: 12,
            name: 'Photography and Editing',
            slug: 'photography-and-editing',
        },
        {
            id: 13,
            name: 'Prompting and AI Tools',
            slug: 'prompting-and-ai-tools',
        },
        {
            id: 14,
            name: 'Idea Generation and Brainstorming',
            slug: 'idea-generation-and-brainstorming',
        },
        {
            id: 15,
            name: 'Copywriting and Content Creation',
            slug: 'copywriting-and-content-creation',
        },
        {
            id: 16,
            name: 'Strategy and Concept Development',
            slug: 'strategy-and-concept-development',
        },
        {
            id: 17,
            name: 'Creative and Art Direction',
            slug: 'creative-and-art-direction',
        },
        {
            id: 18,
            name: 'Business Planning and Financing',
            slug: 'business-planning-and-financing',
        },
        {
            id: 19,
            name: 'Pitching and Presentation Skills',
            slug: 'pitching-and-presentation-skills',
        },
        {
            id: 20,
            name: 'Typography, Layout, and Composition',
            slug: 'typography-layout-and-composition',
        },
        {
            id: 21,
            name: 'Cross-Channel Marketing',
            slug: 'cross-channel-marketing',
        },
        {
            id: 22,
            name: 'Campaign Development',
            slug: 'campaign-development',
        },
        {
            id: 23,
            name: 'Infographics and Data Visualization',
            slug: 'infographics-and-data-visualization',
        },
        {
            id: 24,
            name: 'Packaging and Print Design',
            slug: 'packaging-and-print-design',
        },
        {
            id: 25,
            name: 'Film and Cinematography',
            slug: 'film-and-cinematography',
        },
    ],
};

const topicsMockGerman: useCaseModels.TListTopicsSuccessResponse['data'] = {
    topics: [
        {
            id: 1,
            name: 'Branding und Identität',
            slug: 'branding-and-identity',
        },
        {
            id: 2,
            name: 'Grafik- und Visualdesign',
            slug: 'graphic-and-visual-design',
        },
        {
            id: 3,
            name: 'Motion Design und Animation',
            slug: 'motion-design-and-animation',
        },
        {
            id: 4,
            name: 'Sound Design und Bearbeitung',
            slug: 'sound-design-and-editing',
        },
        {
            id: 5,
            name: 'Digitale Inhalte und Social Media Strategie',
            slug: 'digital-content-and-social-media-strategy',
        },
        {
            id: 6,
            name: 'Webdesign und Entwicklung',
            slug: 'web-design-and-development',
        },
        {
            id: 7,
            name: 'UI/UX Design',
            slug: 'ui-ux-design',
        },
        {
            id: 8,
            name: 'Visuelles Storytelling',
            slug: 'visual-storytelling',
        },
        {
            id: 9,
            name: 'Werbekampagnen',
            slug: 'advertising-campaigns',
        },
        {
            id: 10,
            name: 'Key Visual Erstellung',
            slug: 'key-visual-creation',
        },
        {
            id: 11,
            name: 'Ganzheitliche Konzeptentwicklung',
            slug: 'holistic-concept-development',
        },
        {
            id: 12,
            name: 'Fotografie und Bearbeitung',
            slug: 'photography-and-editing',
        },
        {
            id: 13,
            name: 'Prompting und KI-Tools',
            slug: 'prompting-and-ai-tools',
        },
        {
            id: 14,
            name: 'Ideenfindung und Brainstorming',
            slug: 'idea-generation-and-brainstorming',
        },
        {
            id: 15,
            name: 'Copywriting und Content-Erstellung',
            slug: 'copywriting-and-content-creation',
        },
        {
            id: 16,
            name: 'Strategie und Konzeptentwicklung',
            slug: 'strategy-and-concept-development',
        },
        {
            id: 17,
            name: 'Kreative und Art Direction',
            slug: 'creative-and-art-direction',
        },
        {
            id: 18,
            name: 'Geschäftsplanung und Finanzierung',
            slug: 'business-planning-and-financing',
        },
        {
            id: 19,
            name: 'Pitching und Präsentationsfähigkeiten',
            slug: 'pitching-and-presentation-skills',
        },
        {
            id: 20,
            name: 'Typografie, Layout und Komposition',
            slug: 'typography-layout-and-composition',
        },
        {
            id: 21,
            name: 'Cross-Channel Marketing',
            slug: 'cross-channel-marketing',
        },
        {
            id: 22,
            name: 'Kampagnenentwicklung',
            slug: 'campaign-development',
        },
        {
            id: 23,
            name: 'Infografiken und Datenvisualisierung',
            slug: 'infographics-and-data-visualization',
        },
        {
            id: 24,
            name: 'Verpackung und Printdesign',
            slug: 'packaging-and-print-design',
        },
        {
            id: 25,
            name: 'Film und Kinematographie',
            slug: 'film-and-cinematography',
        },
    ],
};

const topicsCriticalError: useCaseModels.TGetHomePageUseCaseErrorResponse = {
    success: false,
    data: {
        errorType: 'NotFoundError',
        message: 'Topics not found',
        operation: 'getTopics',
        context: {},
        trace: undefined,
    },
};

const topicsAuthError: useCaseModels.TGetHomePageUseCaseErrorResponse = {
    success: false,
    data: {
        errorType: 'AuthenticationError',
        message: 'You are not authorized to access this resource',
        operation: 'getTopics',
        context: {},
        trace: undefined,
        statusCode: 403,
    },
};

const topicsCriticalErrorGerman: useCaseModels.TGetHomePageUseCaseErrorResponse = {
    success: false,
    data: {
        errorType: 'NotFoundError',
        message: 'Themen nicht gefunden',
        operation: 'getTopics',
        context: {},
        trace: undefined,
    },
};

const topicsAuthErrorGerman: useCaseModels.TGetHomePageUseCaseErrorResponse = {
    success: false,
    data: {
        errorType: 'AuthenticationError',
        message: 'Sie sind nicht berechtigt, auf diese Ressource zuzugreifen',
        operation: 'getTopics',
        context: {},
        trace: undefined,
        statusCode: 403,
    },
};

export const listTopics = t.procedure
    .input(useCaseModels.ListTopicsRequestSchema)
    .query(async (opts): Promise<useCaseModels.TListTopicsUseCaseResponse> => {
        return {
            success: true,
            data: topicsMock,
        };
    });
