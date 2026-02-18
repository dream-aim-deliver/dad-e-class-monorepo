import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { AssignmentOverviewList } from "../../lib/components/assignment/assignment-overview-list";
import { AssignmentOverview } from "../../lib/components/assignment/assignment-overview";
import { TLocale } from "@maany_shr/e-class-translations";

// --- Mock Data ---
const mockCourse1 = {
    id: 1,
    title: "Advanced Mathematics",
    imageUrl: "https://picsum.photos/40/40?random=1",
    slug: "advanced-mathematics",
};

const mockCourse2 = {
    id: 2,
    title: "Physics Fundamentals",
    imageUrl: "https://picsum.photos/40/40?random=2",
    slug: "physics-fundamentals",
};

const mockCourse3 = {
    id: 3,
    title: "Chemistry Lab",
    imageUrl: "https://picsum.photos/40/40?random=3",
    slug: "chemistry-lab",
};

const mockStudent1 = {
    id: 1,
    name: "Emma",
    surname: "Watson",
    username: "emma_watson",
    avatarUrl: "https://randomuser.me/api/portraits/women/18.jpg",
};

const mockStudent2 = {
    id: 2,
    name: "John",
    surname: "Doe",
    username: "john_doe",
    avatarUrl: "https://randomuser.me/api/portraits/men/25.jpg",
};

const mockStudent3 = {
    id: 3,
    name: "Sarah",
    surname: "Johnson",
    username: "sarah_johnson",
    avatarUrl: "https://randomuser.me/api/portraits/women/32.jpg",
};

const mockFiles = [
    {
        name: "Assignment Instructions.pdf",
        thumbnailUrl: null,
        id: "file1",
        size: 1024000,
        category: "document" as const,
        downloadUrl: "https://example.com/assignment.pdf",
    },
];

const mockLinks = [
    {
        title: "Reference Material",
        url: "https://example.com/reference",
    },
];

const mockReply = {
    sender: {
        id: 1,
        username: "student",
        role: "student",
        name: "Student",
        surname: "User",
        avatarUrl: "https://randomuser.me/api/portraits/women/18.jpg",
        isCurrentUser: true,
    },
    comment: "Here is my submission",
    files: mockFiles,
    links: mockLinks,
    sentAt: 1709827200,
    replyType: "reply" as const,
};

// --- Helper Functions ---
const createMockStudentAssignment = (
    id: number,
    status: "waiting-feedback" | "long-wait" | "course-completed",
    course: any,
    isReplied: boolean
) => {
    const baseProps = {
        id,
        module: Math.floor(Math.random() * 5) + 1,
        lesson: Math.floor(Math.random() * 10) + 1,
        title: `Assignment ${id}: ${course.title} Challenge`,
        status,
        course,
        groupId: 100 + id,
        groupName: `Study Group ${id}`,
        onClickCourse: () => alert(`Navigate to ${course.title}`),
        onClickGroup: () => alert(`Navigate to Study Group ${id}`),
        onClickView: () => alert(`View assignment ${id} details`),
        onFileDownload: (downloadUrl: string) => alert(`Download: ${downloadUrl}`),
        locale: "en" as TLocale,
    };

    if (isReplied) {
        return {
            ...baseProps,
            key: `assignment-${id}`,
            role: "student" as const,
            isReplied: true as const,
            lastReply: mockReply,
        };
    } else {
        return {
            ...baseProps,
            key: `assignment-${id}`,
            role: "student" as const,
            isReplied: false as const,
            description: `Complete the ${course.title} assignment by following the instructions provided.`,
            links: mockLinks,
            files: mockFiles,
        };
    }
};

const createMockCoachAssignment = (
    id: number,
    status: "waiting-feedback" | "long-wait" | "course-completed",
    course: any,
    student: any
) => {
    const baseProps = {
        id,
        module: Math.floor(Math.random() * 5) + 1,
        lesson: Math.floor(Math.random() * 10) + 1,
        title: `Assignment ${id}: ${course.title} Challenge`,
        status,
        course,
        groupId: 100 + id,
        groupName: `Study Group ${id}`,
        onClickCourse: () => alert(`Navigate to ${course.title}`),
        onClickGroup: () => alert(`Navigate to Study Group ${id}`),
        onClickView: () => alert(`View assignment ${id} details`),
        onFileDownload: (downloadUrl: string) => alert(`Download: ${downloadUrl}`),
        locale: "en" as TLocale,
    };

    return {
        ...baseProps,
        key: `assignment-${id}`,
        role: "coach" as const,
        student,
        lastReply: mockReply,
        onClickUser: () => alert(`Navigate to ${student.name} ${student.surname} profile`),
    };
};

// --- Meta ---
const meta: Meta<typeof AssignmentOverviewList> = {
    title: "Components/Assignment/AssignmentOverviewList",
    component: AssignmentOverviewList,
    argTypes: {
        locale: {
            control: "radio",
            options: ["en", "de"],
            defaultValue: "en",
        },
    },
};
export default meta;
type Story = StoryObj<typeof AssignmentOverviewList>;

// --- Empty State ---
export const Empty: Story = {
    args: {
        locale: "en",
        children: [],
    },
};

export const EmptyUndefined: Story = {
    args: {
        locale: "en",
        children: undefined,
    },
};

// --- Single Assignment ---
export const SingleStudentAssignment: Story = {
    args: {
        locale: "en",
        children: (
            <AssignmentOverview
                {...createMockStudentAssignment(1, "waiting-feedback", mockCourse1, false)}
            />
        ),
    },
};

export const SingleCoachAssignment: Story = {
    args: {
        locale: "en",
        children: (
            <AssignmentOverview
                {...createMockCoachAssignment(1, "waiting-feedback", mockCourse1, mockStudent1)}
            />
        ),
    },
};

// --- Multiple Student Assignments ---
export const MultipleStudentAssignments: Story = {
    args: {
        locale: "en",
        children: [
            <AssignmentOverview
                {...createMockStudentAssignment(1, "waiting-feedback", mockCourse1, false)}
            />,
            <AssignmentOverview
                {...createMockStudentAssignment(2, "long-wait", mockCourse2, true)}
            />,
            <AssignmentOverview
                {...createMockStudentAssignment(3, "course-completed", mockCourse3, true)}
            />,
        ],
    },
};

// --- Multiple Coach Assignments ---
export const MultipleCoachAssignments: Story = {
    args: {
        locale: "en",
        children: [
            <AssignmentOverview
                {...createMockCoachAssignment(1, "waiting-feedback", mockCourse1, mockStudent1)}
            />,
            <AssignmentOverview
                {...createMockCoachAssignment(2, "long-wait", mockCourse2, mockStudent2)}
            />,
            <AssignmentOverview
                {...createMockCoachAssignment(3, "course-completed", mockCourse3, mockStudent3)}
            />,
        ],
    },
};

// --- Large Grid ---
export const LargeGrid: Story = {
    args: {
        locale: "en",
        children: Array.from({ length: 9 }, (_, index) => {
            const courses = [mockCourse1, mockCourse2, mockCourse3];
            const students = [mockStudent1, mockStudent2, mockStudent3];
            const statuses: Array<"waiting-feedback" | "long-wait" | "course-completed"> = [
                "waiting-feedback", 
                "long-wait", 
                "course-completed"
            ];
            
            const course = courses[index % courses.length];
            const student = students[index % students.length];
            const status = statuses[index % statuses.length];
            
            return (
                <AssignmentOverview
                    {...createMockCoachAssignment(index + 1, status, course, student)}
                />
            );
        }),
    },
};

// --- Mixed Roles ---
export const MixedRoles: Story = {
    args: {
        locale: "en",
        children: [
            <AssignmentOverview
                {...createMockStudentAssignment(1, "waiting-feedback", mockCourse1, false)}
            />,
            <AssignmentOverview
                {...createMockCoachAssignment(2, "long-wait", mockCourse2, mockStudent1)}
            />,
            <AssignmentOverview
                {...createMockStudentAssignment(3, "course-completed", mockCourse3, true)}
            />,
            <AssignmentOverview
                {...createMockCoachAssignment(4, "waiting-feedback", mockCourse1, mockStudent2)}
            />,
        ],
    },
};

// --- German Locale ---
export const GermanLocale: Story = {
    args: {
        locale: "de",
        children: [
            <AssignmentOverview
                {...{
                    ...createMockStudentAssignment(1, "waiting-feedback", mockCourse1, false),
                    locale: "de",
                }}
            />,
            <AssignmentOverview
                {...{
                    ...createMockCoachAssignment(2, "long-wait", mockCourse2, mockStudent1),
                    locale: "de",
                }}
            />,
        ],
    },
};

// --- Responsive Breakpoints Test ---
export const ResponsiveTest: Story = {
    args: {
        locale: "en",
        children: [
            <AssignmentOverview
                {...createMockStudentAssignment(1, "waiting-feedback", mockCourse1, false)}
            />,
            <AssignmentOverview
                {...createMockStudentAssignment(2, "long-wait", mockCourse2, true)}
            />,
            <AssignmentOverview
                {...createMockStudentAssignment(3, "course-completed", mockCourse3, true)}
            />,
            <AssignmentOverview
                {...createMockCoachAssignment(4, "waiting-feedback", mockCourse1, mockStudent1)}
            />,
            <AssignmentOverview
                {...createMockCoachAssignment(5, "long-wait", mockCourse2, mockStudent2)}
            />,
        ],
    },
    parameters: {
        viewport: {
            defaultViewport: 'responsive',
        },
        docs: {
            description: {
                story: 'Test the responsive grid behavior: 1 column on mobile, 2 columns on tablet (md), 3 columns on desktop (xl)',
            },
        },
    },
};