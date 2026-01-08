import { useCaseModels } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';

// TODO: add mock data
const listLessonComponentsMock: useCaseModels.TListLessonComponentsSuccessResponse['data'] =
{
    courseVersion: 1,
    lessonTitle: "JavaScript",
    components: [
        // RichText Component
        {
            id: 'comp_001',
            order: 1,
            type: 'richText',
            includeInMaterials: true,
            text: JSON.stringify([
                {
                    type: 'paragraph',
                    children: [
                        {
                            text: 'Welcome to this comprehensive lesson on ',
                        },
                        {
                            text: 'Modern Web Development',
                            bold: true,
                        },
                        {
                            text: '. In this lesson, we will explore ',
                        },
                        {
                            text: 'React, TypeScript, and best practices',
                            italic: true,
                        },
                        {
                            text: ' for building scalable applications.',
                        },
                    ],
                },
            ]),
        },
        // Heading Component
        {
            id: 'comp_002',
            order: 2,
            type: 'heading',
            text: 'Introduction to React Hooks',
            size: 'h2',
        },
        // TextInput Component
        {
            id: 'comp_003',
            order: 3,
            type: 'textInput',
            helperText: JSON.stringify([
                {
                    type: 'paragraph',
                    children: [
                        {
                            text: 'Please share your ',
                        },
                        {
                            text: 'previous experience',
                            bold: true,
                        },
                        {
                            text: ' with React development.',
                        },
                    ],
                },
            ]),
            required: true,
            progress: {
                answer: 'I have been working with React for about 2 years, mainly building single-page applications and working with hooks like useState and useEffect. I have some experience with Context API and custom hooks as well.'
            },
        },
        // SingleChoice Component
        {
            id: 'comp_004',
            order: 4,
            type: 'singleChoice',
            title: 'Which React Hook is used for state management?',
            options: [
                { id: '1', name: 'useEffect' },
                { id: '2', name: 'useState' },
                { id: '3', name: 'useContext' },
                { id: '4', name: 'useReducer' },
            ],
            required: true,
            progress: {
                answerId: '2'
            },
        },
        // MultipleChoice Component
        {
            id: 'comp_005',
            order: 5,
            type: 'multipleChoice',
            title: 'Select all valid JavaScript data types:',
            options: [
                { id: '1', name: 'string' },
                { id: '2', name: 'number' },
                { id: '3', name: 'boolean' },
                { id: '4', name: 'undefined' },
                { id: '5', name: 'integer' },
            ],
            required: false,
            progress: {
                answerIds: ['1', '2', '3', '4']
            },
        },
        // OneOutOfThree Component
        {
            id: 'comp_006',
            order: 6,
            type: 'oneOutOfThree',
            title: 'Match the React Hook with its primary use case:',
            columns: [
                { id: '1', name: 'State Management' },
                { id: '2', name: 'Side Effects' },
                { id: '3', name: 'Context Access' },
            ],
            rows: [
                { id: '1', name: 'useState' },
                { id: '2', name: 'useEffect' },
                { id: '3', name: 'useContext' },
            ],
            required: true,
            progress: {
                answers: [
                    { rowId: '1', columnId: '1' }, // useState -> State Management
                    { rowId: '2', columnId: '2' }, // useEffect -> Side Effects
                    { rowId: '3', columnId: '3' }, // useContext -> Context Access
                ]
            },
        },
        // Video Component
        {
            id: 'comp_007',
            order: 7,
            type: 'video',
            videoFile: {
                id: 'video_001',
                name: 'React Hooks Tutorial.mp4',
                size: 157286400,
                category: 'video',
                downloadUrl:
                    'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
                thumbnailUrl:
                    'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                playbackId: 'abc123def456',
            },
        },
        // Image Component
        {
            id: 'comp_008',
            order: 8,
            type: 'image',
            imageFile: {
                id: 'image_001',
                name: 'react-architecture.jpg',
                size: 2048000,
                category: 'image',
                downloadUrl:
                    'https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            },
        },
        // ImageCarousel Component
        {
            id: 'comp_009',
            order: 9,
            type: 'imageCarousel',
            imageFiles: [
                {
                    id: 'carousel_img_001',
                    name: 'code-editor.jpg',
                    size: 1536000,
                    category: 'image',
                    downloadUrl:
                        'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                },
                {
                    id: 'carousel_img_002',
                    name: 'laptop-coding.jpg',
                    size: 1792000,
                    category: 'image',
                    downloadUrl:
                        'https://images.unsplash.com/photo-1484417894907-623942c8ee29?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                },
                {
                    id: 'carousel_img_003',
                    name: 'team-collaboration.jpg',
                    size: 1920000,
                    category: 'image',
                    downloadUrl:
                        'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                },
                {
                    id: 'carousel_img_004',
                    name: 'team-collaboration.jpg',
                    size: 1920000,
                    category: 'image',
                    downloadUrl:
                        'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&w=1200&q=80',
                },
            ],
        },
        // Links Component
        {
            id: 'comp_010',
            order: 10,
            type: 'links',
            links: [
                {
                    title: 'React Official Documentation',
                    url: 'https://reactjs.org/docs/getting-started.html',
                    iconFile: null,
                },
                {
                    title: 'TypeScript Handbook',
                    url: 'https://www.typescriptlang.org/docs/',
                    iconFile: {
                        id: 'icon_002',
                        name: 'typescript-icon.png',
                        size: 28672,
                        category: 'image',
                        downloadUrl:
                            'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=64&q=80',
                    },
                },
                {
                    title: 'MDN Web Docs',
                    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
                    iconFile: null,
                },
            ],
            includeInMaterials: true,
            asPartOfMaterialsOnly: false,
        },
        // DownloadFiles Component
        {
            id: 'comp_011',
            order: 11,
            type: 'downloadFiles',
            files: [
                {
                    id: 'download_001',
                    name: 'React_Cheat_Sheet.pdf',
                    size: 2097152,
                    category: 'document',
                    downloadUrl:
                        'https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf',
                    thumbnailUrl:
                        'https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
                },
                {
                    id: 'download_002',
                    name: 'Project_Template.zip',
                    size: 5242880,
                    category: 'generic',
                    downloadUrl:
                        'https://github.com/facebook/create-react-app/archive/refs/heads/main.zip',
                    thumbnailUrl: null,
                },
                {
                    id: 'download_003',
                    name: 'Coding_Standards.docx',
                    size: 1048576,
                    category: 'document',
                    downloadUrl:
                        'https://file-examples.com/storage/fee2f0e8096d5e6c7e5e6e8/2017/10/file_example_DOC_100kB.doc',
                    thumbnailUrl:
                        'https://images.unsplash.com/photo-1568992687947-868a62a9f521?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
                },
            ],
        },
        // UploadFiles Component
        {
            id: 'comp_012',
            order: 12,
            type: 'uploadFiles',
            description:
                'Please upload your completed React component exercise files. Accepted formats: .js, .jsx, .ts, .tsx',
            progress: {
                files: [
                    {
                        id: 'uploaded_001',
                        name: 'TodoComponent.tsx',
                        size: 4096,
                        category: 'generic',
                        downloadUrl: 'https://example.com/uploads/TodoComponent.tsx',
                    },
                    {
                        id: 'uploaded_002',
                        name: 'UserProfile.jsx',
                        size: 2048,
                        category: 'generic',
                        downloadUrl: 'https://example.com/uploads/UserProfile.jsx',
                    },
                ]
            },
        },
        // QuizTypeOne Component
        {
            id: 'comp_013',
            order: 13,
            type: 'quizTypeOne',
            title: 'React Component Lifecycle',
            description:
                'Identify the correct React component lifecycle method',
            imageFile: {
                id: 'quiz_img_001',
                name: 'react-lifecycle.jpg',
                size: 1638400,
                category: 'image',
                downloadUrl:
                    'https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            },
            options: [
                { id: '1', name: 'componentDidMount' },
                { id: '2', name: 'componentWillMount' },
                { id: '3', name: 'componentDidUpdate' },
                { id: '4', name: 'componentWillUnmount' },
            ],
            correctOptionId: '1',
        },
        // QuizTypeTwo Component
        {
            id: 'comp_014',
            order: 14,
            type: 'quizTypeTwo',
            title: 'Frontend Technologies Categorization',
            description:
                'Categorize the following technologies by their primary purpose',
            imageFile: {
                id: 'quiz_img_002',
                name: 'frontend-tech.jpg',
                size: 1843200,
                category: 'image',
                downloadUrl:
                    'https://images.unsplash.com/photo-1627398242454-45a1465c2479?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            },
            groups: [
                {
                    id: '1',
                    title: 'Frontend Frameworks',
                    options: [
                        { id: '1', name: 'React' },
                        { id: '2', name: 'Vue.js' },
                        { id: '3', name: 'Angular' },
                    ],
                    correctOptionId: '1',
                },
                {
                    id: '2',
                    title: 'Styling Solutions',
                    options: [
                        { id: '4', name: 'Tailwind CSS' },
                        { id: '5', name: 'Styled Components' },
                        { id: '6', name: 'SCSS' },
                    ],
                    correctOptionId: '5',
                },
                {
                    id: '3',
                    title: 'Build Tools',
                    options: [
                        { id: '7', name: 'Webpack' },
                        { id: '8', name: 'Vite' },
                        { id: '9', name: 'Parcel' },
                    ],
                    correctOptionId: '9',
                },
            ],
        },
        // QuizTypeThree Component
        {
            id: 'comp_015',
            order: 15,
            type: 'quizTypeThree',
            title: 'Code Pattern Recognition',
            description:
                'Select the image that represents the correct React Hook pattern',
            options: [
                {
                    id: '1',
                    imageFile: {
                        id: 'pattern_img_001',
                        name: 'useState-pattern.jpg',
                        size: 1024000,
                        category: 'image',
                        downloadUrl:
                            'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                    },
                    description: 'useState Hook Implementation',
                },
                {
                    id: '2',
                    imageFile: {
                        id: 'pattern_img_002',
                        name: 'useEffect-pattern.jpg',
                        size: 1126400,
                        category: 'image',
                        downloadUrl:
                            'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                    },
                    description: 'useEffect Hook Implementation',
                },
                {
                    id: '3',
                    imageFile: {
                        id: 'pattern_img_003',
                        name: 'useContext-pattern.jpg',
                        size: 998400,
                        category: 'image',
                        downloadUrl:
                            'https://images.unsplash.com/photo-1484417894907-623942c8ee29?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                    },
                    description: 'useContext Hook Implementation',
                },
            ],
            correctOptionId: '1',
        },
        // QuizTypeFour Component
        {
            id: 'comp_016',
            order: 16,
            type: 'quizTypeFour',
            title: 'Development Environment Setup',
            description:
                'Select all the tools you would need for a React development environment',
            options: [
                {
                    id: '1',
                    imageFile: {
                        id: 'tool_img_001',
                        name: 'vscode-editor.jpg',
                        size: 1331200,
                        category: 'image',
                        downloadUrl:
                            'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                    },
                    description: 'Code Editor (VS Code)',
                },
                {
                    id: '2',
                    imageFile: {
                        id: 'tool_img_002',
                        name: 'nodejs-runtime.jpg',
                        size: 1228800,
                        category: 'image',
                        downloadUrl:
                            'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                    },
                    description: 'Node.js Runtime',
                },
                {
                    id: '3',
                    imageFile: {
                        id: 'tool_img_003',
                        name: 'browser-devtools.jpg',
                        size: 1433600,
                        category: 'image',
                        downloadUrl:
                            'https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                    },
                    description: 'Browser Developer Tools',
                },
                {
                    id: '4',
                    imageFile: {
                        id: 'tool_img_004',
                        name: 'photoshop-design.jpg',
                        size: 1536000,
                        category: 'image',
                        downloadUrl:
                            'https://images.unsplash.com/photo-1626785774625-0b1c2c4eab67?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                    },
                    description: 'Adobe Photoshop',
                },
            ],
        },
        // CoachingSession Component
        {
            id: 'comp_017',
            order: 17,
            type: 'coachingSession',
            courseCoachingOfferingId: 2,
            name: 'Quick sprint',
            duration: 20,
        },
        // Assignment Component
        {
            id: 'comp_018',
            order: 18,
            type: 'assignment',
            title: 'Build a Todo App with React Hooks',
            description:
                'Create a fully functional todo application using React hooks. The app should include adding, editing, deleting, and marking todos as complete. Use TypeScript for type safety.',
            resources: [
                {
                    id: 'resource_001',
                    name: 'Todo_App_Requirements.pdf',
                    size: 1572864,
                    category: 'document',
                    downloadUrl:
                        'https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf',
                    thumbnailUrl:
                        'https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
                },
                {
                    id: 'resource_002',
                    name: 'Starter_Template.zip',
                    size: 3145728,
                    category: 'generic',
                    downloadUrl:
                        'https://github.com/facebook/create-react-app/archive/refs/heads/main.zip',
                    thumbnailUrl: null,
                },
            ],
            links: [
                {
                    title: 'React Hooks API Reference',
                    url: 'https://reactjs.org/docs/hooks-reference.html',
                    iconFile: {
                        id: 'link_icon_001',
                        name: 'react-docs-icon.png',
                        size: 16384,
                        category: 'image',
                        downloadUrl:
                            'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=32&q=80',
                    },
                },
                {
                    title: 'TypeScript React Tutorial',
                    url: 'https://www.typescriptlang.org/docs/handbook/react.html',
                    iconFile: null,
                },
            ],
        },
    ],
};

export const listLessonComponents = t.procedure
    .input(useCaseModels.ListLessonComponentsRequestSchema)
    .query(
        async (): Promise<useCaseModels.TListLessonComponentsUseCaseResponse> => {
            return {
                success: true,
                data: listLessonComponentsMock,
            };
        },
    );

export const saveLessonComponents = t.procedure
    .input(useCaseModels.SaveLessonComponentsRequestSchema)
    .mutation(
        async (
            ctx,
        ): Promise<useCaseModels.TSaveLessonComponentsUseCaseResponse> => {
            console.log(ctx.input);
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay
            return {
                success: true,
                data: {
                    ...listLessonComponentsMock,
                    components: listLessonComponentsMock.components.slice(0, 3),
                },
            };
        },
    );
