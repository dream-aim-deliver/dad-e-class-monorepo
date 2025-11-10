import { useCaseModels } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';

const getCourseStructureMock: useCaseModels.TGetCourseStructureSuccessResponse['data'] =
    {
        courseVersion: 1,
        modules: [
            {
                id: 1,
                title: 'Web Fundamentals',
                position: 1,
                lessons: [
                    {
                        id: 101,
                        title: 'HTML5 Essentials',
                        position: 1,
                        extraTraining: false,
                    },
                    {
                        id: 102,
                        title: 'CSS3 Styling Techniques',
                        position: 2,
                        extraTraining: false,
                    },
                    {
                        id: 103,
                        title: 'CSS Grid & Flexbox Mastery',
                        position: 3,
                        extraTraining: false,
                    },
                    {
                        id: 104,
                        title: 'Responsive Design Principles',
                        position: 4,
                        extraTraining: true,
                    },
                    {
                        id: 105,
                        title: 'JavaScript Basics',
                        position: 5,
                        extraTraining: true,
                    },
                    {
                        id: 106,
                        title: 'DOM Manipulation & Events',
                        position: 6,
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
                position: 2,
                lessons: [
                    {
                        id: 201,
                        title: 'React.js Fundamentals',
                        position: 1,
                        extraTraining: false,
                    },
                    {
                        id: 202,
                        title: 'Component Lifecycle & Hooks',
                        position: 2,
                        extraTraining: false,
                    },
                    {
                        id: 203,
                        title: 'State Management with Redux',
                        position: 3,
                        extraTraining: false,
                    },
                    {
                        id: 204,
                        title: 'React Router v6',
                        position: 4,
                        extraTraining: false,
                    },
                    {
                        id: 205,
                        title: 'Advanced React Patterns',
                        position: 5,
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
                position: 3,
                lessons: [
                    {
                        id: 301,
                        title: 'Node.js & Express Basics',
                        position: 1,
                        extraTraining: false,
                    },
                    {
                        id: 302,
                        title: 'REST API Design',
                        position: 2,
                        extraTraining: false,
                    },
                    {
                        id: 303,
                        title: 'Database Modeling with MongoDB',
                        position: 3,
                        extraTraining: false,
                    },
                    {
                        id: 304,
                        title: 'SQL Databases with PostgreSQL',
                        position: 4,
                        extraTraining: false,
                    },
                    {
                        id: 305,
                        title: 'Authentication Strategies',
                        position: 5,
                        extraTraining: false,
                    },
                    {
                        id: 306,
                        title: 'API Documentation with Swagger',
                        position: 6,
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
                position: 4,
                lessons: [
                    {
                        id: 401,
                        title: 'GraphQL Implementation',
                        position: 1,
                        extraTraining: false,
                    },
                    {
                        id: 402,
                        title: 'TypeScript for Full-Stack',
                        position: 2,
                        extraTraining: false,
                    },
                    {
                        id: 403,
                        title: 'WebSockets & Real-time Features',
                        position: 3,
                        extraTraining: false,
                    },
                    {
                        id: 404,
                        title: 'Advanced Testing Strategies',
                        position: 4,
                        extraTraining: false,
                    },
                    {
                        id: 405,
                        title: 'Performance Optimization',
                        position: 5,
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
                position: 5,
                lessons: [
                    {
                        id: 501,
                        title: 'Project Planning & Architecture',
                        position: 1,
                        extraTraining: false,
                    },
                    {
                        id: 502,
                        title: 'Setting up Development Environment',
                        position: 2,
                        extraTraining: false,
                    },
                    {
                        id: 503,
                        title: 'Agile Development Workflow',
                        position: 3,
                        extraTraining: false,
                    },
                    {
                        id: 504,
                        title: 'Frontend Implementation',
                        position: 4,
                        extraTraining: false,
                    },
                    {
                        id: 505,
                        title: 'Backend API Development',
                        position: 5,
                        extraTraining: false,
                    },
                    {
                        id: 506,
                        title: 'Integration & Testing',
                        position: 6,
                        extraTraining: false,
                    },
                    {
                        id: 507,
                        title: 'Deployment Strategies',
                        position: 7,
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
                position: 6,
                lessons: [
                    {
                        id: 601,
                        title: 'Web Security Fundamentals',
                        position: 1,
                        extraTraining: false,
                    },
                    {
                        id: 602,
                        title: 'JWT Authentication',
                        position: 2,
                        extraTraining: false,
                    },
                    {
                        id: 603,
                        title: 'OAuth 2.0 & Social Login',
                        position: 3,
                        extraTraining: false,
                    },
                    {
                        id: 604,
                        title: 'Input Validation & Sanitization',
                        position: 4,
                        extraTraining: false,
                    },
                    {
                        id: 605,
                        title: 'HTTPS & Certificate Management',
                        position: 5,
                        extraTraining: true,
                    },
                    {
                        id: 606,
                        title: 'Security Testing & Auditing',
                        position: 6,
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
                position: 7,
                lessons: [
                    {
                        id: 701,
                        title: 'CI/CD Pipelines with GitHub Actions',
                        position: 1,
                        extraTraining: false,
                    },
                    {
                        id: 702,
                        title: 'Docker Containerization',
                        position: 2,
                        extraTraining: false,
                    },
                    {
                        id: 703,
                        title: 'AWS Deployment Strategies',
                        position: 3,
                        extraTraining: false,
                    },
                    {
                        id: 704,
                        title: 'Kubernetes Basics',
                        position: 4,
                        extraTraining: true,
                    },
                    {
                        id: 705,
                        title: 'Monitoring & Logging',
                        position: 5,
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
            return {
                success: true,
                data: saveCourseStructureMock,
            };
        },
    );
