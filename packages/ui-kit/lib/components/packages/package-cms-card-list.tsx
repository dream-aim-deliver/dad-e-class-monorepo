'use client';

import React, { ReactNode } from 'react';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { CheckBox } from '../checkbox';
import { Button } from '../button';
import { IconPlus } from '../icons';

export interface PackageCmsCardListProps extends isLocalAware {
    children?: ReactNode;
    packageCount: number;
    showArchived: boolean;
    onClickCheckbox: () => void;
    onCreatePackage: () => void;
}

/**
 * PackageCmsCardList Component
 *
 * A container component for rendering a list of `PackageCmsCard` elements with built-in filtering,
 * empty state handling, and UI controls for showing archived packages and creating new ones.
 *
 * Features:
 * ----------
 * - Renders a title with the total package count
 * - Displays a checkbox to toggle showing archived packages
 * - Displays a "Create Package" button
 * - Filters children based on the `showArchived` prop and their `status` prop
 * - Shows an empty state message when no packages match the filter
 *
 * Props:
 * ----------
 * Common (from `isLocalAware`):
 * - `locale` (string) — Language/locale for translations
 *
 * Component-specific:
 * - `children` (ReactNode) — List of package cards (`PackageCmsCard`) to display
 * - `packageCount` (number) — Total number of packages (displayed in the heading)
 * - `showArchived` (boolean) — Whether archived packages are included in the list
 * - `onClickCheckbox` (() => void) — Callback when the "Show Archived" checkbox is toggled
 * - `onCreatePackage` (() => void) — Callback when the "Create Package" button is clicked
 *
 * Filtering Logic:
 * ----------
 * - If `showArchived` is false → only shows children with `status="published"`
 * - If `showArchived` is true → shows children with `status="published"` or `status="archived"`
 *
 * Usage Example:
 * --------------
 * ```tsx
 * import { PackageCmsCardList } from './package-cms-card-list';
 * import { PackageCmsCard } from './package-cms-card';
 *
 * function PackageListExample() {
 *   const [showArchived, setShowArchived] = useState(false);
 *
 *   return (
 *     <PackageCmsCardList
 *       locale="en"
 *       packageCount={2}
 *       showArchived={showArchived}
 *       onClickCheckbox={() => setShowArchived((prev) => !prev)}
 *       onCreatePackage={() => console.log('Create Package clicked')}
 *     >
 *       <PackageCmsCard
 *         status="published"
 *         title="React for Beginners"
 *         description="Learn React.js from scratch."
 *         duration={90}
 *         courseCount={5}
 *         imageUrl="https://example.com/react.jpg"
 *         pricing={{ currency: '$', fullPrice: 199, partialPrice: 99 }}
 *         locale="en"
 *         onClickEdit={() => console.log('Edit clicked')}
 *         onClickArchive={() => console.log('Archive clicked')}
 *       />
 *
 *       <PackageCmsCard
 *         status="archived"
 *         title="Advanced TypeScript"
 *         description="Deep dive into TypeScript."
 *         duration={120}
 *         courseCount={8}
 *         imageUrl="https://example.com/typescript.jpg"
 *         pricing={{ currency: '€', fullPrice: 249, partialPrice: 149 }}
 *         locale="en"
 *         onClickEdit={() => console.log('Edit clicked')}
 *         onClickPublished={() => console.log('Publish clicked')}
 *       />
 *     </PackageCmsCardList>
 *   );
 * }
 * ```
 */

export function PackageCmsCardList({
    children,
    locale,
    packageCount,
    showArchived,
    onClickCheckbox,
    onCreatePackage,
}: PackageCmsCardListProps) {
    const dictionary = getDictionary(locale).components.packages;

    // Convert children to a safe array for processing
    const childrenArray = React.Children.toArray(children);

    // Filter cards based on showArchived and their status prop
    const filteredChildren = childrenArray.filter((child) => {
        if (!React.isValidElement(child)) return false;

        const element = child as React.ReactElement<{ status?: string }>;
        const status = element.props.status;

        if (!showArchived) {
            // Show only published packages when checkbox is NOT checked
            return status === 'published';
        }

        // When checkbox is checked, show all cards regardless of status
        return true;
    });

    const isEmpty = filteredChildren.length === 0;

    if (isEmpty) {
        return (
            <div className="flex flex-col gap-8 p-4">
                {/* Title, Checkbox & CreatePackageButton - shown even when empty */}
                <div className="flex flex-row items-center gap-4 justify-between">
                    <h1 className="text-text-primary text-3xl md:text-4xl">
                        {dictionary.allPackagesText} ({packageCount})
                    </h1>
                    <div className="flex flex-row gap-5">
                        <CheckBox
                            size="medium"
                            name="showArchived"
                            value="showArchived"
                            withText={true}
                            label={dictionary.showArchivedText}
                            checked={showArchived}
                            onChange={onClickCheckbox}
                            labelClass="text-text-primary"
                        />

                        <Button
                            variant="primary"
                            size="medium"
                            hasIconLeft
                            iconLeft={<IconPlus />}
                            onClick={onCreatePackage}
                            text={dictionary.createPackageButton}
                        />
                    </div>
                </div>

                {/* Empty state message */}
                <div className="flex flex-col md:p-5 p-3 gap-2 rounded-medium border border-card-stroke bg-card-fill w-full lg:min-w-[22rem]">
                    <p className="text-text-primary text-md">
                        {dictionary.emptyState}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 p-4">
            {/* Title, Checkbox & CreatePackageButton */}
            <div className="flex flex-row items-center gap-4 justify-between">
                <h1 className="text-text-primary text-3xl md:text-4xl">
                    {dictionary.allPackagesText} ({packageCount})
                </h1>
                <div className="flex flex-row gap-5">
                    <CheckBox
                        size="medium"
                        name="showArchived"
                        value="showArchived"
                        withText={true}
                        label={dictionary.showArchivedText}
                        checked={showArchived}
                        onChange={onClickCheckbox}
                        labelClass="text-text-primary"
                    />

                    <Button
                        variant="primary"
                        size="medium"
                        hasIconLeft
                        iconLeft={<IconPlus />}
                        onClick={onCreatePackage}
                        text={dictionary.createPackageButton}
                    />
                </div>
            </div>

            {/* List of cards */}
            <div className="flex flex-col gap-4 justify-center items-center">
                <div
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3"
                    role="list"
                >
                    {filteredChildren.map((child, index) => {
                        if (React.isValidElement(child)) {
                            return (
                                <div
                                    key={
                                        child.key ?? `package-cms-card-${index}`
                                    }
                                    role="listitem"
                                >
                                    {child}
                                </div>
                            );
                        }
                        // Fallback in case the child is not a valid React element
                        return (
                            <div
                                key={`package-cms-card-${index}`}
                                role="listitem"
                            >
                                {child}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
