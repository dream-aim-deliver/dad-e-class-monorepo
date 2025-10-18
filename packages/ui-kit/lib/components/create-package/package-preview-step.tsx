'use client';

import React from 'react';
import { Button } from '../button';
import { BuyCompletePackageBanner } from '../buy-complete-package-banner';
import { CourseCard } from '../course-card/course-card';
import { PackageCourseSelector } from '../course-card/package-course-selector/package-course-selector';
import { PackageGeneralInformation } from '../package-general-information-banner';
import { DefaultAccordion } from '../accordion/default-accordion';
import { TLocale, getDictionary } from '@maany_shr/e-class-translations';
import { type AccordionBuilderItem } from '../accordion-builder';

type CoursePreview = {
    id: string;
    title: string;
    description: string;
    rating: number;
    reviewCount: number;
    language: { code: string; name: string };
    sessions: number;
    duration: { video: number; coaching: number; selfStudy: number };
    sales: number;
    imageUrl: string;
    author: { name: string; image: string };
    pricing: { fullPrice: number; partialPrice: number; currency: string };
};

export interface PackagePreviewStepProps {

    // Package general info
    packageTitle: string;
    packageDescription: string;
    featuredImageUrl?: string;
    durationInMinutes?: number;

    // Accordion
    accordionTitle: string;
    showListItemNumbers: boolean;
    accordionItems: AccordionBuilderItem[];

    // Courses
    selectedCourses: CoursePreview[];
    onExcludeCourse: (courseId: string) => void;

    // Pricing
    coachingIncluded: boolean;
    onToggleCoaching: () => void;
    selectedCoursesTotal: number;
    selectedCoursesSavings: number;

    // Footer actions
    onBack: () => void;
    onPublish: () => void;
    isPublishing: boolean;

    // Intl
    locale: TLocale;

    // Banner copy
    bottomBannerTitle: string;
    bottomBannerSubtitle: string;
}

/**
 * PackagePreviewStep
 *
 * Renders the Step 4 preview for the Create Package flow using existing UI Kit components.
 *
 * Sections:
 * 1) BuyCompletePackageBanner (hero)
 * 2) Package details accordion populated from Step 1
 * 3) Flexible course selection grid rendered with CourseCard and Include/Exclude controls
 * 4) Disabled "Purchase Selected Courses" CTA with dynamic totals
 * 5) Secondary BuyCompletePackageBanner (complete package CTA)
 * 6) Footer publish controls (Back / Publish)
 *
 * The component is purely presentational; all data/state are passed from the parent.
 */

export function PackagePreviewStep({
    packageTitle,
    packageDescription,
    featuredImageUrl,
    durationInMinutes,
    accordionTitle,
    showListItemNumbers,
    accordionItems,
    selectedCourses,
    onExcludeCourse,
    coachingIncluded,
    onToggleCoaching,
    selectedCoursesTotal,
    selectedCoursesSavings,
    onBack,
    onPublish,
    isPublishing,
    locale,
    bottomBannerTitle,
    bottomBannerSubtitle,
}: PackagePreviewStepProps) {
    const dictionary = getDictionary(locale);
    
    return (
        <div className="flex flex-col gap-8 bg-card-fill p-5 border border-card-stroke rounded-medium">
            {/* Top hero section */}
            <PackageGeneralInformation
                title={packageTitle}
                subTitle={''}
                imageUrl={featuredImageUrl || ''}
                description={packageDescription}
                duration={durationInMinutes || 0}
                pricing={{ currency: 'CHF', fullPrice: selectedCoursesTotal, partialPrice: selectedCoursesSavings } as any}
                locale={locale}
                onClickPurchase={() => undefined}
            />

            <div className="border-t border-card-stroke" />

            {/* Accordion Section */}
            {accordionItems.length > 0 && (
                <div className="flex flex-col gap-4">
                    <h3 className="text-lg font-semibold text-text-primary">{accordionTitle || dictionary.components.packagePreviewStep.packageDetailsTitle}</h3>
                    <DefaultAccordion
                        showNumbers={showListItemNumbers}
                        items={accordionItems.map((item, index) => ({
                            title: item.title || `Item ${index + 1}`,
                            iconImageUrl: item.icon ? (item.icon.thumbnailUrl || item.icon.url) : undefined,
                            content: item.content || '',
                            position: index + 1,
                        }))}
                    />
                </div>
            )}

            <div className="border-t border-card-stroke" />

            {/* Flexible Section using PackageCourseSelector */}
            <PackageCourseSelector
                title={dictionary.components.packagePreviewStep.flexibleSectionTitle}
                description={dictionary.components.packagePreviewStep.flexibleDescription}
                coachingIncluded={coachingIncluded}
                pricing={{ currency: 'CHF', fullPrice: selectedCoursesTotal, partialPrice: Math.max(selectedCoursesTotal - selectedCoursesSavings, 0) }}
                onClickCheckbox={onToggleCoaching}
                onClickPurchase={() => undefined}
                locale={locale}
            >
                {selectedCourses.map((course) => (
                    <div key={course.id} className="w-full">
                        <CourseCard
                            userType="visitor"
                            reviewCount={course.reviewCount}
                            locale={locale}
                            language={{ code: course.language.code, name: course.language.name } as any}
                            course={{
                                title: course.title,
                                description: course.description,
                                author: course.author,
                                imageUrl: course.imageUrl,
                                rating: course.rating,
                                duration: course.duration,
                                pricing: course.pricing,
                            } as any}
                            sessions={course.sessions}
                            sales={course.sales}
                            onDetails={() => undefined}
                            onClickUser={() => undefined}
                            className="mb-3"
                        />
                        <div className="flex items-center justify-between">
                            <span className="font-semibold text-text-primary">
                                {course.pricing.currency} {course.pricing.partialPrice}
                            </span>
                            <div className="flex gap-2">
                                <Button
                                    variant="secondary"
                                    size="small"
                                    text={dictionary.components.packagePreviewStep.excludeButton}
                                    onClick={() => onExcludeCourse(course.id)}
                                />
                                <Button
                                    variant="text"
                                    size="small"
                                    text={dictionary.components.packagePreviewStep.detailsButton}
                                    onClick={() => undefined}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </PackageCourseSelector>

            <div className="border-t border-card-stroke" />

            {/* Bottom banner (complete package CTA) */}
            <BuyCompletePackageBanner
                titleBanner={bottomBannerTitle}
                descriptionBanner={bottomBannerSubtitle}
                imageUrl={featuredImageUrl || ''}
                title={packageTitle}
                description={packageDescription}
                duration={durationInMinutes || 0}
                pricing={{ currency: 'CHF', fullPrice: selectedCoursesTotal, partialPrice: selectedCoursesSavings }}
                locale={locale}
                onClickPurchase={() => undefined}
            />

        </div>
    );
}


