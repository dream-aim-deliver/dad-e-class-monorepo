import { describe, it, expect, vi } from 'vitest';
import ListGroupAssignmentsPresenter from '../../src/lib/infrastructure/common/presenters/list-group-assignments-presenter';

describe('ListGroupAssignmentsPresenter', () => {
    it('presentSuccess transforms response to default view model', () => {
        const setViewModel = vi.fn();
        const presenter = new ListGroupAssignmentsPresenter(setViewModel, {});

        const mockResponse = {
            success: true as const,
            data: {
                assignments: [
                    {
                        id: 'assignment-1',
                        title: 'Group Assignment',
                        module: 1,
                        lesson: 2,
                        groupId: 42,
                        groupName: 'Alpha Group',
                        status: 'waiting-feedback',
                        course: { id: 1, title: 'Course', slug: 'course-slug', imageUrl: null },
                        student: { id: 1, username: 'student1', name: 'Student', surname: 'One', avatarUrl: null },
                        lastReply: {
                            replyType: 'reply' as const,
                            sentAt: 1700000000,
                            comment: 'Hello from group',
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
                    },
                ],
            },
        };

        const result = presenter.presentSuccess(mockResponse as any);

        expect(result.mode).toBe('default');
        expect(result.data.assignments).toHaveLength(1);
        expect(result.data.assignments[0].groupId).toBe(42);
        expect(result.data.assignments[0].groupName).toBe('Alpha Group');
        expect(result.data.assignments[0].lastReply?.sender.isCurrentUser).toBe(true);
    });

    it('presentSuccess with updated lastReply produces different viewModel', () => {
        const setViewModel = vi.fn();
        const presenter = new ListGroupAssignmentsPresenter(setViewModel, {});

        const baseAssignment = {
            id: 'assignment-1',
            title: 'Group Test',
            module: 1,
            lesson: 1,
            groupId: 10,
            groupName: 'Beta Group',
            status: 'waiting-feedback',
            course: { id: 1, title: 'Course', slug: 'slug', imageUrl: null },
            student: { id: 1, username: 'student1', name: 'S', surname: 'O', avatarUrl: null },
        };

        const response1 = {
            success: true as const,
            data: {
                assignments: [{
                    ...baseAssignment,
                    lastReply: {
                        replyType: 'reply' as const,
                        sentAt: 1700000000,
                        comment: 'Old message',
                        files: [],
                        links: [],
                        sender: { id: 1, username: 'student1', name: 'S', surname: 'O', avatarUrl: null, role: 'student', isCurrentUser: true },
                    },
                }],
            },
        };

        const response2 = {
            success: true as const,
            data: {
                assignments: [{
                    ...baseAssignment,
                    lastReply: {
                        replyType: 'reply' as const,
                        sentAt: 1700001000,
                        comment: 'New message from coach',
                        files: [],
                        links: [],
                        sender: { id: 2, username: 'coach1', name: 'C', surname: 'O', avatarUrl: null, role: 'coach', isCurrentUser: false },
                    },
                }],
            },
        };

        const vm1 = presenter.presentSuccess(response1 as any);
        const vm2 = presenter.presentSuccess(response2 as any);

        expect(vm1.data.assignments[0].lastReply?.sentAt).not.toBe(vm2.data.assignments[0].lastReply?.sentAt);
        expect(vm1.data.assignments[0].lastReply?.sender.isCurrentUser).toBe(true);
        expect(vm2.data.assignments[0].lastReply?.sender.isCurrentUser).toBe(false);
    });

    it('presentError routes NotFoundError to not-found mode', () => {
        const setViewModel = vi.fn();
        const presenter = new ListGroupAssignmentsPresenter(setViewModel, {});

        const errorResponse = {
            success: false as const,
            data: {
                errorType: 'NotFoundError',
                message: 'Not found',
                operation: 'test',
                context: {},
            },
        };

        const result = presenter.presentError(errorResponse as any);
        expect(result.mode).toBe('not-found');
    });

    it('presentError routes other errors to kaboom mode', () => {
        const setViewModel = vi.fn();
        const presenter = new ListGroupAssignmentsPresenter(setViewModel, {});

        const errorResponse = {
            success: false as const,
            data: {
                errorType: 'UnknownError',
                message: 'Something broke',
                operation: 'test',
                context: {},
            },
        };

        const result = presenter.presentError(errorResponse as any);
        expect(result.mode).toBe('kaboom');
    });
});
