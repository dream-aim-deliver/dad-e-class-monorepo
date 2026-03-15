import { describe, it, expect, vi } from 'vitest';
import ListStudentAssignmentsPresenter from '../../src/lib/infrastructure/common/presenters/list-student-assignments-presenter';

describe('ListStudentAssignmentsPresenter', () => {
    it('presentSuccess transforms response to default view model', () => {
        const setViewModel = vi.fn();
        const presenter = new ListStudentAssignmentsPresenter(setViewModel, {});

        const mockResponse = {
            success: true as const,
            data: {
                assignments: [
                    {
                        id: 'assignment-1',
                        title: 'Test Assignment',
                        module: 1,
                        lesson: 1,
                        groupId: null,
                        groupName: null,
                        status: 'waiting-feedback',
                        course: { id: 1, title: 'Course', slug: 'course-slug' },
                        student: { id: 1, username: 'student1', name: 'Student', surname: 'One', avatarUrl: null },
                        lastReply: {
                            replyType: 'reply' as const,
                            sentAt: 1700000000,
                            comment: 'Hello',
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
        expect(result.data.assignments[0].lastReply?.sender.isCurrentUser).toBe(true);
    });

    it('presentSuccess with updated lastReply produces different viewModel', () => {
        const setViewModel = vi.fn();
        const presenter = new ListStudentAssignmentsPresenter(setViewModel, {});

        const baseAssignment = {
            id: 'assignment-1',
            title: 'Test',
            module: 1,
            lesson: 1,
            groupId: null,
            groupName: null,
            status: 'waiting-feedback',
            course: { id: 1, title: 'Course', slug: 'slug' },
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

        // ViewModels should be structurally different when lastReply changes
        expect(vm1.data.assignments[0].lastReply?.sentAt).not.toBe(vm2.data.assignments[0].lastReply?.sentAt);
        expect(vm1.data.assignments[0].lastReply?.sender.isCurrentUser).toBe(true);
        expect(vm2.data.assignments[0].lastReply?.sender.isCurrentUser).toBe(false);
    });

    it('presentError routes NotFoundError to not-found mode', () => {
        const setViewModel = vi.fn();
        const presenter = new ListStudentAssignmentsPresenter(setViewModel, {});

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
        const presenter = new ListStudentAssignmentsPresenter(setViewModel, {});

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

    it('presentSuccess with null lastReply renders correctly', () => {
        const setViewModel = vi.fn();
        const presenter = new ListStudentAssignmentsPresenter(setViewModel, {});

        const mockResponse = {
            success: true as const,
            data: {
                assignments: [
                    {
                        id: 'assignment-1',
                        title: 'No Reply Assignment',
                        module: 1,
                        lesson: 1,
                        groupId: null,
                        groupName: null,
                        status: 'waiting-feedback',
                        course: { id: 1, title: 'Course', slug: 'course-slug', imageUrl: null },
                        student: { id: 1, username: 'student1', name: 'Student', surname: 'One', avatarUrl: null },
                        lastReply: null,
                    },
                ],
            },
        };

        const result = presenter.presentSuccess(mockResponse as any);

        expect(result.mode).toBe('default');
        expect(result.data.assignments).toHaveLength(1);
        expect(result.data.assignments[0].lastReply).toBeNull();
    });

    it('presentSuccess with passed assignment (replyType: passed)', () => {
        const setViewModel = vi.fn();
        const presenter = new ListStudentAssignmentsPresenter(setViewModel, {});

        const mockResponse = {
            success: true as const,
            data: {
                assignments: [
                    {
                        id: 'assignment-passed',
                        title: 'Passed Assignment',
                        module: 2,
                        lesson: 3,
                        groupId: null,
                        groupName: null,
                        status: 'passed',
                        course: { id: 1, title: 'Course', slug: 'course-slug', imageUrl: null },
                        student: { id: 1, username: 'student1', name: 'Student', surname: 'One', avatarUrl: null },
                        lastReply: {
                            replyType: 'passed' as const,
                            passedAt: 1700010000,
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
                ],
            },
        };

        const result = presenter.presentSuccess(mockResponse as any);

        expect(result.mode).toBe('default');
        expect(result.data.assignments).toHaveLength(1);
        expect(result.data.assignments[0].lastReply?.replyType).toBe('passed');
        expect(result.data.assignments[0].lastReply?.sender.isCurrentUser).toBe(false);
    });

    it('presentSuccess with empty assignments array', () => {
        const setViewModel = vi.fn();
        const presenter = new ListStudentAssignmentsPresenter(setViewModel, {});

        const mockResponse = {
            success: true as const,
            data: {
                assignments: [],
            },
        };

        const result = presenter.presentSuccess(mockResponse as any);

        expect(result.mode).toBe('default');
        expect(result.data.assignments).toHaveLength(0);
    });

    it('presentSuccess with multiple assignments', () => {
        const setViewModel = vi.fn();
        const presenter = new ListStudentAssignmentsPresenter(setViewModel, {});

        const makeAssignment = (id: string, title: string) => ({
            id,
            title,
            module: 1,
            lesson: 1,
            groupId: null,
            groupName: null,
            status: 'waiting-feedback',
            course: { id: 1, title: 'Course', slug: 'slug', imageUrl: null },
            student: { id: 1, username: 'student1', name: 'S', surname: 'O', avatarUrl: null },
            lastReply: {
                replyType: 'reply' as const,
                sentAt: 1700000000,
                comment: 'Hello',
                files: [],
                links: [],
                sender: { id: 1, username: 'student1', name: 'S', surname: 'O', avatarUrl: null, role: 'student', isCurrentUser: true },
            },
        });

        const mockResponse = {
            success: true as const,
            data: {
                assignments: [
                    makeAssignment('a1', 'First'),
                    makeAssignment('a2', 'Second'),
                    makeAssignment('a3', 'Third'),
                ],
            },
        };

        const result = presenter.presentSuccess(mockResponse as any);

        expect(result.mode).toBe('default');
        expect(result.data.assignments).toHaveLength(3);
        expect(result.data.assignments[0].id).toBe('a1');
        expect(result.data.assignments[1].id).toBe('a2');
        expect(result.data.assignments[2].id).toBe('a3');
    });
});
