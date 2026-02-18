import React from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';
import { CoachStudentInteractionCard } from '../lib/components/coach-student-interaction-card';
import { TListStudentInteractionsSuccess } from 'packages/models/src/view-models';

/**
 * CoachStudentInteractionCard Component
 * 
 * A nested accordion component for displaying coach-student interactions.
 * Shows modules with nested lessons, allowing coaches to view lesson details.
 * 
 * Features:
 * - Nested accordion structure (modules → lessons)
 * - Multiple modules support
 * - "View Lesson" button for each lesson
 * - Responsive and accessible design
 */
const meta: Meta<typeof CoachStudentInteractionCard> = {
    title: 'Components/CoachStudentInteractionCard',
    component: CoachStudentInteractionCard,
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: 'A component for displaying student interactions organized by modules and lessons in a nested accordion format.',
            },
        },
    },
    decorators: [
        (Story) => (
            <div className="w-full max-w-4xl mx-auto">
                <Story />
            </div>
        ),
    ],
    argTypes: {
        locale: {
            control: 'select',
            options: ['en', 'es', 'fr', 'de'],
            description: 'The locale for translations',
        },
        modules: {
            control: 'object',
            description: 'Array of modules with nested lessons',
        },
        onViewLessonsClick: {
            action: 'view lesson clicked',
            description: 'Callback when "View Lesson" button is clicked',
        },
    },
};

export default meta;
type Story = StoryObj<typeof CoachStudentInteractionCard>;

// Mock data for student interactions with text inputs
const mockModules = [
    {
        id: 'module-1',
        title: 'Introduction to Web Development',
        lessons: [
            {
                id: 'lesson-1-1',
                title: 'HTML Basics',
                position: 1,
                textInputs: [
                    {
                        id: 'text-input-1',
                        type: 'textInput' as const,
                        helperText: JSON.stringify([
                            {
                                type: 'paragraph',
                                children: [
                                    { text: 'What is HTML and why is it important in web development?' }
                                ]
                            }
                        ]),
                        required: true,
                        progress: {
                            answer: JSON.stringify([
                                {
                                    type: 'paragraph',
                                    children: [
                                        { text: 'HTML stands for HyperText Markup Language. It is the standard markup language for creating web pages and web applications. HTML is important because it provides the structure and content of a webpage.' }
                                    ]
                                }
                            ])
                        }
                    },
                    {
                        id: 'text-input-2',
                        type: 'textInput' as const,
                        helperText: JSON.stringify([
                            {
                                type: 'paragraph',
                                children: [
                                    { text: 'Describe the difference between ' },
                                    { text: '<div>', code: true },
                                    { text: ' and ' },
                                    { text: '<span>', code: true },
                                    { text: ' elements.' }
                                ]
                            }
                        ]),
                        required: true,
                        progress: {
                            answer: JSON.stringify([
                                {
                                    type: 'paragraph',
                                    children: [
                                        { text: 'A ' },
                                        { text: '<div>', code: true },
                                        { text: ' is a block-level element that creates a new line and takes up the full width available, while a ' },
                                        { text: '<span>', code: true },
                                        { text: ' is an inline element that only takes up as much width as necessary and doesn\'t create a new line.' }
                                    ]
                                }
                            ])
                        }
                    }
                ],
            },
            {
                id: 'lesson-1-2',
                title: 'CSS Fundamentals',
                position: 2,
                textInputs: [
                    {
                        id: 'text-input-3',
                        type: 'textInput' as const,
                        helperText: JSON.stringify([
                            {
                                type: 'paragraph',
                                children: [
                                    { text: 'Explain the CSS box model and its components.' }
                                ]
                            }
                        ]),
                        required: true,
                        progress: {
                            answer: JSON.stringify([
                                {
                                    type: 'paragraph',
                                    children: [
                                        { text: 'The CSS box model describes how elements are rendered on a page. It consists of four parts:' }
                                    ]
                                },
                                {
                                    type: 'numbered-list',
                                    children: [
                                        {
                                            type: 'list-item',
                                            children: [{ text: 'Content - the actual content of the element' }]
                                        },
                                        {
                                            type: 'list-item',
                                            children: [{ text: 'Padding - space between content and border' }]
                                        },
                                        {
                                            type: 'list-item',
                                            children: [{ text: 'Border - surrounds the padding' }]
                                        },
                                        {
                                            type: 'list-item',
                                            children: [{ text: 'Margin - space outside the border' }]
                                        }
                                    ]
                                }
                            ])
                        }
                    }
                ],
            },
            {
                id: 'lesson-1-3',
                title: 'JavaScript Introduction',
                position: 3,
                textInputs: [],
            },
        ],
    },
    {
        id: 'module-2',
        title: 'Advanced JavaScript',
        lessons: [
            {
                id: 'lesson-2-1',
                title: 'ES6+ Features',
                position: 1,
                textInputs: [
                    {
                        id: 'text-input-4',
                        type: 'textInput' as const,
                        helperText: JSON.stringify([
                            {
                                type: 'paragraph',
                                children: [
                                    { text: 'What are arrow functions and how do they differ from regular functions?' }
                                ]
                            }
                        ]),
                        required: true,
                        progress: {
                            answer: JSON.stringify([
                                {
                                    type: 'paragraph',
                                    children: [
                                        { text: 'Arrow functions are a more concise syntax for writing functions. Key differences include:' }
                                    ]
                                },
                                {
                                    type: 'bulleted-list',
                                    children: [
                                        {
                                            type: 'list-item',
                                            children: [{ text: 'Shorter syntax' }]
                                        },
                                        {
                                            type: 'list-item',
                                            children: [{ text: 'No ' }, { text: 'this', code: true }, { text: ' binding' }]
                                        },
                                        {
                                            type: 'list-item',
                                            children: [{ text: 'Cannot be used as constructors' }]
                                        }
                                    ]
                                }
                            ])
                        }
                    }
                ],
            },
            {
                id: 'lesson-2-2',
                title: 'Async/Await and Promises',
                position: 2,
                textInputs: [],
            },
        ],
    },
    {
        id: 'module-3',
        title: 'React Framework',
        lessons: [
            {
                id: 'lesson-3-1',
                title: 'React Components',
                position: 1,
                textInputs: [],
            },
            {
                id: 'lesson-3-2',
                title: 'State Management with Hooks',
                position: 2,
                textInputs: [],
            },
            {
                id: 'lesson-3-3',
                title: 'React Router',
                position: 3,
                textInputs: [],
            },
            {
                id: 'lesson-3-4',
                title: 'Context API',
                position: 4,
                textInputs: [],
            },
        ],
    },
] as TListStudentInteractionsSuccess['modules'];

const singleModuleMock = [
    {
        id: 'module-1',
        title: 'Introduction to Python',
        lessons: [
            {
                id: 'lesson-1-1',
                title: 'Python Basics',
                position: 1,
                textInputs: [],
            },
            {
                id: 'lesson-1-2',
                title: 'Data Types and Variables',
                position: 2,
                textInputs: [],
            },
        ],
    },
] as TListStudentInteractionsSuccess['modules'];

const manyLessonsMock = [
    {
        id: 'module-1',
        title: 'Complete Web Development Bootcamp',
        lessons: [
            { id: 'lesson-1', title: 'Introduction to HTML', position: 1, textInputs: [] },
            { id: 'lesson-2', title: 'HTML Forms and Inputs', position: 2, textInputs: [] },
            { id: 'lesson-3', title: 'CSS Styling Basics', position: 3, textInputs: [] },
            { id: 'lesson-4', title: 'CSS Flexbox', position: 4, textInputs: [] },
            { id: 'lesson-5', title: 'CSS Grid', position: 5, textInputs: [] },
            { id: 'lesson-6', title: 'Responsive Design', position: 6, textInputs: [] },
            { id: 'lesson-7', title: 'JavaScript Fundamentals', position: 7, textInputs: [] },
            { id: 'lesson-8', title: 'DOM Manipulation', position: 8, textInputs: [] },
            { id: 'lesson-9', title: 'Event Handling', position: 9, textInputs: [] },
            { id: 'lesson-10', title: 'AJAX and Fetch API', position: 10, textInputs: [] },
        ],
    },
] as TListStudentInteractionsSuccess['modules'];

/**
 * Default story with multiple modules
 */
export const Default: Story = {
    args: {
        locale: 'en',
        modules: mockModules,
        onViewLessonsClick: (moduleId: string, lessonId: string) => {
            console.log('View lesson clicked:', { moduleId, lessonId });
        },
    },
    parameters: {
        docs: {
            description: {
                story: 'Default view with multiple modules, each containing several lessons.',
            },
        },
    },
};

/**
 * Single module story
 */
export const SingleModule: Story = {
    args: {
        locale: 'en',
        modules: singleModuleMock,
        onViewLessonsClick: (moduleId: string, lessonId: string) => {
            console.log('View lesson clicked:', { moduleId, lessonId });
        },
    },
    parameters: {
        docs: {
            description: {
                story: 'Component with a single module containing a few lessons.',
            },
        },
    },
};

/**
 * Module with many lessons
 */
export const ManyLessons: Story = {
    args: {
        locale: 'en',
        modules: manyLessonsMock,
        onViewLessonsClick: (moduleId: string, lessonId: string) => {
            console.log('View lesson clicked:', { moduleId, lessonId });
        },
    },
    parameters: {
        docs: {
            description: {
                story: 'Module with many lessons to demonstrate scrolling and layout.',
            },
        },
    },
};

/**
 * Empty state
 */
export const Empty: Story = {
    args: {
        locale: 'en',
        modules: [],
        onViewLessonsClick: (moduleId: string, lessonId: string) => {
            console.log('View lesson clicked:', { moduleId, lessonId });
        },
    },
    parameters: {
        docs: {
            description: {
                story: 'Empty state when no modules are available.',
            },
        },
    },
};

/**
 * Module without any lessons
 */
export const ModuleWithoutLessons: Story = {
    args: {
        locale: 'en',
        modules: [
            {
                id: 'module-1',
                title: 'Empty Module',
                position: 1,
                lessonCount: 0,
                lessons: [],
            },
        ],
        onViewLessonsClick: (moduleId: string, lessonId: string) => {
            console.log('View lesson clicked:', { moduleId, lessonId });
        },
    },
    parameters: {
        docs: {
            description: {
                story: 'Module without any lessons.',
            },
        },
    },
};

/**
 * With Student Interactions - Showcases text input questions and answers
 */
export const WithStudentInteractions: Story = {
    args: {
        locale: 'en',
        modules: [
            {
                id: 'module-1',
                title: 'Web Development Fundamentals',
                position: 1,
                lessonCount: 2,
                lessons: [
                    {
                        id: 'lesson-1',
                        title: 'HTML and CSS Basics',
                        position: 1,
                        textInputs: [
                            {
                                id: 'text-input-1',
                                type: 'textInput' as const,
                                position: 1,
                                helperText: JSON.stringify([
                                    {
                                        type: 'paragraph',
                                        children: [
                                            { text: 'Explain the purpose of semantic HTML and provide ' },
                                            { text: '3 examples', bold: true },
                                            { text: ' of semantic tags.' }
                                        ]
                                    }
                                ]),
                                required: true,
                                progress: {
                                    type: 'textInput',
                                    componentId: 'text-input-1',
                                    answer: JSON.stringify([
                                        {
                                            type: 'paragraph',
                                            children: [
                                                { text: 'Semantic HTML uses tags that clearly describe their meaning to both the browser and the developer. This improves ' },
                                                { text: 'accessibility', bold: true },
                                                { text: ' and ' },
                                                { text: 'SEO', bold: true },
                                                { text: '.' }
                                            ]
                                        },
                                        {
                                            type: 'paragraph',
                                            children: [
                                                { text: 'Three examples of semantic tags:' }
                                            ]
                                        },
                                        {
                                            type: 'numbered-list',
                                            children: [
                                                {
                                                    type: 'list-item',
                                                    children: [
                                                        { text: '<header>', code: true },
                                                        { text: ' - defines a header for a document or section' }
                                                    ]
                                                },
                                                {
                                                    type: 'list-item',
                                                    children: [
                                                        { text: '<nav>', code: true },
                                                        { text: ' - defines navigation links' }
                                                    ]
                                                },
                                                {
                                                    type: 'list-item',
                                                    children: [
                                                        { text: '<article>', code: true },
                                                        { text: ' - defines independent, self-contained content' }
                                                    ]
                                                }
                                            ]
                                        }
                                    ])
                                }
                            },
                            {
                                id: 'text-input-2',
                                type: 'textInput' as const,
                                position: 2,
                                helperText: JSON.stringify([
                                    {
                                        type: 'paragraph',
                                        children: [
                                            { text: 'What is the CSS ' },
                                            { text: 'flexbox', code: true },
                                            { text: ' layout and when would you use it?' }
                                        ]
                                    }
                                ]),
                                required: true,
                                progress: {
                                    type: 'textInput',
                                    componentId: 'text-input-2',
                                    answer: JSON.stringify([
                                        {
                                            type: 'paragraph',
                                            children: [
                                                { text: 'Flexbox is a one-dimensional layout method for arranging items in rows or columns. I would use it when:' }
                                            ]
                                        },
                                        {
                                            type: 'bulleted-list',
                                            children: [
                                                {
                                                    type: 'list-item',
                                                    children: [{ text: 'Creating responsive navigation bars' }]
                                                },
                                                {
                                                    type: 'list-item',
                                                    children: [{ text: 'Centering elements vertically and horizontally' }]
                                                },
                                                {
                                                    type: 'list-item',
                                                    children: [{ text: 'Creating card layouts that adapt to screen size' }]
                                                },
                                                {
                                                    type: 'list-item',
                                                    children: [{ text: 'Distributing space between elements evenly' }]
                                                }
                                            ]
                                        }
                                    ])
                                }
                            }
                        ],
                    },
                    {
                        id: 'lesson-2',
                        title: 'JavaScript Fundamentals',
                        position: 2,
                        textInputs: [
                            {
                                id: 'text-input-3',
                                type: 'textInput' as const,
                                position: 1,
                                helperText: JSON.stringify([
                                    {
                                        type: 'paragraph',
                                        children: [
                                            { text: 'Describe the difference between ' },
                                            { text: 'let', code: true },
                                            { text: ', ' },
                                            { text: 'const', code: true },
                                            { text: ', and ' },
                                            { text: 'var', code: true },
                                            { text: ' in JavaScript.' }
                                        ]
                                    }
                                ]),
                                required: true,
                                progress: {
                                    type: 'textInput',
                                    componentId: 'text-input-3',
                                    answer: JSON.stringify([
                                        {
                                            type: 'paragraph',
                                            children: [
                                                { text: 'The main differences are:' }
                                            ]
                                        },
                                        {
                                            type: 'bulleted-list',
                                            children: [
                                                {
                                                    type: 'list-item',
                                                    children: [
                                                        { text: 'var', code: true, bold: true },
                                                        { text: ': function-scoped, can be redeclared, hoisted' }
                                                    ]
                                                },
                                                {
                                                    type: 'list-item',
                                                    children: [
                                                        { text: 'let', code: true, bold: true },
                                                        { text: ': block-scoped, cannot be redeclared in same scope, not hoisted' }
                                                    ]
                                                },
                                                {
                                                    type: 'list-item',
                                                    children: [
                                                        { text: 'const', code: true, bold: true },
                                                        { text: ': block-scoped, cannot be reassigned or redeclared, not hoisted' }
                                                    ]
                                                }
                                            ]
                                        }
                                    ])
                                }
                            }
                        ],
                    }
                ]
            }
        ],
        onViewLessonsClick: (moduleId: string, lessonId: string) => {
            console.log('View lesson clicked:', { moduleId, lessonId });
        },
    },
    parameters: {
        docs: {
            description: {
                story: 'Demonstrates student-coach interactions with text input questions and rich-text formatted answers.',
            },
        },
    },
};

/**
 * Interactive example
 */
export const Interactive: Story = {
    args: {
        locale: 'en',
        modules: mockModules,
    },
    render: (args) => {
        const [clickedLesson, setClickedLesson] = React.useState<{
            moduleId: string;
            lessonId: string;
        } | null>(null);

        return (
            <div className="space-y-4 max-w-4xl">
                <CoachStudentInteractionCard
                    {...args}
                    onViewLessonsClick={(moduleId, lessonId) => {
                        setClickedLesson({ moduleId, lessonId });
                    }}
                />
                {clickedLesson && (
                    <div className="p-4 bg-base-neutral-800 rounded-medium border border-action-default">
                        <h4 className="text-text-primary font-semibold mb-2">
                            Last Clicked Lesson:
                        </h4>
                        <p className="text-text-secondary text-sm">
                            Module ID: <span className="text-action-default">{clickedLesson.moduleId}</span>
                        </p>
                        <p className="text-text-secondary text-sm">
                            Lesson ID: <span className="text-action-default">{clickedLesson.lessonId}</span>
                        </p>
                    </div>
                )}
            </div>
        );
    },
    parameters: {
        docs: {
            description: {
                story: 'Interactive example that shows which lesson was clicked.',
            },
        },
    },
};