import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';

export interface ReceivedPaymentsCardListProps extends isLocalAware {
    children?: React.ReactNode;
}

/**
 * `ReceivedPaymentsCardList` is a layout component that renders one or more received payments card components in a responsive layout.
 *
 * It includes localization support and shows a styled empty state message if no children are provided.
 *
 * ### Props
 * @param {ReceivedPaymentsCardListProps} props - Props for `ReceivedPaymentsCardList`.
 * @param {React.ReactNode} [props.children] - One or more React nodes (typically ReceivedPaymentsCard components) to be displayed.
 * @param {string} props.locale - The locale string used for translations (provided via `isLocalAware`).
 *
 * ### Behavior
 * - Displays an empty state card with a localized message when `children` is `null`, `undefined`, or an empty array.
 * - Renders provided children in a vertical stack with consistent spacing.
 * - Each child is wrapped in a `<div>` with `role="listitem"` for accessibility.
 * - The container has `role="list"` to indicate a list-like structure.
 *
 * @returns {JSX.Element} A responsive list of received payments cards or an empty state message.
 */

export function ReceivedPaymentsCardList({
    children,
    locale,
}: ReceivedPaymentsCardListProps) {
    const dictionary = getDictionary(locale).components.receivedPaymentsCard;

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
        <div className="flex flex-col gap-4 w-full">
            <div
                className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4 w-full"
                role="list"
            >
                {Array.isArray(children) ? (
                    children.map((child, index) => (
                        <div
                            key={child?.key ?? `received-payments-card-${index}`}
                            role="listitem"
                            className="min-w-0 w-full"
                        >
                            {child}
                        </div>
                    ))
                ) : (
                    <div key="single-received-payments-card" role="listitem" className="min-w-0 w-full">
                        {children}
                    </div>
                )}
            </div>
        </div>
    );
}
