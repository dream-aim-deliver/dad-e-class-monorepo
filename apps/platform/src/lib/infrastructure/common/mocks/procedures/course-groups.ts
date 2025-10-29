import { t } from '../trpc-setup';
import { z } from 'zod';

// Mock data matching your backend structure
const listCourseGroupsMock: Record<string, any> = {
    'introduction-to-python': {
        groups: [
            {
                id: 1,
                name: 'Python Beginners Group',
                actualStudentCount: 10,
                maxStudentCount: 20,
                course: {
                    id: 101,
                    title: 'Introduction to Python',
                    slug: 'introduction-to-python',
                    imageUrl: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&h=600&fit=crop'
                },
                coaches: [
                    {
                        id: 201,
                        username: 'coach1',
                        name: 'John',
                        surname: 'Doe',
                        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
                        isCurrentUser: false
                    },
                    {
                        id: 202,
                        username: 'coach2',
                        name: 'Jane',
                        surname: 'Smith',
                        avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
                        isCurrentUser: true
                    }
                ]
            },
            {
                id: 2,
                name: 'Advanced Python Group',
                actualStudentCount: 15,
                maxStudentCount: 25,
                course: {
                    id: 102,
                    title: 'Advanced Python',
                    slug: 'advanced-python',
                    imageUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&h=600&fit=crop'
                },
                coaches: [
                    {
                        id: 203,
                        username: 'coach3',
                        name: 'Alice',
                        surname: 'Johnson',
                        avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
                        isCurrentUser: false
                    }
                ]
            },
            {
                id: 3,
                name: 'Web Development with Python',
                actualStudentCount: 8,
                maxStudentCount: 15,
                course: {
                    id: 103,
                    title: 'Web Development with Python',
                    slug: 'web-dev-python',
                    imageUrl: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&h=600&fit=crop'
                },
                coaches: [
                    {
                        id: 204,
                        username: 'webcoach',
                        name: 'Mike',
                        surname: 'Wilson',
                        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
                        isCurrentUser: false
                    }
                ]
            }
        ]
    }
};

// Schema for listCourseGroups request
const ListCourseGroupsRequestSchema = z.object({
    courseSlug: z.string(),
});

// Schema for registerCoachToGroup request  
const RegisterCoachToGroupRequestSchema = z.object({
    couponCode: z.string(),
});

export const listCourseGroups = t.procedure
    .input(ListCourseGroupsRequestSchema)
    .query(async (opts): Promise<any> => {
        await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
        
        const { courseSlug } = opts.input;
        const courseData = listCourseGroupsMock[courseSlug];

        if (courseData) {
            return {
                success: true,
                data: courseData,
            };
        }

        // Return default data for any course not in the mock
        return {
            success: true,
            data: {
                groups: [
                    {
                        id: 1,
                        name: 'General Learning Group',
                        actualStudentCount: 5,
                        maxStudentCount: 15,
                        course: {
                            id: 1,
                            title: courseSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                            slug: courseSlug,
                            imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop'
                        },
                        coaches: [
                            {
                                id: 100,
                                username: 'defaultcoach',
                                name: 'Sarah',
                                surname: 'Davis',
                                avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
                                isCurrentUser: true
                            }
                        ]
                    }
                ]
            }
        };
    });

export const registerCoachToGroup = t.procedure
    .input(RegisterCoachToGroupRequestSchema)
    .mutation(async (opts): Promise<any> => {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay
        
        const { couponCode } = opts.input;
        
        // Mock validation - accept any code for demo
        if (couponCode.trim().length === 0) {
            throw new Error('Coupon code is required');
        }
        
        // Mock successful registration - return the same format as listCourseGroups
        return {
            success: true,
            data: {
                groups: [
                    {
                        id: 1,
                        name: 'Group A',
                        actualStudentCount: 10,
                        maxStudentCount: 20,
                        course: {
                            id: 101,
                            title: 'Introduction to Python',
                            slug: 'introduction-to-python',
                            imageUrl: 'https://example.com/course-image.png'
                        },
                        coaches: [
                            {
                                id: 201,
                                username: 'coach1',
                                name: 'John',
                                surname: 'Doe',
                                avatarUrl: 'https://example.com/avatar1.png',
                                isCurrentUser: false
                            },
                            {
                                id: 202,
                                username: 'coach2',
                                name: 'Jane',
                                surname: 'Smith',
                                avatarUrl: 'https://example.com/avatar2.png',
                                isCurrentUser: true
                            }
                        ]
                    },
                    {
                        id: 2,
                        name: 'Group B',
                        actualStudentCount: 15,
                        maxStudentCount: 25,
                        course: {
                            id: 102,
                            title: 'Advanced Python',
                            slug: 'advanced-python',
                            imageUrl: 'https://example.com/course-image.png'
                        },
                        coaches: [
                            {
                                id: 203,
                                username: 'coach3',
                                name: 'Alice',
                                surname: 'Johnson',
                                avatarUrl: 'https://example.com/avatar3.png',
                                isCurrentUser: false
                            }
                        ]
                    }
                ]
            }
        };
    });