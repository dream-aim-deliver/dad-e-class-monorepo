import { HydrateClient, prefetch, trpc } from '../config/trpc/cms-server';
import { Suspense } from 'react';
import DefaultLoadingWrapper from '../../client/wrappers/default-loading';
import OffersPage from '../../client/pages/offers/offers-page';

interface OffersProps {
    topics?: string[];
}

export default async function OffersServerComponent(props: OffersProps) {
    await Promise.all([
        prefetch(trpc.getOffersPageOutline.queryOptions({})),
        prefetch(trpc.listTopicsByCategory.queryOptions({})),
        prefetch(trpc.listOffersPagePackages.queryOptions({})),
    ]);

    return (
        <>
            <HydrateClient>
                <Suspense fallback={<DefaultLoadingWrapper />}>
                    <OffersPage initialSelectedTopics={props.topics} />
                </Suspense>
            </HydrateClient>
        </>
    );
}
