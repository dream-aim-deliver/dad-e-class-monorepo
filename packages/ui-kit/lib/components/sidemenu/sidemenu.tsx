import React, { FC, JSX } from 'react';
import clsx from 'clsx';
import { Badge } from '../badge';
import { UserAvatar } from '../avatar/user-avatar';
import { IconButton } from '../icon-button';
import { IconChevronRight } from '../icons/icon-chevron-right';
import { IconChevronLeft } from '../icons/icon-chevron-left';
import { StarRating } from '../star-rating';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';

// Interface for menu items 
export interface MenuItem {
  label: string;
  icon: JSX.Element;
  route: string;
  isActive?: boolean;
}

export interface SideMenuProps extends isLocalAware {
  userName: string;
  userRole: 'student' | 'coach' | 'courseCreator';
  profileImageUrl?: string;
  menuItems: MenuItem[][];
  rating?: { score: number; count: number };
  className?: string;
  isCollapsed?: boolean;
  onClickItem?: (item: MenuItem) => void;
  onClickToggle?: (isCollapsed: boolean) => void;
}

/**
 * A collapsible SideMenu component that displays user profile information and grouped menu items.
 * The menu supports an initial collapsed state and dynamically adjusts its layout accordingly.
 *
 * @param userName The name of the user to display in the profile section.
 * @param userRole The role of the user, displayed as a badge. Defaults to 'Student'.
 * @param profileImageUrl URL of the user's profile image. Defaults to a placeholder image.
 * @param menuItems An array of menu item groups, where each group is an array of menu items.
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
 *   menuItems={[
 *     [{ label: 'Home', icon: <HomeIcon />, route: '/' }],
 *     [{ label: 'Profile', icon: <ProfileIcon />, route: '/profile' }]
 *   ]}
 *   rating={{ score: 4.5, count: 100 }}
 *   className="custom-SideMenu"
 *   isCollapsed={false}
 *   onClickItem={(item) => console.log('Item clicked:', item)}
 *   onClickToggle={() => console.log('Toggle button clicked!')}
 * />
 */


export const SideMenu: FC<SideMenuProps> = ({
  userName,
  userRole ,
  profileImageUrl,
  menuItems,
  rating,
  className,
  isCollapsed = false,
  onClickItem,
  onClickToggle,
  locale
}) => {
  const dictionary = getDictionary(locale);
  return (
    <div
      className={clsx(
        'bg-card-fill rounded-medium border-[1px] border-card-stroke flex flex-col gap-4 py-6 items-center relative overflow-hidden transition-all duration-500 ease-in-out',
        isCollapsed
          ? 'w-[4rem] px-4 gap-[1.6875rem] cursor-pointer h-full'
          : `w-auto h-fit px-6 ${className || ''}`,
      )}
      onClick={isCollapsed ? () => onClickToggle(isCollapsed) : undefined}
      data-testid="menu-container"
    >
      {/* User Profile Section */}
      <div className={clsx('flex w-full gap-4 h-auto')}>
        <div className={clsx('flex items-center', isCollapsed && 'h-[4rem]')}>
          <UserAvatar
            imageUrl={profileImageUrl}
            size={isCollapsed ? 'small' : 'large'}
            className="rounded-full"
          />
        </div>
        {!isCollapsed && (
          <div className="flex flex-col gap-[6px] items-start justify-center">
            <p className="text-text-primary text-md font-bold leading-[100%]">
              {userName}
            </p>
            <div className="flex gap-2">
              {
                userRole === 'student' ?
                  <Badge data-testid="badge" text={dictionary.components.sideMenu.studentText}/> : 
                  <Badge text={dictionary.components.sideMenu.coachText}/>
              }
              {userRole === 'courseCreator' && <Badge text={dictionary.components.sideMenu.courseCreatorText} />}
            </div>
            {userRole !== 'student' && rating && (
              <div className="flex gap-[0.25rem] items-end">
                <StarRating rating={rating.score} totalStars={5}/>
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
      <div className="flex flex-col items-end gap-2 self-stretch mb-[1rem]">
        {menuItems?.map((group, groupIndex) => (
          <div
            key={groupIndex}
            className="flex flex-col w-full border-t border-divider pt-2"
          >
            {group?.map((item, itemIndex) => (
              <div
                onClick={isCollapsed ? undefined : () => onClickItem(item)}
                key={itemIndex}
                className={clsx(
                  'flex items-center cursor-pointer w-full ',
                  isCollapsed
                    ? 'justify-center h-[2.875rem]'
                    : 'justify-start px-4 py-2 gap-2',
                )}
              >
                <div className={`flex items-center justify-center`}>
                  {/* {item.icon} */}
                  {React.cloneElement(item.icon, {
                    classNames: `transition-colors duration-300 ${item?.isActive ? 'fill-button-primary-fill' : 'fill-text-primary'}`,
                  })}
                </div>
                <span
                  className={`transition-all duration-300 leading-[150%] text-md text-left ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'} ${item?.isActive ? 'text-button-primary-fill' : 'text-text-primary '}`}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Collapse Button */}
      <div
        className={clsx(
          'flex w-[2rem] h-[2rem] absolute p-[4] right-[0.5rem] bottom-[0.5rem] items-center',
        )}
      >
        {isCollapsed ? (
          <IconButton
            icon={<IconChevronRight />}
            styles="text"
            size="small"
          />
        ) : (
          <IconButton
            icon={<IconChevronLeft />}
            styles="text"
            size="small"
            onClick={() => onClickToggle(isCollapsed)}
          />
        )}
      </div>
    </div>
  );
};
