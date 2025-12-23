'use client';
import React, { useState } from "react";
import { Button } from "../button";
import { Badge } from "../badge";
import { getDictionary, isLocalAware } from "@maany_shr/e-class-translations";
import { homePage } from "@maany_shr/e-class-models";
import { useImageComponent } from "../../contexts/image-component-context";

interface GeneralCardProps extends homePage.TGeneralCard, isLocalAware {
  onButtonClick: () => void;
}

/**
 * A card component for displaying general information, such as course or content details.
 * Includes an image, title, description, optional badge, and a button with a custom callback.
 *
 * @param imageUrl The URL of the card's image. Displays a placeholder if omitted or invalid.
 * @param title The title of the card content.
 * @param description A brief description of the card content.
 * @param badge Optional text for a badge displayed over the image (e.g., "New", "Featured").
 * @param buttonText The text displayed on the button.
 * @param buttonUrl The URL associated with the button (can be used in the callback).
 * @param locale The locale for translation and localization purposes (e.g., "en" for English, "de" for German).
 * @param onButtonClick Callback function to execute when the button is clicked.
 *
 * @example
 * <GeneralCard
 *   imageUrl="https://example.com/image.jpg"
 *   title="Digital Marketing Basics"
 *   description="Learn the essentials of digital marketing in this introductory course."
 *   badge="New"
 *   buttonText="Enroll Now"
 *   buttonUrl="/digital-marketing"
 *   locale="en"
 *   onButtonClick={() => router.push('/digital-marketing')}
 * />
 */
export const GeneralCard: React.FC<GeneralCardProps> = React.memo(
  ({
    imageUrl,
    title,
    description,
    badge,
    buttonText,
    locale,
    buttonUrl,
    onButtonClick,
  }) => {
    const ImageComponent = useImageComponent();
    const [isImageError, setIsImageError] = useState(false);
    const dictionary = getDictionary(locale);

    const handleImageError = () => {
      setIsImageError(true);
    };

    const shouldShowPlaceholder = !imageUrl || isImageError;

    return (
      <article className="flex flex-col w-full max-w-[382px]">
        <div className="relative flex flex-col justify-start w-full h-[540px] rounded-lg border border-solid bg-card-fill border-card-stroke">
          {/* Image Container with Fixed Height */}
          <div className="relative w-full h-[262px] rounded-t-medium overflow-hidden">
            {shouldShowPlaceholder ? (
              <div className="w-full h-full bg-base-neutral-700 flex items-center justify-center">
                <span className="text-text-secondary text-md">
                  {dictionary.components.generalCard.placeHolderText}
                </span>
              </div>
            ) : (
              <ImageComponent
                loading="lazy"
                src={imageUrl}
                alt={title || ""} // Use title for accessibility or empty for decorative
                width={350}
                height={262}
                onError={handleImageError}
                className="object-cover w-full h-full rounded-t-medium"
              />
            )}
          </div>

          {badge && (
            <div className="absolute top-4 right-4">
              <Badge variant="info" size="big" text={badge} />
            </div>
          )}

          <div className="flex flex-col p-4 w-full flex-grow gap-4 justify-between">
            <header className="text-left flex flex-col gap-2">
              <div className="group relative">
                <h2
                  title={title}
                  className="text-xl sm:text-2xl font-bold leading-tight text-stone-50 line-clamp-2"
                >
                  {title}
                </h2>
              </div>
              <p className="text-sm sm:text-base leading-snug sm:leading-6 text-stone-300 line-clamp-6">{description}</p>
            </header>

            <Button
              className="w-full py-2 sm:py-3"
              size="medium"
              onClick={onButtonClick}
              text={buttonText}
              variant="primary"
            />
          </div>
        </div>
      </article>
    );
  }
);
