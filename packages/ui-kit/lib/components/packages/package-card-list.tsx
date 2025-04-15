import React from "react";
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';

export interface PackageCardListProps extends isLocalAware{
    children: React.ReactNode
}

/**
 * A container component that displays a list of package cards with a localized heading.
 * It wraps the children elements (typically PackageCard components) and provides consistent spacing and styling.
 *
 * @param children The package card components or any React nodes to be displayed within the list.
 * @param locale The locale for translation and localization purposes (e.g., "en" for English, "de" for German).
 *
 * @example
 * <PackageCardList locale="en">
 *   <PackageCard {...package1Props} />
 *   <PackageCard {...package2Props} />
 * </PackageCardList>
 *
 * @remarks
 * - The heading text is localized based on the provided `locale`.
 * - Children are displayed in a flexible, wrapped layout with gaps between items.
 */

export const PackageCardList: React.FC<PackageCardListProps> = ({ 
    children ,
    locale
}) => {
    const dictionary = getDictionary(locale);
    return (
        <div className="flex flex-col gap-[60px]">
            <p className="text-2xl text-text-primary font-bold leading-[110%]">
                {dictionary.components.packages.ourPackagesText}
            </p>
            <div className="flex gap-4 flex-wrap">
                {children}
            </div>
        </div>
    )
}
