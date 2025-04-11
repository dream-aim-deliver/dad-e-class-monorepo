import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import React, { useEffect, useState } from 'react';
import { homePage } from '@maany_shr/e-class-models';

export interface CoachingOnDemandBannerProps extends isLocalAware , homePage.TCoachingOnDemand{
}

/**
 * A component that displays a banner for coaching on demand, including a title, description, and responsive images.
 * @param {CoachingOnDemandBannerProps} props - The props for the component.
 * @returns {JSX.Element} The rendered CoachingOnDemandBanner component.
 */

export const CoachingOnDemandBanner: React.FC<CoachingOnDemandBannerProps> = ({
  title,
  description,
  desktopImageUrl,
  tabletImageUrl,
  mobileImageUrl,
  locale,
}) => {
  const [isImageError, setIsImageError] = React.useState(false);
  const [currentImageUrl, setCurrentImageUrl] = React.useState('');
  const dictionary = getDictionary(locale);

  useEffect(() => {
    const handleResize = () => {
      let newImageUrl = '';
      if (window.innerWidth >= 1024) {
        newImageUrl = desktopImageUrl;
      } else if (window.innerWidth >= 768) {
        newImageUrl = tabletImageUrl;
      } else {
        newImageUrl = mobileImageUrl;
      }
  
      setCurrentImageUrl(newImageUrl);
      setIsImageError(false); // Reset error state when switching image
    };
  
    handleResize(); // Set initial image URL
    window.addEventListener('resize', handleResize);
  
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [desktopImageUrl, tabletImageUrl, mobileImageUrl]);
  

  const handleImageError = () => {
    setIsImageError(true);
  };

  const shouldShowPlaceholder = !currentImageUrl || isImageError;

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
      <div className="flex gap-2 w-full">
      {shouldShowPlaceholder ? (
        <div className="rounded-medium w-full min-h-[18rem] h-full bg-base-neutral-700 flex items-center justify-center">
          <span className="text-text-secondary text-md">
            {dictionary.components.coachingOnDemandBanner.noImageText}
          </span>
        </div>
        ) : (
          <img
            src={currentImageUrl}
            alt='Image'
            onError={handleImageError}
            className="object-cover w-full h-auto rounded-medium"
            loading="lazy"
          />
        )}
      </div>
    </div>
  );
};
