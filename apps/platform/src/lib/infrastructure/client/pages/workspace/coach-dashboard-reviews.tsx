'use client';

import { useCallback } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { TLocale } from '@maany_shr/e-class-translations';
import { Button, ReviewCard } from '@maany_shr/e-class-ui-kit';
import { trpc } from '../../trpc/cms-client';

export default function CoachDashboardReviews() {
    const router = useRouter();
    const locale = useLocale() as TLocale;
    const { data: session } = useSession();
    const t = useTranslations('pages.coachDashboardReviews');

    const {
        data: reviewsResponse,
        isLoading,
        error,
    } = trpc.listCoachReviews.useQuery(
        {
            coachUsername: session?.user?.name || '',
        },
        {
            enabled: !!session?.user?.name,
        }
    );

    const handleViewAllReviews = useCallback(() => {
        router.push(`/${locale}/workspace/your-reviews`);
    }, [router, locale]);

    // @ts-ignore - tRPC response structure
    const reviews = reviewsResponse?.data?.reviews || [];
    const hasReviews = reviews.length > 0;

    if (isLoading) {
        return (
            <div className="flex flex-col space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold text-white">{t('title')}</h2>
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

    return (
        <div className="rounded-lg">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-white">{t('title')}</h2>
                <Button
                    variant="text"
                    size="small"
                    onClick={handleViewAllReviews}
                    text={t('viewAllReviews')}
                />
            </div>

            {hasReviews ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {reviews.slice(0, 3).map((review: any) => (
                        <ReviewCard
                            key={review.id}
                            locale={locale}
                            reviewerName={`${review.student?.name} ${review.student?.surname}`.trim()}
                            reviewerAvatar={review.student?.avatarImage?.url}
                            rating={review.rating}
                            reviewText={review.notes}
                            date={new Date(review.createdAt)}
                            time={new Date(review.createdAt).toLocaleTimeString(locale, {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false
                            })}
                            workshopTitle={review.coachingOfferingTitle}
                            courseTitle={review.courseName}
                            courseImage={review.courseImageUrl}
                        />
                    ))}
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
