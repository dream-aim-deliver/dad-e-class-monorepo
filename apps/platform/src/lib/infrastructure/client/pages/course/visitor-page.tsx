'use client';

import {
    CourseGeneralInformationVisitor,
    CourseIntroBanner,
    DefaultAccordion,
    ReviewSnippet,
    PackageCardList,
    PackageCard,
    StarRating,
    Dropdown,
    Button,
    DefaultError,
    TeachCourseBanner,
    Breadcrumbs,
    DefaultNotFound,
} from '@maany_shr/e-class-ui-kit';
import { viewModels } from '@maany_shr/e-class-models';
import { TGetCourseIntroductionUseCaseResponse } from '@dream-aim-deliver/e-class-cms-rest';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import OffersCarousel from '../offers/offers-carousel';
import { TLocale } from '@maany_shr/e-class-translations';
import { trpc } from '../../trpc/cms-client';
import { useGetCoachingPagePresenter } from '../../hooks/use-get-coaching-page-presenter';
import { useGetPublicCourseDetailsPresenter } from '../../hooks/use-public-course-details-presenter';
import { useGetCourseIntroductionPresenter } from '../../hooks/use-course-introduction-presenter';
import { useGetCourseOutlinePresenter } from '../../hooks/use-course-outline-presenter';
import { useListCourseReviewsPresenter } from '../../hooks/use-list-course-reviews-presenter';
import { useGetCoursePackagesPresenter } from '../../hooks/use-course-packages-presenter';
import { useGetOffersPageOutlinePresenter } from '../../hooks/use-get-offers-page-outline-presenter';
import { useRouter } from 'next/navigation';

interface VisitorPageProps {
    courseSlug: string;
    locale: TLocale;
}

export default function VisitorPage({
    courseSlug,
    locale,
}: VisitorPageProps) {
    const t = useTranslations('pages.course.visitor');
    const breadcrumbsTranslations = useTranslations('components.breadcrumbs');
    const router = useRouter();
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

    // Fetch all data using tRPC hooks (from prefetched cache)
    const [courseDetailsResponse] = trpc.getPublicCourseDetails.useSuspenseQuery({ courseSlug });
    const [courseIntroductionResponse] = trpc.getCourseIntroduction.useSuspenseQuery({ courseSlug });
    const [courseOutlineResponse] = trpc.getCourseOutline.useSuspenseQuery({ courseSlug });
    const [courseReviewsResponse] = trpc.listCourseReviews.useSuspenseQuery({ courseSlug });
    const [coursePackagesResponse] = trpc.getCoursePackages.useSuspenseQuery({ courseSlug });
    const [offersCarouselResponse] = trpc.getOffersPageOutline.useSuspenseQuery({});
    const [coachingPageResponse] = trpc.getCoachingPage.useSuspenseQuery({});

    // Create view model states
    const [courseData, setCourseData] = useState<viewModels.TPublicCourseDetailsViewModel | undefined>(undefined);
    const [introductionData, setIntroductionData] = useState<viewModels.TCourseIntroductionViewModel | undefined>(undefined);
    const [outlineData, setOutlineData] = useState<viewModels.TCourseOutlineViewModel | undefined>(undefined);
    const [reviewsData, setReviewsData] = useState<viewModels.TCourseReviewsViewModel | undefined>(undefined);
    const [packagesData, setPackagesData] = useState<viewModels.TCoursePackagesViewModel | undefined>(undefined);
    const [offersCarouselData, setOffersCarouselData] = useState<viewModels.TGetOffersPageOutlineViewModel | undefined>(undefined);
    const [coachingPageViewModel, setCoachingPageViewModel] = useState<viewModels.TGetCoachingPageViewModel | undefined>(undefined);

    // Create presenters using hooks
    const { presenter: courseDetailsPresenter } = useGetPublicCourseDetailsPresenter(setCourseData);
    const { presenter: courseIntroductionPresenter } = useGetCourseIntroductionPresenter(setIntroductionData);
    const { presenter: courseOutlinePresenter } = useGetCourseOutlinePresenter(setOutlineData);
    const { presenter: courseReviewsPresenter } = useListCourseReviewsPresenter(setReviewsData);
    const { presenter: coursePackagesPresenter } = useGetCoursePackagesPresenter(setPackagesData);
    const { presenter: offersCarouselPresenter } = useGetOffersPageOutlinePresenter(setOffersCarouselData);
    const { presenter: coachingPagePresenter } = useGetCoachingPagePresenter(setCoachingPageViewModel);

    // Run presenters when data is available
    useEffect(() => {
        if (courseDetailsResponse) {
            // @ts-ignore
            courseDetailsPresenter.present(courseDetailsResponse, courseData);
        }
    }, [courseDetailsResponse]);

    useEffect(() => {
        if (courseIntroductionResponse) {
            // Extract the actual response data from the TRPC wrapper and type it correctly
            const actualResponse = courseIntroductionResponse?.data as TGetCourseIntroductionUseCaseResponse;
            courseIntroductionPresenter.present(actualResponse, introductionData);
        }
    }, [courseIntroductionResponse]);

    useEffect(() => {
        if (courseOutlineResponse) {
            // @ts-ignore
            courseOutlinePresenter.present(courseOutlineResponse, outlineData);
        }
    }, [courseOutlineResponse]);

    useEffect(() => {
        if (courseReviewsResponse) {
            // @ts-ignore
            courseReviewsPresenter.present(courseReviewsResponse, reviewsData);
        }
    }, [courseReviewsResponse]);

    useEffect(() => {
        if (coursePackagesResponse) {
            // @ts-ignore
            coursePackagesPresenter.present(coursePackagesResponse, packagesData);
        }
    }, [coursePackagesResponse]);

    useEffect(() => {
        if (offersCarouselResponse) {
            // @ts-ignore
            offersCarouselPresenter.present(offersCarouselResponse, offersCarouselData);
        }
    }, [offersCarouselResponse]);

    useEffect(() => {
        if (coachingPageResponse) {
            // @ts-ignore
            coachingPagePresenter.present(coachingPageResponse, coachingPageViewModel);
        }
    }, [coachingPageResponse]);

    // Handle coaching page loading and error states
    if (!coachingPageViewModel) {
        // We'll continue with the page render but without banner data
    } else if (coachingPageViewModel.mode === 'kaboom') {
        // We'll continue with the page render but without banner data
    }

    const handleCoachingIncludedChange = (coachingIncluded: boolean) => {
        // TODO: Implement coaching included logic
        console.log('Coaching included changed:', coachingIncluded);
    };

    const handleClickBook = () => {
        // TODO: Implement book logic
        console.log('Book button clicked');
    };

    const handleClickBuyCourse = (coachingIncluded: boolean) => {
        // TODO: Implement buy course logic
        console.log('Buy course clicked with coaching:', coachingIncluded);
    };

    const handleClickRequiredCourse = (slug: string) => {
        // TODO: Implement navigation to required course
        console.log('Navigate to required course:', slug);
    };

    const handleErrorCallback = (message: string, error: any) => {
        console.error('Video error:', message, error);
    };

    const handlePackagePurchase = (packageId: string) => {
        // TODO: Implement package purchase logic
        console.log('Package purchase clicked:', packageId);
    };

    const handlePackageDetails = (packageId: string) => {
        // TODO: Implement package details logic
        console.log('Package details clicked:', packageId);
    };

    const renderCourseData = () => {
        switch (courseData?.mode) {
            case 'kaboom':
                return <DefaultError locale={locale} />;
            case 'default':
                return (
                    <CourseGeneralInformationVisitor
                        title={courseData.data.title}
                        longDescription={courseData.data.description}
                        language={{ code: 'en', name: 'English' }}
                        description={''}
                        duration={{
                            video: courseData.data.duration?.video || 0,
                            coaching: courseData.data.duration?.coaching || 0,
                            selfStudy: courseData.data.duration?.selfStudy || 0,
                        }}
                        author={{
                            name: `${courseData.data.author.name} ${courseData.data.author.surname}`,
                            image: courseData.data.author.avatarUrl || '',
                        }}
                        pricing={{
                            currency: courseData.data.currency,
                            partialPrice: courseData.data.basePrice,
                            fullPrice: courseData.data.priceIncludingCoachings,
                        }}
                        rating={courseData.data.averageRating}
                        totalRating={courseData.data.reviewCount}
                        ownerRating={courseData.data.author.averageRating}
                        ownerTotalRating={Math.floor(
                            courseData.data.author.averageRating * 10,
                        )}
                        imageUrl={courseData.data.imageFile?.downloadUrl || ''}
                        coaches={courseData.data.coaches.map((coach) => ({
                            name: coach.name,
                            avatarUrl: coach.avatarUrl || '',
                        }))}
                        totalCoachesCount={courseData.data.coaches.length}
                        coachingIncluded={false}
                        onCoachingIncludedChange={handleCoachingIncludedChange}
                        onClickBook={handleClickBook}
                        onClickBuyCourse={handleClickBuyCourse}
                        requiredCourses={courseData.data.requirements.map(
                            (req) => ({
                                image: '', // Could be enhanced to fetch course images
                                courseTitle: req.courseName,
                                slug: req.courseSlug,
                            }),
                        )}
                        onClickRequiredCourse={handleClickRequiredCourse}
                        locale={locale}
                    />
                );
            default:
                return null;
        }
    };

    const renderIntroductionData = () => {
        switch (introductionData?.mode) {
            case 'kaboom':
                return <DefaultError locale={locale} />;
            case 'default':
                return (
                    <CourseIntroBanner
                        description={introductionData.data.text}
                        videoId={introductionData.data.video?.playbackId || ''}
                        thumbnailUrl={
                            introductionData.data.video?.thumbnailUrl ||
                            undefined
                        }
                        locale={locale}
                        onErrorCallback={handleErrorCallback}
                    />
                );
            default:
                return null;
        }
    };

    const renderOutlineData = () => {
        switch (outlineData?.mode) {
            case 'kaboom':
                return <DefaultError locale={locale} />;
            case 'default':
                return (
                    <div className="p-6 bg-card-fill border border-card-stroke rounded-medium">
                        <DefaultAccordion
                            items={outlineData.data.items.map((item) => ({
                                title: item.title,
                                content: item.description,
                                position: item.position,
                                iconImageUrl:
                                    item.icon?.downloadUrl || undefined,
                            }))}
                            showNumbers={true}
                            className="w-full"
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    const renderReviewsData = () => {
        switch (reviewsData?.mode) {
            case 'kaboom':
                return <DefaultError locale={locale} />;
            case 'default':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {reviewsData.data.reviews
                            .sort((a: any, b: any) =>
                                sortOrder === 'newest'
                                    ? new Date(b.createdAt).getTime() -
                                    new Date(a.createdAt).getTime()
                                    : new Date(a.createdAt).getTime() -
                                    new Date(b.createdAt).getTime(),
                            )
                            .map((review: any) => (
                                <ReviewSnippet
                                    key={review.id}
                                    reviewText={review.comment}
                                    rating={review.rating}
                                    reviewerName={`${review.student.firstName} ${review.student.lastName}`}
                                    reviewerAvatarUrl={
                                        review.student.avatarFile
                                            ?.downloadUrl || ''
                                    }
                                    locale={locale}
                                />
                            ))}
                    </div>
                );
            default:
                return null;
        }
    };

    const renderPackagesData = () => {
        switch (packagesData?.mode) {
            case 'kaboom':
                return <DefaultError locale={locale} />;
            case 'default':
                if (packagesData.data.packages.length === 0) return null;
                return (
                    <div className="w-full flex flex-col gap-6">
                        <div className="flex flex-col gap-4">
                            <h3 className="md:text-3xl text-2xl text-text-primary">
                                {t('alsoIncludedIn')}
                            </h3>
                            <p className="text-text-primary md:text-xl text-md">
                                {t('alsoIncludedDescription')}
                            </p>
                        </div>
                        <PackageCardList locale={locale}>
                            {packagesData.data.packages.map((pkg) => (
                                <PackageCard
                                    key={pkg.id}
                                    {...pkg}
                                    onClickPurchase={() =>
                                        handlePackagePurchase(String(pkg.id))
                                    }
                                    onClickDetails={() =>
                                        handlePackageDetails(String(pkg.id))
                                    }
                                    locale={locale}
                                />
                            ))}
                        </PackageCardList>
                    </div>
                );
            default:
                return null;
        }
    };

    const renderOffersData = () => {
        switch (offersCarouselData?.mode) {
            case 'kaboom':
                return <DefaultError locale={locale} />;
            case 'not-found':
                return <DefaultNotFound locale={locale} />;
            case 'default':
                return <OffersCarousel items={offersCarouselData.data.items} />;
            default:
                return null;
        }
    };

    return (
        <div className="w-full flex flex-col gap-6 px-15">
            <div className="w-full pl-4">
                <Breadcrumbs
                    items={[
                        {
                            label: breadcrumbsTranslations('courses'),
                            onClick: () => {
                                // TODO: Implement navigation to courses visitor
                            },
                        },
                        {
                            label:
                                courseData?.mode === 'default'
                                    ? courseData.data.title
                                    : '',
                            onClick: () => {
                                // Nothing should happen on clicking the current page
                            },
                        },
                    ]}
                />
            </div>
            <div className="flex flex-col gap-30 ">
                {/* Course General Information */}
                {renderCourseData()}

                {/* Course Introduction Banner */}
                {renderIntroductionData()}

                {/* Course Outline Section */}
                <div className="w-full flex flex-col gap-6">
                    <h2 className="md:text-4xl text-2xl  text-text-primary">
                        {t('courseOutlineTitle')}
                    </h2>
                    {renderOutlineData()}
                </div>

                {/* Course Reviews Section */}
                <div className="w-full flex flex-col gap-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex flex-col sm:flex-row  sm:items-center gap-2">
                            <h3 className="md:text-3xl text-2xl text-text-primary">
                                {t('courseReviewsTitle')}
                            </h3>
                            {courseData?.mode === 'default' && (
                                <div className="flex flex-row items-center gap-2">
                                    <h6 className="text-text-primary">
                                        {courseData.data.averageRating}
                                    </h6>
                                    <StarRating
                                        totalStars={5}
                                        size="4"
                                        rating={courseData.data.averageRating}
                                    />
                                    <p className="text-text-secondary text-xs">
                                        {courseData.data.reviewCount}{' '}
                                        {t('reviewsCount')}
                                    </p>
                                </div>
                            )}
                        </div>
                        <div className="flex gap-1 items-center">
                            <label className="md:text-md text-sm text-text-primary">
                                {t('sortByLabel')}
                            </label>
                            <Dropdown
                                type="simple"
                                options={[
                                    { label: t('newest'), value: 'newest' },
                                    { label: t('oldest'), value: 'oldest' },
                                ]}
                                onSelectionChange={(selected) =>
                                    setSortOrder(
                                        selected as 'newest' | 'oldest',
                                    )
                                }
                                text={{ simpleText: t('sortByLabel') }}
                                defaultValue="newest"
                            />
                        </div>
                    </div>
                    {renderReviewsData()}
                </div>

                {/* Course Packages Section */}
                {renderPackagesData()}

                {/* Offers Carousel Section */}
                <div className="flex flex-col justify-center gap-10">
                    <h2 className="md:text-4xl text-2xl  text-text-primary text-center">
                        {t('notFoundTitle')}
                    </h2>
                    {renderOffersData()}
                </div>

                {coachingPageViewModel &&
                    coachingPageViewModel.mode !== 'kaboom' && coachingPageViewModel.mode !== 'not-found' && (
                        (() => {
                            const coachingPage = coachingPageViewModel.data;
                            return (
                                <TeachCourseBanner
                                    locale={locale}
                                    title={coachingPage.banner.title}
                                    description={coachingPage.banner.description}
                                    imageUrl={coachingPage.banner.image?.downloadUrl ?? ''}
                                    onClick={() => {
                                        router.push(coachingPage.banner.buttonLink);
                                    }}
                                />
                            );
                        })()
                    )}
            </div>
        </div>
    );
}
