import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';

export interface PlatformCardListProps extends isLocalAware {
    children?: React.ReactNode;
}

/**
 * `PlatformCardList` is a layout component that renders one or more platform card components (or any React nodes) in a responsive grid layout.
 *
 * It includes localization support and shows a styled empty state message if no children are provided.
 *
 * ### Props
 * @param {PlatformCardListProps} props - Props for `PlatformCardList`.
 * @param {React.ReactNode} [props.children] - One or more React nodes (typically platform cards) to be displayed in the grid.
 * @param {string} props.locale - The locale string used for translations (provided via `isLocalAware`).
 *
 * ### Behavior
 * - Displays an empty state card with a localized message when `children` is `null`, `undefined`, or an empty array.
 * - Renders provided children in a grid: 1 column on small screens, 2 on medium, and 3 on extra-large.
 * - Each child is wrapped in a `<div>` with `role="listitem"` for accessibility.
 * - The grid container has `role="list"` to indicate a list-like structure.
 *
 * @returns {JSX.Element} A responsive list of platform cards or an empty state message.
 */

export function PlatformCardList({ children, locale }: PlatformCardListProps) {
    const dictionary = getDictionary(locale).components.platformCard;

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
                            key={child?.key ?? `platform-card-${index}`}
                            role="listitem"
                        >
                            {child}
                        </div>
                    ))
                ) : (
                    <div key="single-platform-card" role="listitem">
                        {children}
                    </div>
                )}
            </div>
        </div>
    );
}