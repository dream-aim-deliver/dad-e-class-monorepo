import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { TEClassPackage } from 'packages/models/src/eclass-package';
import { Badge, Button, CheckBox } from '..';
import { FC, useState } from 'react';
import { IconClock } from './icons/icon-clock';

export interface PackageGeneralInformationView
    extends TEClassPackage,
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
        <div className="flex w-full gap-15 md:flex-row flex-col-reverse p-10">
            <div className="flex flex-col basis-1/2">
                {/* Title section and duration bagde */}
                <div className="flex flex-col gap-7 mb-7">
                    <h1 className="text-text-primary">{title}</h1>
                    <div className="flex gap-2">
                        <Badge
                            hasIconLeft
                            iconLeft={<IconClock size="4" />}
                            text={formatDuration(duration)}
                            className="text-sm"
                        />
                    </div>
                </div>

                {/* Subtitle and description */}
                <div className="flex flex-col gap-2 mb-7">
                    <h5 className="text-text-primary text-lg">{subTitle}</h5>
                    <p className="text-text-secondary text-md leading-[150%]">
                        {description}
                    </p>
                </div>

                {/* Pricing, checkbox and button */}
                <div className="flex gap-3 flex-col">
                    <CheckBox
                        name="coachingIncluded"
                        value="coachingIncluded"
                        checked={true}
                        size="medium"
                        withText={true}
                        label={dictionary.coachingIncluded}
                        labelClass="text-text-secondary text-md"
                    />
                    <div className="flex flex-row gap-4 items-start">
                        <Button
                            className=""
                            variant="primary"
                            size="big"
                            text={dictionary.purchaseButton}
                            onClick={onClickPurchase}
                        />
                        <div className="flex flex-col items-start text-left">
                            <h6 className="text-text-primary lg:text-lg text-md">
                                {dictionary.fromText} {pricing.currency}{' '}
                                {pricing.fullPrice}
                            </h6>
                            <p className="text-feedback-success-primary lg:text-md text-sm font-bold">
                                {dictionary.saveText} {pricing.currency}{' '}
                                {pricing.partialPrice}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Image section */}
            <div className="w-full basis-1/2 h-full">
                {shouldShowPlaceholder ? (
                    <div className="w-full h-[400px] bg-base-neutral-700 flex items-center justify-center">
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
