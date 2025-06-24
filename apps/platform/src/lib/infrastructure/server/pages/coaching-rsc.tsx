import { HydrateClient, prefetch, trpc } from '../config/trpc/server';
import { Suspense } from 'react';
import DefaultLoadingWrapper from '../../client/wrappers/default-loading';
import Coaching from '../../client/pages/coaching';

interface CoachingProps {
    topics?: string[];
}

export default async function CoachingServerComponent(props: CoachingProps) {
    await Promise.all([prefetch(trpc.getCoachingPage.queryOptions({}))]);

    return (
        <>
            <HydrateClient>
                <Suspense fallback={<DefaultLoadingWrapper />}>
                    <Coaching />
                </Suspense>
            </HydrateClient>
        </>
    );
}
