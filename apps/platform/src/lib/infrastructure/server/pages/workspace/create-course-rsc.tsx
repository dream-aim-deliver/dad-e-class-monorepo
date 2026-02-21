import { HydrateClient } from '../../config/trpc/cms-server';
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

    const roles = session.user.roles || [];

    if (!roles.includes('admin') && !roles.includes('course_creator')) {
        // TODO: fill in localized error message
        throw new Error('You do not have permission to access this page');
    }

    // TODO: possibly prefetch duplication course

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
