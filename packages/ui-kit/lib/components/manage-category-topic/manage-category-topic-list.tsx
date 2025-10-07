import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';

export interface ManageCategoryTopicListProps extends isLocalAware {
    children?: React.ReactNode;
}

/**
 * `ManageCategoryTopicList` is a layout component that renders one or more topic/category item components
 * in a vertical list layout.
 *
 * It includes localization support and shows a styled empty state message if no children are provided.
 *
 * ### Props
 * @param {ManageCategoryTopicListProps} props - Props for `ManageCategoryTopicList`.
 * @param {React.ReactNode} [props.children] - One or more React nodes (typically topic/category items) to be displayed in the list.
 * @param {string} props.locale - The locale string used for translations (provided via `isLocalAware`).
 *
 * ### Behavior
 * - Displays an empty state card with a localized message when `children` is `null`, `undefined`, or an empty array.
 * - Renders provided children in a vertical list layout.
 * - Each child is wrapped in a `<div>` with `role="listitem"` for accessibility.
 * - The list container has `role="list"` to indicate a list-like structure.
 *
 * @returns {JSX.Element} A vertical list of topic/category items or an empty state message.
 */
export function ManageCategoryTopicList({ children, locale }: ManageCategoryTopicListProps) {
    const dictionary = getDictionary(locale).components.manageCategoryTopicItem;

    const isEmpty =
        !children || (Array.isArray(children) && children.length === 0);

    if (isEmpty) {
        return (
            <div className="flex flex-col p-5 gap-2 rounded-medium border border-card-stroke bg-card-fill w-full">
                <p className="text-text-primary text-md">
                    {dictionary.emptyState}
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full">
            <div
                className="flex flex-col overflow-hidden"
                role="list"
            >
                {Array.isArray(children) ? (
                    children.map((child, index) => (
                        <div
                            key={child?.key ?? `topic-item-${index}`}
                            role="listitem"
                        >
                            {child}
                        </div>
                    ))
                ) : (
                    <div key="single-topic-item" role="listitem">
                        {children}
                    </div>
                )}
            </div>
        </div>
    );
}
