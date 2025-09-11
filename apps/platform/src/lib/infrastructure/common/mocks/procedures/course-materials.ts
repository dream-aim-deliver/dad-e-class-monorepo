import { useCaseModels } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';

const listCourseMaterialsMock: useCaseModels.TListCourseMaterialsSuccessResponse['data'] = {
    modules: [
        {
            id: 'module-1',
            position: 1,
            title: 'Getting Started',
            lessons: [
                {
                    id: 'lesson-1',
                    position: 1,
                    title: 'Introduction to React',
                    materials: [
                        {
                            type: 'richText',
                            id: 'material-1',
                            title: 'Course Overview',
                            content: '<p>Welcome to the React course! This material contains important information about the course structure.</p>'
                        },
                        {
                            type: 'links',
                            id: 'material-2',
                            title: 'Useful Resources',
                            links: [
                                {
                                    title: 'React Documentation',
                                    url: 'https://react.dev',
                                    description: 'Official React documentation'
                                },
                                {
                                    title: 'React GitHub',
                                    url: 'https://github.com/facebook/react',
                                    description: 'React source code repository'
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
                            type: 'downloadFiles',
                            id: 'material-3',
                            title: 'Project Files',
                            files: [
                                {
                                    id: 'file-1',
                                    name: 'starter-project.zip',
                                    size: 1024000,
                                    downloadUrl: '/downloads/starter-project.zip',
                                    mimeType: 'application/zip'
                                },
                                {
                                    id: 'file-2',
                                    name: 'environment-setup.pdf',
                                    size: 512000,
                                    downloadUrl: '/downloads/environment-setup.pdf',
                                    mimeType: 'application/pdf'
                                }
                            ]
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
                            id: 'material-4',
                            title: 'Component Theory',
                            content: '<h2>Understanding Components</h2><p>Components are the building blocks of React applications...</p>'
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
                data: listCourseMaterialsMock,
            };
        },
    );
