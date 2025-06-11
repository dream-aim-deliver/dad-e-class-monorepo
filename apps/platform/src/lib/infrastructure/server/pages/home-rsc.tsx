import Home from '../../client/pages/home';
import {
    getQueryClient,
    HydrateClient,
    prefetch,
    trpc,
} from '../config/trpc/server';
import { Suspense } from 'react';
import { getGetHomePagePresenter } from '../presenters/get-home-page-presenter';
import { HomePageViewModels } from '@maany_shr/e-class-models';
import { redirect } from 'next/navigation';

export default async function HomeServerComponent() {
    // TODO: might be cached without hydration
    await Promise.all([prefetch(trpc.getHomePageTopics.queryOptions())]);

    const queryOptions = trpc.getHomePage.queryOptions();
    const queryClient = getQueryClient();
    const homePageResponse = await queryClient.fetchQuery(queryOptions);
    let homePageViewModel: HomePageViewModels.THomePageViewModel | undefined;
    const presenter = getGetHomePagePresenter((newViewModel) => {
        homePageViewModel = newViewModel;
    });
    await presenter.present(homePageResponse, homePageViewModel);

    if (!homePageViewModel || homePageViewModel.mode === 'kaboom') {
        throw new Error(
            homePageViewModel?.data?.message || 'A critical error occurred',
        );
    }

    if (homePageViewModel.mode === 'unauthenticated') {
        redirect(`/auth/login`);
    }

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
