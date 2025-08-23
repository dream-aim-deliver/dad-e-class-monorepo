'use client';
import { FC } from 'react';
import { Badge } from '../badge';
import { UserAvatar } from '../avatar/user-avatar';
import { IconButton } from '../icon-button';
import { IconChevronRight } from '../icons/icon-chevron-right';
import { IconChevronLeft } from '../icons/icon-chevron-left';
import { StarRating } from '../star-rating';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { TRole } from 'packages/models/src/role';
import { cn } from '../../utils/style-utils';

export interface SideMenuProps extends isLocalAware {
    userName: string;
    userRole: Exclude<TRole, 'admin' | 'visitor'> | 'courseCreator';
    profileImageUrl?: string;
    children: React.ReactNode;
    rating?: { score: number; count: number };
    className?: string;
    isCollapsed?: boolean;
    onClickToggle?: (isCollapsed: boolean) => void;
}

/**
 * A collapsible SideMenu component that displays user profile information and grouped menu items.
 * The menu supports an initial collapsed state and dynamically adjusts its layout accordingly.
 *
 * @param userName The name of the user to display in the profile section.
 * @param userRole The role of the user, displayed as a badge. Defaults to 'Student'.
 * @param profileImageUrl URL of the user's profile image. Defaults to a placeholder image.
 * @param rating Optional user rating information.
 * @param rating.score The user's rating score (e.g., 4.5).
 * @param rating.count The number of ratings received.
 * @param className Optional CSS class for styling the SideMenu container.
 * @param isCollapsed Optional initial collapsed state of the SideMenu. Defaults to false.
 * @param onClickItem Optional callback function to handle item click events.
 * @param onClickToggle Optional callback function to handle toggle button click events.
 *
 * @example
 * <SideMenu
 *   userName="John Doe"
 *   userRole="Coach"
 *   profileImageUrl="https://example.com/profile.jpg"
 *   children={<div>children</div>}
 *   rating={{ score: 4.5, count: 100 }}
 *   className="custom-SideMenu"
 *   isCollapsed={false}
 *   onClickItem={(item) => console.log('Item clicked:', item)}
 *   onClickToggle={() => console.log('Toggle button clicked!')}
 * />
 */

export const SideMenu: FC<SideMenuProps> = ({
    userName,
    userRole,
    profileImageUrl,
    rating,
    className,
    isCollapsed = false,
    children,
    onClickToggle,
    locale,
}) => {
    const dictionary = getDictionary(locale);
    return (
        <div
            className={cn(
                'bg-card-fill rounded-medium border-[1px] border-card-stroke flex flex-col gap-4 py-6 items-center relative overflow-hidden transition-all duration-500 ease-in-out',
                isCollapsed ? 'w-[4rem] px-4 gap-3' : `w-[18rem] px-6`,
                className,
            )}
            data-testid="menu-container"
        >
            {/* User Profile Section */}
            <div className={cn('flex w-full gap-4 h-auto')}>
                <div className={cn('flex items-center')}>
                    <UserAvatar
                        imageUrl={profileImageUrl}
                        size={isCollapsed ? 'small' : 'large'}
                        className="rounded-full"
                    />
                </div>
                {!isCollapsed && (
                    <div className="flex flex-col items-start gap-2 justify-center">
                        <p className="text-text-primary text-md font-bold leading-[100%]">
                            {userName}
                        </p>
                        <div className="flex gap-2">
                            {userRole === 'student' && (
                                <Badge
                                    data-testid="badge"
                                    text={
                                        dictionary.components.sideMenu
                                            .studentText
                                    }
                                />
                            )}
                            {(userRole === 'coach' ||
                                userRole === 'courseCreator') && (
                                <Badge
                                    text={
                                        dictionary.components.sideMenu.coachText
                                    }
                                />
                            )}
                            {userRole === 'courseCreator' && (
                                <Badge
                                    text={
                                        dictionary.components.sideMenu
                                            .courseCreatorText
                                    }
                                />
                            )}
                        </div>
                        {userRole !== 'student' && rating && (
                            <div className="flex gap-[0.25rem] items-end">
                                <StarRating
                                    rating={rating.score}
                                    totalStars={5}
                                />
                                <p className="text-text-primary text-xs font-bold leading-[100%]">
                                    {rating.score}
                                </p>
                                <p className="text-text-secondary text-2xs font-bold leading-[100%]">
                                    ({rating.count})
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Menu Groups */}
            <div className="flex flex-col items-end gap-2 self-stretch mb-[1.5rem]">
                {children}
            </div>

            {/* Collapse Button */}
            <div
                className={cn(
                    'flex w-[2rem] h-[2rem] absolute p-[4] right-[0.5rem] bottom-[0.5rem] items-center',
                )}
                data-testid="toggle-container"
            >
                <IconButton
                    icon={
                        isCollapsed ? <IconChevronRight /> : <IconChevronLeft />
                    }
                    styles="text"
                    size="small"
                    onClick={() => onClickToggle && onClickToggle(isCollapsed)}
                />
            </div>
        </div>
    );
};
