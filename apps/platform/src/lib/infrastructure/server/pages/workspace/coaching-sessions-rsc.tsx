import { Suspense } from "react";
import MockTRPCClientProviders from "../../../client/trpc/mock-client-providers";
import DefaultLoadingWrapper from "../../../client/wrappers/default-loading"
import getSession from "../../config/auth/get-session";
import { redirect } from "next/navigation";
import StudentCoachingSessions from "../../../client/pages/workspace/student-coaching-sessions";

export default async function CoachingSessionsServerComponent() {
    const session = await getSession();

    if (!session || !session.user) {
        redirect('/auth/login');
    }

    const roles = session.user.roles;

    if(roles && (roles.includes('coach'))) {
        // Render coach-specific content
        return (
            <MockTRPCClientProviders>
                <Suspense fallback={<DefaultLoadingWrapper />}>
                    <StudentCoachingSessions />
                </Suspense>
            </MockTRPCClientProviders>
        )
    } else if (roles && (roles.includes('student'))) {
        return (
            <MockTRPCClientProviders>
                <Suspense fallback={<DefaultLoadingWrapper />}>
                    <StudentCoachingSessions />
                </Suspense>
            </MockTRPCClientProviders>
        )
    } else {
        // TODO: fill in localized error message
        throw new Error('Access denied. Only coaches and course creators can access this page.');
    }
}