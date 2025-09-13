"use client";

import { CourseGeneralInformationVisitor, CourseIntroBanner, DefaultAccordion, ReviewSnippet, PackageCardList, PackageCard, StarRating, Dropdown } from '@maany_shr/e-class-ui-kit';
import { viewModels } from '@maany_shr/e-class-models';
import { useState } from 'react';
import OffersCarousel from '../offers/offers-carousel';

interface VisitorPageProps {
    courseData: viewModels.TPublicCourseDetailsSuccess;
    introductionData: viewModels.TCourseIntroductionSuccess;
    outlineData: viewModels.TCourseOutlineSuccess;
    reviews: viewModels.TCourseReviewsSuccess['reviews'];
    packagesData: viewModels.TCoursePackagesSuccess['packages'];
    offersCarouselData: viewModels.TOffersPageCarouselViewModel;
}

export default function VisitorPage({ courseData,
     introductionData,
    outlineData, reviews,
    packagesData,
    offersCarouselData,

}: VisitorPageProps) {
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
                locale="en"
            />
            {/* Course Introduction Banner */}
            <CourseIntroBanner
                description={introductionData.text}
                videoId={introductionData.video?.playbackId || ''}
                thumbnailUrl={introductionData.video?.thumbnailUrl || undefined}
                locale="en"
                onErrorCallback={handleErrorCallback}
            />

            {/* Course Outline Section */}
            <div className="w-full flex flex-col gap-6">
            
                    <h2 className="md:text-4xl text-2xl  text-text-primary">
                        Course Outline
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
                    <div className="flex flex-col sm:flex-row sm:items-center sm:items-center gap-2">
                        <h3 className="md:text-3xl text-2xl text-text-primary">
                            Course Reviews
                        </h3>
                        <div className="flex flex-row items-center gap-2">
                            <h6 className="text-text-primary">{courseData.averageRating}</h6>
                            <StarRating totalStars={5} size="4" rating={courseData.averageRating} />
                            <p className="text-text-secondary text-xs">
                                {courseData.reviewCount} reviews
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-1 items-center">
                    <label className="md:text-md text-sm text-text-primary">Sort by</label>
                    <Dropdown
                        type="simple"
                        options={[
                            { label: 'Newest', value: 'newest' },
                            { label: 'Oldest', value: 'oldest' },
                        ]}
                        onSelectionChange={(selected) => setSortOrder(selected as 'newest' | 'oldest')}
                        text={{ simpleText: 'Sort by' }}
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
                                locale="en"
                            />
                        ))}
                </div>
            </div>

            {/* Course Packages Section */}
            {packagesData && packagesData.length > 0 && (
                <div className="w-full flex flex-col gap-6">
                    <div className="flex flex-col gap-4">
                        <h3 className="md:text-3xl text-2xl text-text-primary">
                            Also included in
                        </h3>
                        <p className="text-text-primary md:text-xl text-md">
                           Learn more while saving. You can get this course included in the following bundles:
                        </p>
                    </div>

                    <PackageCardList locale="en">
                        {packagesData.map(pkg => (
                            <PackageCard
                                key={pkg.id}
                                {...pkg}
                                courseCount={pkg.courseCount}
                                onClickPurchase={() => handlePackagePurchase(pkg.id)}
                                onClickDetails={() => handlePackageDetails(pkg.id)}
                                locale="en"
                            />
                        ))}
                    </PackageCardList>
                </div>
            )}

            {/* Offers Carousel Section */}
            <div className="flex flex-col justify-center gap-10">
                 <h2 className="md:text-4xl text-2xl  text-text-primary text-center">
                        Haven't found what your were looking for?
                    </h2>
            <OffersCarousel data={offersCarouselData} />
            </div>
         <div className="flex sm:flex-row flex-col items-center gap-10">
            <Image
                src="/path/to/image.jpg"
                alt="Descriptive alt text"
                layout="responsive"
                width={475}
                height={275}
                className="max-w-[475px] rounded-medium"
            />
            <div  className="flex flex-col gap-4">
                <h2 className="md:text-4xl text-2xl  text-base-white">Turn Your Expertise into Earnings</h2>
                <p className="md:text-lg text-md text-base-white">Have the skills? Become a coach and inspire others! Share your knowledge, teach this course, and earn while making a difference. Join our community of experts.</p>
                <Button text="Become a Coach" size="medium"/>
                    
               
            </div>

            </div>
        </div>
    );
}
