import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { AssignmentOverview } from "../../lib/components/assignment/assignment-overview";
import { TLocale } from "@maany_shr/e-class-translations";

// --- Mock Data ---
const mockCourse = {
    id: 7,
    title: "Advanced Mathematics",
    imageUrl: "https://picsum.photos/40/40",
    slug: "advanced-mathematics",
};

const mockStudent = {
    id: 1,
    name: "Emma",
    surname: "Watson",
    username: "emma_watson",
    avatarUrl: "https://randomuser.me/api/portraits/women/18.jpg",
};

const mockCoachSender = {
    id: 2,
    username: "coach_smith",
    role: "coach",
    name: "John",
    surname: "Smith",
    avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
    isCurrentUser: false,
};

const mockStudentSender = {
    id: 1,
    username: "emma_watson",
    role: "student",
    name: "Emma",
    surname: "Watson",
    avatarUrl: "https://randomuser.me/api/portraits/women/18.jpg",
    isCurrentUser: true,
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
    {
        name: "Example Image.jpg",
        thumbnailUrl: "https://picsum.photos/100/100",
        id: "file2",
        size: 512000,
        category: "image" as const,
        downloadUrl: "https://example.com/image.jpg",
    },
];

const mockLinks = [
    {
        title: "Reference Material",
        url: "https://example.com/reference",
        iconFile: {
            name: "icon.png",
            id: "icon1",
            size: 1024,
            category: "image" as const,
            downloadUrl: "https://example.com/icon.png",
        },
    },
    {
        title: "Additional Resources",
        url: "https://example.com/resources",
    },
];

const mockReplyWithResources = {
    sender: mockStudentSender,
    comment: "Here is my completed assignment. I found the problem in section 3 particularly challenging.",
    files: [
        {
            name: "My Solution.pdf",
            thumbnailUrl: null,
            id: "reply_file1",
            size: 2048000,
            category: "document" as const,
            downloadUrl: "https://example.com/solution.pdf",
        },
    ],
    links: [
        {
            title: "Additional Reference",
            url: "https://example.com/additional-ref",
        },
    ],
    sentAt: 1709827200,
    replyType: "reply" as const,
};

const mockPassedReply = {
    sender: mockCoachSender,
    replyType: "passed" as const,
    passedAt: 1709827200,
};

// --- Meta ---
const meta: Meta<typeof AssignmentOverview> = {
    title: "Components/Assignment/AssignmentOverview",
    component: AssignmentOverview,
    argTypes: {
        locale: {
            control: "radio",
            options: ["en", "de"],
            defaultValue: "en",
        },
    },
};
export default meta;
type Story = StoryObj<typeof AssignmentOverview>;

// --- Base Props ---
const baseProps = {
    id: 123,
    module: 3,
    lesson: 7,
    title: "Quadratic Equations and Problem Solving",
    course: mockCourse,
    groupId: 456,
    groupName: "Advanced Math Group",
    onClickCourse: () => alert("Navigate to course"),
    onClickGroup: () => alert("Navigate to group"),
    onClickView: () => alert("View assignment details"),
    onFileDownload: (downloadUrl: string) => alert(`Download file: ${downloadUrl}`),
    locale: "en" as TLocale,
};

// --- Student Stories ---
export const StudentNoReplyWaitingFeedback: Story = {
    args: {
        ...baseProps,
        role: "student",
        isReplied: false,
        status: "waiting-feedback",
        description: "Solve the quadratic equations provided in the worksheet. Show all work and explain your reasoning for each solution method chosen.",
        links: mockLinks,
        files: mockFiles,
    },
};

export const StudentNoReplyLongWait: Story = {
    args: {
        ...baseProps,
        role: "student",
        isReplied: false,
        status: "long-wait",
        description: "Complete the advanced problem set focusing on discriminant analysis and vertex form transformations.",
        links: mockLinks,
        files: mockFiles,
    },
};

export const StudentNoReplyCourseCompleted: Story = {
    args: {
        ...baseProps,
        role: "student",
        isReplied: false,
        status: "course-completed",
        description: "Final assignment: Create a comprehensive project demonstrating all quadratic equation solving methods.",
        links: mockLinks,
        files: mockFiles,
    },
};

export const StudentWithReplyWaitingFeedback: Story = {
    args: {
        ...baseProps,
        role: "student",
        isReplied: true,
        status: "waiting-feedback",
        lastReply: mockReplyWithResources,
    },
};

export const StudentWithReplyPassed: Story = {
    args: {
        ...baseProps,
        role: "student",
        isReplied: true,
        status: "course-completed",
        lastReply: mockPassedReply,
    },
};

export const StudentWithReplyNoLastReply: Story = {
    args: {
        ...baseProps,
        role: "student",
        isReplied: true,
        status: "waiting-feedback",
        lastReply: undefined,
    },
};

// --- Coach Stories ---
export const CoachWaitingFeedback: Story = {
    args: {
        ...baseProps,
        role: "coach",
        status: "waiting-feedback",
        student: mockStudent,
        lastReply: mockReplyWithResources,
        onClickUser: () => alert("Navigate to student profile"),
    },
};

export const CoachLongWait: Story = {
    args: {
        ...baseProps,
        role: "coach",
        status: "long-wait",
        student: mockStudent,
        lastReply: mockReplyWithResources,
        onClickUser: () => alert("Navigate to student profile"),
    },
};

export const CoachCourseCompleted: Story = {
    args: {
        ...baseProps,
        role: "coach",
        status: "course-completed",
        student: mockStudent,
        lastReply: mockPassedReply,
        onClickUser: () => alert("Navigate to student profile"),
    },
};

export const CoachNoLastReply: Story = {
    args: {
        ...baseProps,
        role: "coach",
        status: "waiting-feedback",
        student: mockStudent,
        lastReply: undefined,
        onClickUser: () => alert("Navigate to student profile"),
    },
};

// --- German Locale Example ---
export const StudentGermanLocale: Story = {
    args: {
        ...baseProps,
        role: "student",
        isReplied: false,
        status: "waiting-feedback",
        description: "Lösen Sie die quadratischen Gleichungen im Arbeitsblatt. Zeigen Sie alle Schritte und erklären Sie Ihre Begründung für jede gewählte Lösungsmethode.",
        links: mockLinks,
        files: mockFiles,
        locale: "de",
    },
};