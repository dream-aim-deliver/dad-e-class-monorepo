
"use client";

import { CourseGeneralInformationVisitor, CourseIntroBanner, DefaultAccordion, ReviewSnippet, PackageCardList, PackageCard, StarRating, Dropdown, Button } from '@maany_shr/e-class-ui-kit';
import Image from 'next/image';
import { viewModels } from '@maany_shr/e-class-models';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import OffersCarousel from '../offers/offers-carousel';

interface VisitorPageProps {
    courseData: viewModels.TPublicCourseDetailsSuccess;
    introductionData: viewModels.TCourseIntroductionSuccess;
    outlineData: viewModels.TCourseOutlineSuccess;
    reviews: viewModels.TCourseReviewsSuccess['reviews'];
    packagesData: viewModels.TCoursePackagesSuccess['packages'];
    offersCarouselData: viewModels.TOffersPageOutlineViewModel;
    locale: string;
}

export default function VisitorPage({ courseData,
    introductionData,
    outlineData, reviews,
    packagesData,
    offersCarouselData,
    locale
}: VisitorPageProps) {
    const t = useTranslations('pages.course.visitor');
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
        window.location.href = `/en/courses/${slug}`;
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

    return (
        <div className="flex flex-col gap-30 px-15">


            {/* Course General Information */}
            <CourseGeneralInformationVisitor
                title={courseData.title}
                longDescription={courseData.description}
                language={{ code: "en", name: "English" }}
                description={''}
                duration={{
                    video: courseData.duration?.video || 0,
                    coaching: courseData.duration?.coaching || 0,
                    selfStudy: courseData.duration?.selfStudy || 0,
                }}
                author={{
                    name: `${courseData.author.name} ${courseData.author.surname}`,
                    image: courseData.author.avatarUrl || '',
                }}
                pricing={{
                    currency: courseData.currency,
                    partialPrice: courseData.basePrice,
                    fullPrice: courseData.priceIncludingCoachings,
                }}
                rating={courseData.averageRating}
                totalRating={courseData.reviewCount}
                ownerRating={courseData.author.averageRating}
                ownerTotalRating={Math.floor(courseData.author.averageRating * 10)}
                imageUrl={courseData.imageFile?.downloadUrl || ''}
                coaches={courseData.coaches.map(coach => ({
                    name: coach.name,
                    avatarUrl: coach.avatarUrl || '',
                }))}
                totalCoachesCount={courseData.coaches.length}
                coachingIncluded={false}
                onCoachingIncludedChange={handleCoachingIncludedChange}
                onClickBook={handleClickBook}
                onClickBuyCourse={handleClickBuyCourse}
                requiredCourses={courseData.requirements.map(req => ({
                    image: '', // Could be enhanced to fetch course images
                    courseTitle: req.courseName,
                    slug: req.courseSlug,
                }))}
                onClickRequiredCourse={handleClickRequiredCourse}
                requirementsDetails={courseData.requirements.length > 0
                    ? "This course has prerequisites that you should complete first."
                    : "No prerequisites required."
                }
                locale={locale as "en" | "de"}
            />
            {/* Course Introduction Banner */}
            <CourseIntroBanner
                description={introductionData.text}
                videoId={introductionData.video?.playbackId || ''}
                thumbnailUrl={introductionData.video?.thumbnailUrl || undefined}
                locale={locale}
                onErrorCallback={handleErrorCallback}
            />

            {/* Course Outline Section */}
            <div className="w-full flex flex-col gap-6">

                <h2 className="md:text-4xl text-2xl  text-text-primary">
                    {t('courseOutlineTitle')}
                </h2>

                <div className="p-6 bg-card-fill border border-card-stroke rounded-medium">
                    <DefaultAccordion
                        items={outlineData.items.map(item => ({
                            title: item.title,
                            content: item.description,
                            position: item.position,
                            iconImageUrl: item.icon?.downloadUrl || undefined,
                        }))}
                        showNumbers={true}
                        className="w-full"
                    />
                </div>
            </div>

            {/* Course Reviews Section */}
            <div className="w-full flex flex-col gap-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex flex-col sm:flex-row  sm:items-center gap-2">
                        <h3 className="md:text-3xl text-2xl text-text-primary">
                            {t('courseReviewsTitle')}
                        </h3>
                        <div className="flex flex-row items-center gap-2">
                            <h6 className="text-text-primary">{courseData.averageRating}</h6>
                            <StarRating totalStars={5} size="4" rating={courseData.averageRating} />
                            <p className="text-text-secondary text-xs">
                                {courseData.reviewCount} {t('reviewsCount')}
                            </p>
                        </div>
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...reviews]
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
            </div>

            {/* Course Packages Section */}
            {packagesData && packagesData.length > 0 && (
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
                        {packagesData.map(pkg => (
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
            )}

            {/* Offers Carousel Section */}
            <div className="flex flex-col justify-center gap-10">
                <h2 className="md:text-4xl text-2xl  text-text-primary text-center">
                    {t('notFoundTitle')}
                </h2>
                <OffersCarousel items={offersCarouselData?.data?.items || []} />
            </div>
            <div className="flex sm:flex-row flex-col items-center gap-10">
                <div className="flex-shrink-0 max-w-[475px] h-[275px]">
                    <Image
                        src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=475&h=275&fit=crop&crop=face"
                        alt="Become a coach and share your knowledge"
                        width={475}
                        height={275}
                        className="rounded-medium w-full h-full object-cover"
                    />
                </div>
                <div className="flex flex-col gap-4">
                    <h2 className="md:text-4xl text-2xl  text-base-white">{t('becomeCoachTitle')}</h2>
                    <p className="md:text-lg text-md text-base-white">{t('becomeCoachDescription')}</p>
                    <div>
                    <Button
                        onClick={() => {
                            // TODO: Implement become coach logic
                            console.log('Become coach button clicked');
                        }}
                        className="!w-auto"
                        text={t('becomeCoachButton')}
                        size="big"
                    />
</div>

                </div>

            </div>
        </div>
    );
}
