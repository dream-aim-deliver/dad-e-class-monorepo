'use client';
import React, { useState } from "react";
import { Button } from "./button";
import { getDictionary, isLocalAware } from "@maany_shr/e-class-translations";
import { useImageComponent } from "../contexts/image-component-context";

interface CoachBannerProps {
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  buttonText?: string; // Optional button text, defaults to localized text
  onClick?: () => void;
}

/**
 * A reusable CoachBanner component that displays a promotional banner with a title, subtitle, description, image, and a call-to-action button.
 * Supports localization and handles image loading errors with a fallback placeholder.
 *
 * @param locale The locale string used for localization, inherited from the `isLocalAware` interface. Determines the language of the button and placeholder text.
 * @param title The main title of the banner, displayed prominently at the top.
 * @param subtitle The secondary title of the banner, typically displayed alongside the main title.
 * @param description A brief text description providing additional context or details for the banner.
 * @param imageUrl The URL of the image to display in the banner. If the image fails to load, a placeholder is shown.
 * @param onClick Optional callback function triggered when the button is clicked.
 *
 * @example
 * <CoachBanner
 *   locale="en"
 *   title="Become a Coach"
 *   subtitle="Today"
 *   description="Join our platform and start coaching students worldwide."
 *   imageUrl="https://example.com/coach-image.jpg"
 *   onClick={() => console.log("Button clicked!")}
 * />
 */
export const CoachBanner: React.FC<isLocalAware & CoachBannerProps> = ({
  locale,
  title,
  subtitle,
  description,
  imageUrl,
  buttonText,
  onClick
}) => {
  const ImageComponent = useImageComponent();
  const dictionary = getDictionary(locale);
  const [isImageError, setIsImageError] = useState(false);

  const handleImageError = () => {
    setIsImageError(true);
  };
  const shouldShowPlaceholder = !imageUrl || isImageError;
  return (
    <div className="flex flex-col items-start self-stretch max-w-7xl mx-auto py-8 md:py-12 px-[40px] rounded-[16px] border border-solid border-card-stroke bg-card-fill">
      <div className="grid grid-cols-1 md:grid-cols-2 items-start w-full h-full sm:gap-3">
        <div className="order-2 md:order-1 flex flex-col justify-start gap-4">
          <h2 className="text-2xl font-bold leading-[150%] text-base-white">
            {title} <br className="hidden md:block" /> {subtitle}
          </h2>
          <p className="text-gray-300 text-md md:text-base leading-[150%] mb-6">
            {description}
          </p>
          {buttonText && (
            <Button
              variant="primary"
              size="big"
              text={buttonText}
              className="self-start"
              onClick={onClick}
            />
          )}
        </div>

        <div className="order-1 md:order-2 h-full p-0 md:ml-10">
          {shouldShowPlaceholder ? (
            // Placeholder for broken image
            <div className="rounded-xl w-full h-[500px] lg:max-h-[320px]  bg-base-neutral-700 flex items-center justify-center mb-4 md:mb-0">
              <span className="text-text-secondary text-md"> {dictionary.components.coachBanner.placeHolderText} </span>
            </div>
          ) : (
            <ImageComponent
              src={imageUrl}
              alt="Banner image"
              className="rounded-xl w-full h-auto lg:max-h-[320px] md:h-auto object-cover mb-4 md:mb-0"
              onError={handleImageError}
              loading="lazy"
            />
          )}
        </div>
      </div>
    </div>
  );
};