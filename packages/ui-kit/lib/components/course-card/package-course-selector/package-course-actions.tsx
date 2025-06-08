import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { Button } from '../../button';
import * as React from 'react';
import { TCoursePricing } from 'packages/models/src/course';

export interface PackageCourseActionsProps extends isLocalAware {
    pricing: TCoursePricing;
    courseIncluded: boolean;
    onClickDetails: () => void;
    onClickIncludeExclude: () => void;
};

/**
 * A component for rendering course action buttons based on the study progress of a course.
 *
 * @param pricing The pricing object containing the full price, partial price, and currency of the course.
 * @param courseIncluded A boolean indicating if the course is included in the package.
 * @param onClickDetails Callback function triggered when the "Details" button is clicked.
 * @param onClickIncludeExclude Callback function triggered when the "Include/Exclude" button is clicked.
 *
 * @example
 * <PackageCourseActions
 *   pricing={{ fullPrice: 100, partialPrice: 50, currency: 'USD' }}
 *   courseIncluded={true}
 *   onClickDetails={() => console.log("Details clicked!")}
 *   onClickIncludeExclude={() => console.log("Include/Exclude clicked!")}
 *   locale="en"
 * />
 */

export const PackageCourseActions: React.FC<PackageCourseActionsProps> = ({
    pricing,
    courseIncluded,
    onClickDetails,
    onClickIncludeExclude,
    locale
}) => {
    const dictionary = getDictionary(locale);
    const includeExcludeButtonText = courseIncluded
        ? dictionary.components.courseCard.excludeCourseButton
        : dictionary.components.courseCard.includeCourseButton;

    return (
        <div className='flex flex-col gap-2'>
            <div className='flex items-center justify-between'>
                <h6 className='text-md font-bold leading-[120%] text-text-primary'>
                    {pricing.currency} {pricing.partialPrice}
                </h6>
                <Button
                    variant='text'
                    size='medium'
                    onClick={onClickDetails}
                    text={dictionary.components.courseCard.detailsCourseButton}
                />
            </div>
            <Button
                variant={courseIncluded ? 'primary' : 'secondary'}
                size='medium'
                onClick={onClickIncludeExclude}
                text={includeExcludeButtonText}
                className='w-full'
            />
        </div>
    );
};
