import React from 'react';
import { isLocalAware } from '@maany_shr/e-class-translations';

export interface PackageCardListProps extends isLocalAware {
    children: React.ReactNode;
}

/**
 * `PackageCardList` is a layout component for displaying a list of package cards
 * in a responsive grid. It handles responsive visibility for certain cards and
 * ensures proper accessibility roles (`list` and `listitem`) for screen readers.
 *
 * Features:
 * - Renders children in a grid layout (1 column on small screens, up to 3 columns on large screens).
 * - Automatically hides the 3rd card on small/medium screens and shows it on large screens.
 * - Supports localization via the `locale` prop inherited from `isLocalAware`.
 *
 * Props:
 * @param {React.ReactNode} children - The package cards or elements to display.
 * @param {string} [locale] - Optional locale string to support localized content.
 *
 * Example usage:
 * ```tsx
 * <PackageCardList locale="en">
 *   <PackageCard title="Basic Plan" price="$10" />
 *   <PackageCard title="Pro Plan" price="$20" />
 *   <PackageCard title="Enterprise Plan" price="$50" />
 * </PackageCardList>
 * ```
 *
 * Notes:
 * - Each child should have a unique `key` prop for optimal React performance.
 * - The component automatically converts children into an array to manage layout logic.
 */

export const PackageCardList: React.FC<PackageCardListProps> = ({
    children,
    locale,
}) => {
    const childrenArray = React.Children.toArray(children);
    return (
        <div className="flex flex-col gap-4 justify-center items-center">
            <div
                className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
                role="list"
            >
                {childrenArray.map((child, index) => (
                    <div
                        key={(child as any)?.key ?? `package-card-${index}`}
                        role="listitem"
                        className={
                            index === 2
                                ? 'hidden lg:block' // Hide 3rd card on small/medium, show on large
                                : ''
                        }
                    >
                        {child}
                    </div>
                ))}
            </div>
        </div>
    );
};
