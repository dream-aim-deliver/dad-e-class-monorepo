import { useCaseModels } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';

const topicsMock: useCaseModels.TGetTopicsSuccessResponse['data'] = {
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

export const getTopics = t.procedure
    .input(useCaseModels.GetTopicsRequestSchema)
    .query(async (opts): Promise<useCaseModels.TGetTopicsUseCaseResponse> => {
        return {
            success: true,
            data: topicsMock,
        };
    });
