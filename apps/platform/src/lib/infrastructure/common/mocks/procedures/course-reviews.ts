import { useCaseModels } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';

const courseReviewsMock: useCaseModels.TListCourseReviewsSuccessResponse['data'] = {
    reviews: [
        {
            id: 1,
            rating: 5,
            comment: 'This course was absolutely amazing! The instructor explained everything clearly and the practical examples were very helpful.',
            createdAt: '2024-01-15T10:30:00Z',
            student: {
                id: 1,
                firstName: 'John',
                lastName: 'Doe',
                avatarFile: {
                    id: 'avatar1',
                    name: 'john-doe-avatar.jpg',
                    size: 102400,
                    category: 'image',
                    downloadUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
                },
            },
        },
        {
            id: 2,
            rating: 4,
            comment: 'Great content and well-structured. I learned a lot, though some sections could be more detailed.',
            createdAt: '2024-01-20T14:45:00Z',
            student: {
                id: 2,
                firstName: 'Jane',
                lastName: 'Smith',
                avatarFile: {
                    id: 'avatar2',
                    name: 'jane-smith-avatar.jpg',
                    size: 98304,
                    category: 'image',
                    downloadUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
                },
            },
        },
        {
            id: 3,
            rating: 5,
            comment: 'Excellent course! The instructor is very knowledgeable and the course materials are top-notch.',
            createdAt: '2024-02-01T09:15:00Z',
            student: {
                id: 3,
                firstName: 'Mike',
                lastName: 'Johnson',
                avatarFile: {
                    id: 'avatar3',
                    name: 'mike-johnson-avatar.jpg',
                    size: 112640,
                    category: 'image',
                    downloadUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
                },
            },
        },
        {
            id: 4,
            rating: 4,
            comment: 'Very informative course with good practical applications. Highly recommended!',
            createdAt: '2024-02-10T16:20:00Z',
            student: {
                id: 4,
                firstName: 'Sarah',
                lastName: 'Williams',
                avatarFile: {
                    id: 'avatar4',
                    name: 'sarah-williams-avatar.jpg',
                    size: 96768,
                    category: 'image',
                    downloadUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
                },
            },
        },
        {
            id: 5,
            rating: 5,
            comment: 'This course exceeded my expectations. The depth of knowledge and teaching quality is outstanding.',
            createdAt: '2024-02-15T11:30:00Z',
            student: {
                id: 5,
                firstName: 'David',
                lastName: 'Brown',
                avatarFile: {
                    id: 'avatar5',
                    name: 'david-brown-avatar.jpg',
                    size: 104857,
                    category: 'image',
                    downloadUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
                },
            },
        },
    ],
};

export const listCourseReviews = t.procedure
    .input(useCaseModels.ListCourseReviewsRequestSchema)
    .query(async (opts): Promise<useCaseModels.TListCourseReviewsUseCaseResponse> => {
        return {
            success: true,
            data: courseReviewsMock,
        };
    });
