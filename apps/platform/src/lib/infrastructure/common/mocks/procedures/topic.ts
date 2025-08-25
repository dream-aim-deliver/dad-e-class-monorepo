import { useCaseModels } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';

const topicsMock: useCaseModels.TListTopicsSuccessResponse['data'] = {
    topics: [
        {
            name: 'Branding and Identity',
            slug: 'branding-and-identity',
        },
        {
            name: 'Graphic and Visual Design',
            slug: 'graphic-and-visual-design',
        },
        {
            name: 'Motion Design and Animation',
            slug: 'motion-design-and-animation',
        },
        {
            name: 'Sound Design and Editing',
            slug: 'sound-design-and-editing',
        },
        {
            name: 'Digital Content and Social Media Strategy',
            slug: 'digital-content-and-social-media-strategy',
        },
        {
            name: 'Web Design and Development',
            slug: 'web-design-and-development',
        },
        {
            name: 'UI/UX Design',
            slug: 'ui-ux-design',
        },
        {
            name: 'Visual Storytelling',
            slug: 'visual-storytelling',
        },
        {
            name: 'Advertising Campaigns',
            slug: 'advertising-campaigns',
        },
        {
            name: 'Key Visual Creation',
            slug: 'key-visual-creation',
        },
        {
            name: 'Holistic Concept Development',
            slug: 'holistic-concept-development',
        },
        {
            name: 'Photography and Editing',
            slug: 'photography-and-editing',
        },
        {
            name: 'Prompting and AI Tools',
            slug: 'prompting-and-ai-tools',
        },
        {
            name: 'Idea Generation and Brainstorming',
            slug: 'idea-generation-and-brainstorming',
        },
        {
            name: 'Copywriting and Content Creation',
            slug: 'copywriting-and-content-creation',
        },
        {
            name: 'Strategy and Concept Development',
            slug: 'strategy-and-concept-development',
        },
        {
            name: 'Creative and Art Direction',
            slug: 'creative-and-art-direction',
        },
        {
            name: 'Business Planning and Financing',
            slug: 'business-planning-and-financing',
        },
        {
            name: 'Pitching and Presentation Skills',
            slug: 'pitching-and-presentation-skills',
        },
        {
            name: 'Typography, Layout, and Composition',
            slug: 'typography-layout-and-composition',
        },
        {
            name: 'Cross-Channel Marketing',
            slug: 'cross-channel-marketing',
        },
        {
            name: 'Campaign Development',
            slug: 'campaign-development',
        },
        {
            name: 'Infographics and Data Visualization',
            slug: 'infographics-and-data-visualization',
        },
        {
            name: 'Packaging and Print Design',
            slug: 'packaging-and-print-design',
        },
        {
            name: 'Film and Cinematography',
            slug: 'film-and-cinematography',
        },
    ],
};

const topicsMockGerman: useCaseModels.TListTopicsSuccessResponse['data'] = {
    topics: [
        {
            name: 'Branding und Identität',
            slug: 'branding-and-identity',
        },
        {
            name: 'Grafik- und Visualdesign',
            slug: 'graphic-and-visual-design',
        },
        {
            name: 'Motion Design und Animation',
            slug: 'motion-design-and-animation',
        },
        {
            name: 'Sound Design und Bearbeitung',
            slug: 'sound-design-and-editing',
        },
        {
            name: 'Digitale Inhalte und Social Media Strategie',
            slug: 'digital-content-and-social-media-strategy',
        },
        {
            name: 'Webdesign und Entwicklung',
            slug: 'web-design-and-development',
        },
        {
            name: 'UI/UX Design',
            slug: 'ui-ux-design',
        },
        {
            name: 'Visuelles Storytelling',
            slug: 'visual-storytelling',
        },
        {
            name: 'Werbekampagnen',
            slug: 'advertising-campaigns',
        },
        {
            name: 'Key Visual Erstellung',
            slug: 'key-visual-creation',
        },
        {
            name: 'Ganzheitliche Konzeptentwicklung',
            slug: 'holistic-concept-development',
        },
        {
            name: 'Fotografie und Bearbeitung',
            slug: 'photography-and-editing',
        },
        {
            name: 'Prompting und KI-Tools',
            slug: 'prompting-and-ai-tools',
        },
        {
            name: 'Ideenfindung und Brainstorming',
            slug: 'idea-generation-and-brainstorming',
        },
        {
            name: 'Copywriting und Content-Erstellung',
            slug: 'copywriting-and-content-creation',
        },
        {
            name: 'Strategie und Konzeptentwicklung',
            slug: 'strategy-and-concept-development',
        },
        {
            name: 'Kreative und Art Direction',
            slug: 'creative-and-art-direction',
        },
        {
            name: 'Geschäftsplanung und Finanzierung',
            slug: 'business-planning-and-financing',
        },
        {
            name: 'Pitching und Präsentationsfähigkeiten',
            slug: 'pitching-and-presentation-skills',
        },
        {
            name: 'Typografie, Layout und Komposition',
            slug: 'typography-layout-and-composition',
        },
        {
            name: 'Cross-Channel Marketing',
            slug: 'cross-channel-marketing',
        },
        {
            name: 'Kampagnenentwicklung',
            slug: 'campaign-development',
        },
        {
            name: 'Infografiken und Datenvisualisierung',
            slug: 'infographics-and-data-visualization',
        },
        {
            name: 'Verpackung und Printdesign',
            slug: 'packaging-and-print-design',
        },
        {
            name: 'Film und Kinematographie',
            slug: 'film-and-cinematography',
        },
    ],
};

const topicsCriticalError: useCaseModels.TGetHomePageUseCaseErrorResponse = {
    success: false,
    data: {
        errorType: 'NotFound',
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
    },
};

const topicsCriticalErrorGerman: useCaseModels.TGetHomePageUseCaseErrorResponse = {
    success: false,
    data: {
        errorType: 'NotFound',
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
