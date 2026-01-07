'use client';

import { useEffect, useRef, useState } from 'react';
import { Badge } from '../badge';
import { Button } from '../button';
import { IconClock } from '../icons/icon-clock';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { TEClassPackage } from 'packages/models/src/eclass-package';
import { useImageComponent } from '../../contexts/image-component-context';
import RichTextRenderer from '../rich-text-element/renderer';

export interface PackageCardProps extends TEClassPackage, isLocalAware {
    courseCount: number;
    onClickPurchase: () => void;
    onClickDetails: () => void;
}

/**
 * A visual card component for displaying e-class package details.
 *
 * Displays an image (or placeholder), title, description, duration,
 * number of courses, and pricing information.
 * Includes badges and action buttons for purchasing and viewing details.
 *
 * Props are a combination of:
 * - `TEClassPackage` (package details such as `imageUrl`, `title`, `description`, `duration`, `pricing`)
 * - `isLocalAware` (locale handling)
 * - Additional UI-related props defined in `PackageCardProps`
 *
 * @prop {number} courseCount
 *   The number of courses included in the package. Displayed as a badge if greater than zero.
 * @prop {() => void} onClickPurchase
 *   Callback for when the "Purchase Package" button is clicked.
 * @prop {() => void} onClickDetails
 *   Callback for when the "Details" button is clicked.
 *
 * @remarks
 * - If `imageUrl` is missing or the image fails to load, a placeholder text is shown instead.
 * - Duration is formatted into hours and minutes if over 59 minutes (e.g., `1h 30m`).
 * - The title truncates after two lines, with a tooltip on hover showing the full title.
 * - Pricing is displayed with full price and a “save” amount.
 * - All button texts, labels, and placeholders are localized using `getDictionary(locale)`.
 *
 * @example
 * <PackageCard
 *   imageUrl="https://example.com/image.jpg"
 *   title="Advanced Web Development"
 *   description="Master web development with this comprehensive course package."
 *   duration={120}
 *   courseCount={5}
 *   pricing={{ currency: 'USD', fullPrice: 299, partialPrice: 249 }}
 *   locale="en"
 *   onClickPurchase={() => console.log('Purchase clicked')}
 *   onClickDetails={() => console.log('Details clicked')}
 * />
 */

export const PackageCard = ({
    imageUrl,
    title,
    description,
    duration,
    courseCount,
    pricing,
    locale,
    onClickPurchase,
    onClickDetails,
}: PackageCardProps) => {
    const ImageComponent = useImageComponent();
    const dictionary = getDictionary(locale);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const [isTruncated, setIsTruncated] = useState(false);
    const [isImageError, setIsImageError] = useState(false);

    // Helper function to format duration in hours and minutes
    const formatDuration = (duration?: number): string => {
        if (!duration || duration <= 0) return '0m';
        if (duration > 59) {
            const hours = Math.floor(duration / 60);
            const minutes = duration % 60;
            return `${hours}h ${minutes}m`;
        }
        return `${duration}m`;
    };

    // Handle image error and set error state
    const handleImageError = () => {
        setIsImageError(true);
    };

    const shouldShowPlaceholder = !imageUrl || isImageError;

    // Check for truncation of title on resize
    useEffect(() => {
        const checkTruncation = () => {
            if (titleRef.current) {
                const { scrollHeight, clientHeight } = titleRef.current;
                setIsTruncated(scrollHeight > clientHeight);
            }
        };

        checkTruncation();
        window.addEventListener('resize', checkTruncation);
        return () => window.removeEventListener('resize', checkTruncation);
    }, [title]);

    return (
        <div className="flex flex-col rounded-medium border border-card-stroke bg-card-fill w-full max-w-[24rem]">
            {/* Image Section */}
            {shouldShowPlaceholder ? (
                <div className="rounded-t-lg w-full h-[12rem] bg-base-neutral-700 flex items-center justify-center">
                    <span className="text-text-secondary text-md">
                        {dictionary.components.generalCard.placeHolderText}
                    </span>
                </div>
            ) : (
                <div className="relative w-full rounded-t-medium overflow-hidden">
                    <ImageComponent
                        loading="lazy"
                        src={imageUrl}
                        alt={title}
                        width={400}
                        height={192}
                        onError={handleImageError}
                        className="object-cover w-full h-[12rem] rounded-t-medium border-bottom-0"
                    />
                </div>
            )}

            {/* Card Information Section */}
            <div className="flex flex-col gap-4 p-6">
                <div className="flex flex-col gap-3">
                    <div className="group relative">
                        <h4
                            ref={titleRef}
                            className="text-text-primary lg:text-2xl line-clamp-2"
                        >
                            {title}
                        </h4>
                        {isTruncated && (
                            <div className="absolute invisible group-hover:visible opacity-10 group-hover:opacity-100 transition-opacity duration-200 bg-card-stroke text-text-primary text-sm rounded py-2 px-3 -top-18 left-0 w-max max-w-[14rem] z-10">
                                {title}
                                <div className="absolute top-full left-4 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-card-stroke" />
                            </div>
                        )}
                    </div>

                    {/* Duration & Courses Badges */}
                    <div className="flex gap-2">
                        {typeof duration === 'number' && (
                            <Badge
                                hasIconLeft
                                iconLeft={<IconClock size="5" />}
                                key={duration}
                                text={formatDuration(duration)}
                                className="h-6 py-1 text-base max-w-full"
                            />
                        )}
                        {courseCount > 0 && (
                            <Badge
                                key={courseCount}
                                text={
                                    courseCount +
                                    ' ' +
                                    dictionary.components.packages.coursesText
                                }
                                className="h-6 py-1 text-base max-w-full"
                            />
                        )}
                    </div>
                </div>

                {/* Description */}
                {description && (
                    <RichTextRenderer
                        content={description}
                        onDeserializationError={console.error}
                        className="text-text-secondary lg:text-lg line-clamp-3"
                    />
                )}

                <div className="flex flex-col md:pt-4 gap-4">
                    <div className="flex flex-col md:flex-row flex-wrap gap-3 md:gap-4 items-stretch">
                        <Button
                            variant="primary"
                            size="big"
                            text={
                                dictionary.components.packages
                                    .purchasePackageText
                            }
                            onClick={onClickPurchase}
                            className="w-full md:flex-1"
                        />
                        <Button
                            variant="secondary"
                            size="big"
                            text={dictionary.components.packages.detailsText}
                            onClick={onClickDetails}
                            className="w-full md:flex-1"
                        />

                        {/* Prices */}
                        {pricing && (
                            <div className="flex gap-2 items-center">
                                <h6 className="text-text-primary lg:text-lg">
                                    {pricing.currency} {pricing.fullPrice}
                                </h6>
                                <p className="text-feedback-success-primary lg:text-md text-sm font-important">
                                    {dictionary.components.packages.saveText}{' '}
                                    {pricing.currency} {pricing.partialPrice}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
