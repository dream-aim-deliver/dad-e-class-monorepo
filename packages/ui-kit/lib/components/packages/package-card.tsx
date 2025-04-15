import { useEffect, useRef, useState } from "react";
import { Badge } from "../badge";
import { Button } from "../button";
import { IconClock } from "../icons/icon-clock";
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { TEClassPackage } from "packages/models/src/eclass-package";

export interface PackageCardProps extends TEClassPackage , isLocalAware {
    courseCount: number;
    onClickPurchase?: () => void;
    onClickDetails?: () => void;
};

/**
 * A card component for displaying package details, such as title, description, duration, course count, and pricing information.
 * Includes an image, badges, and buttons for user actions like purchasing or viewing more details.
 *
 * @param imageUrl The URL of the package image. Displays a placeholder if omitted or invalid.
 * @param title The title of the package content.
 * @param description A brief description of the package content.
 * @param duration The duration of the package in minutes. Automatically formatted to "hours and minutes" if greater than 59 minutes.
 * @param courseCount The number of courses included in the package.
 * @param pricing An object representing pricing details for the package.
 * @param pricing.currency The currency used for pricing (e.g., "USD", "EUR").
 * @param pricing.fullPrice The full price of the package before discounts.
 * @param pricing.partialPrice The discounted price of the package.
 * @param locale The locale for translation and localization purposes (e.g., "en" for English, "de" for German).
 * @param onClickPurchase An optional callback function to handle the "Purchase Packages" button click.
 * @param onClickDetails An optional callback function to handle the "Details" button click.
 *
 * @example
 * <PackageCard
 *   imageUrl="https://example.com/image.jpg"
 *   title="Advanced Web Development"
 *   description="Master web development with this comprehensive course package."
 *   duration={120}
 *   courseCount={5}
 *   pricing={{ currency: 'USD', fullPrice: 299, partialPrice: 249 }}
 *   locale="en"
 *   onClickPurchase={() => console.log('Purchase button clicked')}
 *   onClickDetails={() => console.log('Details button clicked')}
 * />
 *
 * @remarks
 * - If `imageUrl` is invalid or omitted, a placeholder image will be displayed.
 * - The `duration` is automatically formatted to "hours and minutes" using a helper function.
 * - Conditional rendering ensures that missing or invalid props do not break the component's layout.
 */

export const PackageCard = ({
    imageUrl,
    title,
    description ,
    duration,
    courseCount ,
    pricing ,
    locale ,
    onClickPurchase ,
    onClickDetails 
}: PackageCardProps) => {
    const dictionary = getDictionary(locale);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const [isTruncated, setIsTruncated] = useState(false);
    const [isImageError, setIsImageError] = useState(false);

    // Helper function to format duration in hours and minutes
    const formatDuration = (duration?: number): string => {
        if (!duration || duration <= 0) return;
        if (duration > 59) {
          const hours = Math.floor(duration / 60);
          const minutes = duration % 60;
          return `${hours}h ${minutes}m`;
        }
        return `${duration}m`;
    };
    

    // Handle image error and set error state
    const handleImageError = () => {
        setIsImageError(true);
    };

    const shouldShowPlaceholder = !imageUrl || isImageError;

    // Check for truncation of title on resize 
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
    return (
        <div className="flex flex-col bg-card-fill border-2 border-card-stroke rounded-medium max-w-[385px] w-auto">
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
                        className="object-cover w-full max-h-[262px] rounded-t-medium border-bottom-0"
                    />
                </div>
            )}
            <div className="flex flex-col gap-4 p-6">
                <div className="flex flex-col gap-4">
                    <div className="group relative">
                        <h4 
                            ref={titleRef}
                            className="text-text-primary text-xl lg:text-3xl font-bold leading-[120%] line-clamp-2"
                        >
                            {title}
                        </h4>
                        {isTruncated && (
                            <div className="absolute invisible group-hover:visible opacity-10 group-hover:opacity-100 transition-opacity duration-200 bg-card-stroke text-text-primary text-sm rounded py-2 px-3 -top-18 left-0 w-max max-w-[14rem] z-10">
                                {title}
                                <div className="absolute top-full left-4 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-card-stroke" />
                            </div>
                        )}
                    </div>
                    <div className="flex gap-2">
                        {duration > 0 &&
                            <Badge
                                hasIconLeft
                                iconLeft={<IconClock size='5'/>}
                                key={duration}
                                text={formatDuration(duration)}
                                className="h-6 py-1 text-base max-w-full"
                            />
                        }
                        {courseCount > 0 && 
                            <Badge
                                key={courseCount}
                                text={courseCount + ' ' + dictionary.components.packages.coursesText}
                                className="h-6 py-1 text-base max-w-full"
                            />
                        }
                    </div>
                </div>
                <p className="text-text-secondary text-md lg:text-xl leading-[150%]">
                    {description}
                </p>
                <div className="flex flex-col pt-4 gap-4">
                    <div className="flex flex-wrap gap-4">
                        <Button variant='primary' size="big" text={dictionary.components.packages.purchasePackageText} onClick={onClickPurchase}/>
                        <Button variant='secondary' size="big" text={dictionary.components.packages.detailsText}  onClick={onClickDetails}/>
                        <div className="flex gap-2 items-center">
                            <p className="text-text-primary lg:text-xl text-md font-bold leading-[120%]">
                                {pricing.currency} {pricing.fullPrice}
                            </p>
                            <p className="text-feedback-success-primary lg:text-md text-sm font-bold">
                                {dictionary.components.packages.saveText} {pricing.currency} {pricing.partialPrice}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};