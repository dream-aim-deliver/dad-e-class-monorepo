import { describe, it, expect, vi } from 'vitest';
import GetAssignmentPresenter from '../../src/lib/infrastructure/common/presenters/assignment-presenter';

describe('GetAssignmentPresenter', () => {
    it('presentSuccess transforms assignment detail to default view model', () => {
        const setViewModel = vi.fn();
        const presenter = new GetAssignmentPresenter(setViewModel, {});

        const mockResponse = {
            success: true as const,
            data: {
                title: 'Assignment Detail',
                description: 'Detailed description of the assignment',
                resources: [
                    {
                        id: 'res-1',
                        name: 'resource.pdf',
                        size: 1024,
                        category: 'document' as const,
                        downloadUrl: 'https://example.com/resource.pdf',
                        thumbnailUrl: null,
                    },
                ],
                links: [
                    {
                        title: 'Reference Link',
                        url: 'https://example.com/ref',
                    },
                ],
                progress: {
                    replies: [
                        {
                            replyType: 'reply' as const,
                            sentAt: 1700000000,
                            comment: 'Here is my submission',
                            files: [],
                            links: [],
                            sender: {
                                id: 1,
                                username: 'student1',
                                name: 'Student',
                                surname: 'One',
                                avatarUrl: null,
                                role: 'student',
                                isCurrentUser: true,
                            },
                        },
                    ],
                    passedDetails: {
                        passedAt: 1700005000,
                        sender: {
                            id: 2,
                            username: 'coach1',
                            name: 'Coach',
                            surname: 'One',
                            avatarUrl: null,
                            role: 'coach',
                            isCurrentUser: false,
                        },
                    },
                },
            },
        };

        const result = presenter.presentSuccess(mockResponse as any);

        expect(result.mode).toBe('default');
        expect(result.data.title).toBe('Assignment Detail');
        expect(result.data.description).toBe('Detailed description of the assignment');
        expect(result.data.resources).toHaveLength(1);
        expect(result.data.links).toHaveLength(1);
        expect(result.data.progress?.replies).toHaveLength(1);
        expect(result.data.progress?.replies[0].sender.isCurrentUser).toBe(true);
        expect(result.data.progress?.passedDetails?.passedAt).toBe(1700005000);
    });

    it('presentError routes NotFoundError to not-found mode', () => {
        const setViewModel = vi.fn();
        const presenter = new GetAssignmentPresenter(setViewModel, {});

        const errorResponse = {
            success: false as const,
            data: {
                errorType: 'NotFoundError',
                message: 'Assignment not found',
                operation: 'getAssignment',
                context: {},
            },
        };

        const result = presenter.presentError(errorResponse as any);
        expect(result.mode).toBe('not-found');
        expect(result.data.message).toBe('Assignment not found');
    });

    it('presentError routes other errors to kaboom mode', () => {
        const setViewModel = vi.fn();
        const presenter = new GetAssignmentPresenter(setViewModel, {});

        const errorResponse = {
            success: false as const,
            data: {
                errorType: 'UnknownError',
                message: 'Something went wrong',
                operation: 'getAssignment',
                context: {},
            },
        };

        const result = presenter.presentError(errorResponse as any);
        expect(result.mode).toBe('kaboom');
        expect(result.data.message).toBe('Something went wrong');
    });
});
