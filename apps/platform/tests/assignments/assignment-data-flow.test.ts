import { describe, it, expect, vi } from 'vitest';
import deepEqual from 'deep-equal-js';
import ListStudentAssignmentsPresenter from '../../src/lib/infrastructure/common/presenters/list-student-assignments-presenter';

describe('Assignment data flow - deepEqual behavior', () => {
    it('deepEqual detects lastReply changes between viewModels', () => {
        const vm1 = {
            mode: 'default' as const,
            data: {
                assignments: [{
                    id: 'a1',
                    lastReply: {
                        replyType: 'reply',
                        sentAt: 1700000000,
                        comment: 'Old',
                        sender: { id: 1, isCurrentUser: true },
                    },
                }],
            },
        };

        const vm2 = {
            mode: 'default' as const,
            data: {
                assignments: [{
                    id: 'a1',
                    lastReply: {
                        replyType: 'reply',
                        sentAt: 1700001000,
                        comment: 'New',
                        sender: { id: 2, isCurrentUser: false },
                    },
                }],
            },
        };

        // deepEqual should detect the difference — this is what BasePresenter uses
        expect(deepEqual(vm1, vm2)).toBe(false);
    });

    it('deepEqual returns true for identical viewModels', () => {
        const vm = {
            mode: 'default' as const,
            data: {
                assignments: [{
                    id: 'a1',
                    lastReply: {
                        sentAt: 1700000000,
                        comment: 'Same',
                        sender: { id: 1, isCurrentUser: true },
                    },
                }],
            },
        };

        // Same structure = deepEqual returns true = presenter skips update (correct, no infinite loop)
        expect(deepEqual(vm, { ...vm, data: { ...vm.data, assignments: [...vm.data.assignments] } })).toBe(true);
    });

    it('isCurrentUser differs by viewer context', () => {
        const makeLastReply = (viewerIsCoach: boolean) => ({
            sender: {
                id: 2,
                username: 'coach1',
                role: 'coach',
                isCurrentUser: viewerIsCoach, // true when coach is viewing, false when student is viewing
            },
        });

        const coachView = makeLastReply(true);
        const studentView = makeLastReply(false);

        expect(coachView.sender.isCurrentUser).toBe(true);
        expect(studentView.sender.isCurrentUser).toBe(false);
        expect(deepEqual(coachView, studentView)).toBe(false);
    });

    it('presenter.present() calls setViewModel when response data changes', async () => {
        const setViewModel = vi.fn();
        const presenter = new ListStudentAssignmentsPresenter(setViewModel, {});

        const response = {
            success: true as const,
            data: {
                assignments: [{
                    id: 'a1',
                    title: 'Test',
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
                }],
            },
        };

        await presenter.present(response as any, undefined);

        expect(setViewModel).toHaveBeenCalledTimes(1);
        expect(setViewModel).toHaveBeenCalledWith(expect.objectContaining({ mode: 'default' }));
    });

    it('presenter.present() does NOT call setViewModel when data is identical', async () => {
        const setViewModel = vi.fn();
        const presenter = new ListStudentAssignmentsPresenter(setViewModel, {});

        const response = {
            success: true as const,
            data: {
                assignments: [{
                    id: 'a1',
                    title: 'Test',
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
                }],
            },
        };

        await presenter.present(response as any, undefined);

        // Get the viewModel that was set
        const viewModel = setViewModel.mock.calls[0][0];
        setViewModel.mockClear();

        // Call again with same response and the viewModel it produced
        await presenter.present(response as any, viewModel);

        // Should NOT call setViewModel again (deepEqual returns true)
        expect(setViewModel).not.toHaveBeenCalled();
    });

    it('deepEqual detects status change (waiting-feedback → passed)', () => {
        const vm1 = {
            mode: 'default' as const,
            data: {
                assignments: [{
                    id: 'a1',
                    title: 'Test',
                    status: 'waiting-feedback',
                    lastReply: {
                        replyType: 'reply',
                        sentAt: 1700000000,
                        comment: 'Submission',
                        sender: { id: 1, isCurrentUser: true },
                    },
                }],
            },
        };

        const vm2 = {
            mode: 'default' as const,
            data: {
                assignments: [{
                    id: 'a1',
                    title: 'Test',
                    status: 'passed',
                    lastReply: {
                        replyType: 'reply',
                        sentAt: 1700000000,
                        comment: 'Submission',
                        sender: { id: 1, isCurrentUser: true },
                    },
                }],
            },
        };

        expect(deepEqual(vm1, vm2)).toBe(false);
    });

    it('deepEqual detects when one of multiple assignments changes lastReply', () => {
        const makeAssignment = (id: string, sentAt: number) => ({
            id,
            title: 'Test',
            status: 'waiting-feedback',
            lastReply: {
                replyType: 'reply',
                sentAt,
                comment: 'Message',
                sender: { id: 1, isCurrentUser: true },
            },
        });

        const vm1 = {
            mode: 'default' as const,
            data: {
                assignments: [
                    makeAssignment('a1', 1700000000),
                    makeAssignment('a2', 1700001000),
                    makeAssignment('a3', 1700002000),
                ],
            },
        };

        const vm2 = {
            mode: 'default' as const,
            data: {
                assignments: [
                    makeAssignment('a1', 1700000000),
                    makeAssignment('a2', 1700009999), // only this one changed
                    makeAssignment('a3', 1700002000),
                ],
            },
        };

        expect(deepEqual(vm1, vm2)).toBe(false);
    });
});
