import { useCaseModels } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';

const publicCourseDetailsMock: useCaseModels.TGetPublicCourseDetailsSuccessResponse['data'] = {
    courseVersion: 1,
    title: 'Complete UI/UX Design Masterclass',
    imageFile: {
        id: 'course-image-1',
        name: 'ui-ux-design-course.jpg',
        size: 2048576, // 2MB
        category: 'image',
        downloadUrl: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&h=600&fit=crop'
    },
    averageRating: 4.8,
    reviewCount: 1247,
    description: 'Master the art of user interface and user experience design with this comprehensive course. Learn design principles, prototyping, user research, and modern design tools. Perfect for beginners and intermediate designers looking to advance their careers.',
    basePrice: 299,
    priceIncludingCoachings: 499,
    currency: 'USD',
    duration: {
        video: 2400, // 40 hours
        coaching: 600, // 10 hours
        selfStudy: 1200, // 20 hours
    },
    author: {
        username: 'sarah_design_expert',
        name: 'Sarah',
        surname: 'Mitchell',
        averageRating: 4.9,
        avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    },
    coaches: [
        {
            name: 'Sarah Mitchell',
            avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
        },
        {
            name: 'David Chen',
            avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
        },
        {
            name: 'Emma Rodriguez',
            avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
        }
    ],
    students: [
        {
            name: 'Alex Johnson',
            avatarUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop&crop=face'
        },
        {
            name: 'Maria Garcia',
            avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
        },
        {
            name: 'James Wilson',
            avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
        },
        {
            name: 'Lisa Park',
            avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face'
        },
        {
            name: 'Michael Brown',
            avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
        },
        {
            name: 'Anna Kim',
            avatarUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face'
        }
    ],
    requirements: [
        {
            courseName: 'Design Fundamentals',
            courseSlug: 'design-fundamentals'
        },
        {
            courseName: 'Introduction to Digital Design',
            courseSlug: 'introduction-digital-design'
        }
    ]
};

export const getPublicCourseDetails = t.procedure
    .input(useCaseModels.GetPublicCourseDetailsRequestSchema)
    .query(async (opts): Promise<useCaseModels.TGetPublicCourseDetailsUseCaseResponse> => {
        const { courseSlug } = opts.input;
        await new Promise((resolve) => setTimeout(resolve, 800));
        return {
            success: true,
            data: publicCourseDetailsMock,
        };
    });
