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
import { 
    TListTopicsUseCaseResponse,
    TListCategoriesUseCaseResponse
} from '@dream-aim-deliver/e-class-cms-rest';
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

    // ========================================
    // TYPE SAFETY DEMONSTRATION
    // ========================================
    // This demonstrates the new type-safe translation utilities!
    // All of these will have full IntelliSense and compile-time type checking.

    const tCourseCard = useTranslations('components.courseCard');
    const tNavbar = useTranslations('components.navbar');

    // These keys are fully typed - try autocomplete in your IDE!
    console.log('[Type Safety Demo] Testing typed translations:', {
        // Valid keys from courseCard namespace - TypeScript knows these exist!
        courseCard_createdBy: tCourseCard('createdBy'),
        courseCard_you: tCourseCard('you'),
        courseCard_group: tCourseCard('group'),
        courseCard_manageButton: tCourseCard('manageButton'),

        // Valid keys from navbar namespace
        navbar_login: tNavbar('login'),
        navbar_logout: tNavbar('logout'),
        navbar_workspace: tNavbar('workspace'),

        // UNCOMMENT THE LINES BELOW TO TEST TYPE SAFETY:
        // These should cause TypeScript compilation errors! ❌
        // invalidKey: tCourseCard('thisKeyDoesNotExist'),
        // wrongNamespace: tNavbar('createdBy'), // This key is in courseCard, not navbar!
    });
    // ========================================

    // Topics data fetching and presentation
    const [topicsResponse, { refetch: refetchTopics }] = trpc.listTopics.useSuspenseQuery({});
    const [topicsViewModel, setTopicsViewModel] = useState<
        viewModels.TTopicListViewModel | undefined
    >(undefined);
    const { presenter: topicsPresenter } = useListTopicsPresenter(setTopicsViewModel);
    topicsPresenter.present(topicsResponse?.data as TListTopicsUseCaseResponse, topicsViewModel);

    // Categories data fetching and presentation
    const [categoriesResponse, { refetch: refetchCategories }] = trpc.listCategories.useSuspenseQuery({});
    const [categoriesViewModel, setCategoriesViewModel] = useState<
        viewModels.TCategoryListViewModel | undefined
    >(undefined);
    const { presenter: categoriesPresenter } = useListCategoriesPresenter(setCategoriesViewModel);
    categoriesPresenter.present(categoriesResponse?.data as TListCategoriesUseCaseResponse, categoriesViewModel);

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
        <div className="flex flex-col space-y-8 p-5">
            {/* Platform Header */}
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg shadow-lg mb-12">
                <h1 className="mb-3">
                    Platform Management
                </h1>
                <div className="flex items-center gap-4 text-lg flex-wrap">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold">Platform:</span>
                        <Badge
                            variant="primary"
                            text={platformContext.platformSlug}
                            size="medium"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-semibold">Content Language:</span>
                        <Badge
                            variant="primary"
                            text={contentLocale.toUpperCase()}
                            size="medium"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-semibold">UI Language:</span>
                        <Badge
                            variant="primary"
                            text={appLocale.toUpperCase()}
                            size="medium"
                        />
                    </div>
                </div>
            </div>

            {/* Statistics Summary */}
            <h3 className="mb-4">Platform Statistics</h3>
            <section className="bg-card-fill border border-card-stroke rounded-lg p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-text-primary">
                            {categories.length}
                        </div>
                        <div className="text-sm text-text-secondary mt-1">
                            Total Categories
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-text-primary">
                            {topics.length}
                        </div>
                        <div className="text-sm text-text-secondary mt-1">
                            Total Topics
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-text-primary">
                            {Math.round(topics.length / Math.max(categories.length, 1))}
                        </div>
                        <div className="text-sm text-text-secondary mt-1">
                            Avg Topics/Category
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">
                            Active
                        </div>
                        <div className="text-sm text-text-secondary mt-1">
                            Platform Status
                        </div>
                    </div>
                </div>
            </section>

            <Divider className='my-8'/>

            {/* Categories Section */}
            <section>
                <h3 className="mb-4">
                    Categories ({categories.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className="p-4 hover:shadow-lg transition-shadow bg-card-fill border border-card-stroke cursor-pointer rounded-lg"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="text-text-primary">
                                        {category.name}
                                    </h4>
                                    <p className="text-sm text-text-secondary mt-1">
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

            <Divider className='my-8'/>

            {/* Topics Section */}
            <section>
                <h3 className="mb-4">
                    Topics ({topics.length})
                </h3>
                <div className="flex flex-wrap gap-3">
                    {topics.map((topic) => (
                        <div
                            key={topic.id}
                            className="group relative"
                        >
                            <Badge
                                variant="primary"
                                className="px-4 py-2 text-sm text-button-secondary-text font-medium bg-button-secondary-fill border border-secondary-stroke hover:bg-primary-100 transition-colors cursor-pointer"
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

        </div>
    );
}