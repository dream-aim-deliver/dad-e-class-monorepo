import React, { FC, JSX } from "react";
import { cn } from "../../utils/style-utils";
import { Badge } from "../badge";

export interface MenuItem {
    label: string;
    icon: JSX.Element;
    notificationCount?: number;
    isActive?: boolean;
    onClick: () => void;
}

export interface SideMenuItemProps {
    item: MenuItem;
    onClickItem?: (item: MenuItem) => void;
    isCollapsed?: boolean
}

/**
 * A navigation link component designed for sidebar menus, supporting collapsed/expanded states and notification badges.
 * 
 * @param item The menu item data containing:
 *   - `label`: Text to display for the menu item
 *   - `icon`: React element to display as the menu icon
 *   - `isActive`: Boolean indicating active state
 *   - `onClick`: Click handler for the menu item
 *   - `notificationCount`: Number to display in badge (0 hides badge)
 * @param onClickItem Optional click handler that receives the menu item object
 * @param isCollapsed Optional boolean to toggle between collapsed/expanded states
 * 
 * @Note When collapsed:
 *   - Only shows centered icon
 *   - Hides label and badge
 *   - Maintains square aspect ratio
 * 
 * @Note When expanded:
 *   - Shows icon, label, and badge (if present)
 *   - Text truncates with ellipsis when long
 *   - Badge maintains fixed position regardless of text length
 *   - Uses hover effects and active state styling
 * 
 * @example
 * <SideMenuItem
 *   item={{
 *     label: 'Notifications',
 *     icon: <BellIcon />,
 *     isActive: false,
 *     notificationCount: 5
 *   }}
 *   onClickItem={(item) => handleNavClick(item)}
 *   isCollapsed={false}
 * />
 */

export const SideMenuItem: FC<SideMenuItemProps> = ({
    item,
    onClickItem,
    isCollapsed = false
}) => {
    return (
        <div
            onClick={() => onClickItem?.(item)}
            key={item.label}
            className={cn(
                'flex items-center cursor-pointer w-full hover:bg-base-neutral-800 rounded-medium',
                isCollapsed
                    ? 'justify-center h-[2.875rem]'
                    : 'justify-between px-4 py-2 gap-2',
            )}
        >
            <div className={cn('flex items-center w-full', isCollapsed ? 'gap-0' : 'gap-2')}>
                <span
                    className={cn(`flex items-center justify-center`, isCollapsed && 'w-full')}
                    title={item.label}
                >
                    {/* {item.icon} */}
                    {React.cloneElement(item?.icon, {
                        classNames: `transition-colors duration-300  ${item?.isActive ? 'fill-button-primary-fill' : 'fill-text-primary'}`,
                    })}
                </span>
                {/* label and badge */}
                {!isCollapsed &&
                    <div className="flex items-center justify-between w-full overflow-hidden">
                        <span
                            className={`transition-all duration-300 leading-[150%] text-md text-left truncate ${item?.isActive ? 'text-button-primary-fill' : 'text-text-primary'}`}
                            title={item.label}
                        >
                            {item.label}
                        </span>
                        {item?.notificationCount && item.notificationCount > 0 && (
                            <div className="flex-shrink-0">
                                <Badge text={`${item?.notificationCount}`} size="medium" />
                            </div>
                        )}
                    </div>
                }
            </div>
        </div>
    );
}