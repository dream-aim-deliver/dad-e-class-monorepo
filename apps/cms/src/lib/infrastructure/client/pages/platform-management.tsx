'use client';

import { trpc } from '../trpc/cms-client';
import { useLocale, useTranslations } from 'next-intl';
import {
    DefaultError,
    DefaultLoading,
    DefaultNotFound,
    Badge,
    Divider,
} from '@maany_shr/e-class-ui-kit';
import { TLocale } from '@maany_shr/e-class-translations';
import { viewModels } from '@maany_shr/e-class-models';
import { useState } from 'react';
import { useListTopicsPresenter } from '../hooks/use-topics-presenter';
import { useListCategoriesPresenter } from '../hooks/use-categories-presenter';
import { usePlatformLocale, useRequiredPlatformLocale } from '../context/platform-locale-context';
import { useContentLocale } from '../hooks/use-platform-translations';

/**
 * Platform Management component.
 * Manages platform-specific content with dual-locale support:
 * - App locale (UI): For interface elements (buttons, labels, navigation)
 * - Platform locale (content): For platform-specific content (courses, categories, topics)
 */
export default function PlatformManagement() {
    // App locale - used for UI elements (buttons, labels, etc.)
    const appLocale = useLocale() as TLocale;

    // Platform context - contains platform-specific information
    const platformContext = useRequiredPlatformLocale();

    // Content locale - the locale for platform content (may differ from app UI locale)
    const contentLocale = useContentLocale();

    console.log('[Platform Management] App locale (UI):', appLocale);
    console.log('[Platform Management] Platform context:', platformContext);
    console.log('[Platform Management] Content locale:', contentLocale);

    // Topics data fetching and presentation
    const [topicsResponse, { refetch: refetchTopics }] = trpc.listTopics.useSuspenseQuery({});
    const [topicsViewModel, setTopicsViewModel] = useState<
        viewModels.TTopicListViewModel | undefined
    >(undefined);
    const { presenter: topicsPresenter } = useListTopicsPresenter(setTopicsViewModel);
    // @ts-ignore
    topicsPresenter.present(topicsResponse, topicsViewModel);

    // Categories data fetching and presentation
    const [categoriesResponse, { refetch: refetchCategories }] = trpc.listCategories.useSuspenseQuery({});
    const [categoriesViewModel, setCategoriesViewModel] = useState<
        viewModels.TCategoryListViewModel | undefined
    >(undefined);
    const { presenter: categoriesPresenter } = useListCategoriesPresenter(setCategoriesViewModel);
    // @ts-ignore
    categoriesPresenter.present(categoriesResponse, categoriesViewModel);

    // Loading state
    if (!topicsViewModel || !categoriesViewModel) {
        return <DefaultLoading locale={appLocale} variant="minimal" />;
    }

    // Error handling for topics
    if (topicsViewModel.mode === 'kaboom') {
        return (
            <DefaultError
                locale={appLocale}
                onRetry={() => {
                    refetchTopics();
                }}
            />
        );
    }

    // Error handling for categories
    if (categoriesViewModel.mode === 'kaboom') {
        return (
            <DefaultError
                locale={appLocale}
                onRetry={() => {
                    refetchCategories();
                }}
            />
        );
    }


    const topics = topicsViewModel.data.topics;
    const categories = categoriesViewModel.data.categories;

    return (
        <div className="flex flex-col space-y-8 p-6">
            {/* Platform Header */}
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-8 rounded-lg shadow-lg">
                <h1 className="text-4xl font-bold mb-2">
                    Platform Management
                </h1>
                <div className="flex items-center gap-4 text-lg flex-wrap">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold">Platform:</span>
                        <Badge
                            variant="primary"
                            className="bg-white/20 text-white"
                            text={platformContext.platformSlug}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-semibold">Content Language:</span>
                        <Badge
                            variant="primary"
                            className="bg-white/20 text-white"
                            text={contentLocale.toUpperCase()}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-semibold">UI Language:</span>
                        <Badge
                            variant="primary"
                            className="bg-white/20 text-white"
                            text={appLocale.toUpperCase()}
                        />
                    </div>
                </div>
            </div>

            {/* Categories Section */}
            <section>
                <h2 className="text-2xl font-semibold mb-4">
                    Categories ({categories.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className="p-4 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 rounded-lg"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-medium text-lg text-gray-900">
                                        {category.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        ID: {category.id}
                                    </p>
                                </div>
                                <Badge
                                    variant="info"
                                    className="ml-2"
                                    text={category.name}
                                />
                            </div>
                        </div>
                    ))}
                </div>
                {categories.length === 0 && (
                    <p className="text-gray-500 italic">No categories available</p>
                )}
            </section>

            <Divider />

            {/* Topics Section */}
            <section>
                <h2 className="text-2xl font-semibold mb-4">
                    Topics ({topics.length})
                </h2>
                <div className="flex flex-wrap gap-3">
                    {topics.map((topic) => (
                        <div
                            key={topic.id}
                            className="group relative"
                        >
                            <Badge
                                variant="primary"
                                className="px-4 py-2 text-sm font-medium hover:bg-primary-100 transition-colors cursor-pointer"
                                text={topic.name}
                            />
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                                Slug: {topic.slug}
                            </div>
                        </div>
                    ))}
                </div>
                {topics.length === 0 && (
                    <p className="text-gray-500 italic">No topics available</p>
                )}
            </section>

            {/* Statistics Summary */}
            <section className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Platform Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-primary-600">
                            {categories.length}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                            Total Categories
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-primary-600">
                            {topics.length}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                            Total Topics
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-primary-600">
                            {Math.round(topics.length / Math.max(categories.length, 1))}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                            Avg Topics/Category
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">
                            Active
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                            Platform Status
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}