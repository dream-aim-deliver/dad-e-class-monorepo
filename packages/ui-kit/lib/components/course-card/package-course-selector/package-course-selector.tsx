import { getDictionary, isLocalAware } from "@maany_shr/e-class-translations";
import { FC } from "react";
import { CheckBox } from "../../checkbox";
import { Button } from "../../button";
import { TCoursePricing } from "packages/models/src/course";
import Tooltip from "../../tooltip";

export interface PackageCourseSelectorProps extends isLocalAware {
    title: string;
    description: string;
    coachingIncluded: boolean;
    pricing: TCoursePricing;
    children: React.ReactNode;
    onClickCheckbox: () => void;
    onClickPurchase: () => void;
};

/**
 * PackageCourseSelector Component
 * 
 * This component renders a structured section for selecting and purchasing a course within a package.
 * It displays metadata like the course title, description, optional coaching inclusion, pricing, and a call-to-action button.
 * It can also render an array of `PackageCourseCard` components passed via `children`, representing selectable course cards.
 * 
 * @param title The title of the selected course package.
 * @param description A short description of the selected course.
 * @param coachingIncluded A boolean indicating whether coaching is included with the course.
 * @param pricing An object representing course pricing details, including full and partial price.
 * @param locale A locale string used for fetching dictionary translations.
 * @param onClickCheckbox Callback function triggered when the coaching checkbox is toggled.
 * @param onClickPurchase Callback function triggered when the "Purchase" button is clicked.
 * @param children (Optional) Array of `PackageCourseCard` components representing courses included in the package.
 * 
 * @example
 * <PackageCourseSelector
 *   title="Full Stack Development"
 *   description="Includes frontend, backend, and deployment modules."
 *   coachingIncluded={true}
 *   pricing={{ fullPrice: 999, partialPrice: 799, currency: 'INR' }}
 *   locale="en"
 *   onClickCheckbox={() => console.log('Coaching toggled')}
 *   onClickPurchase={() => console.log('Purchase initiated')}
 * >
 *   <PackageCourseCard {...course1Props} />
 *   <PackageCourseCard {...course2Props} />
 * </PackageCourseSelector>
 */

export const PackageCourseSelector: FC<PackageCourseSelectorProps> = ({
    title,
    description,
    coachingIncluded,
    pricing,
    children,
    onClickCheckbox,
    onClickPurchase,
    locale
}) => {
    const dictionary = getDictionary(locale);

    return (
        <div className="flex flex-col md:gap-20 gap-12 w-full">
            <div className="flex flex-col gap-10">
                <h2 className="text-text-primary text-3xl font-bold leading-[100%]">
                    {dictionary.components.courseCard.packageCourseSelectorTitle}
                </h2>
                <p className="text-text-primary text-md leading-[150%]">
                    {dictionary.components.courseCard.packageCourseSelectorDescription}
                </p>
            </div>
            <div className="flex flex-col gap-10">
                <div className="flex justify-between gap-10 md:flex-row flex-col">
                    <div className="flex flex-col gap-[5px] flex-1 min-w-0">
                        <h3 className="text-2xl font-bold text-text-primary">{title}</h3>
                        <p className="text-md leading-[150%] text-text-secondary">{description}</p>
                    </div>
                    <div className="flex flex-shrink-0 items-end">
                        <CheckBox
                            size="medium"
                            name="coachingIncluded"
                            value="coachingIncluded"
                            withText={true}
                            label={dictionary.components.courseCard.coachingIncluded}
                            checked={coachingIncluded}
                            onChange={onClickCheckbox}
                            labelClass="text-text-primary text-sm leading-[150%]"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {children}
                </div>

                {/*
                  * Pricing Display Section
                  *
                  * Shows pricing for selected courses with the following format:
                  * [Strikethrough fullPrice] → [Actual partialPrice] → [Save X] (info icon)
                  *
                  * Expected pricing props:
                  * - fullPrice: What you'd pay buying courses separately (scratched/strikethrough)
                  * - partialPrice: Discounted price after package discount (what user pays)
                  * - savings: Amount saved (fullPrice - partialPrice)
                  * - currency: Currency code (e.g., "EUR", "USD")
                  *
                  * See calculatePackageWithCoursesPricing() in package.tsx for calculation logic.
                  */}
                <div className="flex md:gap-10 gap-4 md:p-4 md:bg-card-fill md:border md:border-card-stroke border-none rounded-huge w-full md:flex-row flex-col items-center">
                    <Button
                        variant="primary"
                        size='big'
                        text={dictionary.components.courseCard.packageCourseSelectorButton}
                        onClick={onClickPurchase}
                        className="w-full"
                    />
                    <div className="flex items-center gap-2 flex-wrap">
                        {/* Strikethrough original price (what you'd pay buying separately) */}
                        {(pricing as any).fullPrice > (pricing as any).partialPrice && (
                            <span className="text-text-secondary line-through text-md whitespace-nowrap">
                                {(pricing as any).currency} {Math.round((pricing as any).fullPrice * 100) / 100}
                            </span>
                        )}
                        {/* Actual price user pays (discounted) */}
                        <h6 className="text-md font-bold text-text-primary leading-[120%] whitespace-nowrap">
                            {(pricing as any).currency} {Math.round((pricing as any).partialPrice * 100) / 100}
                        </h6>
                        {/* Savings amount with info tooltip */}
                        {(pricing as any).fullPrice > (pricing as any).partialPrice && (
                            <div className="flex items-center gap-1">
                                <p className="text-sm font-bold text-feedback-success-primary leading-[100%] whitespace-nowrap">
                                    {dictionary.components.courseCard.saveText} {(pricing as any).currency} {Math.round((pricing as any).savings * 100) / 100}
                                </p>
                                <Tooltip
                                    text=""
                                    description={getDictionary(locale).components.packages.savingsTooltip}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};