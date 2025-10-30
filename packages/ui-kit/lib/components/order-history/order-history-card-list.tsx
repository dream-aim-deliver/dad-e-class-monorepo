import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';

export interface OrderHistoryCardListProps extends isLocalAware {
    children?: React.ReactNode;
}

/**
 * `OrderHistoryCardList` is a layout component that renders one or more order history card components in a responsive layout.
 *
 * It includes localization support and shows a styled empty state message if no children are provided.
 *
 * ### Props
 * @param {OrderHistoryCardListProps} props - Props for `OrderHistoryCardList`.
 * @param {React.ReactNode} [props.children] - One or more React nodes (typically OrderHistoryCard components) to be displayed.
 * @param {string} props.locale - The locale string used for translations (provided via `isLocalAware`).
 *
 * ### Behavior
 * - Displays an empty state card with a localized message when `children` is `null`, `undefined`, or an empty array.
 * - Renders provided children in a vertical stack with consistent spacing.
 * - Each child is wrapped in a `<div>` with `role="listitem"` for accessibility.
 * - The container has `role="list"` to indicate a list-like structure.
 *
 * @returns {JSX.Element} A responsive list of order history cards or an empty state message.
 */

export function OrderHistoryCardList({
    children,
    locale,
}: OrderHistoryCardListProps) {
    const dictionary = getDictionary(locale).components.orderHistoryCard;

    const isEmpty =
        !children || (Array.isArray(children) && children.length === 0);

    if (isEmpty) {
        return (
            <div className="flex flex-col md:p-5 p-3 gap-2 rounded-medium border border-card-stroke bg-card-fill w-full lg:max-w-[22rem]">
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
                            key={child?.key ?? `order-history-card-${index}`}
                            role="listitem"
                        >
                            {child}
                        </div>
                    ))
                ) : (
                    <div key="single-order-history-card" role="listitem">
                        {children}
                    </div>
                )}
            </div>
        </div>
    );
}
