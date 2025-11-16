import { useCaseModels } from "@maany_shr/e-class-models";
import { t } from "../trpc-setup";

const listCourseStudentsMock: Record<string, useCaseModels.TListCourseStudentsSuccessResponse['data']> = {
    "this-is-first-course": {
        students: [
            {
                studentId: 1,
                fullName: 'John Doe',
                avatarUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
                courseTitle: 'Introduction to Economics',
                courseSlug: 'intro-to-economics',
                courseImageUrl: 'https://example.com/course-image1.jpg',
                isStudentOfCoach: true,
                courseCompletionDate: '2023-12-15T10:30:00Z',
                lastAssignmentCoach: {
                    coachId: 101,
                    coachFullName: 'Jane Coach',
                    coachingSessionCount: 0,
                    avatarUrl: 'https://randomuser.me/api/portraits/women/2.jpg',
                },
                lastAssignment: {
                    assignmentId: 'assign-123',
                    assignmentTitle: 'Assignment 1',
                    assignmentStatus: 'passed',
                },
            },
            {
                studentId: 2,
                fullName: 'Alice Smith',
                avatarUrl: 'https://randomuser.me/api/portraits/women/3.jpg',
                courseTitle: 'Microeconomics Basics',
                courseSlug: 'microeconomics-basics',
                courseImageUrl: 'https://example.com/course-image2.jpg',
                isStudentOfCoach: false,
                courseCompletionDate: null,
                lastAssignmentCoach: {
                    coachId: 102,
                    coachFullName: 'Bob Trainer',
                    coachingSessionCount: 3,
                    avatarUrl: 'https://randomuser.me/api/portraits/men/4.jpg',
                },
                lastAssignment: {
                    assignmentId: 'assign-124',
                    assignmentTitle: 'Assignment 2',
                    assignmentStatus: 'long-wait',
                },
            },
            {
                studentId: 3,
                fullName: 'Michael Johnson',
                avatarUrl: null,
                courseTitle: 'Macroeconomics Fundamentals',
                courseSlug: 'macroeconomics-fundamentals',
                courseImageUrl: null,
                isStudentOfCoach: true,
                courseCompletionDate: '2023-11-20T14:45:00Z',
                lastAssignmentCoach: {
                    coachId: 101,
                    coachFullName: 'Jane Coach',
                    coachingSessionCount: 0,
                    avatarUrl: 'https://randomuser.me/api/portraits/women/2.jpg',
                },
                lastAssignment: {
                    assignmentId: 'assign-125',
                    assignmentTitle: 'Assignment 3',
                    assignmentStatus: 'passed',
                },
            },
            {
                studentId: 4,
                fullName: 'Sophia Lee',
                avatarUrl: 'https://randomuser.me/api/portraits/women/5.jpg',
                courseTitle: 'Economic Policy Analysis',
                courseSlug: 'economic-policy-analysis',
                courseImageUrl: 'https://example.com/course-image3.jpg',
                isStudentOfCoach: false,
                courseCompletionDate: null,
                lastAssignmentCoach: {
                    coachId: 103,
                    coachFullName: null,
                    coachingSessionCount: 2,
                    avatarUrl: null,
                },
                lastAssignment: null,
            },
            {
                studentId: 5,
                fullName: 'David Brown',
                avatarUrl: 'https://randomuser.me/api/portraits/men/6.jpg',
                courseTitle: 'Statistics for Economists',
                courseSlug: 'statistics-for-economists',
                courseImageUrl: 'https://example.com/course-image4.jpg',
                isStudentOfCoach: true,
                courseCompletionDate: null,
                lastAssignmentCoach: {
                    coachId: 104,
                    coachFullName: 'Emma Coach',
                    coachingSessionCount: 0,
                    avatarUrl: 'https://randomuser.me/api/portraits/women/7.jpg',
                },
                lastAssignment: {
                    assignmentId: 'assign-127',
                    assignmentTitle: 'Assignment 5',
                    assignmentStatus: 'waiting-feedback',
                },
            },
            {
                studentId: 6,
                fullName: 'Olivia Wilson',
                avatarUrl: null,
                courseTitle: 'Financial Economics',
                courseSlug: 'financial-economics',
                courseImageUrl: null,
                isStudentOfCoach: false,
                courseCompletionDate: '2023-12-01T09:15:00Z',
                lastAssignmentCoach: {
                    coachId: 105,
                    coachFullName: 'Liam Trainer',
                    coachingSessionCount: 4,
                    avatarUrl: 'https://randomuser.me/api/portraits/men/5.jpg',
                },
                lastAssignment: {
                    assignmentId: 'assign-128',
                    assignmentTitle: 'Assignment 6',
                    assignmentStatus: 'passed',
                },
            },
            {
                studentId: 7,
                fullName: 'James Taylor',
                avatarUrl: 'https://randomuser.me/api/portraits/men/6.jpg',
                courseTitle: 'Behavioral Economics',
                courseSlug: 'behavioral-economics',
                courseImageUrl: 'https://example.com/course-image5.jpg',
                isStudentOfCoach: true,
                courseCompletionDate: '2024-02-05T11:30:00Z',
                lastAssignmentCoach: {
                    coachId: 106,
                    coachFullName: 'Olivia Coach',
                    coachingSessionCount: 0,
                    avatarUrl: 'https://randomuser.me/api/portraits/women/8.jpg',
                },
                lastAssignment: {
                    assignmentId: 'assign-129',
                    assignmentTitle: 'Assignment 7',
                    assignmentStatus: 'passed',
                },
            },
            {
                studentId: 8,
                fullName: 'Isabella Martinez',
                avatarUrl: 'https://randomuser.me/api/portraits/women/9.jpg',
                courseTitle: 'Development Economics',
                courseSlug: 'development-economics',
                courseImageUrl: 'https://example.com/course-image6.jpg',
                isStudentOfCoach: false,
                courseCompletionDate: null,
                lastAssignmentCoach: {
                    coachId: 107,
                    coachFullName: null,
                    coachingSessionCount: 0,
                    avatarUrl: null,
                },
                lastAssignment: null,
            },
        ],
    },
};


export const listCourseStudents = t.procedure
    .input(useCaseModels.ListCourseStudentsRequestSchema)
    .query(async (opts): Promise<useCaseModels.TListCourseStudentsUseCaseResponse> => {
        const { courseSlug } = opts.input;
        const courseData = listCourseStudentsMock[courseSlug];

        if (courseData) {
            return {
                success: true,
                data: { students: courseData.students },
            };
        }
            
        return {
            success: true,
            data: { students: [] },
        };
    });

