import { useCaseModels } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';

const getCourseOutlineMock: useCaseModels.TGetCourseOutlineSuccessResponse['data'] =
    {
        items: [
            {
                title: 'Matching',
                description: JSON.stringify([
                    {
                        type: 'paragraph',
                        children: [
                            {
                                text: 'Our intelligent matching system connects you with the perfect opportunities. Using advanced algorithms, we analyze your ',
                            },
                            {
                                text: 'skills, preferences, and goals',
                                bold: true,
                            },
                            {
                                text: ' to find the most suitable matches for your profile.',
                            },
                        ],
                    },
                    {
                        type: 'paragraph',
                        children: [
                            {
                                text: 'Get personalized recommendations that align with your career aspirations and expertise level.',
                            },
                        ],
                    },
                ]),
                position: 1,
            },
            {
                title: 'Geführt zum Ziel',
                description: JSON.stringify([
                    {
                        type: 'paragraph',
                        children: [
                            {
                                text: 'Du lernst wie du Ideen findest, umsetzt und gestaltest. Wir zeigen dir die Tools für deinen Bedarf und führen dich durch den Workflow zum Resultat. Am Ende hast du eine ',
                            },
                            {
                                text: 'tolle Kampagne',
                                bold: true,
                            },
                            {
                                text: ', eine Website, Visuals oder einen Film für Social Media.',
                            },
                        ],
                    },
                    {
                        type: 'bulleted-list',
                        children: [
                            {
                                type: 'list-item',
                                children: [
                                    { text: 'Schritt-für-Schritt Anleitung' },
                                ],
                            },
                            {
                                type: 'list-item',
                                children: [
                                    {
                                        text: 'Professionelle Tools und Templates',
                                    },
                                ],
                            },
                            {
                                type: 'list-item',
                                children: [
                                    {
                                        text: 'Persönliche Betreuung durch Experten',
                                    },
                                ],
                            },
                        ],
                    },
                ]),
                position: 2,
            },
            {
                title: 'Selbständig und Effizient',
                description: JSON.stringify([
                    {
                        type: 'paragraph',
                        children: [
                            {
                                text: 'Work independently with our comprehensive toolkit designed for ',
                            },
                            {
                                text: 'maximum efficiency',
                                bold: true,
                                italic: true,
                            },
                            {
                                text: '. Our platform empowers you to manage projects, track progress, and deliver results without constant supervision.',
                            },
                        ],
                    },
                    {
                        type: 'paragraph',
                        children: [
                            {
                                text: 'Features include:',
                            },
                        ],
                    },
                    {
                        type: 'numbered-list',
                        children: [
                            {
                                type: 'list-item',
                                children: [
                                    { text: 'Automated workflow management' },
                                ],
                            },
                            {
                                type: 'list-item',
                                children: [
                                    { text: 'Real-time collaboration tools' },
                                ],
                            },
                            {
                                type: 'list-item',
                                children: [
                                    { text: 'Performance analytics dashboard' },
                                ],
                            },
                        ],
                    },
                ]),
                position: 3,
            },
            {
                title: 'KI & Partner',
                description: JSON.stringify([
                    {
                        type: 'paragraph',
                        children: [
                            {
                                text: 'Leverage the power of ',
                            },
                            {
                                text: 'artificial intelligence',
                                bold: true,
                            },
                            {
                                text: ' combined with human expertise. Our AI partners work alongside you to enhance productivity, provide insights, and automate routine tasks.',
                            },
                        ],
                    },
                    {
                        type: 'blockquote',
                        children: [
                            {
                                type: 'paragraph',
                                children: [
                                    {
                                        text: 'The future of work is collaborative intelligence - humans and AI working together to achieve extraordinary results.',
                                        italic: true,
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        type: 'paragraph',
                        children: [
                            {
                                text: 'Experience seamless integration with cutting-edge AI tools that adapt to your working style.',
                            },
                        ],
                    },
                ]),
                position: 4,
            },
            {
                title: 'Mehr Budget für andere Dinge',
                description: JSON.stringify([
                    {
                        type: 'paragraph',
                        children: [
                            {
                                text: 'Optimize your spending and ',
                            },
                            {
                                text: 'save up to 40%',
                                bold: true,
                            },
                            {
                                text: ' on operational costs. Our cost-effective solutions help you allocate more budget to what truly matters - growing your business and investing in innovation.',
                            },
                        ],
                    },
                    {
                        type: 'paragraph',
                        children: [
                            {
                                text: 'Cost benefits include:',
                            },
                        ],
                    },
                    {
                        type: 'bulleted-list',
                        children: [
                            {
                                type: 'list-item',
                                children: [
                                    {
                                        text: 'Reduced operational overhead',
                                    },
                                ],
                            },
                            {
                                type: 'list-item',
                                children: [
                                    {
                                        text: 'Flexible pricing models',
                                    },
                                ],
                            },
                            {
                                type: 'list-item',
                                children: [
                                    {
                                        text: 'No hidden fees or long-term contracts',
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        type: 'paragraph',
                        children: [
                            {
                                text: 'Invest your savings in ',
                            },
                            {
                                text: 'strategic initiatives',
                                italic: true,
                            },
                            {
                                text: ' that drive real business value.',
                            },
                        ],
                    },
                ]),
                position: 5,
            },
        ],
    };

export const getCourseOutline = t.procedure
    .input(useCaseModels.GetCourseOutlineRequestSchema)
    .query(
        async (): Promise<useCaseModels.TGetCourseOutlineUseCaseResponse> => {
            return {
                success: true,
                data: getCourseOutlineMock,
            };
        },
    );
