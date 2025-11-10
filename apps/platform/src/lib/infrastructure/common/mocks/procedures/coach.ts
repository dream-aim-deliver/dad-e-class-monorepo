import { useCaseModels } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';

const coachesMock: useCaseModels.TListCoachesSuccessResponse['data'] = {
    coaches: [
        {
            username: 'sarah_creative',
            name: 'Sarah',
            surname: 'Johnson',
            languages: ['English', 'Spanish'],
            avatarUrl:
                'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            coachingSessionCount: 127,
            skills: [
                {
                    name: 'Branding and Identity',
                    slug: 'branding-and-identity',
                },
                {
                    name: 'Graphic and Visual Design',
                    slug: 'graphic-and-visual-design',
                },
                {
                    name: 'Creative and Art Direction',
                    slug: 'creative-and-art-direction',
                },
            ],
            averageRating: 4.8,
            reviewCount: 89,
            bio: 'Creative director with 10+ years of experience in brand development and visual storytelling. I help designers and entrepreneurs build compelling brand identities that resonate with their target audience.',
            coursesTaught: [
                {
                    title: 'Brand Identity Fundamentals',
                    slug: 'brand-identity-fundamentals',
                    imageUrl:
                        'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=500&h=300&fit=crop',
                },
                {
                    title: 'Logo Design Masterclass',
                    slug: 'logo-design-masterclass',
                    imageUrl:
                        'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=500&h=300&fit=crop',
                },
            ],
        },
        {
            username: 'david_ux',
            name: 'David',
            surname: 'Chen',
            avatarUrl: null,
            languages: ['English', 'Mandarin'],
            coachingSessionCount: 203,
            skills: [
                {
                    name: 'UI/UX Design',
                    slug: 'ui-ux-design',
                },
                {
                    name: 'Web Design and Development',
                    slug: 'web-design-and-development',
                },
                {
                    name: 'Strategy and Concept Development',
                    slug: 'strategy-and-concept-development',
                },
            ],
            averageRating: 4.9,
            reviewCount: 156,
            bio: 'Senior UX designer at a Fortune 500 company with expertise in user research, design systems, and product strategy. I mentor designers transitioning into UX and help teams improve their design processes.',
            coursesTaught: [
                {
                    title: 'UX Research Methods',
                    slug: 'ux-research-methods',
                    imageUrl:
                        'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=500&h=300&fit=crop',
                },
                {
                    title: 'Design Systems Workshop',
                    slug: 'design-systems-workshop',
                    imageUrl:
                        'https://images.unsplash.com/photo-1555421689-491a97ff2040?w=500&h=300&fit=crop',
                },
                {
                    title: 'Prototyping with Figma',
                    slug: 'prototyping-with-figma',
                    imageUrl: null,
                },
            ],
        },
        {
            username: 'maria_motion',
            name: 'Maria',
            surname: 'Rodriguez',
            avatarUrl:
                'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            languages: ['English', 'Spanish', 'Portuguese'],
            coachingSessionCount: 78,
            skills: [
                {
                    name: 'Motion Design and Animation',
                    slug: 'motion-design-and-animation',
                },
                {
                    name: 'Film and Cinematography',
                    slug: 'film-and-cinematography',
                },
                {
                    name: 'Visual Storytelling',
                    slug: 'visual-storytelling',
                },
            ],
            averageRating: 4.7,
            reviewCount: 52,
            bio: 'Award-winning motion designer and animator with experience in advertising, film, and digital media. I specialize in creating engaging animated content that tells powerful stories.',
            coursesTaught: [
                {
                    title: 'After Effects for Beginners',
                    slug: 'after-effects-beginners',
                    imageUrl:
                        'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=500&h=300&fit=crop',
                },
                {
                    title: 'Character Animation Workshop',
                    slug: 'character-animation-workshop',
                    imageUrl:
                        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&h=300&fit=crop',
                },
            ],
        },
        {
            username: 'alex_social',
            name: 'Alex',
            surname: 'Thompson',
            avatarUrl:
                'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            languages: ['English'],
            coachingSessionCount: 164,
            skills: [
                {
                    name: 'Digital Content and Social Media Strategy',
                    slug: 'digital-content-and-social-media-strategy',
                },
                {
                    name: 'Copywriting and Content Creation',
                    slug: 'copywriting-and-content-creation',
                },
                {
                    name: 'Cross-Channel Marketing',
                    slug: 'cross-channel-marketing',
                },
            ],
            averageRating: 4.6,
            reviewCount: 112,
            bio: 'Digital marketing strategist who has helped brands grow their online presence across multiple platforms. I focus on content strategy, community building, and conversion optimization.',
            coursesTaught: [
                {
                    title: 'Social Media Strategy Blueprint',
                    slug: 'social-media-strategy-blueprint',
                    imageUrl:
                        'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500&h=300&fit=crop',
                },
                {
                    title: 'Content Calendar Mastery',
                    slug: 'content-calendar-mastery',
                    imageUrl: null,
                },
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
                {
                    name: 'Sound Design and Editing',
                    slug: 'sound-design-and-editing',
                },
                {
                    name: 'Film and Cinematography',
                    slug: 'film-and-cinematography',
                },
            ],
            averageRating: 4.9,
            reviewCount: 67,
            bio: 'Professional sound designer and audio engineer with credits on independent films, podcasts, and commercial projects. I teach the technical and creative aspects of audio production.',
            coursesTaught: [
                {
                    title: 'Pro Tools Fundamentals',
                    slug: 'pro-tools-fundamentals',
                    imageUrl:
                        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=300&fit=crop',
                },
                {
                    title: 'Podcast Production Workshop',
                    slug: 'podcast-production-workshop',
                    imageUrl:
                        'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=500&h=300&fit=crop',
                },
            ],
        },
        {
            username: 'james_photo',
            name: 'James',
            surname: 'Miller',
            languages: ['English'],
            avatarUrl: null,
            coachingSessionCount: 215,
            skills: [
                {
                    name: 'Photography and Editing',
                    slug: 'photography-and-editing',
                },
                {
                    name: 'Visual Storytelling',
                    slug: 'visual-storytelling',
                },
                {
                    name: 'Advertising Campaigns',
                    slug: 'advertising-campaigns',
                },
            ],
            averageRating: 4.8,
            reviewCount: 178,
            bio: 'Commercial photographer with 15 years of experience shooting for major brands and publications. I help aspiring photographers develop their technical skills and build sustainable photography businesses.',
            coursesTaught: [
                {
                    title: 'Commercial Photography Basics',
                    slug: 'commercial-photography-basics',
                    imageUrl:
                        'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&h=300&fit=crop',
                },
                {
                    title: 'Lightroom Editing Techniques',
                    slug: 'lightroom-editing-techniques',
                    imageUrl:
                        'https://images.unsplash.com/photo-1551808525-51a94da548ce?w=500&h=300&fit=crop',
                },
                {
                    title: 'Building a Photography Business',
                    slug: 'building-photography-business',
                    imageUrl: null,
                },
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
                {
                    name: 'Prompting and AI Tools',
                    slug: 'prompting-and-ai-tools',
                },
                {
                    name: 'Idea Generation and Brainstorming',
                    slug: 'idea-generation-and-brainstorming',
                },
                {
                    name: 'Strategy and Concept Development',
                    slug: 'strategy-and-concept-development',
                },
            ],
            averageRating: null,
            reviewCount: 0,
            bio: 'AI researcher and consultant specializing in creative applications of artificial intelligence. I help creative professionals integrate AI tools into their workflows while maintaining their unique artistic vision.',
            coursesTaught: [
                {
                    title: 'AI Tools for Creatives',
                    slug: 'ai-tools-for-creatives',
                    imageUrl:
                        'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500&h=300&fit=crop',
                },
            ],
        },
        {
            username: 'michael_pitch',
            name: 'Michael',
            surname: 'Davis',
            languages: ['English', 'German'],
            avatarUrl: null,
            coachingSessionCount: 138,
            skills: [
                {
                    name: 'Pitching and Presentation Skills',
                    slug: 'pitching-and-presentation-skills',
                },
                {
                    name: 'Business Planning and Financing',
                    slug: 'business-planning-and-financing',
                },
                {
                    name: 'Strategy and Concept Development',
                    slug: 'strategy-and-concept-development',
                },
            ],
            averageRating: 4.7,
            reviewCount: 95,
            bio: 'Former startup founder and current business consultant who has raised over $10M in funding. I coach creative entrepreneurs on building compelling pitches and developing sustainable business models.',
            coursesTaught: [
                {
                    title: 'Pitch Deck Masterclass',
                    slug: 'pitch-deck-masterclass',
                    imageUrl:
                        'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=500&h=300&fit=crop',
                },
                {
                    title: 'Creative Business Models',
                    slug: 'creative-business-models',
                    imageUrl:
                        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=300&fit=crop',
                },
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
                {
                    name: 'Typography, Layout, and Composition',
                    slug: 'typography-layout-and-composition',
                },
                {
                    name: 'Packaging and Print Design',
                    slug: 'packaging-and-print-design',
                },
                {
                    name: 'Graphic and Visual Design',
                    slug: 'graphic-and-visual-design',
                },
            ],
            averageRating: 4.9,
            reviewCount: 134,
            bio: 'Typography expert and print designer with a passion for creating beautiful, functional designs. I help designers master the fundamentals of type, layout, and print production.',
            coursesTaught: [
                {
                    title: 'Typography Fundamentals',
                    slug: 'typography-fundamentals',
                    imageUrl:
                        'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500&h=300&fit=crop',
                },
                {
                    title: 'Print Design Workshop',
                    slug: 'print-design-workshop',
                    imageUrl:
                        'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=500&h=300&fit=crop',
                },
                {
                    title: 'Layout and Composition',
                    slug: 'layout-and-composition',
                    imageUrl: null,
                },
            ],
        },
        {
            username: 'robert_data',
            name: 'Robert',
            surname: 'Taylor',
            languages: ['English'],
            avatarUrl: null,
            coachingSessionCount: 89,
            skills: [
                {
                    name: 'Infographics and Data Visualization',
                    slug: 'infographics-and-data-visualization',
                },
                {
                    name: 'Graphic and Visual Design',
                    slug: 'graphic-and-visual-design',
                },
                {
                    name: 'Strategy and Concept Development',
                    slug: 'strategy-and-concept-development',
                },
            ],
            averageRating: 4.6,
            reviewCount: 61,
            bio: 'Data visualization specialist who transforms complex information into compelling visual stories. I work with organizations to make their data accessible and engaging through thoughtful design.',
            coursesTaught: [
                {
                    title: 'Data Storytelling Essentials',
                    slug: 'data-storytelling-essentials',
                    imageUrl:
                        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop',
                },
                {
                    title: 'Creating Effective Infographics',
                    slug: 'creating-effective-infographics',
                    imageUrl:
                        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop',
                },
            ],
        },
    ],
};

export const listCoaches = t.procedure
    .input(useCaseModels.ListCoachesRequestSchema)
    .query(async (opts): Promise<useCaseModels.TListCoachesUseCaseResponse> => {
        const { pagination, skillSlugs } = opts.input;

        // Start with all coaches
        let filteredCoaches = coachesMock.coaches;

        // Filter by skill slugs if provided
        if (skillSlugs && skillSlugs.length > 0) {
            filteredCoaches = filteredCoaches.filter((coach) =>
                coach.skills.some((skill) => skillSlugs.includes(skill.slug)),
            );
        }

        // Apply pagination only if both page and pageSize are provided
        if (pagination) {
            const startIndex = (pagination.page - 1) * pagination.pageSize;
            const endIndex = startIndex + pagination.pageSize;
            const paginatedCoaches = filteredCoaches.slice(
                startIndex,
                endIndex,
            );

            return {
                success: true,
                data: {
                    coaches: paginatedCoaches,
                },
            };
        }

        return {
            success: true,
            data: coachesMock,
        };
    });
