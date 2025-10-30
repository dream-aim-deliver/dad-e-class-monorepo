import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';

/**
 * Props for the AssignmentOverviewList component.
 */
export interface AssignmentOverviewListProps extends isLocalAware {
    children?: React.ReactNode;
}

/**
 * Renders a responsive grid layout for displaying multiple assignment overview cards.
 * 
 * This component serves as a container for assignment overview items, providing:
 *   - Responsive grid layout that adapts to screen size:
 *     * 1 column on mobile (default)
 *     * 2 columns on medium screens (md breakpoint)
 *     * 3 columns on extra large screens (xl breakpoint)
 *   - Empty state display when no assignments are present
 *   - Proper accessibility with ARIA roles (list/listitem)
 *   - Consistent spacing and styling across all items
 * 
 * The component intelligently handles both single child and array of children,
 * wrapping each item in a list item container with proper key management.
 * 
 * When empty (no children or empty array), displays a card with an empty state message
 * instead of the grid layout.
 * 
 * This is a presentational layout component with no internal state.
 * It relies on composition pattern, accepting assignment cards as children.
 * 
 * @param children React nodes to render in the grid, typically AssignmentOverview components
 * @param locale Locale string for i18n/localization (used for empty state message)
 * 
 * @example
 * // With multiple assignment cards
 * <AssignmentOverviewList locale="en">
 *   <AssignmentOverview key="1" {...assignment1Props} />
 *   <AssignmentOverview key="2" {...assignment2Props} />
 *   <AssignmentOverview key="3" {...assignment3Props} />
 * </AssignmentOverviewList>
 * 
 * @example
 * // With single assignment card
 * <AssignmentOverviewList locale="en">
 *   <AssignmentOverview {...assignmentProps} />
 * </AssignmentOverviewList>
 * 
 * @example
 * // Empty state
 * <AssignmentOverviewList locale="en">
 *   {[]}
 * </AssignmentOverviewList>
 * 
 * @example
 * // Dynamic rendering with mapped data
 * <AssignmentOverviewList locale="en">
 *   {assignments.map((assignment) => (
 *     <AssignmentOverview
 *       key={assignment.id}
 *       {...assignment}
 *       onClickView={() => navigate(`/assignments/${assignment.id}`)}
 *     />
 *   ))}
 * </AssignmentOverviewList>
 */

export function AssignmentOverviewList({ children, locale }: AssignmentOverviewListProps) {
    const dictionary = getDictionary(locale).components.assignmentOverviewList;

    const isEmpty =
        !children || (Array.isArray(children) && children.length === 0);

    if (isEmpty) {
        return (
            <div className="flex flex-col md:p-5 p-3 gap-2 rounded-medium border border-card-stroke bg-card-fill w-full lg:min-w-[22rem]">
                <p className="text-text-primary text-md">
                    {dictionary.emptyState}
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 justify-center items-center w-full">
            <div
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 w-full"
                role="list"
            >
                {Array.isArray(children) ? (
                    children.map((child, index) => (
                        <div
                            key={child?.key ?? `student-card-${index}`}
                            role="listitem"
                        >
                            {child}
                        </div>
                    ))
                ) : (
                    <div key="single-student-card" role="listitem">
                        {children}
                    </div>
                )}
            </div>
        </div>
    );
}
