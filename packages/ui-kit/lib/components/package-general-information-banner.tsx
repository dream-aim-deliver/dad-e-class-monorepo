'use client';

import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { eClassPackage } from '@maany_shr/e-class-models';
import { Badge } from './badge';
import { CheckBox } from './checkbox';
import { Button } from './button';
import { FC, useState } from 'react';
import { IconClock } from './icons/icon-clock';

export interface PackageGeneralInformationView
    extends eClassPackage.TEClassPackage,
    isLocalAware {
    onClickPurchase: () => void;
    subTitle: string;
}

/**
 * Displays general information about a package, including title, subtitle, description,
 * duration, pricing, and an image. Handles image loading errors by showing a placeholder.
 * Also provides a purchase button and a checkbox indicating coaching inclusion.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {() => void} props.onClickPurchase - Callback invoked when the purchase button is clicked.
 * @param {string} props.title - The main title of the package.
 * @param {string} props.subTitle - The subtitle or secondary title of the package.
 * @param {string} [props.imageUrl] - URL of the package image.
 * @param {string} props.description - Description of the package.
 * @param {number} [props.duration] - Duration of the package in minutes.
 * @param {Object} props.pricing - Pricing information for the package.
 * @param {string} props.pricing.currency - Currency symbol or code.
 * @param {number|string} props.pricing.fullPrice - Full price of the package.
 * @param {number|string} props.pricing.partialPrice - Discounted or partial price.
 * @param {string} props.locale - Locale identifier for translations.
 *
 * @returns {JSX.Element} The rendered package general information component.
 */
export const PackageGeneralInformation: FC<PackageGeneralInformationView> = ({
    onClickPurchase,
    title,
    subTitle,
    imageUrl,
    description,
    duration,
    pricing,
    locale,
}) => {
    const dictionary =
        getDictionary(locale).components.packageGeneralInformation;
    const [isImageError, setIsImageError] = useState(false);

    // Handle image loading errors
    const handleImageError = () => {
        setIsImageError(true);
    };

    const shouldShowPlaceholder = !imageUrl || isImageError;

    // Helper function to format duration in hours and minutes
    const formatDuration = (durationInMinutes?: number): string => {
        if (!durationInMinutes || durationInMinutes <= 0) return '0m';
        if (durationInMinutes > 59) {
            const hours = Math.floor(durationInMinutes / 60);
            const minutes = durationInMinutes % 60;
            return `${hours}h ${minutes}m`;
        }
        return `${durationInMinutes}m`;
    };

    return (
        <div className="flex w-full md:gap-15 gap-3 md:p-10 flex-col md:flex-row">
            <div className="flex flex-col basis-full md:basis-1/2">
                {/* Title and duration badge */}
                <h1 className="text-text-primary text-3xl mb-5 md:text-4xl">
                    {title}
                </h1>
                <div className="flex gap-2 mb-5">
                    <Badge
                        hasIconLeft
                        iconLeft={<IconClock size="4" />}
                        text={formatDuration(duration)}
                        className="text-sm"
                    />
                </div>

                {/* IMAGE for mobile */}
                <div className="block md:hidden w-full h-64 mb-5">
                    {shouldShowPlaceholder ? (
                        <div className="w-full h-full bg-base-neutral-700 flex items-center justify-center rounded-medium">
                            <span className="text-text-secondary text-md">
                                {dictionary.errorImageText}
                            </span>
                        </div>
                    ) : (
                        <img
                            loading="lazy"
                            src={imageUrl}
                            className="w-full h-full object-cover rounded-medium"
                            onError={handleImageError}
                        />
                    )}
                </div>

                {/* Subtitle and description */}
                <h5 className="text-text-primary text-lg mb-2">{subTitle}</h5>
                <p className="text-text-secondary text-md leading-[150%] mb-5">
                    {description}
                </p>

                {/* Checkbox visible JUST in desktop */}
                <div className="hidden md:block mb-5">
                    <CheckBox
                        name="coachingIncluded"
                        value="coachingIncluded"
                        checked={true}
                        size="medium"
                        withText={true}
                        label={dictionary.coachingIncluded}
                        labelClass="text-text-secondary text-md"
                    />
                </div>

                {/* Button and pricing */}
                <Button
                    variant="primary"
                    size="big"
                    text={dictionary.purchaseButton}
                    onClick={onClickPurchase}
                />
                <div className="flex gap-4 mt-4 justify-start">
                    <h6 className="text-text-primary lg:text-lg text-md">
                        {dictionary.fromText} {(pricing as any).currency as string}{' '}
                        {(pricing as any).fullPrice as number}
                    </h6>
                    <p className="text-feedback-success-primary lg:text-md text-sm font-bold">
                        {dictionary.saveText} {(pricing as any).currency as string}{' '}
                        {(pricing as any).partialPrice as number}
                    </p>
                </div>
            </div>

            {/* IMAGE desktop */}
            <div className="hidden md:block basis-1/2 h-full">
                {shouldShowPlaceholder ? (
                    <div className="w-full h-[400px] bg-base-neutral-700 flex items-center justify-center rounded-medium">
                        <span className="text-text-secondary text-md">
                            {dictionary.errorImageText}
                        </span>
                    </div>
                ) : (
                    <img
                        loading="lazy"
                        src={imageUrl}
                        className="w-full h-full object-cover rounded-medium"
                        onError={handleImageError}
                    />
                )}
            </div>
        </div>
    );
};
