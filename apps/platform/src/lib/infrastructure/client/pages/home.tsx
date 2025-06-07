'use client';
import { useTheme } from '@maany_shr/e-class-ui-kit/contexts';
import {
    isLocalAware,
    TLocale,
    getDictionary,
} from '@maany_shr/e-class-translations';
import { signOut } from 'next-auth/react';
import { isSessionAware } from '@maany_shr/e-class-auth';
import { trpc } from '../trpc/client';
import { useState } from 'react';
import Image from 'next/image';
import { THomePageViewModel } from 'packages/models/src/view-models/home-page-view-model';
import { useGetHomePagePresenter } from '../../presenters/react/get-home-page-react-presenter';

export type HomeProps = isLocalAware & isSessionAware;

export default function Home(props: HomeProps) {
    const [data] = trpc.getHomePage.useSuspenseQuery({
        success: false,
    });
    const [viewModel, setViewModel] = useState<THomePageViewModel>();
    const { presenter } = useGetHomePagePresenter(setViewModel);

    presenter.present(data, viewModel).catch((error) => {
        console.error('Error presenting data:', error);
    });

    if (viewModel?.mode === 'kaboom') {
        return (
            <div className="bg-red-100 text-red-900 p-6 rounded-2xl shadow-lg max-w-3xl mx-auto space-y-4 border border-red-300">
                <div className="space-y-2">
                    <h1 className="text-3xl font-extrabold text-red-800 flex items-center gap-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 text-red-600"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M18 10c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8zm-8 4a1 1 0 100-2 1 1 0 000 2zm-1-7a1 1 0 112 0v3a1 1 0 11-2 0V7z"
                                clipRule="evenodd"
                            />
                        </svg>
                        Kaboom! An error occurred
                    </h1>
                    <p className="text-base font-medium">
                        Something went wrong. Here's what we know:
                    </p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-inner space-y-2 text-sm font-mono text-gray-700">
                    <p>
                        <span className="font-semibold">Type:</span>{' '}
                        {viewModel.data.type}
                    </p>
                    <p>
                        <span className="font-semibold">Operation:</span>{' '}
                        {viewModel.data.operation}
                    </p>
                    <p>
                        <span className="font-semibold">Context:</span>{' '}
                        {JSON.stringify(viewModel.data.context)}
                    </p>
                    <div>
                        <p className="font-semibold">Trace:</p>
                        <pre className="bg-gray-100 text-gray-800 p-3 rounded overflow-x-auto">
                            {viewModel.data.trace}
                        </pre>
                    </div>
                    <p>
                        <span className="font-semibold">Message:</span>{' '}
                        {viewModel.data.message}
                    </p>
                </div>

                <div className="text-sm text-red-800">
                    <p>Please try again later.</p>
                    <p>If the problem persists, please contact support.</p>
                </div>

                <div>
                    <button
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition duration-150"
                        onClick={() => {
                            signOut({ callbackUrl: '/auth/signin' });
                        }}
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        );
    }

    if (viewModel?.mode === 'default') {
        return (
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 space-y-6 border border-gray-200">
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {viewModel.data.banner.title}
                    </h2>
                    <p className="text-gray-600">
                        {viewModel.data.banner.description}
                    </p>
                </div>

                <div className="relative overflow-hidden rounded-xl shadow-md border border-gray-300">
                    <Image
                        width={100}
                        height={100}
                        src={viewModel.data.banner.thumbnailUrl}
                        alt="Video thumbnail"
                        className="w-full h-auto object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                        <button
                            className="bg-white text-red-600 font-bold px-6 py-2 rounded-full shadow hover:bg-gray-100 transition"
                            onClick={() => {
                                // open YouTube or handle playback
                                window.open(
                                    `https://www.youtube.com/watch?v=${viewModel.data.banner.videoId}`,
                                    '_blank',
                                );
                            }}
                        >
                            ▶ Play Video
                        </button>
                    </div>
                </div>

                <div className="text-sm text-gray-500">
                    <p>
                        <span className="font-semibold">Video ID:</span>{' '}
                        {viewModel.data.banner.videoId}
                    </p>
                </div>
            </div>
        );
    }
}
