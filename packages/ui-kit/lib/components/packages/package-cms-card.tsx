'use client';

import { useEffect, useRef, useState } from 'react';
import { Badge } from '../badge';
import { Button } from '../button';
import { IconClock } from '../icons/icon-clock';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { eClassPackage } from '@maany_shr/e-class-models';
import { IconEdit, IconTrashAlt } from '../icons';
import { useImageComponent } from '../../contexts/image-component-context';

interface PackageCmsBaseCardProps extends eClassPackage.TEClassPackage, isLocalAware {
    courseCount: number;
    onClickEdit: () => void;
}

export interface PackageCmsPublishedCardProps extends PackageCmsBaseCardProps {
    onClickArchive: () => void;
    status: 'published';
}

export interface PackageCmsArchivedCardProps extends PackageCmsBaseCardProps {
    onClickPublished: () => void;
    status: 'archived';
}

export type PackageCmsCardProps =
    | PackageCmsPublishedCardProps
    | PackageCmsArchivedCardProps;

/**
 * A CMS card component for displaying e-class package information in either **published** or **archived** state.
 *
 * The component adjusts its available actions and visual indicators based on the `status` prop.
 * It shows package details (title, description, duration, course count, pricing) and provides contextual CMS controls.
 *
 * ## Features
 * - Locale-aware (text pulled from `@maany_shr/e-class-translations`)
 * - Shows image or placeholder if missing/failed to load
 * - Duration formatting in hours and minutes (if > 59 minutes)
 * - Title truncates after two lines with tooltip on hover
 * - Displays pricing with “save” message
 * - Contextual buttons:
 *   - **Published:** Archive + Edit
 *   - **Archived:** Publish + Edit + "Archived" badge
 *
 * ## Common Props
 * Inherited from:
 * - `eClassPackage.TEClassPackage` — e-class package details (`imageUrl`, `title`, `description`, `duration`, `pricing`)
 * - `isLocalAware` — locale for translations (`locale`)
 *
 * Additional:
 * @prop {number} courseCount — Number of courses in the package (badge shown if > 0)
 * @prop {() => void} onClickEdit — Called when the "Edit" button is clicked
 *
 * ## Published Variant (`status: 'published'`)
 * @prop {'published'} status — Marks the package as published
 * @prop {() => void} onClickArchive — Called when the "Archive" button is clicked
 *
 * ## Archived Variant (`status: 'archived'`)
 * @prop {'archived'} status — Marks the package as archived
 * @prop {() => void} onClickPublished — Called when the "Publish" button is clicked
 *
 * ## Examples
 *
 * ```tsx
 * // Published card
 * <PackageCmsCard
 *   status="published"
 *   title="React for Beginners"
 *   description="Learn React.js from scratch with hands-on projects."
 *   duration={90}
 *   courseCount={5}
 *   imageUrl="https://example.com/react.jpg"
 *   pricing={{ currency: '$', fullPrice: 199, partialPrice: 99 }}
 *   locale="en"
 *   onClickEdit={() => console.log('Edit clicked')}
 *   onClickArchive={() => console.log('Archive clicked')}
 * />
 *
 * // Archived card
 * <PackageCmsCard
 *   status="archived"
 *   title="Advanced TypeScript"
 *   description="Deep dive into TypeScript for large-scale applications."
 *   duration={120}
 *   courseCount={8}
 *   imageUrl="https://example.com/typescript.jpg"
 *   pricing={{ currency: '€', fullPrice: 249, partialPrice: 149 }}
 *   locale="de"
 *   onClickEdit={() => console.log('Edit clicked')}
 *   onClickPublished={() => console.log('Publish clicked')}
 * />
 * ```
 */

export const PackageCmsCard = (props: PackageCmsCardProps) => {
    const {
        imageUrl,
        title,
        onClickEdit,
        description,
        duration,
        courseCount,
        pricing,
        locale,
    } = props;
    const dictionary = getDictionary(locale).components.packages;
    const [isImageError, setIsImageError] = useState(false);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const [isTruncated, setIsTruncated] = useState(false);
    const ImageComponent = useImageComponent();

    // Helper function to format duration in hours and minutes
    const formatDuration = (duration: number | undefined): string => {
        if (!duration || duration <= 0) return '0m';
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
        window.addEventListener('resize', checkTruncation);
        return () => window.removeEventListener('resize', checkTruncation);
    }, [title]);

    return (
        <div className="flex flex-col gap-2 rounded-medium border border-card-stroke bg-card-fill w-full lg:max-w-[22rem]">
            {/* Image Section */}
            {shouldShowPlaceholder ? (
                <div className="rounded-t-lg w-full h-[12rem] bg-base-neutral-700 flex items-center justify-center">
                    <span className="text-text-secondary text-md">
                        {dictionary.placeHolderText}
                    </span>
                </div>
            ) : (
                <div className="relative w-full rounded-t-medium overflow-hidden">
                    <ImageComponent
                        loading="lazy"
                        src={imageUrl}
                        alt={title}
                        width={400}
                        height={192}
                        onError={handleImageError}
                        className="object-cover w-full h-[12rem] rounded-t-medium "
                    />
                </div>
            )}

            <div className="flex flex-col gap-4 p-6">
                <div className="flex flex-col gap-4">
                    {/* Badge for Archived Card */}
                    {props.status === 'archived' && (
                        <Badge
                            text={dictionary.archivedBadge}
                            variant="errorprimary"
                            className="w-fit h-6"
                            size="big"
                        />
                    )}

                    {/* Title */}
                    <div className="group relative">
                        <h4
                            className="text-text-primary lg:text-2xl line-clamp-2"
                            ref={titleRef}
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

                    {/* Duration & Courses Badges */}
                    <div className="flex flex-row gap-2">
                        {typeof duration === 'number' && (
                            <Badge
                                hasIconLeft
                                iconLeft={<IconClock size="4" />}
                                key={duration}
                                text={formatDuration(duration)}
                                className="h-6"
                                size="big"
                            />
                        )}
                        {courseCount > 0 && (
                            <Badge
                                key={courseCount}
                                text={
                                    courseCount + ' ' + dictionary.coursesText
                                }
                                className="h-6"
                                size="big"
                            />
                        )}
                    </div>
                </div>

                {/* Description */}
                <p className="text-text-secondary lg:text-lg">{description}</p>

                {/* Prices */}
                {pricing && (
                    <div className="flex flex-col gap-1">
                        <div className="flex gap-2 items-center">
                            <h6 className="text-text-primary lg:text-lg">
                                {pricing.currency} {pricing.fullPrice}
                            </h6>
                            <p className="text-feedback-success-primary lg:text-md text-sm font-important">
                                {dictionary.saveText} {pricing.currency}{' '}
                                {pricing.partialPrice}
                            </p>
                        </div>
                        <p className="italic text-text-secondary text-sm">incl. coachings</p>
                    </div>
                )}

                {/* Buttons */}
                <div className="flex flex-col md:flex-row flex-wrap w-full justify-center gap-3 md:gap-4">
                    {props.status === 'archived' && (
                        <Button
                            variant="secondary"
                            size="big"
                            text={dictionary.publishButton}
                            onClick={props.onClickPublished}
                            className="text-md lg:text-lg w-full md:flex-1"
                        />
                    )}

                    {props.status === 'published' && (
                        <Button
                            variant="secondary"
                            size="big"
                            hasIconLeft
                            iconLeft={<IconTrashAlt size="5" />}
                            text={dictionary.archiveButton}
                            onClick={props.onClickArchive}
                            className="text-md lg:text-lg w-full md:flex-1"
                        />
                    )}

                    <Button
                        variant="primary"
                        size="big"
                        text={dictionary.editButton}
                        onClick={onClickEdit}
                        hasIconLeft
                        iconLeft={<IconEdit size="5" />}
                        className="text-md lg:text-lg w-full md:flex-1"
                    />
                </div>
            </div>
        </div>
    );
};
