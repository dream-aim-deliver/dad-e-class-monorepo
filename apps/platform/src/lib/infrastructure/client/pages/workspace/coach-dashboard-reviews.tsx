'use client';

import { useCallback, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { TLocale } from '@maany_shr/e-class-translations';
import { Button, CoachReviewCard, DefaultError } from '@maany_shr/e-class-ui-kit';
import { trpc } from '../../trpc/cms-client';
import { viewModels } from '@maany_shr/e-class-models';
import { useListCoachReviewsPresenter } from '../../hooks/use-list-coach-reviews-presenter';

export default function CoachDashboardReviews() {
    const router = useRouter();
    const locale = useLocale() as TLocale;
    const { data: session } = useSession();
    const t = useTranslations('pages.coachDashboardReviews');

    // Fetch reviews using useSuspenseQuery
    const [reviewsResponse] = trpc.listCoachReviews.useSuspenseQuery({
        coachUsername: session?.user?.name || '',
    });

    // Set up view model state and presenter
    const [reviewsViewModel, setReviewsViewModel] = useState<
        viewModels.TListCoachReviewsViewModel | undefined
    >(undefined);
    const { presenter } = useListCoachReviewsPresenter(setReviewsViewModel);

    // Call presenter directly in render
    // @ts-ignore
    presenter.present(reviewsResponse, reviewsViewModel);

    const handleViewAllReviews = useCallback(() => {
        router.push(`/${locale}/workspace/your-reviews`);
    }, [router, locale]);

    // Handle loading state
    if (!reviewsViewModel) {
        return (
            <div className="flex flex-col space-y-4">
                <div className="flex justify-between items-center">
                    <h3>{t('title')}</h3>
                </div>
                <div className="animate-pulse">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-48 bg-neutral-800 border border-neutral-700 rounded-medium"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Handle error state
    if (reviewsViewModel.mode === 'kaboom') {
        return <DefaultError locale={locale} />;
    }

    // Extract reviews from view model
    const reviews = reviewsViewModel.mode === 'default'
        ? reviewsViewModel.data.reviews
        : [];
    const hasReviews = reviews.length > 0;

    return (
        <div className="rounded-lg">
            <div className="flex items-center mb-6">
                <h3>{t('title')}</h3>
                <Button
                    variant="text"
                    size="small"
                    onClick={handleViewAllReviews}
                    text={t('viewAllReviews')}
                />
            </div>

            {hasReviews ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {reviews.slice(0, 3).map((review: any) => {
                        const baseProps = {
                            locale,
                            reviewerName: review.student?.username || '',
                            reviewerAvatar: review.student?.avatarImage?.url,
                            rating: review.rating,
                            reviewText: review.notes,
                            date: new Date(review.createdAt),
                            time: new Date(review.createdAt).toLocaleTimeString(locale, {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false
                            }),
                            workshopTitle: review.coachingOfferingTitle,
                            onClickReviewer: () => window.open(`/${locale}/students/${review.student?.username}`, '_blank'),
                        };

                        if (review.courseName) {
                            return (
                                <CoachReviewCard
                                    key={review.id}
                                    {...baseProps}
                                    type="with-course"
                                    courseTitle={review.courseName}
                                    courseImage={review.courseImageUrl || ''}
                                />
                            );
                        }

                        return (
                            <CoachReviewCard
                                key={review.id}
                                {...baseProps}
                                type="standalone"
                            />
                        );
                    })}
                </div>
            ) : (
                <div className="flex flex-col md:p-5 p-3 gap-2 rounded-medium border border-card-stroke bg-card-fill w-full">
                    <p className="text-text-secondary">
                        {t('noReviewsDescription')}
                    </p>
                </div>
            )}
        </div>
    );
}
