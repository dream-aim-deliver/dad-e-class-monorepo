import { Button } from './button';
import { IconChevronRight } from './icons/icon-chevron-right';

export interface BreadcrumbItem {
    label: string;
    onClick: () => void;
}

export interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

/**
 * Breadcrumbs component renders a navigation breadcrumb trail.
 *
 * @param {BreadcrumbsProps} props - Component props
 * @param {BreadcrumbItem[]} props.items - Array of breadcrumb items to display.
 * Each item includes a label and an onClick handler function.
 *
 * @returns {JSX.Element} A navigation element containing breadcrumb items.
 *
 * @example
 * const items = [
 *   { label: 'Home', onClick: () => console.log('Home clicked') },
 *   { label: 'Library', onClick: () => console.log('Library clicked') },
 *   { label: 'Data', onClick: () => console.log('Data clicked') },
 * ];
 *
 * <Breadcrumbs items={items} />
 *
 * @description
 * This component displays a list of breadcrumb items separated by right-chevron icons.
 * All items except the last are rendered as clickable buttons triggering their onClick handlers.
 * The last item is displayed as plain text to indicate the current page.
 * The container uses semantic <nav> with aria-label for accessibility.
 */

export const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
    return (
        <nav
            aria-label="Breadcrumb"
            className="flex items-center text-sm text-base-brand-500 flex-wrap gap-1"
        >
            {items.map((item, index) => {
                const isLast = index === items.length - 1;

                return (
                    <div key={index} className="flex items-center gap-1">
                        {index > 0 && (
                            <IconChevronRight className="w-4 h-4 text-text-primary" />
                        )}

                        {!isLast ? (
                            <Button
                                variant="text"
                                size="small"
                                onClick={item.onClick}
                                className="hover:underline p-1 underline-offset-4 hover:text-base-brand-400 font-normal text-base-brand-500"
                                text={item.label}
                            />
                        ) : (
                            <span className="font-important text-color-default">
                                {item.label}
                            </span>
                        )}
                    </div>
                );
            })}
        </nav>
    );
};
