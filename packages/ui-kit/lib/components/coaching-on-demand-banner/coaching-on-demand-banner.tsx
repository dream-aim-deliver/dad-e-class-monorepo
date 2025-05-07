import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import React, { useEffect, useState, useRef } from 'react';
import { homePage } from '@maany_shr/e-class-models';
import { IconLoaderSpinner } from '../icons/icon-loader-spinner';

export interface CoachingOnDemandBannerProps extends isLocalAware, homePage.TCoachingOnDemand {
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
  const [imageState, setImageState] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [currentImageUrl, setCurrentImageUrl] = useState<string>('');
  const [isValidUrl, setIsValidUrl] = useState<boolean>(true);
  const dictionary = getDictionary(locale);
  const imageRef = useRef<HTMLImageElement | null>(null);

  // Check if URL is empty or invalid
  const validateImageUrl = (url: string) => {
    return url && url.trim() !== '';
  };

  // Handle responsive image selection based on screen size
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

      const isValid = validateImageUrl(newImageUrl);
      setIsValidUrl(isValid);

      // Reset image state when URL changes
      if (newImageUrl !== currentImageUrl) {
        setCurrentImageUrl(newImageUrl);
        setImageState(isValid ? 'loading' : 'error');
      }
    };

    handleResize(); // Set initial image URL
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [desktopImageUrl, tabletImageUrl, mobileImageUrl, currentImageUrl]);

  // Handle pre-loaded or cached images
  useEffect(() => {
    if (!isValidUrl) {
      setImageState('error');
      return;
    }

    // Check if image is already loaded (cached)
    if (imageRef.current?.complete) {
      // If complete but had an error, set to error state
      if (imageRef.current.naturalWidth === 0) {
        setImageState('error');
      } else {
        setImageState('loaded');
      }
      return;
    }

    // Set a fallback timeout to handle hanging image requests
    const timeout = setTimeout(() => {
      if (imageState === 'loading') {
        setImageState('error');
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, [currentImageUrl, imageState, isValidUrl]);

  const handleImageError = () => {
    setImageState('error');
  };

  const handleImageLoad = () => {
    setImageState('loaded');
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
      <div className="flex gap-2 w-full relative min-h-[18rem]">
        {/* Loader card - always rendered with fixed dimensions */}
        {(isValidUrl && imageState === 'loading') && (
          <div
            className="rounded-medium w-full h-[18rem] bg-base-neutral-700 flex items-center justify-center absolute inset-0"
            data-testid="loader"
          >
            <IconLoaderSpinner classNames="animate-spin text-text-secondary" />
          </div>
        )}

        {/* Image element - only render if we have a valid URL */}
        {isValidUrl && currentImageUrl && (
          <img
            ref={imageRef}
            src={currentImageUrl}
            alt="Coaching on Demand"
            onError={handleImageError}
            onLoad={handleImageLoad}
            className={`object-cover w-full h-full rounded-medium transition-opacity duration-300 ${imageState === 'loaded' ? 'opacity-100' : 'opacity-0'
              }`}
            loading="lazy"
          />
        )}

        {/* Error placeholder - show when URL is invalid or image failed to load */}
        {imageState === 'error' && (
          <div className="absolute inset-0 rounded-medium w-full h-[18rem] bg-base-neutral-700 flex items-center justify-center">
            <span className="text-text-secondary text-md">
              {dictionary.components.coachingOnDemandBanner.noImageText}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
