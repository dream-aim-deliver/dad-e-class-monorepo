import { useCaseModels } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';

const topicsByCategoryMock: useCaseModels.TGetTopicsByCategorySuccessResponse['data'] =
    {
        topicsByCategory: {
            'Design & Creative': [
                {
                    name: 'Graphic and Visual Design',
                    slug: 'graphic-and-visual-design',
                },
                {
                    name: 'Branding and Identity',
                    slug: 'branding-and-identity',
                },
                {
                    name: 'Typography, Layout, and Composition',
                    slug: 'typography-layout-and-composition',
                },
                {
                    name: 'Key Visual Creation',
                    slug: 'key-visual-creation',
                },
                {
                    name: 'Packaging and Print Design',
                    slug: 'packaging-and-print-design',
                },
                {
                    name: 'Visual Storytelling',
                    slug: 'visual-storytelling',
                },
                {
                    name: 'Creative and Art Direction',
                    slug: 'creative-and-art-direction',
                },
                {
                    name: 'Infographics and Data Visualization',
                    slug: 'infographics-and-data-visualization',
                },
            ],

            'Digital & Technology': [
                {
                    name: 'Web Design and Development',
                    slug: 'web-design-and-development',
                },
                {
                    name: 'UI/UX Design',
                    slug: 'ui-ux-design',
                },
                {
                    name: 'Digital Content and Social Media Strategy',
                    slug: 'digital-content-and-social-media-strategy',
                },
                {
                    name: 'Motion Design and Animation',
                    slug: 'motion-design-and-animation',
                },
                {
                    name: 'Prompting and AI Tools',
                    slug: 'prompting-and-ai-tools',
                },
            ],

            'Media & Production': [
                {
                    name: 'Film and Cinematography',
                    slug: 'film-and-cinematography',
                },
                {
                    name: 'Sound Design and Editing',
                    slug: 'sound-design-and-editing',
                },
                {
                    name: 'Photography and Editing',
                    slug: 'photography-and-editing',
                },
                {
                    name: 'Motion Design and Animation',
                    slug: 'motion-design-and-animation',
                },
                {
                    name: 'Visual Storytelling',
                    slug: 'visual-storytelling',
                },
            ],
            'Strategy & Business': [
                {
                    name: 'Strategy and Concept Development',
                    slug: 'strategy-and-concept-development',
                },
                {
                    name: 'Holistic Concept Development',
                    slug: 'holistic-concept-development',
                },
                {
                    name: 'Advertising Campaigns',
                    slug: 'advertising-campaigns',
                },
                {
                    name: 'Campaign Development',
                    slug: 'campaign-development',
                },
                {
                    name: 'Cross-Channel Marketing',
                    slug: 'cross-channel-marketing',
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
                    name: 'Business Planning and Financing',
                    slug: 'business-planning-and-financing',
                },
                {
                    name: 'Pitching and Presentation Skills',
                    slug: 'pitching-and-presentation-skills',
                },
            ],
        },
    };

export const getTopicsByCategory = t.procedure
    .input(useCaseModels.GetTopicsByCategoryRequestSchema)
    .query(
        async (
            opts,
        ): Promise<useCaseModels.TGetTopicsByCategoryUseCaseResponse> => {
            return {
                success: true,
                data: topicsByCategoryMock,
            };
        },
    );
