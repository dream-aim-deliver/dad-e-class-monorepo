import { useCaseModels } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';

const coachStudentsMock: useCaseModels.TListCoachStudentsSuccessResponse['data'] = {
    students: [
        {
            studentId: 1,
            fullName: 'Alice Johnson',
            avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b647?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
            coachingSessionCount: 5,
            courses: [
                {
                    courseTitle: 'Advanced React Development',
                    courseSlug: 'advanced-react-dev',
                    courseImageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
                    lastAssignment: {
                        assignmentId: 'assignment-1',
                        assignmentTitle: 'Create a photo composition',
                        assignmentStatus: 'AwaitingReview'
                    }
                },
                {
                    courseTitle: 'TypeScript Fundamentals',
                    courseSlug: 'typescript-fundamentals',
                    courseImageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
                    lastAssignment: {
                        assignmentId: 'assignment-2',
                        assignmentTitle: 'Build a TypeScript project',
                        assignmentStatus: 'Passed'
                    }
                }
            ]
        },
        {
            studentId: 2,
            fullName: 'Bob Smith',
            avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
            coachingSessionCount: 3,
            courses: [
                {
                    courseTitle: 'JavaScript Masterclass',
                    courseSlug: 'javascript-masterclass',
                    courseImageUrl: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
                    lastAssignment: {
                        assignmentId: 'assignment-3',
                        assignmentTitle: 'JavaScript algorithms',
                        assignmentStatus: 'AwaitingForLongTime'
                    }
                }
            ]
        },
        {
            studentId: 3,
            fullName: 'Carol Davis',
            avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
            coachingSessionCount: 8,
            courses: [
                {
                    courseTitle: 'UI/UX Design Principles',
                    courseSlug: 'ui-ux-design',
                    courseImageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
                    lastAssignment: {
                        assignmentId: 'assignment-4',
                        assignmentTitle: 'Design wireframes',
                        assignmentStatus: 'AwaitingReview'
                    }
                },
                {
                    courseTitle: 'Digital Marketing Basics',
                    courseSlug: 'digital-marketing',
                    courseImageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
                    lastAssignment: {
                        assignmentId: 'assignment-5',
                        assignmentTitle: 'Create marketing plan',
                        assignmentStatus: 'Passed'
                    }
                }
            ]
        },
        {
            studentId: 6,
            fullName: 'David Wilson',
            avatarUrl: null,
            coachingSessionCount: 2,
            courses: [
                {
                    courseTitle: 'Python for Beginners',
                    courseSlug: 'python-beginners',
                    courseImageUrl: null,
                    lastAssignment: null
                }
            ]
        },
        {
            studentId: 7,
            fullName: 'Eva Martinez',
            avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
            coachingSessionCount: 12,
            courses: [
                {
                    courseTitle: 'Data Science Fundamentals',
                    courseSlug: 'data-science-fundamentals',
                    courseImageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
                    lastAssignment: {
                        assignmentId: 'assignment-6',
                        assignmentTitle: 'Data analysis project',
                        assignmentStatus: 'AwaitingReview'
                    }
                },
                {
                    courseTitle: 'Machine Learning Basics',
                    courseSlug: 'ml-basics',
                    courseImageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
                    lastAssignment: {
                        assignmentId: 'assignment-7',
                        assignmentTitle: 'Build ML model',
                        assignmentStatus: 'AwaitingForLongTime'
                    }
                },
                {
                    courseTitle: 'Statistics for Data Science',
                    courseSlug: 'stats-data-science',
                    courseImageUrl: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
                    lastAssignment: {
                        assignmentId: 'assignment-8',
                        assignmentTitle: 'Statistical analysis',
                        assignmentStatus: 'Passed'
                    }
                }
            ]
        },
        {
            studentId: 8,
            fullName: 'Alice Johnson',
            avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b647?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
            coachingSessionCount: 5,
            courses: [
                {
                    courseTitle: 'Advanced React Development',
                    courseSlug: 'advanced-react-dev',
                    courseImageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
                    lastAssignment: {
                        assignmentId: 'assignment-1',
                        assignmentTitle: 'Create a photo composition',
                        assignmentStatus: 'AwaitingReview'
                    }
                },
                {
                    courseTitle: 'TypeScript Fundamentals',
                    courseSlug: 'typescript-fundamentals',
                    courseImageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
                    lastAssignment: {
                        assignmentId: 'assignment-2',
                        assignmentTitle: 'Build a TypeScript project',
                        assignmentStatus: 'Passed'
                    }
                }
            ]
        },
        {
            studentId: 9,
            fullName: 'Alice Johnson',
            avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b647?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
            coachingSessionCount: 5,
            courses: [
                {
                    courseTitle: 'Advanced React Development',
                    courseSlug: 'advanced-react-dev',
                    courseImageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
                    lastAssignment: {
                        assignmentId: 'assignment-1',
                        assignmentTitle: 'Create a photo composition',
                        assignmentStatus: 'AwaitingReview'
                    }
                },
                {
                    courseTitle: 'TypeScript Fundamentals',
                    courseSlug: 'typescript-fundamentals',
                    courseImageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
                    lastAssignment: {
                        assignmentId: 'assignment-2',
                        assignmentTitle: 'Build a TypeScript project',
                        assignmentStatus: 'Passed'
                    }
                }
            ]
        },
        {
            studentId: 10,
            fullName: 'Alice Johnson',
            avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b647?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
            coachingSessionCount: 5,
            courses: [
                {
                    courseTitle: 'Advanced React Development',
                    courseSlug: 'advanced-react-dev',
                    courseImageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
                    lastAssignment: {
                        assignmentId: 'assignment-1',
                        assignmentTitle: 'Create a photo composition',
                        assignmentStatus: 'AwaitingReview'
                    }
                },
                {
                    courseTitle: 'TypeScript Fundamentals',
                    courseSlug: 'typescript-fundamentals',
                    courseImageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
                    lastAssignment: {
                        assignmentId: 'assignment-2',
                        assignmentTitle: 'Build a TypeScript project',
                        assignmentStatus: 'Passed'
                    }
                }
            ]
        },
        {
            studentId: 11,
            fullName: 'David Wilson',
            avatarUrl: null,
            coachingSessionCount: 2,
            courses: [
                {
                    courseTitle: 'Python for Beginners',
                    courseSlug: 'python-beginners',
                    courseImageUrl: null,
                    lastAssignment: null
                }
            ]
        },
        {
            studentId: 12,
            fullName: 'David Wilson',
            avatarUrl: null,
            coachingSessionCount: 2,
            courses: [
                {
                    courseTitle: 'Python for Beginners',
                    courseSlug: 'python-beginners',
                    courseImageUrl: null,
                    lastAssignment: null
                }
            ]
        },
        {
            studentId: 13,
            fullName: 'David Wilson',
            avatarUrl: null,
            coachingSessionCount: 2,
            courses: [
                {
                    courseTitle: 'Python for Beginners',
                    courseSlug: 'python-beginners',
                    courseImageUrl: null,
                    lastAssignment: null
                }
            ]
        },
    ]
};

export const listCoachStudents = t.procedure
    .input(useCaseModels.ListCoachStudentsRequestSchema)
    .query<useCaseModels.TListCoachStudentsSuccessResponse>(() => {
        return {
            success: true,
            data: coachStudentsMock,
        };
    });
