'use client';
import { useTheme } from '@maany_shr/e-class-ui-kit/contexts';
import {
    isLocalAware,
    TLocale,
    getDictionary,
} from '@maany_shr/e-class-translations';
import { signOut } from 'next-auth/react';
import { isSessionAware } from '@maany_shr/e-class-auth';
import { redirect } from 'next/navigation';
import { trpc } from '../trpc/client';
import { useState } from 'react';
import { THomePageViewModel } from 'packages/models/src/view-models/home-page-view-model';
import { useGetHomePagePresenter } from '../../presenters/react/get-home-page-presenter';

export type HomeProps = isLocalAware & isSessionAware;

export default function Home(props: HomeProps) {
    const [data] = trpc.getHomePage.useSuspenseQuery({
        success: true,
    });
    const [viewModel, setViewModel] = useState<THomePageViewModel>();
    const { presenter } = useGetHomePagePresenter(setViewModel);
    presenter.present(data, viewModel);
    if (viewModel?.mode === 'kaboom') {
        return (
            <div className="text-white">
                <h1 className="text-2xl font-bold">
                    Kaboom! An error occurred
                </h1>
                <p>{viewModel.data.message}</p>
                <button
                    className="bg-red-500 text-white px-4 py-2 rounded"
                    onClick={() => {
                        signOut({
                            callbackUrl: '/auth/signin',
                        });
                    }}
                >
                    Sign Out
                </button>
            </div>
        );
    }
    if(viewModel?.mode === 'default') {
        return (
            <div className="bg-card-color-fill">
                <h1 className="text-2xl font-bold">
                    Welcome Amigo!
                </h1>
                <p>{viewModel.data.banner.description}</p>
                <video
                    src={viewModel.data.banner.videoId}
                    poster={viewModel.data.banner.thumbnailUrl}
                    controls
                    className="w-full h-auto"
                />
            </div>
        );
    }

}
