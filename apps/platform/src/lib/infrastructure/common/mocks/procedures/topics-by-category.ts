import { useCaseModels } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';

const topicsByCategoryMock: useCaseModels.TListTopicsByCategorySuccessResponse['data'] =
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

const topicsByCategoryMockGerman: useCaseModels.TListTopicsByCategorySuccessResponse['data'] =
    {
        topicsByCategory: {
            'Design & Kreativ': [
                {
                    name: 'Grafik- und Visualdesign',
                    slug: 'graphic-and-visual-design',
                },
                {
                    name: 'Branding und Identität',
                    slug: 'branding-and-identity',
                },
                {
                    name: 'Typografie, Layout und Komposition',
                    slug: 'typography-layout-and-composition',
                },
                {
                    name: 'Key Visual Erstellung',
                    slug: 'key-visual-creation',
                },
                {
                    name: 'Verpackung und Printdesign',
                    slug: 'packaging-and-print-design',
                },
                {
                    name: 'Visuelles Storytelling',
                    slug: 'visual-storytelling',
                },
                {
                    name: 'Kreative und Art Direction',
                    slug: 'creative-and-art-direction',
                },
                {
                    name: 'Infografiken und Datenvisualisierung',
                    slug: 'infographics-and-data-visualization',
                },
            ],

            'Digital & Technologie': [
                {
                    name: 'Webdesign und Entwicklung',
                    slug: 'web-design-and-development',
                },
                {
                    name: 'UI/UX Design',
                    slug: 'ui-ux-design',
                },
                {
                    name: 'Digitale Inhalte und Social Media Strategie',
                    slug: 'digital-content-and-social-media-strategy',
                },
                {
                    name: 'Motion Design und Animation',
                    slug: 'motion-design-and-animation',
                },
                {
                    name: 'Prompting und KI-Tools',
                    slug: 'prompting-and-ai-tools',
                },
            ],

            'Medien & Produktion': [
                {
                    name: 'Film und Kinematographie',
                    slug: 'film-and-cinematography',
                },
                {
                    name: 'Sound Design und Bearbeitung',
                    slug: 'sound-design-and-editing',
                },
                {
                    name: 'Fotografie und Bearbeitung',
                    slug: 'photography-and-editing',
                },
                {
                    name: 'Motion Design und Animation',
                    slug: 'motion-design-and-animation',
                },
                {
                    name: 'Visuelles Storytelling',
                    slug: 'visual-storytelling',
                },
            ],
            'Strategie & Business': [
                {
                    name: 'Strategie und Konzeptentwicklung',
                    slug: 'strategy-and-concept-development',
                },
                {
                    name: 'Ganzheitliche Konzeptentwicklung',
                    slug: 'holistic-concept-development',
                },
                {
                    name: 'Werbekampagnen',
                    slug: 'advertising-campaigns',
                },
                {
                    name: 'Kampagnenentwicklung',
                    slug: 'campaign-development',
                },
                {
                    name: 'Cross-Channel Marketing',
                    slug: 'cross-channel-marketing',
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
                    name: 'Geschäftsplanung und Finanzierung',
                    slug: 'business-planning-and-financing',
                },
                {
                    name: 'Pitching und Präsentationsfähigkeiten',
                    slug: 'pitching-and-presentation-skills',
                },
            ],
        },
    };

export const listTopicsByCategory = t.procedure
    .input(useCaseModels.ListTopicsByCategoryRequestSchema)
    .query(
        async (
            opts,
        ): Promise<useCaseModels.TListTopicsByCategoryUseCaseResponse> => {
            return {
                success: true,
                data: topicsByCategoryMock,
            };
        },
    );
