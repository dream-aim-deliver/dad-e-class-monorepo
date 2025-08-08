import { useState } from 'react';
import { Badge } from '../badge';
import { Button } from '../button';
import { IconClock } from '../icons/icon-clock';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { TEClassPackage } from 'packages/models/src/eclass-package';
import { IconEdit, IconTrashAlt } from '../icons';

interface PackageCmsBaseCardProps extends TEClassPackage, isLocalAware {
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
 * PackageCmsCard Component
 *
 * A reusable CMS card for displaying either a **published** or **archived** e-class package.
 * This component adapts its appearance and available actions based on the `status` prop.
 *
 * Features:
 * - Displays package image (or a placeholder if missing or failed to load)
 * - Shows package title, description, duration, and course count
 * - Displays pricing with a "save" message
 * - Includes contextual action buttons:
 *   - **Published**: Archive + Edit
 *   - **Archived**: Publish + Edit
 * - Locale-aware (text is retrieved from `@maany_shr/e-class-translations`)
 *
 * Props:
 * ----------
 * Common props (from `TEClassPackage` and `isLocalAware`):
 * - `imageUrl` (string) — URL to the package image
 * - `title` (string) — Package title
 * - `description` (string) — Short description text
 * - `duration` (number) — Duration in minutes (formatted to h/m)
 * - `pricing` ({ currency: string; fullPrice: number; partialPrice: number }) — Price info
 * - `locale` (string) — Language/locale for translations
 * - `courseCount` (number) — Number of courses in the package
 * - `onClickEdit` (() => void) — Callback when the edit button is clicked
 *
 * Published-specific:
 * - `status`: 'published'
 * - `onClickArchive` (() => void) — Callback when the archive button is clicked
 *
 * Archived-specific:
 * - `status`: 'archived'
 * - `onClickPublished` (() => void) — Callback when the publish button is clicked
 *
 * Usage Example:
 * --------------
 * ```tsx
 * import { PackageCmsCard } from './package-cms-card';
 *
 * // Example: Published package card
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
 * // Example: Archived package card
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

    // Helper function to format duration in hours and minutes
    const formatDuration = (duration?: number): string => {
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
                    <img
                        loading="lazy"
                        src={imageUrl}
                        alt={title}
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
                    <h4 className="text-text-primary">{title}</h4>

                    {/* Duration & Courses Badges */}
                    <div className="flex flex-row gap-2">
                        {duration > 0 && (
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
                <p className="text-text-secondary">{description}</p>

                {/* Prices */}
                <div className="flex gap-2 items-center">
                    <h6 className="text-text-primary">
                        {pricing.currency} {pricing.fullPrice}
                    </h6>
                    <p className="text-feedback-success-primary font-important">
                        {dictionary.saveText} {pricing.currency}{' '}
                        {pricing.partialPrice}
                    </p>
                </div>

                {/* Buttons */}
                <div className="flex flex-row w-full justify-center gap-4">
                    {props.status === 'archived' && (
                        <Button
                            variant="secondary"
                            size="big"
                            text={dictionary.publishButton}
                            onClick={props.onClickPublished}
                            className="text-md lg:text-lg w-full"
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
                            className="text-md lg:text-lg w-full"
                        />
                    )}

                    <Button
                        variant="primary"
                        size="big"
                        text={dictionary.editButton}
                        onClick={onClickEdit}
                        hasIconLeft
                        iconLeft={<IconEdit size="5" />}
                        className="text-md lg:text-lg w-full"
                    />
                </div>
            </div>
        </div>
    );
};
