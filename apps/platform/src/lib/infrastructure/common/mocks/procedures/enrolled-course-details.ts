import { useCaseModels } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';

const getEnrolledCourseDetailsMock: useCaseModels.TGetEnrolledCourseDetailsSuccessResponse[] =
    [
        {
            success: true,
            data: {
                courseVersion: 2,
                title: 'Advanced React Patterns & Performance',
                imageFile: {
                    id: '1',
                    name: 'advanced-react-patterns.jpg',
                    size: 102400,
                    category: 'image',
                    downloadUrl:
                        'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop',
                },
                averageRating: 4.8,
                reviewCount: 247,
                description: JSON.stringify([
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
                duration: {
                    video: 180,
                    coaching: 60,
                    selfStudy: 120,
                },
                author: {
                    username: 'sarah_dev',
                    name: 'Sarah',
                    surname: 'Johnson',
                    averageRating: 4.9,
                    avatarUrl:
                        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face',
                },
                students: [
                    {
                        name: 'Alex',
                        avatarUrl:
                            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
                    },
                    {
                        name: 'Maria',
                        avatarUrl:
                            'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
                    },
                    {
                        name: 'David',
                        avatarUrl:
                            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
                    },
                ],
                studentCount: 1247,
            },
        },
        {
            success: true,
            data: {
                courseVersion: 1,
                title: 'Machine Learning Fundamentals',
                imageFile: {
                    id: '2',
                    name: 'machine-learning-fundamentals.jpg',
                    size: 102400,
                    category: 'image',
                    downloadUrl:
                        'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=400&fit=crop',
                },
                averageRating: 4.6,
                reviewCount: 189,
                description:
                    'Dive into machine learning concepts, algorithms, and practical implementations. Perfect for beginners looking to understand ML from the ground up.',
                duration: {
                    video: 240,
                    coaching: 90,
                    selfStudy: 180,
                },
                author: {
                    username: 'ml_master',
                    name: 'Dr. Michael',
                    surname: 'Thompson',
                    averageRating: 4.7,
                    avatarUrl:
                        'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
                },
                students: [
                    {
                        name: 'Emma Wilson',
                        avatarUrl:
                            'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
                    },
                    {
                        name: 'James Brown',
                        avatarUrl:
                            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
                    },
                    {
                        name: 'Sophie Chen',
                        avatarUrl:
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
                    },
                ],
                studentCount: 892,
            },
        },
        {
            success: true,
            data: {
                courseVersion: 1,
                title: 'UI/UX Design Mastery',
                imageFile: {
                    id: '3',
                    name: 'ui-ux-design-mastery.jpg',
                    size: 102400,
                    category: 'image',
                    downloadUrl:
                        'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=400&fit=crop',
                },
                averageRating: 4.9,
                reviewCount: 324,
                description:
                    'Learn modern UI/UX design principles, user research methods, and design thinking processes. Create beautiful and functional user interfaces.',
                duration: {
                    video: 150,
                    coaching: 45,
                    selfStudy: 90,
                },
                author: {
                    username: 'design_guru',
                    name: 'Isabella',
                    surname: 'Garcia',
                    averageRating: 4.8,
                    avatarUrl:
                        'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
                },
                students: [
                    {
                        name: 'Ryan Murphy',
                        avatarUrl:
                            'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face',
                    },
                    {
                        name: 'Lisa Zhang',
                        avatarUrl:
                            'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face',
                    },
                    {
                        name: 'Tom Anderson',
                        avatarUrl: null, // Testing nullable field
                    },
                ],
                studentCount: 1567,
            },
        },
        {
            success: true,
            data: {
                courseVersion: 1,
                title: 'DevOps & Cloud Architecture',
                imageFile: {
                    id: '4',
                    name: 'devops-cloud-architecture.jpg',
                    size: 102400,
                    category: 'image',
                    downloadUrl:
                        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop',
                },
                averageRating: 4.7,
                reviewCount: 156,
                description:
                    'Master DevOps practices, cloud infrastructure, and deployment strategies. Learn Docker, Kubernetes, CI/CD, and cloud platforms.',
                duration: {
                    video: 200,
                    coaching: 0, // No coaching - testing 0 value
                    selfStudy: 160,
                },
                author: {
                    username: 'devops_pro',
                    name: 'Ahmed',
                    surname: 'Hassan',
                    averageRating: 4.6,
                    avatarUrl:
                        'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face',
                },
                students: [
                    {
                        name: 'Jennifer Lee',
                        avatarUrl:
                            'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&h=150&fit=crop&crop=face',
                    },
                    {
                        name: 'Carlos Mendez',
                        avatarUrl:
                            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
                    },
                    {
                        name: 'Anna Kowalski',
                        avatarUrl:
                            'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=150&h=150&fit=crop&crop=face',
                    },
                ],
                studentCount: 743,
            },
        },
        {
            success: true,
            data: {
                courseVersion: 1,
                title: 'Mobile App Development with Flutter',
                imageFile: null, // Testing nullable field
                averageRating: 4.5,
                reviewCount: 98,
                description:
                    'Build cross-platform mobile applications using Flutter and Dart. Learn widgets, state management, and app deployment.',
                duration: {
                    video: 0, // No video content - testing 0 value
                    coaching: 120,
                    selfStudy: 80,
                },
                author: {
                    username: 'flutter_dev',
                    name: 'Priya',
                    surname: 'Patel',
                    averageRating: 4.4,
                    avatarUrl: null, // Testing nullable field
                },
                students: [
                    {
                        name: 'Michael Johnson',
                        avatarUrl:
                            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
                    },
                    {
                        name: 'Elena Rodriguez',
                        avatarUrl:
                            'https://images.unsplash.com/photo-1494790108755-2616b2e38f17?w=150&h=150&fit=crop&crop=face',
                    },
                    {
                        name: 'Kevin Park',
                        avatarUrl:
                            'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
                    },
                ],
                studentCount: 456,
            },
        },
        {
            success: true,
            data: {
                courseVersion: 1,
                title: 'Full-Stack JavaScript Development',
                imageFile: {
                    id: '5',
                    name: 'full-stack-js-development.jpg',
                    size: 102400,
                    category: 'image',
                    downloadUrl:
                        'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=400&fit=crop',
                },
                averageRating: 4.4,
                reviewCount: 312,
                description:
                    'Master both frontend and backend development with JavaScript. Learn Node.js, Express, React, and database integration.',
                duration: {
                    video: 320,
                    coaching: 80,
                    selfStudy: 200,
                },
                author: {
                    username: 'js_expert',
                    name: 'Robert',
                    surname: 'Mitchell',
                    averageRating: 4.5,
                    avatarUrl:
                        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
                },
                students: [
                    {
                        name: 'Sarah Kim',
                        avatarUrl:
                            'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
                    },
                    {
                        name: 'Daniel Martinez',
                        avatarUrl: null, // Testing nullable field
                    },
                    {
                        name: 'Amy Chen',
                        avatarUrl:
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
                    },
                ],
                studentCount: 1089,
            },
        },
    ];

export const getEnrolledCourseDetails = t.procedure
    .input(useCaseModels.GetEnrolledCourseDetailsRequestSchema)
    .query(
        async (): Promise<useCaseModels.TGetEnrolledCourseDetailsUseCaseResponse> => {
            return getEnrolledCourseDetailsMock[0];
        },
    );
