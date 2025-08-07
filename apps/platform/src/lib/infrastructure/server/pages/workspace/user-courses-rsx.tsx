import { HydrateClient, prefetch, trpc } from '../../config/trpc/server';
import { Suspense } from 'react';
import DefaultLoadingWrapper from '../../../client/wrappers/default-loading';
import { redirect } from 'next/navigation';
import getSession from '../../config/auth/get-session';
import UserCourses from '../../../client/pages/workspace/user-courses';

interface UserCoursesProps {}

export default async function UserCoursesServerComponent(
    props: UserCoursesProps,
) {
    const session = await getSession();

    if (!session || !session.user) {
        redirect('/auth/login');
    }

    await Promise.all([
        prefetch(
            trpc.listUserCourses.queryOptions({
                pagination: {
                    page: 1,
                    // TODO: Configure with environment variable
                    pageSize: 6,
                },
            }),
        ),
    ]);

    return (
        <>
            <HydrateClient>
                <Suspense fallback={<DefaultLoadingWrapper />}>
                    <UserCourses />
                </Suspense>
            </HydrateClient>
        </>
    );
}
