import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import React, { useState } from 'react';

export interface CoachingOnDemandBannerProps extends isLocalAware {
  title: string;
  description: string;
  ImageUrls: string[];
}

/**
 * Props for the CoachingOnDemandBanner component.
 * @typedef {Object} CoachingOnDemandBannerProps
 * @property {string} title - The title of the banner.
 * @property {string} description - The description text for the banner.
 * @property {string[]} ImageUrls - An array of image URLs to be displayed in the banner.
 */

/**
 * A component that displays a banner for coaching on demand, including a title, description, and images.
 * @param {CoachingOnDemandBannerProps} props - The props for the component.
 * @returns {JSX.Element} The rendered CoachingOnDemandBanner component.
 */

export const CoachingOnDemandBanner: React.FC<CoachingOnDemandBannerProps> = ({
  title,
  description,
  ImageUrls,
  locale,
}) => {
  const [imageErrors, setImageErrors] = useState<boolean[]>(
    new Array(ImageUrls?.length).fill(false),
  );
  const dictionary = getDictionary(locale);

  const handleImageError = (index: number) => {
    setImageErrors((prev) => {
      const newErrors = [...prev];
      newErrors[index] = true;
      return newErrors;
    });
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col gap-4 w-full">
        <p className="text-2xl text-text-primary font-bold leading-[110%] break-words">
          {title}
        </p>
        <p className="text-md text-text-secondary leading-[150%] break-words">
          {description}
        </p>
      </div>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-2">
        {ImageUrls?.map((imageUrl, index) => (
          <div
            key={index}
            className="flex relative w-full overflow-hidden items-center"
          >
            {imageErrors[index] ? (
              <div className="rounded-medium w-full min-w-[18rem] min-h-[18rem] h-full bg-base-neutral-700 flex items-center justify-center">
                <span className="text-text-secondary text-md">
                  {dictionary.components.coachingOnDemandBanner.noImageText}
                </span>
              </div>
            ) : (
              <img
                src={imageUrl}
                alt={`Image ${index + 1}`}
                onError={() => handleImageError(index)}
                className="object-cover w-full h-auto rounded-medium"
                loading="lazy"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
