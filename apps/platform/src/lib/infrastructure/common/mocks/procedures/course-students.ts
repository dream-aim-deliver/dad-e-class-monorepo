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
                lastAssignmentCoach: {
                    coachId: 101,
                    coachFullName: 'Jane Coach',
                    coachingSessionCount: 5,
                    avatarUrl: 'https://randomuser.me/api/portraits/women/2.jpg',
                },
                lastAssignment: {
                    assignmentId: 'assign-123',
                    assignmentTile: 'Assignment 1',
                    assignmentStatus: 'Passed',
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
                lastAssignmentCoach: {
                    coachId: 102,
                    coachFullName: 'Bob Trainer',
                    coachingSessionCount: 3,
                    avatarUrl: 'https://randomuser.me/api/portraits/men/4.jpg',
                },
                lastAssignment: {
                    assignmentId: 'assign-124',
                    assignmentTile: 'Assignment 2',
                    assignmentStatus: 'AwaitingForLongTime',
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
                lastAssignmentCoach: {
                    coachId: 101,
                    coachFullName: 'Jane Coach',
                    coachingSessionCount: 7,
                    avatarUrl: 'https://randomuser.me/api/portraits/women/2.jpg',
                },
                lastAssignment: {
                    assignmentId: 'assign-125',
                    assignmentTile: 'Assignment 3',
                    assignmentStatus: 'Passed',
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
                lastAssignmentCoach: {
                    coachId: 103,
                    coachFullName: null,
                    coachingSessionCount: 2,
                    avatarUrl: null,
                },
                lastAssignment: {
                    assignmentId: 'assign-126',
                    assignmentTile: 'Assignment 4',
                    assignmentStatus: 'Passed',
                },
            },
            {
                studentId: 5,
                fullName: 'David Brown',
                avatarUrl: 'https://randomuser.me/api/portraits/men/6.jpg',
                courseTitle: 'Statistics for Economists',
                courseSlug: 'statistics-for-economists',
                courseImageUrl: 'https://example.com/course-image4.jpg',
                isStudentOfCoach: true,
                lastAssignmentCoach: {
                    coachId: 104,
                    coachFullName: 'Emma Coach',
                    coachingSessionCount: 6,
                    avatarUrl: 'https://randomuser.me/api/portraits/women/7.jpg',
                },
                lastAssignment: {
                    assignmentId: 'assign-127',
                    assignmentTile: 'Assignment 5',
                    assignmentStatus: 'AwaitingReview',
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
                lastAssignmentCoach: {
                    coachId: 105,
                    coachFullName: 'Liam Trainer',
                    coachingSessionCount: 4,
                    avatarUrl: 'https://randomuser.me/api/portraits/men/5.jpg',
                },
                lastAssignment: {
                    assignmentId: 'assign-128',
                    assignmentTile: 'Assignment 6',
                    assignmentStatus: 'Passed',
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
                lastAssignmentCoach: {
                    coachId: 106,
                    coachFullName: 'Olivia Coach',
                    coachingSessionCount: 5,
                    avatarUrl: 'https://randomuser.me/api/portraits/women/8.jpg',
                },
                lastAssignment: {
                    assignmentId: 'assign-129',
                    assignmentTile: 'Assignment 7',
                    assignmentStatus: 'Passed',
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
                lastAssignmentCoach: {
                    coachId: 107,
                    coachFullName: null,
                    coachingSessionCount: 2,
                    avatarUrl: null,
                },
                lastAssignment: {
                    assignmentId: 'assign-130',
                    assignmentTile: 'Assignment 8',
                    assignmentStatus: 'AwaitingReview',
                },
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

