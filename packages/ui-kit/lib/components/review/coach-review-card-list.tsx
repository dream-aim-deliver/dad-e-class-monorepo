import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { FC } from 'react';

export interface CoachReviewCardListProps extends isLocalAware {
    children?: React.ReactNode;
}

/**
 * `CoachReviewCardList` is a layout wrapper for displaying one or more `YourStudentCard` components in a responsive grid.
 *
 * It handles localization for the empty state message and gracefully displays a placeholder when no children are provided.
 *
 * ### Props
 * @param {CoachReviewCardListProps} props - The props for `CoachReviewCardList`.
 * @param {React.ReactNode} [props.children] - One or more `CoachReviewCard` components or any valid React nodes to render in the grid.
 * @param {string} props.locale - The locale string used for translation (from `isLocalAware`).
 *
 * ### Behavior
 * - If `children` is `null`, `undefined`, or an empty array, it renders a card-styled empty state with a localized message.
 * - Otherwise, renders children in a responsive grid (1 column on small screens, 2 on medium, 3 on extra-large).
 * - Each child is wrapped in a `<div>` with `role="listitem"` for accessibility.
 *
 * @returns {JSX.Element} A list container for `CoachReviewCard` components or an empty state message.
 */

export const CoachReviewCardList: FC<CoachReviewCardListProps> = ({
    children,
    locale,
}) => {
    const dictionary = getDictionary(locale).components.coachReview;

    const isEmpty =
        !children || (Array.isArray(children) && children.length === 0);

    if (isEmpty) {
        return (
            <div className="flex flex-col md:p-5 p-3 gap-2 rounded-medium border border-card-stroke bg-card-fill w-full">
                <p className="text-text-primary text-md">
                    {dictionary.emptyState}
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col justify-center items-center w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 w-full">
                {Array.isArray(children) ? (
                    children.map((child, index) => (
                        <div
                            key={child?.key ?? `coach-review-card-${index}`}
                            role="listitem"
                        >
                            {child}
                        </div>
                    ))
                ) : (
                    <div key="coach-review-single-card" role="listitem">
                        {children}
                    </div>
                )}
            </div>
        </div>
    );
}
