'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BuyCompletePackageBanner } from '../buy-complete-package-banner';
import { PackageCourseCard } from '../course-card/package-course-selector/package-course-card';
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
    showListItemNumbers: boolean;
    accordionItems: AccordionBuilderItem[];

    // Courses
    selectedCourses: CoursePreview[];
    partialDiscounts: Record<string, string>;
    currency: string;

    // Pricing
    packagePriceWithCoaching: number;
    packagePriceWithoutCoaching: number;
    fullCoursePriceWithCoaching: number;
    fullCoursePriceWithoutCoaching: number;
    coachingIncluded: boolean;
    onToggleCoaching: () => void;

    // Optional publish controls (supported for backwards compatibility)
    onBack?: () => void;
    onPublish?: () => void;
    isPublishing?: boolean;

    // Purchase callback
    onClickPurchase: () => void;

    // Course interaction callbacks
    onCourseDetails: (courseId: string) => void;
    onCourseAuthorClick: (courseId: string) => void;

    // Intl
    locale: TLocale;
}

/**
 * PackagePreviewStep
 *
 * A component for Step 4 of the Create Package flow, providing a comprehensive preview
 * of the package before publishing. This component renders the final package layout
 * using existing UI Kit components to show users exactly how their package will appear.
 *
 * Features:
 * - Complete package information display with hero banner
 * - Dynamic accordion section populated from package details
 * - Flexible course selection grid with individual course controls
 * - Pricing calculations and savings display
 * - Coaching inclusion toggle functionality
 * - Course exclusion controls for flexible purchasing
 * - Complete package purchase banner
 *
 * Props:
 * @param {string} packageTitle - Title of the package
 * @param {string} packageDescription - Description of the package
 * @param {string} featuredImageUrl - Optional URL for the package featured image
 * @param {number} durationInMinutes - Total duration of the package in minutes
 * @param {boolean} showListItemNumbers - Whether to show numbers in accordion items
 * @param {AccordionBuilderItem[]} accordionItems - Array of accordion items to display
 * @param {CoursePreview[]} selectedCourses - Array of selected courses for the package
 * @param {Record<string, string>} partialDiscounts - Discounts applied based on number of selected courses
 * @param {string} currency - Currency code for pricing display
 * @param {boolean} coachingIncluded - Whether coaching is included in the package
 * @param {function} onToggleCoaching - Function to toggle coaching inclusion
 * @param {function} onClickPurchase - Function to handle purchase button clicks (use no-op function for preview mode)
 * @param {function} onCourseDetails - Function to handle course details clicks (receives courseId)
 * @param {function} onCourseAuthorClick - Function to handle course author clicks (receives courseId)
 * @param {TLocale} locale - Current locale for translations
 *
 * Usage:
 * ```tsx
 * <PackagePreviewStep
 *   packageTitle={packageTitle}
 *   packageDescription={packageDescription}
 *   featuredImageUrl={featuredImageUrl}
 *   durationInMinutes={durationInMinutes}
 *   showListItemNumbers={showListItemNumbers}
 *   accordionItems={accordionItems}
 *   selectedCourses={selectedCourses}
 *   partialDiscounts={partialDiscounts}
 *   currency="CHF"
 *   coachingIncluded={coachingIncluded}
 *   onToggleCoaching={onToggleCoaching}
 *   onClickPurchase={() => {}} // Use no-op function for preview mode
 *   onCourseDetails={(courseId) => router.push(`/courses/${courseId}`)} // Navigate to course details
 *   onCourseAuthorClick={(courseId) => router.push(`/coaches/${courseId}`)} // Navigate to author profile
 *   locale={locale}
 * />
 * ```
 */

export function PackagePreviewStep({
    packageTitle,
    packageDescription,
    featuredImageUrl,
    durationInMinutes,
    showListItemNumbers,
    accordionItems,
    selectedCourses,
    partialDiscounts,
    currency,
    packagePriceWithCoaching,
    packagePriceWithoutCoaching,
    fullCoursePriceWithCoaching,
    fullCoursePriceWithoutCoaching,
    coachingIncluded,
    onToggleCoaching,
    onClickPurchase,
    onCourseDetails,
    onCourseAuthorClick,
    locale,
}: PackagePreviewStepProps) {
    const dictionary = getDictionary(locale);

    const [previewExcludedCourseIds, setPreviewExcludedCourseIds] = useState<string[]>([]);

    useEffect(() => {
        setPreviewExcludedCourseIds((prev) =>
            prev.filter((id) => selectedCourses.some((course) => course.id === id)),
        );
    }, [selectedCourses]);

    const handleToggleCourseInPreview = useCallback((courseId: string) => {
        setPreviewExcludedCourseIds((prev) =>
            prev.includes(courseId)
                ? prev.filter((id) => id !== courseId)
                : [...prev, courseId]
        );
    }, []);

    const includedCourses = useMemo(
        () =>
            selectedCourses.filter(
                (course) => !previewExcludedCourseIds.includes(course.id),
            ),
        [selectedCourses, previewExcludedCourseIds],
    );

    const currentPackagePrice = coachingIncluded
        ? packagePriceWithCoaching
        : packagePriceWithoutCoaching;

    const baseFullPrice = coachingIncluded
        ? fullCoursePriceWithCoaching
        : fullCoursePriceWithoutCoaching;

    const previewCoursesFullPrice = useMemo(() => {
        return includedCourses.reduce((total, course) => {
            const price = coachingIncluded
                ? course.pricing.fullPrice ?? 0
                : course.pricing.partialPrice ?? 0;
            return total + price;
        }, 0);
    }, [includedCourses, coachingIncluded]);

    const previewDiscountPercent = useMemo(() => {
        if (includedCourses.length === 0) {
            return 0;
        }
        const raw = partialDiscounts[String(includedCourses.length)] ?? '';
        const normalized = raw.replace(/[^\d.]/g, '').replace(',', '.');
        const parsed = Number(normalized);
        if (Number.isNaN(parsed)) {
            return 0;
        }
        return parsed;
    }, [includedCourses.length, partialDiscounts]);

    const isAllCoursesSelected =
        includedCourses.length > 0 &&
        includedCourses.length === selectedCourses.length;

    const previewPrice = useMemo(() => {
        if (includedCourses.length === 0) {
            return 0;
        }

        if (isAllCoursesSelected) {
            return currentPackagePrice;
        }

        if (previewDiscountPercent <= 0) {
            return previewCoursesFullPrice;
        }

        const discounted = previewCoursesFullPrice * (1 - previewDiscountPercent / 100);
        return Math.max(0, discounted);
    }, [
        includedCourses.length,
        isAllCoursesSelected,
        currentPackagePrice,
        previewCoursesFullPrice,
        previewDiscountPercent,
    ]);

    return (
        <div className="flex flex-col gap-8 bg-card-fill p-5 border border-card-stroke rounded-medium">
            {/* Top hero section */}
            <PackageGeneralInformation
                title={packageTitle}
                subTitle={''}
                imageUrl={featuredImageUrl || ''}
                description={packageDescription}
                duration={durationInMinutes || 0}
                pricing={{
                    currency,
                    fullPrice: baseFullPrice,
                    partialPrice: currentPackagePrice,
                } as any}
                locale={locale}
                onClickPurchase={onClickPurchase}
                coachingIncluded={coachingIncluded}
                onToggleCoaching={onToggleCoaching}
            />

            <div className="border-t border-card-stroke" />

            {/* Accordion Section */}
            {accordionItems.length > 0 && (
                <div className="flex flex-col gap-4">
                    <h3 className="text-lg font-semibold text-text-primary">{dictionary.components.packagePreviewStep.packageDetailsTitle}</h3>
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
                pricing={{
                    currency,
                    fullPrice: previewCoursesFullPrice,
                    partialPrice: previewPrice,
                } as any}
                onClickCheckbox={onToggleCoaching}
                onClickPurchase={onClickPurchase}
                locale={locale}
            >
                {selectedCourses.map((course) => {
                    const isExcluded = previewExcludedCourseIds.includes(course.id);
                    const courseIncluded = !isExcluded;
                    return (
                        <PackageCourseCard
                            key={course.id}
                            courseId={course.id}
                            title={course.title}
                            description={course.description}
                            imageUrl={course.imageUrl}
                            rating={course.rating}
                            author={course.author}
                            language={course.language}
                            duration={course.duration}
                            pricing={{
                                fullPrice: coachingIncluded ? course.pricing.fullPrice : course.pricing.partialPrice,
                                partialPrice: coachingIncluded ? course.pricing.fullPrice : course.pricing.partialPrice,
                                currency: course.pricing.currency
                            }}
                            sales={course.sales}
                            reviewCount={course.reviewCount}
                            courseIncluded={courseIncluded}
                            onClickUser={() => onCourseAuthorClick(course.id)}
                            onClickDetails={() => onCourseDetails(course.id)}
                            onClickIncludeExclude={() => handleToggleCourseInPreview(course.id)}
                            locale={locale}
                        />
                    );
                })}
            </PackageCourseSelector>

            <div className="border-t border-card-stroke" />

            {/* Bottom banner */}
            <BuyCompletePackageBanner
                titleBanner={dictionary.components.packagePreviewStep.bottomBannerTitle}
                descriptionBanner={dictionary.components.packagePreviewStep.bottomBannerSubtitle}
                imageUrl={featuredImageUrl || ''}
                title={packageTitle}
                description={packageDescription}
                duration={durationInMinutes || 0}
                pricing={{
                    currency,
                    fullPrice: baseFullPrice,
                    partialPrice: currentPackagePrice,
                }}
                locale={locale}
                onClickPurchase={onClickPurchase}
                coachingIncluded={coachingIncluded}
                onToggleCoaching={onToggleCoaching}
            />

        </div>
    );
}


