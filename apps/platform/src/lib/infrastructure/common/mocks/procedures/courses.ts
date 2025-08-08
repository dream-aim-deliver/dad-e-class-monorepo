import { useCaseModels } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';

const searchCoursesMock: useCaseModels.TSearchCoursesSuccessResponse['data'] = {
    courses: [
        {
            id: 1,
            slug: 'introduction-to-programming',
            title: 'Introduction to Programming',
            averageRating: 4.5,
            reviewCount: 10,
            author: {
                username: 'johndoe',
                name: 'John',
                surname: 'Doe',
                avatarUrl:
                    'https://plus.unsplash.com/premium_photo-1671656349218-5218444643d8?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            },
        },
        {
            id: 2,
            slug: 'advanced-react-techniques',
            title: 'Advanced React Techniques',
            averageRating: 4.8,
            reviewCount: 5,
            author: {
                username: 'janedoe',
                name: 'Jane',
                surname: 'Doe',
                avatarUrl:
                    'https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=686&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            },
        },
        {
            id: 3,
            slug: 'data-science-with-python',
            title: 'Data Science with Python',
            averageRating: 4.2,
            reviewCount: 8,
            author: {
                username: 'alexsmith',
                name: 'Alex',
                surname: 'Smith',
                avatarUrl:
                    'https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?q=80&w=766&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            },
        },
        {
            id: 4,
            slug: 'machine-learning-basics',
            title: 'Machine Learning Basics',
            averageRating: 4.6,
            reviewCount: 12,
            author: {
                username: 'emilyjohnson',
                name: 'Emily',
                surname: 'Johnson',
                avatarUrl:
                    'https://images.unsplash.com/photo-1587614382400-2c5f5c5c5c5c?q=80&w=686&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            },
        },
        {
            id: 5,
            slug: 'web-design-fundamentals',
            title: 'Web Design Fundamentals',
            averageRating: 4.7,
            reviewCount: 15,
            author: {
                username: 'mikebrown',
                name: 'Mike',
                surname: 'Brown',
                avatarUrl:
                    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            },
        },
        {
            id: 6,
            slug: 'javascript-mastery',
            title: 'JavaScript Mastery',
            averageRating: 4.9,
            reviewCount: 22,
            author: {
                username: 'sarahwilson',
                name: 'Sarah',
                surname: 'Wilson',
                avatarUrl:
                    'https://images.unsplash.com/photo-1494790108755-2616b612b76c?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            },
        },
        {
            id: 7,
            slug: 'mobile-app-development',
            title: 'Mobile App Development',
            averageRating: 4.4,
            reviewCount: 18,
            author: {
                username: 'davidlee',
                name: 'David',
                surname: 'Lee',
                avatarUrl:
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            },
        },
        {
            id: 8,
            slug: 'cloud-computing-aws',
            title: 'Cloud Computing with AWS',
            averageRating: 4.3,
            reviewCount: 14,
            author: {
                username: 'racheltaylor',
                name: 'Rachel',
                surname: 'Taylor',
                avatarUrl:
                    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            },
        },
        {
            id: 9,
            slug: 'cybersecurity-essentials',
            title: 'Cybersecurity Essentials',
            averageRating: 4.6,
            reviewCount: 20,
            author: {
                username: 'tomanderson',
                name: 'Tom',
                surname: 'Anderson',
                avatarUrl:
                    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            },
        },
        {
            id: 10,
            slug: 'digital-marketing-strategy',
            title: 'Digital Marketing Strategy',
            averageRating: 4.5,
            reviewCount: 16,
            author: {
                username: 'lisawhite',
                name: 'Lisa',
                surname: 'White',
                avatarUrl:
                    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=988&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            },
        },
        {
            id: 11,
            slug: 'blockchain-development',
            title: 'Blockchain Development',
            averageRating: 4.1,
            reviewCount: 9,
            author: {
                username: 'kevinmartin',
                name: 'Kevin',
                surname: 'Martin',
                avatarUrl:
                    'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            },
        },
        {
            id: 12,
            slug: 'ui-ux-design-principles',
            title: 'UI/UX Design Principles',
            averageRating: 4.8,
            reviewCount: 25,
            author: {
                username: 'amygarcia',
                name: 'Amy',
                surname: 'Garcia',
                avatarUrl:
                    'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            },
        },
        {
            id: 13,
            slug: 'devops-automation',
            title: 'DevOps and Automation',
            averageRating: 4.4,
            reviewCount: 13,
            author: {
                username: 'chrisdavis',
                name: 'Chris',
                surname: 'Davis',
                avatarUrl:
                    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            },
        },
        {
            id: 14,
            slug: 'artificial-intelligence-ethics',
            title: 'Artificial Intelligence Ethics',
            averageRating: 4.7,
            reviewCount: 11,
            author: {
                username: 'mariarodriguez',
                name: 'Maria',
                surname: 'Rodriguez',
                avatarUrl:
                    'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            },
        },
    ],
};

export const searchCourses = t.procedure
    .input(useCaseModels.SearchCoursesRequestSchema)
    .query(
        async (ctx): Promise<useCaseModels.TSearchCoursesUseCaseResponse> => {
            const titleContains = ctx.input.titleContains?.toLowerCase();
            let courses = searchCoursesMock.courses;
            if (titleContains) {
                courses = searchCoursesMock.courses.filter((course) =>
                    course.title.toLowerCase().includes(titleContains),
                );
            }
            if (ctx.input.pagination) {
                const { page, pageSize } = ctx.input.pagination;
                const start = (page - 1) * pageSize;
                const end = start + pageSize;
                courses = courses.slice(start, end);
            }
            return {
                success: true,
                data: {
                    courses,
                },
            };
        },
    );
