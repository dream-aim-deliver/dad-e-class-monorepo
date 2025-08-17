import { useCaseModels } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';

const getCourseStructureMock: useCaseModels.TGetCourseStructureSuccessResponse['data'] =
    {
        courseVersion: 1,
        modules: [
            {
                id: 1,
                title: 'Web Fundamentals',
                order: 1,
                lessons: [
                    {
                        id: 101,
                        title: 'HTML5 Essentials',
                        order: 1,
                        extraTraining: false,
                    },
                    {
                        id: 102,
                        title: 'CSS3 Styling Techniques',
                        order: 2,
                        extraTraining: false,
                    },
                    {
                        id: 103,
                        title: 'CSS Grid & Flexbox Mastery',
                        order: 3,
                        extraTraining: false,
                    },
                    {
                        id: 104,
                        title: 'Responsive Design Principles',
                        order: 4,
                        extraTraining: true,
                    },
                    {
                        id: 105,
                        title: 'JavaScript Basics',
                        order: 5,
                        extraTraining: true,
                    },
                    {
                        id: 106,
                        title: 'DOM Manipulation & Events',
                        order: 6,
                        extraTraining: false,
                    },
                ],
                milestones: [
                    {
                        id: 1001,
                        precedingLessonId: 103,
                    },
                    {
                        id: 1002,
                        precedingLessonId: 106,
                    },
                ],
            },
            {
                id: 2,
                title: 'Frontend Development',
                order: 2,
                lessons: [
                    {
                        id: 201,
                        title: 'React.js Fundamentals',
                        order: 1,
                        extraTraining: false,
                    },
                    {
                        id: 202,
                        title: 'Component Lifecycle & Hooks',
                        order: 2,
                        extraTraining: false,
                    },
                    {
                        id: 203,
                        title: 'State Management with Redux',
                        order: 3,
                        extraTraining: false,
                    },
                    {
                        id: 204,
                        title: 'React Router v6',
                        order: 4,
                        extraTraining: false,
                    },
                    {
                        id: 205,
                        title: 'Advanced React Patterns',
                        order: 5,
                        extraTraining: true,
                    },
                ],
                milestones: [
                    {
                        id: 2001,
                        precedingLessonId: 0,
                    },
                    {
                        id: 2002,
                        precedingLessonId: 202,
                    },
                    {
                        id: 2003,
                        precedingLessonId: 205,
                    },
                ],
            },
            {
                id: 3,
                title: 'Backend Development',
                order: 3,
                lessons: [
                    {
                        id: 301,
                        title: 'Node.js & Express Basics',
                        order: 1,
                        extraTraining: false,
                    },
                    {
                        id: 302,
                        title: 'REST API Design',
                        order: 2,
                        extraTraining: false,
                    },
                    {
                        id: 303,
                        title: 'Database Modeling with MongoDB',
                        order: 3,
                        extraTraining: false,
                    },
                    {
                        id: 304,
                        title: 'SQL Databases with PostgreSQL',
                        order: 4,
                        extraTraining: false,
                    },
                    {
                        id: 305,
                        title: 'Authentication Strategies',
                        order: 5,
                        extraTraining: false,
                    },
                    {
                        id: 306,
                        title: 'API Documentation with Swagger',
                        order: 6,
                        extraTraining: true,
                    },
                ],
                milestones: [
                    {
                        id: 3001,
                        precedingLessonId: 302,
                    },
                    {
                        id: 3002,
                        precedingLessonId: 304,
                    },
                    {
                        id: 3003,
                        precedingLessonId: 306,
                    },
                ],
            },
            {
                id: 4,
                title: 'Advanced Concepts',
                order: 4,
                lessons: [
                    {
                        id: 401,
                        title: 'GraphQL Implementation',
                        order: 1,
                        extraTraining: false,
                    },
                    {
                        id: 402,
                        title: 'TypeScript for Full-Stack',
                        order: 2,
                        extraTraining: false,
                    },
                    {
                        id: 403,
                        title: 'WebSockets & Real-time Features',
                        order: 3,
                        extraTraining: false,
                    },
                    {
                        id: 404,
                        title: 'Advanced Testing Strategies',
                        order: 4,
                        extraTraining: false,
                    },
                    {
                        id: 405,
                        title: 'Performance Optimization',
                        order: 5,
                        extraTraining: false,
                    },
                ],
                milestones: [
                    {
                        id: 4001,
                        precedingLessonId: 402,
                    },
                    {
                        id: 4002,
                        precedingLessonId: 405,
                    },
                ],
            },
            {
                id: 5,
                title: 'Capstone Project',
                order: 5,
                lessons: [
                    {
                        id: 501,
                        title: 'Project Planning & Architecture',
                        order: 1,
                        extraTraining: false,
                    },
                    {
                        id: 502,
                        title: 'Setting up Development Environment',
                        order: 2,
                        extraTraining: false,
                    },
                    {
                        id: 503,
                        title: 'Agile Development Workflow',
                        order: 3,
                        extraTraining: false,
                    },
                    {
                        id: 504,
                        title: 'Frontend Implementation',
                        order: 4,
                        extraTraining: false,
                    },
                    {
                        id: 505,
                        title: 'Backend API Development',
                        order: 5,
                        extraTraining: false,
                    },
                    {
                        id: 506,
                        title: 'Integration & Testing',
                        order: 6,
                        extraTraining: false,
                    },
                    {
                        id: 507,
                        title: 'Deployment Strategies',
                        order: 7,
                        extraTraining: false,
                    },
                ],
                milestones: [
                    {
                        id: 5001,
                        precedingLessonId: 502,
                    },
                    {
                        id: 5002,
                        precedingLessonId: 505,
                    },
                    {
                        id: 5003,
                        precedingLessonId: 507,
                    },
                ],
            },
            {
                id: 6,
                title: 'Security & Authentication',
                order: 6,
                lessons: [
                    {
                        id: 601,
                        title: 'Web Security Fundamentals',
                        order: 1,
                        extraTraining: false,
                    },
                    {
                        id: 602,
                        title: 'JWT Authentication',
                        order: 2,
                        extraTraining: false,
                    },
                    {
                        id: 603,
                        title: 'OAuth 2.0 & Social Login',
                        order: 3,
                        extraTraining: false,
                    },
                    {
                        id: 604,
                        title: 'Input Validation & Sanitization',
                        order: 4,
                        extraTraining: false,
                    },
                    {
                        id: 605,
                        title: 'HTTPS & Certificate Management',
                        order: 5,
                        extraTraining: true,
                    },
                    {
                        id: 606,
                        title: 'Security Testing & Auditing',
                        order: 6,
                        extraTraining: false,
                    },
                ],
                milestones: [
                    {
                        id: 6001,
                        precedingLessonId: 601,
                    },
                    {
                        id: 6002,
                        precedingLessonId: 604,
                    },
                ],
            },
            {
                id: 7,
                title: 'DevOps & Deployment',
                order: 7,
                lessons: [
                    {
                        id: 701,
                        title: 'CI/CD Pipelines with GitHub Actions',
                        order: 1,
                        extraTraining: false,
                    },
                    {
                        id: 702,
                        title: 'Docker Containerization',
                        order: 2,
                        extraTraining: false,
                    },
                    {
                        id: 703,
                        title: 'AWS Deployment Strategies',
                        order: 3,
                        extraTraining: false,
                    },
                    {
                        id: 704,
                        title: 'Kubernetes Basics',
                        order: 4,
                        extraTraining: true,
                    },
                    {
                        id: 705,
                        title: 'Monitoring & Logging',
                        order: 5,
                        extraTraining: false,
                    },
                ],
                milestones: [
                    {
                        id: 7001,
                        precedingLessonId: 702,
                    },
                    {
                        id: 7002,
                        precedingLessonId: 705,
                    },
                ],
            },
        ],
    };

export const getCourseStructure = t.procedure
    .input(useCaseModels.GetCourseStructureRequestSchema)
    .query(
        async (): Promise<useCaseModels.TGetCourseStructureUseCaseResponse> => {
            return {
                success: true,
                data: getCourseStructureMock,
            };
        },
    );

const saveCourseStructureMock: useCaseModels.TSaveCourseStructureSuccessResponse['data'] =
    {
        courseVersion: 1,
        modules: [],
    };

const saveCourseStructureError: useCaseModels.TSaveCourseStructureUseCaseErrorResponse =
    {
        success: false,
        data: {
            errorType: 'ConflictError',
            courseVersion: 2,
            message: 'Course has been modified before saving.',
            operation: 'saveCourseStructure',
            context: {},
            trace: undefined,
        },
    };

export const saveCourseStructure = t.procedure
    .input(useCaseModels.SaveCourseStructureRequestSchema)
    .mutation(
        async (
            ctx,
        ): Promise<useCaseModels.TSaveCourseStructureUseCaseResponse> => {
            console.dir(ctx.input, { depth: null });
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay
            return {
                success: true,
                data: saveCourseStructureMock,
            };
        },
    );
