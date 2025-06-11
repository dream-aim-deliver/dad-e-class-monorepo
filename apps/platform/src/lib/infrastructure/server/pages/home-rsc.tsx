import Home from '../../client/pages/home';
import {
    getQueryClient,
    HydrateClient,
    prefetch,
    trpc,
} from '../config/trpc/server';
import { Suspense } from 'react';
import { getGetHomePagePresenter } from '../presenters/get-home-page-presenter';
import { viewModels } from '@maany_shr/e-class-models';
import { redirect } from 'next/navigation';
import { unstable_cache } from 'next/cache';
import { env } from '../utils/env';
import { cacheTags } from '../utils/cache-tags';

const getCachedHomePage = unstable_cache(
    async () => {
        const queryOptions = trpc.getHomePage.queryOptions({});
        const queryClient = getQueryClient();
        const homePageResponse = await queryClient.fetchQuery(queryOptions);
        let homePageViewModel: viewModels.THomePageViewModel | undefined;
        const presenter = getGetHomePagePresenter((newViewModel) => {
            homePageViewModel = newViewModel;
        });
        await presenter.present(homePageResponse, homePageViewModel);

        if (!homePageViewModel || homePageViewModel.mode === 'kaboom') {
            throw new Error(
                homePageViewModel?.data?.message ||
                    'Unknown critical error occurred',
            );
        }

        if (homePageViewModel.mode === 'unauthenticated') {
            redirect(`/auth/login`);
        }

        return homePageViewModel;
    },
    [cacheTags.HOME_PAGE, env.platformId], // TODO: the key should include locale
    {
        tags: [cacheTags.HOME_PAGE, `${cacheTags.HOME_PAGE}-${env.platformId}`], // TODO: the key should include locale
        revalidate: 3600, // 1 hour
    },
);

export default async function HomeServerComponent() {
    // TODO: might be cached without hydration
    await Promise.all([prefetch(trpc.getHomePageTopics.queryOptions())]);

    const homePageViewModel = await getCachedHomePage();

    return (
        <>
            <HydrateClient>
                <div className="bg-card-color-fill">
                    <Suspense
                        fallback={<div className="text-white">Loading...</div>}
                    >
                        <Home homePageViewModel={homePageViewModel} />
                    </Suspense>
                </div>
            </HydrateClient>
        </>
    );
}
