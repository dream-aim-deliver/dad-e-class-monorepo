import React, { FC } from 'react';
import { cn } from '../../utils/style-utils';

export interface SideMenuSectionProps {
    title: string;
    children: React.ReactNode;
    isCollapsed?: boolean;
    className?: string;
}

/**
 * A section component for grouping menu items in the sidebar.
 * Displays an optional title and wraps child menu items.
 *
 * @param title Optional section title (e.g., "Website content")
 * @param children Menu items to render in this section
 * @param isCollapsed Whether the parent menu is collapsed
 * @param className Optional CSS class for styling
 *
 * @example
 * <SideMenuSection title="Website content" isCollapsed={false}>
 *   <SideMenuItem item={homepageItem} />
 *   <SideMenuItem item={offersItem} />
 * </SideMenuSection>
 */

export const SideMenuSection: FC<SideMenuSectionProps> = ({
    title,
    children,
    isCollapsed = false,
    className,
}) => {
    return (
        <div className={cn('flex flex-col gap-2 w-full', className)}>
            {title && !isCollapsed && (
                <div className="px-4 py-2">
                    <p className="text-text-secondary text-sm font-bold leading-[150%]">
                        {title}
                    </p>
                </div>
            )}
            <div className="flex flex-col gap-1 w-full">
                {children}
            </div>
        </div>
    );
};
