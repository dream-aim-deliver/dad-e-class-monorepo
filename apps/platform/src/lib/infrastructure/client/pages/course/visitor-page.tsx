
"use client";

import { CourseGeneralInformationVisitor, CourseIntroBanner, DefaultAccordion, ReviewSnippet, PackageCardList, PackageCard, StarRating, Dropdown, Button, DefaultError, TeachCourseBanner, Breadcrumbs } from '@maany_shr/e-class-ui-kit';
import { viewModels } from '@maany_shr/e-class-models';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import OffersCarousel from '../offers/offers-carousel';
import { TLocale } from '@maany_shr/e-class-translations';

interface VisitorPageProps {
    courseData: viewModels.TPublicCourseDetailsViewModel;
    introductionData: viewModels.TCourseIntroductionViewModel;
    outlineData: viewModels.TCourseOutlineViewModel;
    reviewsData: viewModels.TCourseReviewsViewModel;
    packagesData: viewModels.TCoursePackagesViewModel;
    offersCarouselData: viewModels.TOffersPageOutlineViewModel;
    locale: TLocale;
}

export default function VisitorPage({ courseData,
    introductionData,
    outlineData, reviewsData,
    packagesData,
    offersCarouselData,
    locale
}: VisitorPageProps) {
    const t = useTranslations('pages.course.visitor');
    const breadcrumbsTranslations = useTranslations('components.breadcrumbs');
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

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
                        language={{ code: "en", name: "English" }}
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
                        ownerTotalRating={Math.floor(courseData.data.author.averageRating * 10)}
                        imageUrl={courseData.data.imageFile?.downloadUrl || ''}
                        coaches={courseData.data.coaches.map(coach => ({
                            name: coach.name,
                            avatarUrl: coach.avatarUrl || '',
                        }))}
                        totalCoachesCount={courseData.data.coaches.length}
                        coachingIncluded={false}
                        onCoachingIncludedChange={handleCoachingIncludedChange}
                        onClickBook={handleClickBook}
                        onClickBuyCourse={handleClickBuyCourse}
                        requiredCourses={courseData.data.requirements.map(req => ({
                            image: '', // Could be enhanced to fetch course images
                            courseTitle: req.courseName,
                            slug: req.courseSlug,
                        }))}
                        onClickRequiredCourse={handleClickRequiredCourse}
                        requirementsDetails={courseData.data.requirements.length > 0
                            ? "This course has prerequisites that you should complete first."
                            : "No prerequisites required."
                        }
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
                        thumbnailUrl={introductionData.data.video?.thumbnailUrl || undefined}
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
                            items={outlineData.data.items.map(item => ({
                                title: item.title,
                                content: item.description,
                                position: item.position,
                                iconImageUrl: item.icon?.downloadUrl || undefined,
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
                            .sort((a, b) =>
                                sortOrder === 'newest'
                                    ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                                    : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                            )
                            .map(review => (
                                <ReviewSnippet
                                    key={review.id}
                                    reviewText={review.comment}
                                    rating={review.rating}
                                    reviewerName={`${review.student.firstName} ${review.student.lastName}`}
                                    reviewerAvatarUrl={review.student.avatarFile?.downloadUrl || ''}
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
                            {packagesData.data.packages.map(pkg => (
                                <PackageCard
                                    key={pkg.id}
                                    {...pkg}
                                    courseCount={pkg.courseCount}
                                    onClickPurchase={() => handlePackagePurchase(pkg.id)}
                                    onClickDetails={() => handlePackageDetails(pkg.id)}
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
                                        // TODO: Implement navigation to home
                                    },
                                },
                                {
                                    label: courseData?.mode === 'default' ? courseData.data.title : '',
                                    onClick: () => {
                                        // TODO: Implement navigation to workspace
                                    },
                                }
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
                                <h6 className="text-text-primary">{courseData.data.averageRating}</h6>
                                <StarRating totalStars={5} size="4" rating={courseData.data.averageRating} />
                                <p className="text-text-secondary text-xs">
                                    {courseData.data.reviewCount} {t('reviewsCount')}
                                </p>
                            </div>
                        )}
                    </div>
                    <div className="flex gap-1 items-center">
                        <label className="md:text-md text-sm text-text-primary">{t('sortByLabel')}</label>
                        <Dropdown
                            type="simple"
                            options={[
                                { label: t('newest'), value: 'newest' },
                                { label: t('oldest'), value: 'oldest' },
                            ]}
                            onSelectionChange={(selected) => setSortOrder(selected as 'newest' | 'oldest')}
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

            <TeachCourseBanner
                locale={locale}
                imageUrl="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=475&h=275&fit=crop&crop=face"
                title={t('becomeCoachTitle')}
                description={t('becomeCoachDescription')}
                onClick={() => {
                    // TODO: Implement become coach logic
                    console.log('Become coach button clicked');
                }}
                buttonText={t('becomeCoachButton')}
            />
        </div>
        </div>
    );
}
