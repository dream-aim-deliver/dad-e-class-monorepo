import { useCaseModels } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';

const coursesMock: useCaseModels.TListCoursesSuccess = {
    courses: [
        {
            id: 1,
            title: 'Brand Identity Mastery: From Concept to Creation',
            slug: 'brand-identity-mastery-concept-to-creation',
            description:
                'Learn to create compelling brand identities that resonate with audiences. This comprehensive course covers logo design, color theory, typography selection, and brand guidelines development.',
            imageUrl:
                'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop',
            averageRating: 4.8,
            reviewCount: 127,
            author: {
                name: 'Sarah',
                surname: 'Martinez',
                username: 'sarah_martinez',
                avatarUrl:
                    'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
            },
            topicSlugs: [
                'branding-and-identity',
                'graphic-and-visual-design',
                'creative-and-art-direction',
            ],
            language: { name: 'English', code: 'en' },
            coachingSessionCount: 3,
            salesCount: 234,
            fullDuration: 480, // 8 hours in minutes
            pricing: {
                base: 149.99,
                withCoaching: 299.99,
                currency: 'USD',
            },
        },
        {
            id: 2,
            title: 'Motion Graphics for Social Media',
            slug: 'motion-graphics-social-media',
            description:
                'Create eye-catching animations and motion graphics specifically designed for social media platforms. Perfect for content creators and marketers.',
            imageUrl:
                'https://images.unsplash.com/photo-1611262588024-d12430b98920?w=800&h=600&fit=crop',
            averageRating: null,
            reviewCount: 0,
            author: {
                name: 'Alex',
                surname: 'Chen',
                username: 'alex_chen',
                avatarUrl: null,
            },
            topicSlugs: [
                'motion-design-and-animation',
                'digital-content-and-social-media-strategy',
            ],
            language: { name: 'English', code: 'en' },
            coachingSessionCount: null,
            salesCount: 12,
            fullDuration: 360, // 6 hours
            pricing: {
                base: 89.99,
                withCoaching: null,
                currency: 'USD',
            },
        },
        {
            id: 3,
            title: 'Complete UI/UX Design Bootcamp',
            slug: 'complete-ui-ux-design-bootcamp',
            description:
                'Master user interface and user experience design from scratch. Includes wireframing, prototyping, user research, and design systems.',
            imageUrl:
                'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&h=600&fit=crop',
            averageRating: 4.9,
            reviewCount: 89,
            author: {
                name: 'Maria',
                surname: 'Rodriguez',
                username: 'maria_rodriguez',
                avatarUrl:
                    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
            },
            topicSlugs: [
                'ui-ux-design',
                'web-design-and-development',
                'strategy-and-concept-development',
            ],
            language: { name: 'English', code: 'en' },
            coachingSessionCount: 5,
            salesCount: 156,
            fullDuration: 720, // 12 hours
            pricing: {
                base: 199.99,
                withCoaching: 399.99,
                currency: 'USD',
            },
        },
        {
            id: 4,
            title: 'Photography Fundamentals & Post-Processing',
            slug: 'photography-fundamentals-post-processing',
            description:
                'Learn the basics of photography composition, lighting, and advanced editing techniques using professional software.',
            imageUrl: null,
            averageRating: 4.6,
            reviewCount: 203,
            author: {
                name: 'David',
                surname: 'Thompson',
                username: 'david_thompson',
                avatarUrl:
                    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
            },
            topicSlugs: [
                'photography-and-editing',
                'graphic-and-visual-design',
            ],
            language: { name: 'English', code: 'en' },
            coachingSessionCount: 2,
            salesCount: 87,
            fullDuration: 540, // 9 hours
            pricing: {
                base: 129.99,
                withCoaching: 249.99,
                currency: 'USD',
            },
        },
        {
            id: 5,
            title: 'Sound Design for Media',
            slug: 'sound-design-for-media',
            description:
                'Create professional audio experiences for films, games, and digital content. Covers recording, editing, and mixing techniques.',
            imageUrl:
                'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
            averageRating: 4.7,
            reviewCount: 64,
            author: {
                name: 'Jennifer',
                surname: 'Walsh',
                username: 'jennifer_walsh',
                avatarUrl: null,
            },
            topicSlugs: ['sound-design-and-editing', 'film-and-cinematography'],
            language: { name: 'English', code: 'en' },
            coachingSessionCount: 4,
            salesCount: 43,
            fullDuration: 600, // 10 hours
            pricing: {
                base: 179.99,
                withCoaching: 329.99,
                currency: 'USD',
            },
        },
        {
            id: '6',
            title: 'AI-Powered Creative Workflows',
            slug: 'ai-powered-creative-workflows',
            description:
                'Harness the power of AI tools for creative projects. Learn prompting techniques, workflow optimization, and ethical AI usage in design.',
            imageUrl:
                'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
            averageRating: null,
            reviewCount: 0,
            author: {
                name: 'Roberto',
                surname: 'Silva',
                username: 'roberto_silva',
                avatarUrl:
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
            },
            topicSlugs: [
                'prompting-and-ai-tools',
                'idea-generation-and-brainstorming',
            ],
            language: { name: 'Spanish', code: 'es' },
            coachingSessionCount: null,
            salesCount: 8,
            fullDuration: 300, // 5 hours
            pricing: {
                base: 79.99,
                withCoaching: null,
                currency: 'EUR',
            },
        },
        {
            id: '7',
            title: 'Typography & Layout Design Mastery',
            slug: 'typography-layout-design-mastery',
            description:
                'Deep dive into typography principles, hierarchy, and layout composition for print and digital media.',
            imageUrl:
                'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&h=600&fit=crop',
            averageRating: 4.5,
            reviewCount: 91,
            author: {
                name: 'Lisa',
                surname: 'Anderson',
                username: 'lisa_anderson',
                avatarUrl:
                    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
            },
            topicSlugs: [
                'typography-layout-and-composition',
                'graphic-and-visual-design',
                'packaging-and-print-design',
            ],
            language: { name: 'English', code: 'en' },
            coachingSessionCount: 3,
            salesCount: 78,
            fullDuration: 420, // 7 hours
            pricing: {
                base: 119.99,
                withCoaching: 219.99,
                currency: 'USD',
            },
        },
        {
            id: 8,
            title: 'Cross-Channel Marketing Strategy',
            slug: 'cross-channel-marketing-strategy',
            description:
                'Build cohesive marketing campaigns across multiple channels. Learn to create consistent messaging and measure campaign effectiveness.',
            imageUrl:
                'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
            averageRating: 4.4,
            reviewCount: 156,
            author: {
                name: 'Michael',
                surname: 'Brown',
                username: 'michael_brown',
                avatarUrl: null,
            },
            topicSlugs: [
                'cross-channel-marketing',
                'campaign-development',
                'digital-content-and-social-media-strategy',
            ],
            language: { name: 'English', code: 'en' },
            coachingSessionCount: null,
            salesCount: 112,
            fullDuration: 480, // 8 hours
            pricing: {
                base: 159.99,
                withCoaching: null,
                currency: 'USD',
            },
        },
        {
            id: 9,
            title: 'Data Visualization & Infographic Design',
            slug: 'data-visualization-infographic-design',
            description:
                'Transform complex data into compelling visual stories. Learn design principles for charts, graphs, and interactive infographics.',
            imageUrl:
                'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
            averageRating: 4.8,
            reviewCount: 73,
            author: {
                name: 'Emma',
                surname: 'Johnson',
                username: 'emma_johnson',
                avatarUrl:
                    'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
            },
            topicSlugs: [
                'infographics-and-data-visualization',
                'graphic-and-visual-design',
            ],
            language: { name: 'German', code: 'de' },
            coachingSessionCount: 2,
            salesCount: 45,
            fullDuration: 390, // 6.5 hours
            pricing: {
                base: 99.99,
                withCoaching: 189.99,
                currency: 'EUR',
            },
        },
        {
            id: '10',
            title: 'Business Planning for Creatives',
            slug: 'business-planning-for-creatives',
            description:
                'Essential business skills for creative professionals. Covers pricing strategies, client management, and financial planning.',
            imageUrl: null,
            averageRating: 4.3,
            reviewCount: 38,
            author: {
                name: 'James',
                surname: 'Wilson',
                username: 'james_wilson',
                avatarUrl:
                    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
            },
            topicSlugs: [
                'business-planning-and-financing',
                'pitching-and-presentation-skills',
            ],
            language: { name: 'English', code: 'en' },
            coachingSessionCount: 6,
            salesCount: 67,
            fullDuration: 660, // 11 hours
            pricing: {
                base: 189.99,
                withCoaching: 449.99,
                currency: 'USD',
            },
        },
        {
            id: 11,
            title: 'Visual Storytelling Techniques',
            slug: 'visual-storytelling-techniques',
            description:
                'Master the art of telling compelling stories through visual media. Perfect for content creators and brand storytellers.',
            imageUrl:
                'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=600&fit=crop',
            averageRating: null,
            reviewCount: 0,
            author: {
                name: 'Sofia',
                surname: 'Petrov',
                username: 'sofia_petrov',
                avatarUrl: null,
            },
            topicSlugs: [
                'visual-storytelling',
                'copywriting-and-content-creation',
                'creative-and-art-direction',
            ],
            language: { name: 'French', code: 'fr' },
            coachingSessionCount: null,
            salesCount: 3,
            fullDuration: 450, // 7.5 hours
            pricing: {
                base: 109.99,
                withCoaching: null,
                currency: 'EUR',
            },
        },
        {
            id: '12',
            title: 'Packaging Design Excellence',
            slug: 'packaging-design-excellence',
            description:
                'Create stunning package designs that sell. Learn about materials, printing processes, and consumer psychology in packaging.',
            imageUrl:
                'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=600&fit=crop',
            averageRating: 4.6,
            reviewCount: 52,
            author: {
                name: 'Carlos',
                surname: 'Mendez',
                username: 'carlos_mendez',
                avatarUrl:
                    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face',
            },
            topicSlugs: [
                'packaging-and-print-design',
                'branding-and-identity',
                'graphic-and-visual-design',
            ],
            language: { name: 'Spanish', code: 'es' },
            coachingSessionCount: 1,
            salesCount: 29,
            fullDuration: 510, // 8.5 hours
            pricing: {
                base: 139.99,
                withCoaching: 239.99,
                currency: 'EUR',
            },
        },
    ],
};

export const listCourses = t.procedure
    .input(useCaseModels.ListCoursesRequestSchema)
    .query(async (opts): Promise<useCaseModels.TListCoursesUseCaseResponse> => {

        // Create array with 5 copies of coursesMock with unique IDs
        // const multipliedCourses = Array(5)
        //     .fill(null)
        //     .flatMap((_, batchIndex) =>
        //         coursesMock.courses.map((course, courseIndex) => ({
        //             ...course,
        //             id: `${course.id}_${batchIndex}_${courseIndex}`,
        //         })),
        //     );

        return {
            success: true,
            data: coursesMock,
        };
    });
