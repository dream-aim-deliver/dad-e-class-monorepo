import { FC, useState } from 'react';
import { cn } from '../../utils/style-utils';
import { TLocale, getDictionary } from '@maany_shr/e-class-translations';
import { JoinGroup } from './join-group';
import { GroupOverviewCard, GroupOverviewCardDetails } from './groups-overview-card';
import { Tabs } from '../tabs/tab';

export interface GroupsListProps {
  isAdmin?: boolean;
  locale: TLocale;
  className?: string;
  
  // All Groups data - shows ALL groups in "All Groups" tab, filters for "Your Groups" tab
  allGroups?: GroupOverviewCardDetails[];
  
  // Your Groups data - DEPRECATED: now auto-filtered from allGroups based on coach.isCurrentUser
  yourGroups?: GroupOverviewCardDetails[];
  
  // Join Group props
  joinGroupVariant?: 'empty' | 'already-has-coach';
  couponCode?: string;
  onCouponCodeChange?: (value: string) => void;
  onValidateCode?: () => void;
  isValidating?: boolean;
  validationError?: string;
  
  // Callbacks
  onClickCourse?: (slug: string) => void;
  onClickManage?: (groupId: string) => void;
  onClickViewProfile?: (groupId: string) => void;
  
  // Loading states
  isLoading?: boolean;
}

/**
 * GroupsList component displaying groups with tabs for "All groups" and "Your groups"
 * 
 * The component filters groups as follows:
 * - "All groups" tab: Shows ALL groups from the allGroups array
 * - "Your groups" tab: Shows only groups where the current user is the coach (coach.isCurrentUser === true)
 * 
 * @param isAdmin - Whether the current user is an admin (shows manage buttons)
 * @param locale - The locale for translations
 * @param allGroups - Array of all available groups
 * @param yourGroups - Array of user's groups (deprecated - now auto-filtered from allGroups)
 * @param joinGroupVariant - Variant for the join group component
 * @param couponCode - Current coupon code value
 * @param onCouponCodeChange - Callback for coupon code changes
 * @param onValidateCode - Callback for validating coupon code
 * @param isValidating - Whether validation is in progress
 * @param validationError - Error message from validation
 * @param onClickCourse - Callback for clicking on course
 * @param onClickManage - Callback for manage action (admin only)
 * @param onClickViewProfile - Callback for view profile action
 * @param isLoading - Whether data is loading
 * @param className - Additional CSS classes
 */
export const GroupsList: FC<GroupsListProps> = ({
  isAdmin = false,
  locale,
  className,
  allGroups = [],
  yourGroups = [],
  joinGroupVariant = 'empty',
  couponCode = '',
  onCouponCodeChange,
  onValidateCode,
  isValidating = false,
  validationError,
  onClickCourse,
  onClickManage,
  onClickViewProfile,
  isLoading = false,
}) => {
  const dictionary = getDictionary(locale);
  const [activeTab, setActiveTab] = useState('all-groups');

  // "Your Groups" shows only where user is coach, "All Groups" shows ALL groups
  const filteredYourGroups = allGroups.filter(group => group.coach?.isCurrentUser === true);
  const filteredAllGroups = allGroups; // Show ALL groups in "All Groups" tab

  const renderGroupCard = (group: GroupOverviewCardDetails, index: number, isYourGroup = false) => {
    // Show admin view when user is admin AND is the coach of this group (regardless of tab)
    const showAsAdmin = isAdmin && group.coach?.isCurrentUser;
    
    return (
      <GroupOverviewCard
        key={`${group.groupName}-${index}`}
        cardDetails={group}
        isAdmin={showAsAdmin}
        locale={locale}
        onClickCourse={onClickCourse}
        onClickManage={() => onClickManage?.(group.groupName)}
      />
    );
  };

  return (
    <Tabs.Root defaultTab="all-groups" onValueChange={setActiveTab}>
      <div className={cn('flex flex-col gap-6 p-6', className)}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-white text-3xl font-bold leading-[100%] tracking-[-0.64px]">{dictionary.components.groupsList.title}</h2>
          
          {/* Tab Navigation - moved to right side */}
          <Tabs.List className="flex gap-1 border border-card-stroke rounded-md p-1 w-full min-w-[200px] max-w-[400px] justify-end">
            <Tabs.Trigger 
              value="all-groups"
              isLast={false}
              className={cn(
                'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                activeTab === 'all-groups' 
                  ? 'bg-button-primary-fill text-button-primary-text' 
                  : 'text-text-secondary hover:text-text-primary'
              )}
            >
              {dictionary.components.groupsList.allGroups}
            </Tabs.Trigger>
            <Tabs.Trigger 
              value="your-groups"
              isLast={true}
              className={cn(
                'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                activeTab === 'your-groups' 
                  ? 'bg-button-primary-fill text-button-primary-text' 
                  : 'text-text-secondary hover:text-text-primary'
              )}
            >
              {dictionary.components.groupsList.yourGroups}
            </Tabs.Trigger>
          </Tabs.List>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          <Tabs.Content value="all-groups">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Join Group Section */}
              <div className="lg:col-span-1">
                <JoinGroup
                  variant={joinGroupVariant}
                  locale={locale}
                  couponCode={couponCode}
                  onCouponCodeChange={onCouponCodeChange}
                  onValidateCode={onValidateCode}
                  isValidating={isValidating}
                  validationError={validationError}
                />
              </div>

              {/* Groups Grid */}
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredAllGroups.map((group, index) => renderGroupCard(group, index, false))}
                  
                  {/* Loading State */}
                  {isLoading && (
                    <div className="col-span-full flex justify-center py-8">
                      <div className="text-text-secondary">{dictionary.components.groupsList.loading}</div>
                    </div>
                  )}
                  
                  {/* Empty State */}
                  {!isLoading && filteredAllGroups.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                      <div className="text-text-secondary mb-2">{dictionary.components.groupsList.noGroups}</div>
                      <div className="text-text-tertiary text-sm">{dictionary.components.groupsList.noGroupsDescription}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Tabs.Content>

          <Tabs.Content value="your-groups">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredYourGroups.map((group, index) => renderGroupCard(group, index, true))}
              
              {/* Loading State */}
              {isLoading && (
                <div className="col-span-full flex justify-center py-8">
                  <div className="text-text-secondary">{dictionary.components.groupsList.loadingYourGroups}</div>
                </div>
              )}
              
              {/* Empty State */}
              {!isLoading && filteredYourGroups.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                  <div className="text-text-secondary mb-2">{dictionary.components.groupsList.noYourGroups}</div>
                  <div className="text-text-tertiary text-sm">{dictionary.components.groupsList.noYourGroupsDescription}</div>
                </div>
              )}
            </div>
          </Tabs.Content>
        </div>
      </div>
    </Tabs.Root>
  );
};

export default GroupsList;
