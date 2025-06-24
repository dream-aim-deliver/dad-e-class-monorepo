import { HydrateClient, prefetch, trpc } from '../config/trpc/server';
import { Suspense } from 'react';
import DefaultLoadingWrapper from '../../client/wrappers/default-loading';
import Offers from '../../client/pages/offers/offers';

interface OffersProps {
    topics?: string[];
}

export default async function OffersServerComponent(props: OffersProps) {
    await Promise.all([
        prefetch(trpc.getOffersPageOutline.queryOptions({})),
        prefetch(trpc.getTopicsByCategory.queryOptions({})),
    ]);

    return (
        <>
            <HydrateClient>
                <Suspense fallback={<DefaultLoadingWrapper />}>
                    <Offers initialSelectedTopics={props.topics} />
                </Suspense>
            </HydrateClient>
        </>
    );
}
