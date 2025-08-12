import { HydrateClient, prefetch, trpc } from '../../config/trpc/server';
import { Suspense } from 'react';
import DefaultLoadingWrapper from '../../../client/wrappers/default-loading';
import { redirect } from 'next/navigation';
import getSession from '../../config/auth/get-session';
import CreateCourse from '../../../client/pages/workspace/create-course';

export default async function CreateCourseServerComponent() {
    const session = await getSession();

    if (!session || !session.user) {
        redirect('/auth/login');
    }

    if (!session.user.roles?.includes('admin')) {
        // TODO: fill in localized error message
        throw new Error();
    }

    await Promise.all([prefetch(trpc.listUserCourses.queryOptions({}))]);

    return (
        <>
            <HydrateClient>
                <Suspense fallback={<DefaultLoadingWrapper />}>
                    <CreateCourse />
                </Suspense>
            </HydrateClient>
        </>
    );
}
