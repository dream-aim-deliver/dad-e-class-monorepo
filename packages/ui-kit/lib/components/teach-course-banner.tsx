'use client';

import React, { useState } from 'react';
import { Button } from './button';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { useImageComponent } from '../contexts/image-component-context';

interface TeachCourseBannerProps {
    imageUrl: string;
    title: string;
    description: string;
    onClick: () => void;
    buttonText?: string; // Optional button text, defaults to localized text
}

/**
 * A reusable TeachCourseBanner component that displays a promotional banner with customizable title and description, localized button text and placeholder.
 * Uses a responsive layout: stacked on mobile, 1/3 image + 2/3 text content on desktop.
 * The image is positioned on the left side of the text content on larger screens.
 *
 * @param locale The locale string used for localization, inherited from the `isLocalAware` interface. Determines the language of button text and placeholder text.
 * @param imageUrl The URL of the image to display in the banner. If the image fails to load, a localized placeholder is shown.
 * @param title The title text to display in the banner.
 * @param description The description text to display in the banner.
 * @param onClick Callback function triggered when the button is clicked.
 *
 * @example
 * <TeachCourseBanner
 *   locale="en"
 *   imageUrl="https://example.com/teach-image.jpg"
 *   title="Turn Your Expertise Into Earnings"
 *   description="Have the skills? Become a coach and inspire others!"
 *   onClick={() => console.log("Button clicked!")}
 * />
 */
export const TeachCourseBanner: React.FC<
    isLocalAware & TeachCourseBannerProps
> = ({ locale, imageUrl, title, description, onClick, buttonText }) => {
    const dictionary = getDictionary(locale).components.teachCourseBanner;
    const [isImageError, setIsImageError] = useState(false);
    const ImageComponent = useImageComponent();

    const handleImageError = () => {
        setIsImageError(true);
    };
    const shouldShowPlaceholder = !imageUrl || isImageError;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 items-center w-full h-full gap-3 md:gap-1">
            <div className="order-1 md:order-1 md:col-span-1 h-full md:mr-10">
                {shouldShowPlaceholder ? (
                    // Placeholder for broken image
                    <div className="rounded-xl w-full h-[250px] lg:max-h-[320px] bg-base-neutral-700 flex items-center justify-center">
                        <span className="text-text-secondary text-md">
                            {dictionary.placeHolderText}
                        </span>
                    </div>
                ) : (
                    <ImageComponent
                        src={imageUrl}
                        alt="Banner image"
                        className="rounded-xl w-full h-auto lg:max-h-[320px] md:h-auto object-cover"
                        onError={handleImageError}
                        loading="lazy"
                    />
                )}
            </div>

            <div className="order-2 md:order-2 md:col-span-2 flex flex-col justify-start gap-1 md:gap-3">
                <h3>{title}</h3>
                <p className="text-text-secondary text-sm md:text-md">
                    {description}
                </p>
                <Button
                    variant="primary"
                    size="big"
                    text={buttonText || dictionary.teachButtonText}
                    className="self-start"
                    onClick={onClick}
                />
            </div>
        </div>
    );
};
