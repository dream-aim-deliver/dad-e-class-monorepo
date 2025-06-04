import React from 'react';

export interface CoachingOnDemandBannerProps {
    title: string;
    description: string;
    images: React.ReactNode;
}

/**
 * A component that displays a banner for coaching on demand, including a title, description, and responsive images.
 * @param {CoachingOnDemandBannerProps} props - The props for the component.
 * @returns {JSX.Element} The rendered CoachingOnDemandBanner component.
 */

export const CoachingOnDemandBanner: React.FC<CoachingOnDemandBannerProps> = ({
  title,
  description,
  images
}) => {
  return (
    <div className="flex flex-col gap-4 w-full py-24">
      <div className="flex flex-col gap-4 w-full">
        <p className="text-2xl text-text-primary font-bold leading-[110%] break-words">
          {title}
        </p>
        <p className="text-md text-text-secondary leading-[150%] break-words">
          {description}
        </p>
      </div>
      <div className="-mr-4">
        {images}
      </div>
    </div>
  );
};
