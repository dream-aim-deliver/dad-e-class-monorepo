import { Suspense } from 'react';
import DefaultLoadingWrapper from '../../../client/wrappers/default-loading';
import { redirect } from 'next/navigation';
import getSession from '../../config/auth/get-session';
import { HydrateClient, prefetch, trpc } from '../../config/trpc/cms-server';
import StudentCoachingSessions from '../../../client/pages/workspace/student-coaching-sessions';
import CoachCoachingSessions from '../../../client/pages/workspace/coach-coaching-sessions';

interface CoachingSessionsServerComponentProps {
    role?: string;
}

export default async function CoachingSessionsServerComponent(props: CoachingSessionsServerComponentProps) {
    const session = await getSession();

    if (!session || !session.user) {
        redirect('/auth/login');
    }

    const roles = session.user.roles;
    const userRole = props.role || 'coach'; // Get role from props or default to coach

    // If user has coach role, always render CoachCoachingSessions (it has the role dropdown)
    // CoachCoachingSessions will handle showing student content when role=student
    if (roles && roles.includes('coach')) {
        // Always prefetch coach data (CoachCoachingSessions uses it unconditionally)
        prefetch(trpc.listCoachCoachingSessions.queryOptions({}));

        // Also prefetch student data when viewing as student
        if (userRole === 'student') {
            prefetch(trpc.listStudentCoachingSessions.queryOptions({}));
            prefetch(trpc.listCoaches.queryOptions({ pastCoaches: true }));
        }

        return (
            <>
                <HydrateClient>
                    <Suspense fallback={<DefaultLoadingWrapper />}>
                        <CoachCoachingSessions role={userRole} />
                    </Suspense>
                </HydrateClient>
            </>
        );
    } else if (roles && roles.includes('student')) {
        // User is only a student (no coach role), show student view without role selector
        prefetch(trpc.listStudentCoachingSessions.queryOptions({}));

        return (
            <>
                <HydrateClient>
                    <Suspense fallback={<DefaultLoadingWrapper />}>
                        <StudentCoachingSessions />
                    </Suspense>
                </HydrateClient>
            </>
        );
    } else {
        throw new Error('Access denied for current role');
    }
}
