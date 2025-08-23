import { useCaseModels } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';

// TODO: add mock data
const listUserCoursesMock: useCaseModels.TListUserCoursesSuccessResponse['data'] =
    {
        courses: [
            {
                id: 1,
                slug: 'coach-course',
                title: 'Advanced JavaScript Mastery',
                state: 'live',
                description:
                    'Master advanced JavaScript concepts including closures, prototypes, async programming, and modern ES6+ features.',
                imageUrl:
                    'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=600&fit=crop',
                averageRating: 4.8,
                reviewCount: 247,
                author: {
                    name: 'Sarah',
                    surname: 'Chen',
                    username: 'sarahdev',
                    avatarUrl:
                        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
                },
                language: 'English',
                coachingSessionCount: 12,
                salesCount: 1856,
                fullDuration: 2400, // 40 hours in minutes
                role: 'coach' as const,
            },
            {
                id: 2,
                slug: 'progress-course',
                title: 'Digital Photography Fundamentals',
                state: 'draft',
                description:
                    'Learn the art and science of digital photography from composition to post-processing techniques.',
                imageUrl:
                    'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800&h=600&fit=crop',
                averageRating: 4.6,
                reviewCount: 189,
                author: {
                    name: 'Marcus',
                    surname: 'Rodriguez',
                    username: 'marcusphoto',
                    avatarUrl:
                        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
                },
                language: 'English',
                coachingSessionCount: 8,
                salesCount: 923,
                fullDuration: 1800, // 30 hours
                role: 'student' as const,
                progress: 25,
            },
            {
                id: 3,
                slug: 'admin-course',
                title: 'React Native Mobile Development',
                state: 'live',
                description:
                    'Build cross-platform mobile applications using React Native, from basics to advanced deployment strategies.',
                imageUrl:
                    'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop',
                averageRating: 4.9,
                reviewCount: 312,
                author: {
                    name: 'Emily',
                    surname: 'Watson',
                    username: 'emilymobile',
                    avatarUrl:
                        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
                },
                language: 'English',
                salesCount: 2134,
                fullDuration: 3600, // 60 hours
                role: 'owner' as const,
            },
            {
                id: 4,
                slug: 'culinary-arts-italian-cuisine',
                title: 'Italian Culinary Arts Masterclass',
                state: 'draft',
                description:
                    'Discover the secrets of authentic Italian cooking with traditional recipes and modern techniques.',
                imageUrl:
                    'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop',
                averageRating: 4.7,
                reviewCount: 156,
                author: {
                    name: 'Giovanni',
                    surname: 'Rossi',
                    username: 'chef_giovanni',
                    avatarUrl:
                        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
                },
                language: 'Italian',
                coachingSessionCount: 15,
                salesCount: 678,
                fullDuration: 2160, // 36 hours
                role: 'coach' as const,
            },
            {
                id: 5,
                slug: 'data-science-python-analytics',
                title: 'Data Science with Python & Analytics',
                state: 'live',
                description:
                    'Comprehensive data science course covering Python, pandas, machine learning, and statistical analysis.',
                imageUrl:
                    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
                averageRating: 4.5,
                reviewCount: 423,
                author: {
                    name: 'Dr. Aisha',
                    surname: 'Patel',
                    username: 'dr_aisha_data',
                    avatarUrl:
                        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face',
                },
                language: 'English',
                salesCount: 1567,
                fullDuration: 4320, // 72 hours
                role: 'admin' as const,
            },
            {
                id: 6,
                slug: 'watercolor-painting-techniques',
                title: 'Watercolor Painting Techniques',
                state: 'live',
                description:
                    'Explore the beautiful world of watercolor painting with step-by-step tutorials and artistic guidance.',
                imageUrl:
                    'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=600&fit=crop',
                averageRating: 4.4,
                reviewCount: 89,
                author: {
                    name: 'Luna',
                    surname: 'Kim',
                    username: 'luna_artist',
                    avatarUrl:
                        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
                },
                language: 'Korean',
                coachingSessionCount: 6,
                salesCount: 345,
                fullDuration: 1440, // 24 hours
                role: 'student' as const,
                progress: 50,
            },
            {
                id: 7,
                slug: 'blockchain-cryptocurrency-fundamentals',
                title: 'Blockchain & Cryptocurrency Fundamentals',
                state: 'review',
                description:
                    'Understanding blockchain technology, cryptocurrency markets, and decentralized finance (DeFi) applications.',
                imageUrl:
                    'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=600&fit=crop',
                averageRating: 4.3,
                reviewCount: 267,
                author: {
                    name: 'Alex',
                    surname: 'Thompson',
                    username: 'crypto_alex',
                    avatarUrl:
                        'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
                },
                language: 'English',
                salesCount: 1289,
                fullDuration: 2880, // 48 hours
                role: 'owner' as const,
            },
            {
                id: 8,
                slug: 'yoga-meditation-wellness',
                title: 'Yoga, Meditation & Wellness',
                state: 'draft',
                description:
                    'Complete wellness program combining yoga practices, meditation techniques, and mindfulness training.',
                imageUrl:
                    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop',
                averageRating: 4.8,
                reviewCount: 201,
                author: {
                    name: 'Maya',
                    surname: 'Singh',
                    username: 'maya_wellness',
                    avatarUrl:
                        'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=150&h=150&fit=crop&crop=face',
                },
                language: 'English',
                coachingSessionCount: 20,
                salesCount: 892,
                fullDuration: 1800, // 30 hours
                role: 'coach' as const,
            },
            {
                id: 9,
                slug: 'digital-marketing-social-media',
                title: 'Digital Marketing & Social Media Strategy',
                state: 'live',
                description:
                    'Master digital marketing strategies including SEO, social media marketing, and content creation.',
                imageUrl:
                    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
                averageRating: 4.6,
                reviewCount: 334,
                author: {
                    name: 'David',
                    surname: 'Miller',
                    username: 'david_marketing',
                    avatarUrl:
                        'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face',
                },
                language: 'German',
                salesCount: 1743,
                fullDuration: 2700, // 45 hours
                role: 'admin' as const,
            },
            {
                id: 10,
                slug: 'guitar-masterclass-acoustic',
                title: 'Acoustic Guitar Masterclass',
                state: 'review',
                description:
                    'Comprehensive acoustic guitar course from beginner chords to advanced fingerstyle techniques.',
                imageUrl:
                    'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&h=600&fit=crop',
                averageRating: 4.9,
                reviewCount: 178,
                author: {
                    name: 'Carlos',
                    surname: 'Mendez',
                    username: 'carlos_guitar',
                    avatarUrl:
                        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
                },
                language: 'Spanish',
                coachingSessionCount: 10,
                salesCount: 567,
                fullDuration: 2160, // 36 hours
                role: 'student' as const,
                progress: 0,
            },
            {
                id: 11,
                slug: 'ux-ui-design-principles',
                title: 'UX/UI Design Principles',
                state: 'live',
                description:
                    'Learn user experience and interface design principles with hands-on projects and industry best practices.',
                imageUrl:
                    'https://images.unsplash.com/photo-1586717799252-bd134ad00e26?w=800&h=600&fit=crop',
                averageRating: 4.7,
                reviewCount: 445,
                author: {
                    name: 'Jessica',
                    surname: 'Park',
                    username: 'jessica_ux',
                    avatarUrl:
                        'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face',
                },
                language: 'Japanese',
                salesCount: 2089,
                fullDuration: 3240, // 54 hours
                role: 'owner' as const,
            },
            {
                id: 12,
                slug: 'entrepreneurship-startup-bootcamp',
                title: 'Entrepreneurship & Startup Bootcamp',
                state: 'live',
                description:
                    'From idea to launch: complete guide to building a successful startup with real-world case studies.',
                imageUrl:
                    'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=600&fit=crop',
                averageRating: 4.4,
                reviewCount: 298,
                author: {
                    name: 'Michael',
                    surname: 'Johnson',
                    username: 'mike_entrepreneur',
                    avatarUrl:
                        'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face',
                },
                language: 'English',
                coachingSessionCount: 25,
                salesCount: 1456,
                fullDuration: 3600, // 60 hours
                role: 'coach' as const,
            },
            {
                id: 13,
                slug: 'landscape-photography-workshop',
                title: 'Landscape Photography Workshop',
                state: 'draft',
                description:
                    'Capture stunning landscapes with advanced techniques in composition, lighting, and post-processing.',
                imageUrl:
                    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
                averageRating: 4.8,
                reviewCount: 123,
                author: {
                    name: 'Isabella',
                    surname: 'Martinez',
                    username: 'bella_landscapes',
                    avatarUrl:
                        'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&h=150&fit=crop&crop=face',
                },
                language: 'Spanish',
                salesCount: 678,
                fullDuration: 1920, // 32 hours
                role: 'admin' as const,
            },
            {
                id: 14,
                slug: 'machine-learning-tensorflow',
                title: 'Machine Learning with TensorFlow',
                state: 'review',
                description:
                    'Deep dive into machine learning using TensorFlow, covering neural networks and deep learning applications.',
                imageUrl:
                    'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800&h=600&fit=crop',
                averageRating: 4.5,
                reviewCount: 356,
                author: {
                    name: 'Robert',
                    surname: 'Chen',
                    username: 'robert_ml',
                    avatarUrl:
                        'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150&h=150&fit=crop&crop=face',
                },
                language: 'Mandarin',
                coachingSessionCount: 18,
                salesCount: 1234,
                fullDuration: 4800, // 80 hours
                role: 'student' as const,
                progress: 25,
            },
            {
                id: 15,
                slug: 'french-language-immersion',
                title: 'French Language Immersion',
                state: 'live',
                description:
                    'Complete French language course with immersive techniques, cultural context, and conversation practice.',
                imageUrl:
                    'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=800&h=600&fit=crop',
                averageRating: 4.6,
                reviewCount: 412,
                author: {
                    name: 'Claire',
                    surname: 'Dubois',
                    username: 'claire_french',
                    avatarUrl:
                        'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
                },
                language: 'French',
                salesCount: 987,
                fullDuration: 3000, // 50 hours
                role: 'owner' as const,
            },
            {
                id: 16,
                slug: 'woodworking-furniture-crafting',
                title: 'Woodworking & Furniture Crafting',
                state: 'draft',
                description:
                    'Traditional woodworking techniques for creating beautiful, functional furniture pieces from scratch.',
                imageUrl:
                    'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop',
                averageRating: 4.7,
                reviewCount: 156,
                author: {
                    name: 'Thomas',
                    surname: 'Anderson',
                    username: 'tom_woodworker',
                    avatarUrl:
                        'https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&h=150&fit=crop&crop=face',
                },
                language: 'English',
                coachingSessionCount: 12,
                salesCount: 432,
                fullDuration: 2640, // 44 hours
                role: 'coach' as const,
            },
            {
                id: 17,
                slug: 'personal-finance-investment',
                title: 'Personal Finance & Investment Strategy',
                state: 'review',
                description:
                    'Comprehensive guide to personal finance management, investment strategies, and wealth building.',
                imageUrl:
                    'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop',
                averageRating: 4.3,
                reviewCount: 289,
                author: {
                    name: 'Amanda',
                    surname: 'Foster',
                    username: 'amanda_finance',
                    avatarUrl:
                        'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face',
                },
                language: 'English',
                salesCount: 1678,
                fullDuration: 2400, // 40 hours
                role: 'admin' as const,
            },
            {
                id: 18,
                slug: 'sustainable-gardening-permaculture',
                title: 'Sustainable Gardening & Permaculture',
                state: 'live',
                description:
                    'Learn sustainable gardening and permaculture principles to create eco-friendly, productive gardens.',
                imageUrl:
                    'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop',
                averageRating: 4.9,
                reviewCount: 167,
                author: {
                    name: 'Elena',
                    surname: 'Green',
                    username: 'elena_garden',
                    avatarUrl:
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
                },
                language: 'Dutch',
                coachingSessionCount: 8,
                salesCount: 543,
                fullDuration: 1800, // 30 hours
                role: 'student' as const,
                progress: 75,
            },
        ],
    };

export const listUserCourses = t.procedure
    .input(useCaseModels.ListUserCoursesRequestSchema)
    .query(
        async (ctx): Promise<useCaseModels.TListUserCoursesUseCaseResponse> => {
            if (ctx.input.pagination) {
                const { page, pageSize } = ctx.input.pagination;
                const startIndex = (page - 1) * pageSize;
                const endIndex = startIndex + pageSize;
                return {
                    success: true,
                    data: {
                        courses: listUserCoursesMock.courses.slice(
                            startIndex,
                            endIndex,
                        ),
                    },
                };
            }
            return {
                success: true,
                data: listUserCoursesMock,
            };
        },
    );
