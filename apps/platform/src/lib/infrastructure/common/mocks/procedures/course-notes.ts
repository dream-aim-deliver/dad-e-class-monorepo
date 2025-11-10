import { useCaseModels } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';

const listStudentNotesMock: useCaseModels.TListStudentNotesSuccessResponse['data'] = {
    modules: [
        {
            id: 'module-1',
            position: 1,
            title: 'Introduction to Brand Identity',
            lessons: [
                {
                    id: 'lesson-1-1',
                    position: 1,
                    title: 'Understanding Brand Fundamentals',
                    notes: JSON.stringify([
                        {
                            type: 'paragraph',
                            children: [
                                {
                                    text: 'Key takeaways from this lesson:',
                                    bold: true,
                                },
                            ],
                        },
                        {
                            type: 'bulleted-list',
                            children: [
                                {
                                    type: 'list-item',
                                    children: [
                                        { text: 'Brand identity goes beyond just a logo - it encompasses all visual and emotional elements' },
                                    ],
                                },
                                {
                                    type: 'list-item',
                                    children: [
                                        { text: 'Consistency across all touchpoints is crucial for brand recognition' },
                                    ],
                                },
                                {
                                    type: 'list-item',
                                    children: [
                                        { text: 'Understanding target audience is the foundation of effective branding' },
                                    ],
                                },
                            ],
                        },
                        {
                            type: 'paragraph',
                            children: [
                                {
                                    text: 'Remember: ',
                                    bold: true,
                                },
                                {
                                    text: 'A strong brand identity creates emotional connections with customers.',
                                    italic: true,
                                },
                            ],
                        },
                    ]),
                },
                {
                    id: 'lesson-1-2',
                    position: 2,
                    title: 'Color Theory in Branding',
                    notes: JSON.stringify([
                        {
                            type: 'paragraph',
                            children: [
                                {
                                    text: 'Color Psychology Notes:',
                                    bold: true,
                                },
                            ],
                        },
                        {
                            type: 'numbered-list',
                            children: [
                                {
                                    type: 'list-item',
                                    children: [
                                        { text: 'Red: Energy, passion, urgency - often used in food and retail' },
                                    ],
                                },
                                {
                                    type: 'list-item',
                                    children: [
                                        { text: 'Blue: Trust, reliability, professionalism - common in tech and finance' },
                                    ],
                                },
                                {
                                    type: 'list-item',
                                    children: [
                                        { text: 'Green: Growth, nature, health - popular in wellness and eco-friendly brands' },
                                    ],
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
                                            text: 'Color can increase brand recognition by up to 80%',
                                            italic: true,
                                        },
                                    ],
                                },
                            ],
                        },
                    ]),
                },
                {
                    id: 'lesson-1-3',
                    position: 3,
                    title: 'Typography Selection',
                    notes: JSON.stringify([
                        {
                            type: 'paragraph',
                            children: [
                                {
                                    text: 'Typography Guidelines:',
                                    bold: true,
                                },
                            ],
                        },
                        {
                            type: 'paragraph',
                            children: [
                                {
                                    text: 'Serif fonts convey ',
                                },
                                {
                                    text: 'tradition and reliability',
                                    bold: true,
                                },
                                {
                                    text: ', while sans-serif fonts feel ',
                                },
                                {
                                    text: 'modern and clean',
                                    bold: true,
                                },
                                {
                                    text: '.',
                                },
                            ],
                        },
                        {
                            type: 'paragraph',
                            children: [
                                {
                                    text: 'Action items:',
                                    bold: true,
                                },
                            ],
                        },
                        {
                            type: 'bulleted-list',
                            children: [
                                {
                                    type: 'list-item',
                                    children: [
                                        { text: 'Test font readability across different devices' },
                                    ],
                                },
                                {
                                    type: 'list-item',
                                    children: [
                                        { text: 'Limit font families to 2-3 maximum' },
                                    ],
                                },
                                {
                                    type: 'list-item',
                                    children: [
                                        { text: 'Consider accessibility and dyslexia-friendly options' },
                                    ],
                                },
                            ],
                        },
                    ]),
                },
            ],
            lessonCount: 3,
        },
        {
            id: 'module-2',
            position: 2,
            title: 'Logo Design Process',
            lessons: [
                {
                    id: 'lesson-2-1',
                    position: 1,
                    title: 'Research and Inspiration',
                    notes: JSON.stringify([
                        {
                            type: 'paragraph',
                            children: [
                                {
                                    text: 'Research Phase Checklist:',
                                    bold: true,
                                },
                            ],
                        },
                        {
                            type: 'numbered-list',
                            children: [
                                {
                                    type: 'list-item',
                                    children: [
                                        { text: 'Analyze competitor logos and positioning' },
                                    ],
                                },
                                {
                                    type: 'list-item',
                                    children: [
                                        { text: 'Create mood boards with visual references' },
                                    ],
                                },
                                {
                                    type: 'list-item',
                                    children: [
                                        { text: 'Define brand personality and values' },
                                    ],
                                },
                                {
                                    type: 'list-item',
                                    children: [
                                        { text: 'Gather inspiration from outside the industry' },
                                    ],
                                },
                            ],
                        },
                        {
                            type: 'paragraph',
                            children: [
                                {
                                    text: '💡 Tip: ',
                                },
                                {
                                    text: 'Look at logos in different industries for fresh perspectives',
                                    italic: true,
                                },
                            ],
                        },
                    ]),
                },
                {
                    id: 'lesson-2-2',
                    position: 2,
                    title: 'Sketching and Ideation',
                    notes: JSON.stringify([
                        {
                            type: 'paragraph',
                            children: [
                                {
                                    text: 'Sketching Best Practices:',
                                    bold: true,
                                },
                            ],
                        },
                        {
                            type: 'bulleted-list',
                            children: [
                                {
                                    type: 'list-item',
                                    children: [
                                        { text: 'Start with pencil and paper - faster iteration' },
                                    ],
                                },
                                {
                                    type: 'list-item',
                                    children: [
                                        { text: 'Generate 20-30 rough concepts minimum' },
                                    ],
                                },
                                {
                                    type: 'list-item',
                                    children: [
                                        { text: 'Focus on shapes and concepts, not details' },
                                    ],
                                },
                                {
                                    type: 'list-item',
                                    children: [
                                        { text: 'Think about scalability from thumbnail to billboard' },
                                    ],
                                },
                            ],
                        },
                        {
                            type: 'paragraph',
                            children: [
                                {
                                    text: 'Key insight: ',
                                    bold: true,
                                },
                                {
                                    text: 'The best logos work in black and white first',
                                },
                            ],
                        },
                    ]),
                },
            ],
            lessonCount: 2,
        },
        {
            id: 'module-3',
            position: 3,
            title: 'Brand Guidelines Development',
            lessons: [
                {
                    id: 'lesson-3-1',
                    position: 1,
                    title: 'Creating Comprehensive Guidelines',
                    notes: JSON.stringify([
                        {
                            type: 'paragraph',
                            children: [
                                {
                                    text: 'Brand Guidelines Must Include:',
                                    bold: true,
                                },
                            ],
                        },
                        {
                            type: 'numbered-list',
                            children: [
                                {
                                    type: 'list-item',
                                    children: [
                                        { text: 'Logo usage rules (do\'s and don\'ts)' },
                                    ],
                                },
                                {
                                    type: 'list-item',
                                    children: [
                                        { text: 'Color palette with hex codes and print values' },
                                    ],
                                },
                                {
                                    type: 'list-item',
                                    children: [
                                        { text: 'Typography hierarchy and usage examples' },
                                    ],
                                },
                                {
                                    type: 'list-item',
                                    children: [
                                        { text: 'Voice and tone guidelines' },
                                    ],
                                },
                                {
                                    type: 'list-item',
                                    children: [
                                        { text: 'Photography and imagery style' },
                                    ],
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
                                            text: 'A well-documented brand guide ensures consistency across all team members and external partners',
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
                                    text: 'Next steps: ',
                                    bold: true,
                                },
                                {
                                    text: 'Create templates for common applications (business cards, letterhead, social media) Create templates for common applications (business cards, letterhead, social media)',
                                },
                            ],
                        },
                    ]),
                },
                {
                    id: 'lesson-3-2',
                    position: 2,
                    title: 'Implementation Strategies',
                    notes: JSON.stringify([
                        {
                            type: 'paragraph',
                            children: [
                                {
                                    text: 'Implementation Timeline:',
                                    bold: true,
                                },
                            ],
                        },
                        {
                            type: 'paragraph',
                            children: [
                                {
                                    text: 'Phase 1 (Week 1-2): ',
                                    bold: true,
                                },
                                {
                                    text: 'Update primary touchpoints (website, business cards, email signatures)',
                                },
                            ],
                        },
                        {
                            type: 'paragraph',
                            children: [
                                {
                                    text: 'Phase 2 (Week 3-4): ',
                                    bold: true,
                                },
                                {
                                    text: 'Social media profiles, marketing materials, signage',
                                },
                            ],
                        },
                        {
                            type: 'paragraph',
                            children: [
                                {
                                    text: 'Phase 3 (Month 2): ',
                                    bold: true,
                                },
                                {
                                    text: 'Secondary materials, merchandise, vehicle wraps',
                                },
                            ],
                        },
                        {
                            type: 'paragraph',
                            children: [
                                {
                                    text: '⚠️ Important: ',
                                    bold: true,
                                },
                                {
                                    text: 'Train all team members on brand guidelines before launch',
                                    italic: true,
                                },
                            ],
                        },
                    ]),
                },
                {
                    id: 'lesson-3-3',
                    position: 3,
                    title: 'Measuring Brand Success',
                    notes: JSON.stringify([
                        {
                            type: 'paragraph',
                            children: [
                                {
                                    text: 'Brand KPIs to Track:',
                                    bold: true,
                                },
                            ],
                        },
                        {
                            type: 'bulleted-list',
                            children: [
                                {
                                    type: 'list-item',
                                    children: [
                                        { text: 'Brand awareness surveys and metrics' },
                                    ],
                                },
                                {
                                    type: 'list-item',
                                    children: [
                                        { text: 'Social media engagement rates' },
                                    ],
                                },
                                {
                                    type: 'list-item',
                                    children: [
                                        { text: 'Website traffic and user behavior' },
                                    ],
                                },
                                {
                                    type: 'list-item',
                                    children: [
                                        { text: 'Customer sentiment analysis' },
                                    ],
                                },
                                {
                                    type: 'list-item',
                                    children: [
                                        { text: 'Sales conversion rates' },
                                    ],
                                },
                            ],
                        },
                        {
                            type: 'paragraph',
                            children: [
                                {
                                    text: 'Review schedule: ',
                                    bold: true,
                                },
                                {
                                    text: 'Monthly for first 6 months, then quarterly',
                                },
                            ],
                        },
                        {
                            type: 'paragraph',
                            children: [
                                {
                                    text: '📊 Data point: ',
                                },
                                {
                                    text: 'Consistent branding can increase revenue by up to 23%',
                                    italic: true,
                                },
                            ],
                        },
                    ]),
                },
            ],
            lessonCount: 3,
        },
    ],
    moduleCount: 3,
};

export const listStudentNotes = t.procedure
    .input(useCaseModels.ListStudentNotesRequestSchema)
    .query(async (opts): Promise<useCaseModels.TListStudentNotesUseCaseResponse> => {
        return {
            success: true,
            data: listStudentNotesMock,
        };
    });
