import { useCaseModels } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';

// TODO: add mock data
const mockThreeComponents: useCaseModels.TListAssessmentComponentsSuccessResponse['data'] =
    {
        components: [
            {
                id: 'comp_001',
                course_id: 101,
                order: 1,
                type: 'heading',
                text: 'Welcome to the JavaScript Assessment',
                size: 'h1',
            },
            {
                id: 'comp_002',
                course_id: 101,
                order: 2,
                type: 'richText',
                text: JSON.stringify([
                    {
                        type: 'paragraph',
                        children: [
                            {
                                text: 'This assessment will test your understanding of ',
                            },
                            {
                                text: 'JavaScript fundamentals',
                                bold: true,
                            },
                            {
                                text: ' including variables, functions, and ',
                            },
                            {
                                text: 'object-oriented programming',
                                italic: true,
                            },
                            {
                                text: '.',
                            },
                        ],
                    },
                ]),
            },
            {
                id: 'comp_003',
                course_id: 101,
                order: 3,
                type: 'singleChoice',
                title: 'What is the correct way to declare a variable in JavaScript?',
                options: [
                    { id: 1, name: "var myVariable = 'hello';" },
                    { id: 2, name: "let myVariable = 'hello';" },
                    { id: 3, name: "const myVariable = 'hello';" },
                    { id: 4, name: 'All of the above' },
                ],
                required: true,
            },
        ],
    };

const mockFiveComponents: useCaseModels.TListAssessmentComponentsSuccessResponse['data'] =
    {
        components: [
            {
                id: 'comp_101',
                course_id: 202,
                order: 1,
                type: 'heading',
                text: 'React Development Quiz',
                size: 'h1',
            },
            {
                id: 'comp_102',
                course_id: 202,
                order: 2,
                type: 'richText',
                text: JSON.stringify([
                    {
                        type: 'paragraph',
                        children: [
                            {
                                text: 'React is a ',
                            },
                            {
                                text: 'JavaScript library',
                                bold: true,
                            },
                            {
                                text: ' for building user interfaces. It was created by ',
                            },
                            {
                                text: 'Facebook',
                                italic: true,
                            },
                            {
                                text: ' and is now maintained by Meta and the open-source community.',
                            },
                        ],
                    },
                    {
                        type: 'bulleted-list',
                        children: [
                            {
                                type: 'list-item',
                                children: [
                                    { text: 'Component-based architecture' },
                                ],
                            },
                            {
                                type: 'list-item',
                                children: [
                                    {
                                        text: 'Virtual DOM for efficient updates',
                                    },
                                ],
                            },
                            {
                                type: 'list-item',
                                children: [
                                    { text: 'Declarative programming model' },
                                ],
                            },
                        ],
                    },
                ]),
            },
            {
                id: 'comp_103',
                course_id: 202,
                order: 3,
                type: 'heading',
                text: 'Component Lifecycle',
                size: 'h3',
            },
            {
                id: 'comp_104',
                course_id: 202,
                order: 4,
                type: 'multipleChoice',
                title: 'Which of the following are React lifecycle methods? (Select all that apply)',
                options: [
                    { id: 1, name: 'componentDidMount' },
                    { id: 2, name: 'componentWillUnmount' },
                    { id: 3, name: 'componentDidUpdate' },
                    { id: 4, name: 'componentWillRender' },
                    { id: 5, name: 'shouldComponentUpdate' },
                ],
                required: true,
            },
            {
                id: 'comp_105',
                course_id: 202,
                order: 5,
                type: 'textInput',
                helperText: JSON.stringify([
                    {
                        type: 'paragraph',
                        children: [
                            {
                                text: 'Explain the difference between props and state in React',
                            },
                        ],
                    },
                ]),
                required: true,
            },
        ],
    };

const mockSevenComponents: useCaseModels.TListAssessmentComponentsSuccessResponse['data'] =
    {
        components: [
            {
                id: 'comp_201',
                course_id: 303,
                order: 1,
                type: 'heading',
                text: 'Advanced Web Development Assessment',
                size: 'h1',
            },
            {
                id: 'comp_202',
                course_id: 303,
                order: 2,
                type: 'richText',
                text: JSON.stringify([
                    {
                        type: 'paragraph',
                        children: [
                            {
                                text: 'This comprehensive assessment covers ',
                            },
                            {
                                text: 'advanced topics',
                                bold: true,
                            },
                            {
                                text: ' in web development including:',
                            },
                        ],
                    },
                    {
                        type: 'numbered-list',
                        children: [
                            {
                                type: 'list-item',
                                children: [
                                    {
                                        text: 'Performance optimization',
                                        bold: true,
                                    },
                                    {
                                        text: ' techniques',
                                    },
                                ],
                            },
                            {
                                type: 'list-item',
                                children: [
                                    {
                                        text: 'Security',
                                        italic: true,
                                    },
                                    {
                                        text: ' best practices',
                                    },
                                ],
                            },
                            {
                                type: 'list-item',
                                children: [
                                    {
                                        text: 'Modern JavaScript features (ES6+)',
                                        code: true,
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        type: 'block-quote',
                        children: [
                            {
                                text: 'The best way to learn web development is through hands-on practice and continuous learning.',
                                italic: true,
                            },
                        ],
                    },
                ]),
            },
            {
                id: 'comp_203',
                course_id: 303,
                order: 3,
                type: 'heading',
                text: 'Performance Optimization',
                size: 'h2',
            },
            {
                id: 'comp_204',
                course_id: 303,
                order: 4,
                type: 'oneOutOfThree',
                title: 'Match the optimization technique with its primary benefit:',
                columns: [
                    { id: 1, name: 'Code Splitting' },
                    { id: 2, name: 'Image Optimization' },
                    { id: 3, name: 'Caching Strategies' },
                ],
                rows: [
                    { id: 1, name: 'Reduces initial bundle size' },
                    { id: 2, name: 'Improves page load speed' },
                    { id: 3, name: 'Reduces server requests' },
                ],
                required: false,
            },
            {
                id: 'comp_205',
                course_id: 303,
                order: 5,
                type: 'singleChoice',
                title: 'Which HTTP status code indicates a successful response?',
                options: [
                    { id: 1, name: '200 OK' },
                    { id: 2, name: '404 Not Found' },
                    { id: 3, name: '500 Internal Server Error' },
                    { id: 4, name: '301 Moved Permanently' },
                ],
                required: true,
            },
            {
                id: 'comp_206',
                course_id: 303,
                order: 6,
                type: 'heading',
                text: 'Security Considerations',
                size: 'h4',
            },
            {
                id: 'comp_207',
                course_id: 303,
                order: 7,
                type: 'multipleChoice',
                title: 'Which security measures should be implemented in a web application?',
                options: [
                    { id: 1, name: 'Input validation and sanitization' },
                    { id: 2, name: 'HTTPS encryption' },
                    { id: 3, name: 'Cross-Site Scripting (XSS) protection' },
                    { id: 4, name: 'SQL injection prevention' },
                    { id: 5, name: 'Content Security Policy (CSP)' },
                    { id: 6, name: 'Regular security audits' },
                ],
                required: true,
            },
        ],
    };

export const listAssessmentComponents = t.procedure
    .input(useCaseModels.ListAssessmentComponentsRequestSchema)
    .query(
        async (): Promise<useCaseModels.TListAssessmentComponentsUseCaseResponse> => {
            return {
                success: true,
                data: mockFiveComponents,
            };
        },
    );
