import { useCaseModels } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';

/**
 * Mock data structure for course materials - matches the CourseMaterialsAccordion component interface
 */
type CourseMaterialsData = {
  modules: Array<{
    id: string;
    position: number;
    title: string;
    lessons: Array<{
      id: string;
      position: number;
      title: string;
      materials?: Array<{
        id: string;
        type: string;
        text?: string;
        links?: Array<{
          title: string;
          url: string;
        }>;
        files?: Array<{
          id: string;
          name: string;
          downloadUrl: string;
          size?: number;
        }>;
      }>;
    }>;
    lessonCount: number;
  }>;
  moduleCount: number;
};

const listCourseMaterialsMock: CourseMaterialsData = {
    modules: [
        {
            id: 'module-1',
            position: 1,
            title: 'Getting Started',
            lessons: [
                {
                    id: 'lesson-1',
                    position: 1,
                    title: 'Introduction to React with All Material Types',
                    materials: [
                        {
                            type: 'richText',
                            id: 'material-1',
                            text: JSON.stringify([
                                {
                                    type: 'paragraph',
                                    children: [
                                        { text: 'Welcome to the React course! ' },
                                        { text: 'This material contains important information', bold: true },
                                        { text: ' about the course structure.' }
                                    ]
                                },
                                {
                                    type: 'paragraph',
                                    children: [
                                        { text: 'Here are the key topics we will cover:' }
                                    ]
                                },
                                {
                                    type: 'bulleted-list',
                                    children: [
                                        {
                                            type: 'list-item',
                                            children: [{ text: 'Components and Props' }]
                                        },
                                        {
                                            type: 'list-item',
                                            children: [{ text: 'State Management' }]
                                        },
                                        {
                                            type: 'list-item',
                                            children: [{ text: 'Hooks and Lifecycle' }]
                                        }
                                    ]
                                },
                                {
                                    type: 'paragraph',
                                    children: [
                                        { text: 'Make sure to complete all assignments and participate in discussions.' }
                                    ]
                                }
                            ])
                        },
                        {
                            type: 'links',
                            id: 'material-2',
                            links: [
                                {
                                    title: 'React Documentation',
                                    url: 'https://react.dev'
                                },
                                {
                                    title: 'React GitHub',
                                    url: 'https://github.com/facebook/react'
                                },
                                {
                                    title: 'React Tutorial',
                                    url: 'https://react.dev/learn'
                                }
                            ]
                        },
                        {
                            type: 'downloadFiles',
                            id: 'material-3',
                            files: [
                                {
                                    id: 'file-1',
                                    name: 'starter-project.zip',
                                    size: 1024000,
                                    downloadUrl: '/downloads/starter-project.zip'
                                },
                                {
                                    id: 'file-2',
                                    name: 'environment-setup.pdf',
                                    size: 512000,
                                    downloadUrl: '/downloads/environment-setup.pdf'
                                },
                                {
                                    id: 'file-3',
                                    name: 'cheatsheet.pdf',
                                    size: 256000,
                                    downloadUrl: '/downloads/cheatsheet.pdf'
                                }
                            ]
                        }
                    ]
                },
                {
                    id: 'lesson-2',
                    position: 2,
                    title: 'Setting Up Your Environment',
                    materials: [
                        {
                            type: 'richText',
                            id: 'material-4',
                            text: JSON.stringify([
                                {
                                    type: 'heading',
                                    level: 1,
                                    children: [{ text: 'Setting Up Your Development Environment' }]
                                },
                                {
                                    type: 'paragraph',
                                    children: [
                                        { text: 'Before we start coding, you need to set up your development environment. This guide will walk you through the process.' }
                                    ]
                                },
                                {
                                    type: 'heading',
                                    level: 2,
                                    children: [{ text: 'Prerequisites' }]
                                },
                                {
                                    type: 'numbered-list',
                                    children: [
                                        {
                                            type: 'list-item',
                                            children: [{ text: 'Node.js (version 18 or higher)' }]
                                        },
                                        {
                                            type: 'list-item',
                                            children: [{ text: 'npm or yarn package manager' }]
                                        },
                                        {
                                            type: 'list-item',
                                            children: [{ text: 'Git for version control' }]
                                        },
                                        {
                                            type: 'list-item',
                                            children: [{ text: 'A code editor (VS Code recommended)' }]
                                        }
                                    ]
                                }
                            ])
                        }
                    ]
                }
            ],
            lessonCount: 2
        },
        {
            id: 'module-2',
            position: 2,
            title: 'Core Concepts',
            lessons: [
                {
                    id: 'lesson-3',
                    position: 1,
                    title: 'Components and Props',
                    materials: [
                        {
                            type: 'richText',
                            id: 'material-5',
                            text: JSON.stringify([
                                {
                                    type: 'paragraph',
                                    children: [
                                        { text: 'Components are the building blocks of React applications. They allow you to split the UI into independent, reusable pieces.' }
                                    ]
                                },
                                {
                                    type: 'heading',
                                    level: 2,
                                    children: [{ text: 'Types of Components' }]
                                },
                                {
                                    type: 'bulleted-list',
                                    children: [
                                        {
                                            type: 'list-item',
                                            children: [
                                                { text: 'Functional Components', italic: true },
                                                { text: ' - Modern way to write components using functions' }
                                            ]
                                        },
                                        {
                                            type: 'list-item',
                                            children: [
                                                { text: 'Class Components', italic: true },
                                                { text: ' - Traditional way using ES6 classes' }
                                            ]
                                        }
                                    ]
                                }
                            ])
                        },
                        {
                            type: 'links',
                            id: 'material-6',
                            links: [
                                {
                                    title: 'React Components Guide',
                                    url: 'https://react.dev/learn/your-first-component'
                                }
                            ]
                        }
                    ]
                }
            ],
            lessonCount: 1
        }
    ],
    moduleCount: 2
};

const listCourseMaterialsErrorMock: useCaseModels.TListCourseMaterialsUseCaseErrorResponse =
    {
        success: false,
        data: {
            errorType: 'NotFoundError',
            message: 'Course materials not found',
            operation: 'listCourseMaterials',
            context: {},
        },
    };

export const listCourseMaterials = t.procedure
    .input(useCaseModels.ListCourseMaterialsRequestSchema)
    .query(
        async (
            opts,
        ): Promise<useCaseModels.TListCourseMaterialsUseCaseResponse> => {
            const slug = opts.input.courseSlug;
            // Return mock data for all other courses
            return {
                success: true,
                data: listCourseMaterialsMock as any,
            };
        },
    );
