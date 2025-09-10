import { useCaseModels } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';

// Mock data for course-specific coaches using the existing ListCoachesSuccessResponse schema
// This simulates coaches assigned to different courses  
const courseCoachesMockData: Record<string, useCaseModels.TListCoachesSuccessResponse['data']> = {
    // Example course: "reactjs"
    'reactjs': {
        coaches: [
            {
                username: 'sarah_creative',
                name: 'Sarah',
                surname: 'Johnson',
                languages: ['English', 'Spanish'],
                avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                coachingSessionCount: 127,
                skills: [
                    { name: 'Branding and Identity', slug: 'branding-and-identity' },
                    { name: 'Graphic and Visual Design', slug: 'graphic-and-visual-design' },
                    { name: 'Creative and Art Direction', slug: 'creative-and-art-direction' },
                ],
                averageRating: 4.8,
                reviewCount: 89,
                bio: 'Creative director with 10+ years of experience in brand development and visual storytelling. Currently serving as Lead Coach for this course.',
                coursesTaught: [
                    { title: 'Brand Identity Fundamentals', slug: 'brand-identity-fundamentals', imageUrl: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=500&h=300&fit=crop' },
                    { title: 'Logo Design Masterclass', slug: 'logo-design-masterclass', imageUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=500&h=300&fit=crop' },
                ],
            },
            {
                username: 'sophia_type',
                name: 'Sophia',
                surname: 'Anderson',
                languages: ['English', 'Italian'],
                avatarUrl: null,
                coachingSessionCount: 172,
                skills: [
                    { name: 'Typography, Layout, and Composition', slug: 'typography-layout-and-composition' },
                    { name: 'Graphic and Visual Design', slug: 'graphic-and-visual-design' },
                ],
                averageRating: 4.9,
                reviewCount: 134,
                bio: 'Typography expert and print designer. Specializes in typography fundamentals and brand guidelines for this course.',
                coursesTaught: [
                    { title: 'Typography Fundamentals', slug: 'typography-fundamentals', imageUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500&h=300&fit=crop' },
                ],
            },
            {
                username: 'maria_color',
                name: 'Maria',
                surname: 'Rodriguez',
                languages: ['English', 'Spanish'],
                avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                coachingSessionCount: 98,
                skills: [
                    { name: 'Color Theory and Application', slug: 'color-theory-and-application' },
                    { name: 'Graphic and Visual Design', slug: 'graphic-and-visual-design' },
                ],
                averageRating: 4.7,
                reviewCount: 76,
                bio: 'Color specialist and visual designer with expertise in color psychology and brand color systems.',
                coursesTaught: [
                    { title: 'Color Theory for Designers', slug: 'color-theory-for-designers', imageUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=500&h=300&fit=crop' },
                ],
            },
            {
                username: 'james_ux',
                name: 'James',
                surname: 'Wilson',
                languages: ['English'],
                avatarUrl: null,
                coachingSessionCount: 145,
                skills: [
                    { name: 'UI/UX Design', slug: 'ui-ux-design' },
                    { name: 'User Research and Testing', slug: 'user-research-and-testing' },
                ],
                averageRating: 4.8,
                reviewCount: 103,
                bio: 'UX designer focused on user-centered design principles and accessibility. Supporting students with design thinking and user research.',
                coursesTaught: [
                    { title: 'UX Design Principles', slug: 'ux-design-principles', imageUrl: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=500&h=300&fit=crop' },
                ],
            },
        ]
    },
    
    // Example course: "ux-research-methods"
    'ux-research-methods': {
        coaches: [
            {
                username: 'david_ux',
                name: 'David',
                surname: 'Chen',
                avatarUrl: null,
                languages: ['English', 'Mandarin'],
                coachingSessionCount: 203,
                skills: [
                    { name: 'UI/UX Design', slug: 'ui-ux-design' },
                    { name: 'Strategy and Concept Development', slug: 'strategy-and-concept-development' },
                ],
                averageRating: 4.9,
                reviewCount: 156,
                bio: 'Senior UX designer at a Fortune 500 company with expertise in user research, design systems, and product strategy. Leading this UX Research Methods course.',
                coursesTaught: [
                    { title: 'UX Research Methods', slug: 'ux-research-methods', imageUrl: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=500&h=300&fit=crop' },
                    { title: 'Design Systems Workshop', slug: 'design-systems-workshop', imageUrl: 'https://images.unsplash.com/photo-1555421689-491a97ff2040?w=500&h=300&fit=crop' },
                ],
            },
            {
                username: 'lisa_ai',
                name: 'Lisa',
                surname: 'Park',
                languages: ['English', 'Korean'],
                avatarUrl: null,
                coachingSessionCount: 45,
                skills: [
                    { name: 'Strategy and Concept Development', slug: 'strategy-and-concept-development' },
                    { name: 'Idea Generation and Brainstorming', slug: 'idea-generation-and-brainstorming' },
                ],
                averageRating: null,
                reviewCount: 0,
                bio: 'AI researcher and consultant specializing in creative applications of artificial intelligence. Assisting with research methods and data analysis techniques.',
                coursesTaught: [
                    { title: 'AI Tools for Creatives', slug: 'ai-tools-for-creatives', imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500&h=300&fit=crop' },
                ],
            }
        ]
    },

    // Default fallback - shows a subset of coaches for any other course
    'default': {
        coaches: [
            {
                username: 'michael_pitch',
                name: 'Michael',
                surname: 'Davis',
                languages: ['English', 'German'],
                avatarUrl: null,
                coachingSessionCount: 138,
                skills: [
                    { name: 'Pitching and Presentation Skills', slug: 'pitching-and-presentation-skills' },
                    { name: 'Business Planning and Financing', slug: 'business-planning-and-financing' },
                ],
                averageRating: 4.7,
                reviewCount: 95,
                bio: 'Former startup founder and current business consultant who has raised over $10M in funding. Serving as course mentor and business advisor.',
                coursesTaught: [
                    { title: 'Pitch Deck Masterclass', slug: 'pitch-deck-masterclass', imageUrl: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=500&h=300&fit=crop' },
                ],
            },
            {
                username: 'alex_social',
                name: 'Alex',
                surname: 'Thompson',
                avatarUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                languages: ['English'],
                coachingSessionCount: 164,
                skills: [
                    { name: 'Digital Content and Social Media Strategy', slug: 'digital-content-and-social-media-strategy' },
                    { name: 'Cross-Channel Marketing', slug: 'cross-channel-marketing' },
                ],
                averageRating: 4.6,
                reviewCount: 112,
                bio: 'Digital marketing strategist who has helped brands grow their online presence across multiple platforms. Assistant coach focused on community building and student engagement.',
                coursesTaught: [
                    { title: 'Social Media Strategy Blueprint', slug: 'social-media-strategy-blueprint', imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500&h=300&fit=crop' },
                ],
            },
            {
                username: 'emma_sound',
                name: 'Emma',
                surname: 'Williams',
                languages: ['English', 'French'],
                avatarUrl: null,
                coachingSessionCount: 93,
                skills: [
                    { name: 'Sound Design and Editing', slug: 'sound-design-and-editing' },
                    { name: 'Film and Cinematography', slug: 'film-and-cinematography' },
                ],
                averageRating: 4.9,
                reviewCount: 67,
                bio: 'Professional sound designer and audio engineer with credits on independent films, podcasts, and commercial projects. Providing technical support and learning assistance.',
                coursesTaught: [
                    { title: 'Pro Tools Fundamentals', slug: 'pro-tools-fundamentals', imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=300&fit=crop' },
                ],
            },
        ]
    }
};

export const listCourseCoaches = t.procedure
    .input(useCaseModels.ListCoachesRequestSchema)
    .query(async (opts): Promise<useCaseModels.TListCoachesUseCaseResponse> => {
        const {courseSlug } = opts.input;

        await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate network delay

        // Get course-specific coaches or fall back to default
        const courseCoaches = courseCoachesMockData[courseSlug || ''] || courseCoachesMockData['default'];

        return {
            success: true,
            data: courseCoaches,
        };
    });

// Mock procedure for adding a coach to a course
export const addCourseCoach = t.procedure
    .input(useCaseModels.AddCourseCoachRequestSchema)
    .mutation(async (opts): Promise<useCaseModels.TAddCourseCoachUseCaseResponse> => {
        const { coachId, courseSlug } = opts.input;

        await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay

        // For mock purposes, treat coachId as a hashed value that we need to reverse-lookup
        // This is a temporary solution until the backend schema is finalized
        let coachToAdd: useCaseModels.TListCoachesSuccessResponse['data']['coaches'][0] | undefined;

        // Helper function to hash usernames (same as in component)
        const hashUsername = (username: string): number => {
            let hash = 0;
            for (let i = 0; i < username.length; i++) {
                const char = username.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash;
            }
            return Math.abs(hash);
        };

        // Search through all course mock data to find the coach by matching hash
        for (const courseData of Object.values(courseCoachesMockData)) {
            coachToAdd = courseData.coaches.find(coach => hashUsername(coach.username) === coachId);
            if (coachToAdd) break;
        }

        if (coachToAdd) {
            // Initialize course data if it doesn't exist
            if (!courseCoachesMockData[courseSlug]) {
                courseCoachesMockData[courseSlug] = { coaches: [] };
            }

            // Check if coach is already added
            const existingCoach = courseCoachesMockData[courseSlug].coaches.find(
                coach => coach.username === coachToAdd!.username
            );

            if (!existingCoach) {
                // Add coach to the course
                courseCoachesMockData[courseSlug].coaches.push(coachToAdd);
            }
        }

        return {
            success: true,
            data: {
                addedCoach: coachToAdd || null
            },
        };
    });

// Mock procedure for removing a coach from a course
export const removeCourseCoach = t.procedure
    .input(useCaseModels.RemoveCourseCoachRequestSchema)
    .mutation(async (opts): Promise<useCaseModels.TRemoveCourseCoachUseCaseResponse> => {
        const { coachId, courseSlug } = opts.input;

        await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay

        // Helper function to hash usernames (same as in component)
        const hashUsername = (username: string): number => {
            let hash = 0;
            for (let i = 0; i < username.length; i++) {
                const char = username.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash;
            }
            return Math.abs(hash);
        };

        // Find coach by hashed ID and remove from course
        let removedCoach: useCaseModels.TListCoachesSuccessResponse['data']['coaches'][0] | undefined;
        
        if (courseCoachesMockData[courseSlug]) {
            const initialLength = courseCoachesMockData[courseSlug].coaches.length;

            // Find the coach before removing
            removedCoach = courseCoachesMockData[courseSlug].coaches.find(
                coach => hashUsername(coach.username) === coachId
            );

            courseCoachesMockData[courseSlug].coaches = courseCoachesMockData[courseSlug].coaches.filter(
                coach => hashUsername(coach.username) !== coachId
            );

            const finalLength = courseCoachesMockData[courseSlug].coaches.length;

            if (initialLength > finalLength) {
                // Coach removed
            }
        }

        return {
            success: true,
            data: {
                removedCoach: removedCoach || null
            },
        };
    });
