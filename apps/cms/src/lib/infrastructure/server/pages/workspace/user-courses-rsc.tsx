import { Suspense } from 'react';
import DefaultLoadingWrapper from '../../../client/wrappers/default-loading';
import { redirect } from 'next/navigation';
import getSession from '../../config/auth/get-session';
import UserCourses from '../../../client/pages/workspace/user-courses';
import { HydrateClient, prefetch, getServerTRPC } from '../../config/trpc/cms-server';

export default async function UserCoursesServerComponent() {
    const session = await getSession();

    if (!session || !session.user) {
        redirect('/auth/login');
    }

    const roles = session.user.roles;
    const isVisitor = !roles || (roles.length === 1 && roles[0] === 'visitor');

    if (isVisitor) {
        // TODO: fill in localized error message
        throw new Error();
    }

    const trpc = getServerTRPC();
    await Promise.all([prefetch(trpc.listUserCourses.queryOptions({}))]);

    return (
        <>
            <HydrateClient>
                <Suspense fallback={<DefaultLoadingWrapper />}>
                    <UserCourses roles={roles} />
                </Suspense>
            </HydrateClient>
        </>
    );
}
