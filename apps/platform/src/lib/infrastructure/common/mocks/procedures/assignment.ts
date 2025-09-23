import { useCaseModels } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';

const getAssignmentMock: useCaseModels.TGetAssignmentSuccessResponse['data'] =
{
    title: "Advanced React Patterns Implementation",
    description: "In this assignment, you'll implement advanced React patterns including compound components, render props, and custom hooks. Create a reusable modal component that demonstrates these patterns and write comprehensive tests for your implementation.",

    resources: [
        {
            id: "file_001",
            name: "react-patterns-guide.pdf",
            size: 2450000,
            category: "document",
            downloadUrl: "https://example.com/files/react-patterns-guide.pdf"
        },
        {
            id: "file_002",
            name: "component-examples.zip",
            size: 1850000,
            category: "generic",
            downloadUrl: "https://example.com/files/component-examples.zip"
        },
        {
            id: "file_003",
            name: "architecture-diagram.png",
            size: 450000,
            category: "image",
            downloadUrl: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop"
        },
        {
            id: "file_004",
            name: "demo-video.mp4",
            size: 15600000,
            category: "video",
            downloadUrl: "https://example.com/files/demo-video.mp4"
        }
    ],

    links: [
        {
            title: "React Documentation - Advanced Patterns",
            url: "https://react.dev/learn/passing-data-deeply-with-context",
            iconFile: {
                id: "icon_001",
                name: "react-icon.png",
                size: 25000,
                category: "image",
                downloadUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=64&h=64&fit=crop"
            }
        },
        {
            title: "Kent C. Dodds - Advanced React Patterns",
            url: "https://kentcdodds.com/blog/advanced-react-patterns",
            iconFile: null
        },
        {
            title: "Testing Library Documentation",
            url: "https://testing-library.com/docs/react-testing-library/intro/",
            iconFile: {
                id: "icon_002",
                name: "testing-icon.png",
                size: 18000,
                category: "image",
                downloadUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=64&h=64&fit=crop"
            }
        }
    ],

    progress: {
        student: {
            id: 12345,
            username: "johnsmith2024",
            name: "John",
            surname: "Smith",
            avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
            role: "student"
        },

        replies: [
            {
                sentAt: 1704067200000,
                comment: "I've completed the compound component pattern. Here's my initial implementation with the modal component. I'm still working on the render props pattern and would appreciate feedback on my current approach.",
                files: [
                    {
                        id: "reply_001",
                        name: "Modal.tsx",
                        size: 85000,
                        category: "document",
                        downloadUrl: "https://example.com/submissions/Modal.tsx"
                    },
                    {
                        id: "reply_002",
                        name: "Modal.test.tsx",
                        size: 42000,
                        category: "document",
                        downloadUrl: "https://example.com/submissions/Modal.test.tsx"
                    },
                    {
                        id: "reply_003",
                        name: "implementation-screenshot.png",
                        size: 320000,
                        category: "image",
                        downloadUrl: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=800&h=600&fit=crop"
                    }
                ],
                links: [
                    {
                        title: "CodeSandbox - My Implementation",
                        url: "https://codesandbox.io/s/modal-compound-pattern-abc123",
                        iconFile: {
                            id: "link_icon_001",
                            name: "codesandbox-icon.png",
                            size: 12000,
                            category: "image",
                            downloadUrl: "https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?w=64&h=64&fit=crop"
                        }
                    }
                ],
                sender: {
                    id: 12345,
                    username: "johnsmith2024",
                    name: "John",
                    surname: "Smith",
                    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
                    role: "student"
                }
            },

            {
                sentAt: 1704153600000,
                comment: "Great start on the compound component! Your structure looks solid. For the render props pattern, consider extracting the modal state logic into a separate hook first. This will make the render props implementation cleaner.",
                files: [
                    {
                        id: "feedback_001",
                        name: "suggested-improvements.md",
                        size: 28000,
                        category: "document",
                        downloadUrl: "https://example.com/feedback/suggested-improvements.md"
                    }
                ],
                links: [
                    {
                        title: "Accessibility Guidelines for Modals",
                        url: "https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/",
                        iconFile: null
                    }
                ],
                sender: {
                    id: 67890,
                    username: "sarahjones",
                    name: "Sarah",
                    surname: "Jones",
                    avatarUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
                    role: "instructor"
                }
            },

            {
                sentAt: 1704240000000,
                comment: "Thank you for the feedback! I've implemented the custom hook and improved the accessibility. The render props pattern is now working, and I've added comprehensive tests. Ready for final review!",
                files: [
                    {
                        id: "final_001",
                        name: "useModal.tsx",
                        size: 68000,
                        category: "document",
                        downloadUrl: "https://example.com/final/useModal.tsx"
                    },
                    {
                        id: "final_002",
                        name: "ModalRenderProps.tsx",
                        size: 92000,
                        category: "document",
                        downloadUrl: "https://example.com/final/ModalRenderProps.tsx"
                    },
                    {
                        id: "final_003",
                        name: "complete-test-suite.tsx",
                        size: 156000,
                        category: "document",
                        downloadUrl: "https://example.com/final/complete-test-suite.tsx"
                    }
                ],
                links: [
                    {
                        title: "Final Implementation - CodeSandbox",
                        url: "https://codesandbox.io/s/complete-modal-patterns-xyz789",
                        iconFile: {
                            id: "link_icon_002",
                            name: "codesandbox-icon.png",
                            size: 12000,
                            category: "image",
                            downloadUrl: "https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?w=64&h=64&fit=crop"
                        }
                    },
                    {
                        title: "Live Demo",
                        url: "https://modal-patterns-demo.netlify.app",
                        iconFile: {
                            id: "link_icon_003",
                            name: "demo-icon.png",
                            size: 15000,
                            category: "image",
                            downloadUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=64&h=64&fit=crop"
                        }
                    }
                ],
                sender: {
                    id: 12345,
                    username: "johnsmith2024",
                    name: "John",
                    surname: "Smith",
                    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
                    role: "student"
                }
            }
        ],

        passedDetails: {
            passedAt: 1704326400000,
            sender: {
                id: 67890,
                username: "sarahjones",
                name: "Sarah",
                surname: "Jones",
                avatarUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
                role: "instructor"
            }
        }
    },

    module: {
        id: 5,
        title: "Advanced React Development",
        position: 5
    },

    lesson: {
        id: 23,
        title: "Component Patterns and Architecture",
        position: 3
    },

    course: {
        id: 101,
        title: "Full-Stack React Development Bootcamp",
        slug: "fullstack-react-bootcamp",
        imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop"
    }
};

export const getAssignment = t.procedure
    .input(useCaseModels.GetAssignmentRequestSchema)
    .query(
        async (): Promise<useCaseModels.TGetAssignmentUseCaseResponse> => {
            return {
                success: true,
                data: getAssignmentMock,
            };
        },
    );

const passAssignmentMock: useCaseModels.TPassAssignmentSuccessResponse['data'] =
    {};

export const passAssignment = t.procedure
    .input(useCaseModels.PassAssignmentRequestSchema)
    .mutation(
        async (): Promise<useCaseModels.TPassAssignmentUseCaseResponse> => {
            return {
                success: true,
                data: passAssignmentMock,
            };
        },
    );

