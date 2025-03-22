// components/GeneralCard.tsx
import React, { useRef, useState, useEffect } from "react";
import { Button } from "../button";
import { Badge } from "../badge";
import { getDictionary, isLocalAware } from "@maany_shr/e-class-translations";
import { homePage } from "@maany_shr/e-class-models";

interface GeneralCardProps extends homePage.TGeneralCard, isLocalAware {}

const GeneralCard: React.FC<GeneralCardProps> = ({
  imageUrl,
  title,
  description,
  badge,
  buttonText,
  buttonUrl,
  locale,
}) => {
  const [isImageError, setIsImageError] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const dictionary = getDictionary(locale);

  const handleImageError = () => {
    setIsImageError(true);
  };

  useEffect(() => {
    const checkTruncation = () => {
      if (titleRef.current) {
        const { scrollHeight, clientHeight } = titleRef.current;
        setIsTruncated(scrollHeight > clientHeight);
      }
    };

    checkTruncation();
    window.addEventListener("resize", checkTruncation);
    return () => window.removeEventListener("resize", checkTruncation);
  }, [title]);

  const shouldShowPlaceholder = !imageUrl || isImageError;

  const buttonCallback = () => {
    window.location.href = buttonUrl;
  };

  return (
    <article className="flex flex-col h-auto w-full max-w-[382px]">
      <div className="relative flex flex-col justify-start w-full h-auto rounded-lg border border-solid bg-card-fill border-card-stroke">
        {shouldShowPlaceholder ? (
          <div className="rounded-t-lg w-full h-[262px] lg:max-h-[262px] bg-base-neutral-700 flex items-center justify-center">
            <span className="text-text-secondary text-md">
              {dictionary.components.generalCard.placeHolderText}
            </span>
          </div>
        ) : (
          <div className="relative w-full rounded-t-medium overflow-hidden">
            <img
              loading="lazy"
              src={imageUrl}
              alt={title}
              onError={handleImageError}
              className="object-cover w-full max-h-[262px] rounded-t-medium border-buttom-0"
            />
          </div>
        )}

        {badge && (
          <div className="absolute top-4 right-4">
            <Badge variant="info" size="big" text={badge} />
          </div>
        )}

        <div className="flex flex-col p-4 w-full flex-grow gap-4">
          <header className="text-left">
            <div className="group relative">
              <h2
                ref={titleRef}
                className="text-xl sm:text-2xl font-bold leading-tight text-stone-50 line-clamp-2"
              >
                {title}
              </h2>
              {isTruncated && (
                <div className="absolute invisible group-hover:visible opacity-10 group-hover:opacity-100 transition-opacity duration-200 bg-card-stroke text-text-primary text-sm rounded py-2 px-3 -top-18 left-0 w-max max-w-xs z-10">
                  {title}
                  <div className="absolute top-full left-4 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-card-stroke" />
                </div>
              )}
            </div>
            <p className="text-sm sm:text-base leading-snug sm:leading-6 text-stone-300">{description}</p>
          </header>

          <Button
            className="w-full py-2 sm:py-3"
            size="medium"
            onClick={buttonCallback}
            text={buttonText}
            variant="primary"
          />
        </div>
      </div>
    </article>
  );
};

export default GeneralCard;