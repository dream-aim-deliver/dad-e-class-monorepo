import type { Meta, StoryObj } from '@storybook/react-vite';
import { AssignmentCardList } from '../../lib/components/assignment/assignment-card-list';
import { AssignmentCardProps } from '../../lib/components/assignment/assignment-card';
import React from 'react';

// Mock Data Generators
const generateFile = () => ({
    id: Math.random().toString(),
    name: 'Slide.pdf',
    mimeType: 'application/pdf',
    size: 102400,
    checksum: 'xyz123',
    status: 'available' as const,
    category: 'generic' as const,
    url: 'https://example.com/slide.pdf',
});

const generateLink = () => ({
    linkId: Math.floor(Math.random() * 1_000_000),
    title: 'Example Link',
    url: 'https://example.com',
});

// Mock callback functions for Storybook stories
// eslint-disable-next-line @typescript-eslint/no-empty-function
const mockCallback = () => {};

const mockStudent = {
    id: '1',
    name: 'John Doe',
    image: 'https://randomuser.me/api/portraits/men/3.jpg',
    isCurrentUser: false,
    role: 'student' as const,
};

const mockCoach = {
    id: '2',
    name: 'Coach Jane',
    image: 'https://randomuser.me/api/portraits/women/5.jpg',
    isCurrentUser: true,
    role: 'coach' as const,
};

// Sample assignment data without 'id' in course objects
const createSampleAssignments = (): Omit<AssignmentCardProps, 'onFileDownload' | 'onFileDelete' | 'onLinkDelete' | 'onChange' | 'onImageChange' | 'onClickCourse' | 'onClickUser' | 'onClickGroup' | 'onClickView' | 'onReplyFileDelete' | 'onReplyLinkDelete' | 'onDeleteIcon' | 'onReplyImageChange' | 'onReplyDeleteIcon' | 'onReplyChange' | 'locale'>[] => [
    // AwaitingReview, no reply (coach)
    {
        role: 'coach',
        assignmentId: 1,
        title: 'Algebra Homework',
        description: 'Solve all the equations in section B.',
        files: [generateFile()],
        links: [generateLink()],
        course: {
            // Removed id property to match expected type
            title: 'Storybook Champions Course',
            imageUrl: 'https://picsum.photos/40/40',
        },
        module: 2,
        lesson: 4,
        status: 'AwaitingReview',
        replies: [],
        student: mockStudent,
        groupName: 'Team Rockets',
        linkEditIndex: -1,
        replyLinkEditIndex: -1,
    },
    // AwaitingReview, with reply (coach)
    {
        role: 'coach',
        assignmentId: 2,
        title: 'Biology Lab Report',
        description: 'Complete the lab report for the cell division experiment.',
        files: [generateFile()],
        links: [generateLink()],
        course: {
            title: 'Advanced Biology',
            imageUrl: 'https://picsum.photos/40/40',
        },
        module: 3,
        lesson: 2,
        status: 'AwaitingReview',
        replies: [
            {
                replyId: 1001,
                timestamp: new Date(Date.now() - 86400000).toISOString(),
                type: 'resources',
                comment: 'Here is my submission.',
                sender: mockStudent,
                files: [generateFile()],
                links: [generateLink()],
            },
        ],
        student: mockStudent,
        groupName: 'Science Team',
        linkEditIndex: -1,
        replyLinkEditIndex: -1,
    },
    // Passed, with reply (student)
    {
        role: 'student',
        assignmentId: 3,
        title: 'History Essay',
        description: 'Write an essay about World War II.',
        files: [],
        links: [],
        course: {
            title: 'World History',
            imageUrl: 'https://picsum.photos/40/40',
        },
        module: 1,
        lesson: 5,
        status: 'Passed',
        replies: [
            {
                replyId: 1002,
                timestamp: new Date().toISOString(),
                sender: mockCoach,
                type: 'passed',
            },
        ],
        student: mockStudent,
        groupName: 'History Buffs',
        linkEditIndex: -1,
        replyLinkEditIndex: -1,
    },
    // Long waiting assignment
    {
        role: 'coach',
        assignmentId: 4,
        title: 'Create a photo composition',
        description: 'Custom coach description here, for example: "Please download the file, follow the tasks and upload your work when you\'re done."',
        files: [
            {
                id: 'img1',
                name: 'Imagefile.png',
                size: 3500000,
                status: 'available',
                category: 'image',
                url: 'https://picsum.photos/seed/assignment/400/300',
                thumbnailUrl: 'https://picsum.photos/100/100',
            },
        ],
        links: [],
        course: {
            title: 'Photography Course',
            imageUrl: 'https://picsum.photos/40/40',
        },
        module: 2,
        lesson: 4,
        status: 'AwaitingForLongTime',
        replies: [
            {
                replyId: 1,
                timestamp: '2024-09-19T19:52:00Z',
                type: 'resources',
                comment: "I don't know why but it looks weird. Any suggestion?",
                sender: {
                    id: 'alice',
                    name: 'Alice',
                    image: 'https://picsum.photos/40/40',
                    isCurrentUser: false,
                    role: 'student',
                },
                files: [
                    {
                        id: 'img2',
                        name: 'Student_work.png',
                        size: 3500000,
                        status: 'available',
                        category: 'image',
                        url: 'https://picsum.photos/seed/student/400/300',
                        thumbnailUrl: 'https://picsum.photos/100/100',
                    },
                ],
                links: [
                    {
                        linkId: 1,
                        title: 'Reference Link',
                        url: 'https://website.com/reference',
                    },
                ],
            },
        ],
        student: {
            id: 'alice',
            name: 'Alice Johnson',
            image: 'https://randomuser.me/api/portraits/women/1.jpg',
            isCurrentUser: false,
            role: 'student',
        },
        groupName: 'Photography Group',
        linkEditIndex: -1,
        replyLinkEditIndex: -1,
    },
    // Assignment without replies
    {
        role: 'coach',
        assignmentId: 5,
        title: 'Mathematics Problem Set',
        description: 'Solve problems 1-20 from chapter 5.',
        files: [generateFile()],
        links: [],
        course: {
            title: 'Advanced Mathematics',
            imageUrl: 'https://picsum.photos/40/40',
        },
        module: 1,
        lesson: 1,
        status: 'AwaitingReview',
        replies: [],
        student: {
            id: 'bob',
            name: 'Bob Smith',
            image: 'https://randomuser.me/api/portraits/men/4.jpg',
            isCurrentUser: false,
            role: 'student',
        },
        groupName: 'Math Warriors',
        linkEditIndex: -1,
        replyLinkEditIndex: -1,
    },
];

const meta: Meta<typeof AssignmentCardList> = {
    title: 'Components/Assignment/AssignmentCardList',
    component: AssignmentCardList,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
    argTypes: {
        locale: {
            control: 'select',
            options: ['en', 'de'],
            description: 'Language locale for internationalization'
        },
        assignments: {
            description: 'Array of assignment data objects to display'
        },
        onFileDownload: {
            action: 'file-downloaded',
            description: 'Callback for file downloads'
        },
        onFileDelete: {
            action: 'file-deleted',
            description: 'Callback for file deletions'
        },
        onLinkDelete: {
            action: 'link-deleted',
            description: 'Callback for link deletions'
        },
        onChange: {
            action: 'assignment-changed',
            description: 'Callback for assignment modifications'
        },
        onImageChange: {
            action: 'image-changed',
            description: 'Callback for image changes'
        },
        onClickCourse: {
            action: 'course-clicked',
            description: 'Callback for course clicks'
        },
        onClickUser: {
            action: 'user-clicked',
            description: 'Callback for user clicks'
        },
        onClickGroup: {
            action: 'group-clicked',
            description: 'Callback for group clicks'
        },
        onClickView: {
            action: 'view-clicked',
            description: 'Callback for view button clicks'
        },
        onDownloadAll: {
            action: 'download-all-clicked',
            description: 'Callback for download all button'
        }
    },
};

export default meta;
type Story = StoryObj<typeof AssignmentCardList>;

/**
 * Default assignment card list with various assignment states
 */
export const Default: Story = {
    args: {
        assignments: createSampleAssignments().map(assignment => ({
            ...assignment,
            locale: 'en',
            onFileDownload: mockCallback,
            onFileDelete: mockCallback,
            onLinkDelete: mockCallback,
            onChange: mockCallback,
            onImageChange: async () => ({ 
                id: 'mock', 
                name: 'mock', 
                mimeType: 'image/jpeg', 
                size: 1000, 
                checksum: 'mock', 
                status: 'available', 
                category: 'image', 
                url: 'mock', 
                thumbnailUrl: 'mock' 
            }),
            onClickCourse: mockCallback,
            onClickUser: mockCallback,
            onClickGroup: mockCallback,
            onClickView: mockCallback,
            onReplyFileDelete: mockCallback,
            onReplyLinkDelete: mockCallback,
            onDeleteIcon: mockCallback,
            onReplyImageChange: async () => ({ 
                id: 'mock', 
                name: 'mock', 
                mimeType: 'image/jpeg', 
                size: 1000, 
                checksum: 'mock', 
                status: 'available', 
                category: 'image', 
                url: 'mock', 
                thumbnailUrl: 'mock' 
            }),
            onReplyDeleteIcon: mockCallback,
            onReplyChange: mockCallback,
        })),
        locale: 'en',
        availableStatuses: ['AwaitingReview', 'AwaitingForLongTime', 'Passed'],
        availableCourses: ['Storybook Champions Course', 'Advanced Biology', 'World History', 'Photography Course', 'Advanced Mathematics'],
        availableModules: ['Module 1', 'Module 2', 'Module 3'],
        availableLessons: ['Lesson 1', 'Lesson 2', 'Lesson 3', 'Lesson 4', 'Lesson 5'],
    },
    parameters: {
        docs: {
            description: {
                story: 'Default assignment card list showing various assignment states including pending, completed, and long-waiting assignments.'
            }
        }
    }
};

/**
 * Empty state when no assignments are available
 */
export const EmptyState: Story = {
    args: {
        assignments: [],
        locale: 'en',
        onFileDownload: mockCallback,
        onFileDelete: mockCallback,
        onLinkDelete: mockCallback,
        onChange: mockCallback,
        onImageChange: async () => ({ 
            id: 'mock', 
            name: 'mock', 
            mimeType: 'image/jpeg', 
            size: 1000, 
            checksum: 'mock', 
            status: 'available', 
            category: 'image', 
            url: 'mock', 
            thumbnailUrl: 'mock' 
        }),
        onClickCourse: mockCallback,
        onClickUser: mockCallback,
        onClickGroup: mockCallback,
        onClickView: mockCallback,
        availableStatuses: ['AwaitingReview', 'AwaitingForLongTime', 'Passed'],
        availableCourses: ['Course A', 'Course B'],
        availableModules: ['Module 1', 'Module 2'],
        availableLessons: ['Lesson 1', 'Lesson 2'],
    },
    parameters: {
        docs: {
            description: {
                story: 'Empty state displayed when no assignments match the current filters or when no assignments exist.'
            }
        }
    }
};

/**
 * German locale version
 */
export const GermanLocale: Story = {
    args: {
        assignments: createSampleAssignments().slice(0, 3).map(assignment => ({
            ...assignment,
            locale: 'de',
            onFileDownload: mockCallback,
            onFileDelete: mockCallback,
            onLinkDelete: mockCallback,
            onChange: mockCallback,
            onImageChange: async () => ({ 
                id: 'mock', 
                name: 'mock', 
                mimeType: 'image/jpeg', 
                size: 1000, 
                checksum: 'mock', 
                status: 'available', 
                category: 'image', 
                url: 'mock', 
                thumbnailUrl: 'mock' 
            }),
            onClickCourse: mockCallback,
            onClickUser: mockCallback,
            onClickGroup: mockCallback,
            onClickView: mockCallback,
            onReplyFileDelete: mockCallback,
            onReplyLinkDelete: mockCallback,
            onDeleteIcon: mockCallback,
            onReplyImageChange: async () => ({ 
                id: 'mock', 
                name: 'mock', 
                mimeType: 'image/jpeg', 
                size: 1000, 
                checksum: 'mock', 
                status: 'available', 
                category: 'image', 
                url: 'mock', 
                thumbnailUrl: 'mock' 
            }),
            onReplyDeleteIcon: mockCallback,
            onReplyChange: mockCallback,
        })),
        locale: 'de',
        availableStatuses: ['AwaitingReview', 'AwaitingForLongTime', 'Passed'],
        availableCourses: ['Deutsch Kurs', 'Mathematik', 'Geschichte'],
        availableModules: ['Modul 1', 'Modul 2', 'Modul 3'],
        availableLessons: ['Lektion 1', 'Lektion 2', 'Lektion 3'],
    },
    parameters: {
        docs: {
            description: {
                story: 'Assignment card list with German locale to test internationalization and localized content.'
            }
        }
    }
};

/**
 * Single assignment for detailed testing
 */
export const SingleAssignment: Story = {
    args: {
        assignments: [createSampleAssignments()[3]].map(assignment => ({
            ...assignment,
            locale: 'en',
            onFileDownload: mockCallback,
            onFileDelete: mockCallback,
            onLinkDelete: mockCallback,
            onChange: mockCallback,
            onImageChange: async () => ({ 
                id: 'mock', 
                name: 'mock', 
                mimeType: 'image/jpeg', 
                size: 1000, 
                checksum: 'mock', 
                status: 'available', 
                category: 'image', 
                url: 'mock', 
                thumbnailUrl: 'mock' 
            }),
            onClickCourse: mockCallback,
            onClickUser: mockCallback,
            onClickGroup: mockCallback,
            onClickView: mockCallback,
            onReplyFileDelete: mockCallback,
            onReplyLinkDelete: mockCallback,
            onDeleteIcon: mockCallback,
            onReplyImageChange: async () => ({ 
                id: 'mock', 
                name: 'mock', 
                mimeType: 'image/jpeg', 
                size: 1000, 
                checksum: 'mock', 
                status: 'available', 
                category: 'image', 
                url: 'mock', 
                thumbnailUrl: 'mock' 
            }),
            onReplyDeleteIcon: mockCallback,
            onReplyChange: mockCallback,
        })),
        locale: 'en',
        availableStatuses: ['AwaitingForLongTime'],
        availableCourses: ['Photography Course'],
        availableModules: ['Module 2'],
        availableLessons: ['Lesson 4'],
    },
    parameters: {
        docs: {
            description: {
                story: 'Single assignment card for detailed component testing and debugging.'
            }
        }
    }
};

/**
 * Assignment list with download all functionality
 */
export const WithDownloadAll: Story = {
    args: {
        assignments: createSampleAssignments().map(assignment => ({
            ...assignment,
            locale: 'en',
            onFileDownload: mockCallback,
            onFileDelete: mockCallback,
            onLinkDelete: mockCallback,
            onChange: mockCallback,
            onImageChange: async () => ({ 
                id: 'mock', 
                name: 'mock', 
                mimeType: 'image/jpeg', 
                size: 1000, 
                checksum: 'mock', 
                status: 'available', 
                category: 'image', 
                url: 'mock', 
                thumbnailUrl: 'mock' 
            }),
            onClickCourse: mockCallback,
            onClickUser: mockCallback,
            onClickGroup: mockCallback,
            onClickView: mockCallback,
            onReplyFileDelete: mockCallback,
            onReplyLinkDelete: mockCallback,
            onDeleteIcon: mockCallback,
            onReplyImageChange: async () => ({ 
                id: 'mock', 
                name: 'mock', 
                mimeType: 'image/jpeg', 
                size: 1000, 
                checksum: 'mock', 
                status: 'available', 
                category: 'image', 
                url: 'mock', 
                thumbnailUrl: 'mock' 
            }),
            onReplyDeleteIcon: mockCallback,
            onReplyChange: mockCallback,
        })),
        locale: 'en',
        availableStatuses: ['AwaitingReview', 'AwaitingForLongTime', 'Passed'],
        availableCourses: ['Storybook Champions Course', 'Advanced Biology', 'World History', 'Photography Course', 'Advanced Mathematics'],
        availableModules: ['Module 1', 'Module 2', 'Module 3'],
        availableLessons: ['Lesson 1', 'Lesson 2', 'Lesson 3', 'Lesson 4', 'Lesson 5'],
    },
    parameters: {
        docs: {
            description: {
                story: 'Assignment card list with download all functionality enabled to test bulk operations.'
            }
        }
    }
};

/**
 * Mobile responsive view
 */
export const MobileView: Story = {
    args: {
        assignments: createSampleAssignments().slice(0, 3).map(assignment => ({
            ...assignment,
            locale: 'en',
            onFileDownload: mockCallback,
            onFileDelete: mockCallback,
            onLinkDelete: mockCallback,
            onChange: mockCallback,
            onImageChange: async () => ({ 
                id: 'mock', 
                name: 'mock', 
                mimeType: 'image/jpeg', 
                size: 1000, 
                checksum: 'mock', 
                status: 'available', 
                category: 'image', 
                url: 'mock', 
                thumbnailUrl: 'mock' 
            }),
            onClickCourse: mockCallback,
            onClickUser: mockCallback,
            onClickGroup: mockCallback,
            onClickView: mockCallback,
            onReplyFileDelete: mockCallback,
            onReplyLinkDelete: mockCallback,
            onDeleteIcon: mockCallback,
            onReplyImageChange: async () => ({ 
                id: 'mock', 
                name: 'mock', 
                mimeType: 'image/jpeg', 
                size: 1000, 
                checksum: 'mock', 
                status: 'available', 
                category: 'image', 
                url: 'mock', 
                thumbnailUrl: 'mock' 
            }),
            onReplyDeleteIcon: mockCallback,
            onReplyChange: mockCallback,
        })),
        locale: 'en',
        availableStatuses: ['AwaitingReview', 'Passed'],
        availableCourses: ['Mobile Course'],
        availableModules: ['Module 1'],
        availableLessons: ['Lesson 1'],
    },
    parameters: {
        viewport: {
            defaultViewport: 'mobile1',
        },
        docs: {
            description: {
                story: 'Assignment card list optimized for mobile devices with responsive layout and touch-friendly interactions.'
            }
        }
    }
};

/**
 * Interactive demo with state management
 */
export const InteractiveDemo: Story = {
    render: (args) => {
        const [assignments, setAssignments] = React.useState(
            createSampleAssignments().map(assignment => ({
                ...assignment,
                locale: 'en' as const,
                onFileDownload: (id: string) => console.log('Download file:', id),
                onFileDelete: (assignmentId: number, fileId: string) => {
                    console.log('Delete file:', fileId, 'from assignment:', assignmentId);
                },
                onLinkDelete: (assignmentId: number, linkId: number) => {
                    console.log('Delete link:', linkId, 'from assignment:', assignmentId);
                },
                onChange: (files: any[], links: any[], linkEditIndex: number) => {
                    console.log('Assignment changed:', { files: files.length, links: links.length, linkEditIndex });
                },
                onImageChange: async (imageRequest: any) => {
                    console.log('Image change:', imageRequest.name);
                    return { 
                        id: 'new', 
                        name: imageRequest.name, 
                        mimeType: 'image/jpeg', 
                        size: 1000, 
                        checksum: 'new', 
                        status: 'available' as const, 
                        category: 'image' as const, 
                        url: 'new', 
                        thumbnailUrl: 'new' 
                    };
                },
                onClickCourse: () => console.log('Course clicked'),
                onClickUser: () => console.log('User clicked'),
                onClickGroup: () => console.log('Group clicked'),
                onClickView: () => console.log('View clicked'),
                onReplyFileDelete: () => console.log('Reply file deleted'),
                onReplyLinkDelete: () => console.log('Reply link deleted'),
                onDeleteIcon: () => console.log('Delete icon clicked'),
                onReplyImageChange: async () => ({ 
                    id: 'mock', 
                    name: 'mock', 
                    mimeType: 'image/jpeg', 
                    size: 1000, 
                    checksum: 'mock', 
                    status: 'available' as const, 
                    category: 'image' as const, 
                    url: 'mock', 
                    thumbnailUrl: 'mock' 
                }),
                onReplyDeleteIcon: () => console.log('Reply delete icon clicked'),
                onReplyChange: () => console.log('Reply changed'),
            }))
        );

        return (
            <AssignmentCardList
                {...args}
                assignments={assignments}
                onFileDownload={(id) => console.log('List: Download file:', id)}
                onFileDelete={(assignmentId, fileId) => console.log('List: Delete file:', fileId)}
                onLinkDelete={(assignmentId, linkId) => console.log('List: Delete link:', linkId)}
                onChange={(files, links, linkEditIndex) => console.log('List: Changed:', { files: files.length, links: links.length })}
                onImageChange={async (imageRequest) => {
                    console.log('List: Image change:', imageRequest.name);
                    return { 
                        id: 'new', 
                        name: imageRequest.name, 
                        mimeType: 'image/jpeg', 
                        size: 1000, 
                        checksum: 'new', 
                        status: 'available', 
                        category: 'image', 
                        url: 'new', 
                        thumbnailUrl: 'new' 
                    };
                }}
                onClickCourse={() => console.log('List: Course clicked')}
                onClickUser={() => console.log('List: User clicked')}
                onClickGroup={() => console.log('List: Group clicked')}
                onClickView={() => console.log('List: View clicked')}
                onDownloadAll={() => console.log('List: Download all clicked')}
            />
        );
    },
    args: {
        locale: 'en',
        availableStatuses: ['AwaitingReview', 'AwaitingForLongTime', 'Passed'],
        availableCourses: ['All Courses'],
        availableModules: ['All Modules'],
        availableLessons: ['All Lessons'],
    },
    parameters: {
        docs: {
            description: {
                story: 'Interactive demo with console logging to demonstrate all callback functionality and state management.'
            }
        }
    }
};
