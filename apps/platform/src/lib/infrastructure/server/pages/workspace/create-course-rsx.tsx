import { HydrateClient, prefetch, trpc } from '../../config/trpc/server';
import { Suspense } from 'react';
import DefaultLoadingWrapper from '../../../client/wrappers/default-loading';
import { redirect } from 'next/navigation';
import getSession from '../../config/auth/get-session';
import CreateCourse from '../../../client/pages/workspace/create-course';

interface CreateCourseServerComponentProps {
    duplicationCourseSlug?: string;
}

export default async function CreateCourseServerComponent(
    props: CreateCourseServerComponentProps,
) {
    const session = await getSession();

    if (!session || !session.user) {
        redirect('/auth/login');
    }

    if (!session.user.roles?.includes('admin')) {
        // TODO: fill in localized error message
        throw new Error();
    }

    // TODO: possible prefetch duplication course
    await Promise.all([prefetch(trpc.listUserCourses.queryOptions({}))]);

    return (
        <>
            <HydrateClient>
                <Suspense fallback={<DefaultLoadingWrapper />}>
                    <CreateCourse
                        duplicationCourseSlug={props.duplicationCourseSlug}
                    />
                </Suspense>
            </HydrateClient>
        </>
    );
}
