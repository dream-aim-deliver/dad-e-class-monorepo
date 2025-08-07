import { HydrateClient, prefetch, trpc } from '../../config/trpc/server';
import { Suspense } from 'react';
import DefaultLoadingWrapper from '../../../client/wrappers/default-loading';
import { NextAuthGateway } from '@maany_shr/e-class-auth';
import { auth } from '@maany_shr/e-class-models';
import nextAuth from '../../config/auth/next-auth.config';
import { redirect } from 'next/navigation';

interface UserCoursesProps {}

export default async function UserCoursesServerComponent(
    props: UserCoursesProps,
) {
    // TODO: Use React's cache() to not re-fetch the session on every request
    const authGateway = new NextAuthGateway(nextAuth);
    const sessionDTO = await authGateway.getSession();
    let session: auth.TSession | null = null;
    if (sessionDTO.success) {
        session = sessionDTO.data;
    }

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
                    <div>Courses</div>
                </Suspense>
            </HydrateClient>
        </>
    );
}
