'use client';

import { FC, useState } from 'react';
import { cn } from '../../utils/style-utils';
import { TLocale, getDictionary } from '@maany_shr/e-class-translations';
import { JoinGroup } from './join-group';
import { GroupOverviewCard, GroupOverviewCardDetails } from './groups-overview-card';
import { Tabs } from '../tabs/tab';

export interface GroupsListProps {
  locale: TLocale;
  className?: string;

  // All Groups data - shows ALL groups in "All Groups" tab, filters for "Your Groups" tab
  allGroups?: GroupOverviewCardDetails[];

  // Your Groups data - DEPRECATED: now auto-filtered from allGroups based on coaches.isCurrentUser
  yourGroups?: GroupOverviewCardDetails[];
  
  // Join Group props
  couponCode?: string;
  onCouponCodeChange?: (value: string) => void;
  onValidateCode?: () => void;
  isValidating?: boolean;
  hasValidationMessage?: boolean;
  validationMessage?: string;
  validationMessageType?: 'error' | 'success';
  
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
 * - "Your groups" tab: Shows only groups where the current user is a coach (coaches array contains isCurrentUser === true)
 *
 * @param locale - The locale for translations
 * @param allGroups - Array of all available groups
 * @param yourGroups - Array of user's groups (deprecated - now auto-filtered from allGroups)
 * @param couponCode - Current coupon code value
 * @param onCouponCodeChange - Callback for coupon code changes
 * @param onValidateCode - Callback for validating coupon code
 * @param isValidating - Whether validation is in progress
 * @param hasValidationMessage - Whether there is a validation message
 * @param validationMessage - Validation message to display
 * @param validationMessageType - Type of validation message ('error' or 'success')
 * @param onClickCourse - Callback for clicking on course
 * @param onClickManage - Callback for manage action (shown if current user is a coach)
 * @param onClickViewProfile - Callback for view profile action
 * @param isLoading - Whether data is loading
 * @param className - Additional CSS classes
 */
export const GroupsList: FC<GroupsListProps> = ({
  locale,
  className,
  allGroups = [],
  yourGroups = [],
  couponCode = '',
  onCouponCodeChange,
  onValidateCode,
  isValidating = false,
  hasValidationMessage = false,
  validationMessage,
  validationMessageType,
  onClickCourse,
  onClickManage,
  onClickViewProfile,
  isLoading = false,
}) => {
  const dictionary = getDictionary(locale);
  const [activeTab, setActiveTab] = useState('all-groups');

  // "Your Groups" shows only where user is a coach, "All Groups" shows ALL groups
  const filteredYourGroups = allGroups.filter(group =>
    group.coaches?.some(coach => coach.isCurrentUser === true)
  );
  const filteredAllGroups = allGroups; // Show ALL groups in "All Groups" tab

  const renderGroupCard = (group: GroupOverviewCardDetails, index: number, isYourGroup = false) => {
    return (
      <GroupOverviewCard
        key={`${group.groupName}-${index}`}
        cardDetails={group}
        locale={locale}
        onClickCourse={onClickCourse}
        onClickManage={() => onClickManage?.(String(group.groupId))}
      />
    );
  };

  return (
    <Tabs.Root defaultTab="all-groups" onValueChange={setActiveTab}>
      <div className={cn('flex flex-col gap-6 p-6', className)}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-white text-3xl font-bold leading-[100%] tracking-[-0.64px]">{dictionary.components.groupsList.title}</h2>
          
          {/* Tab Navigation - compact width */}
          <Tabs.List className="flex gap-1 border border-card-stroke rounded-md p-1 w-auto">
            <Tabs.Trigger 
              value="all-groups"
              isLast={false}
              className={cn(
                'px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap',
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
                'px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap',
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
            {/* Groups Grid - Full Width with Join Group as first item */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {/* Join Group as first grid item */}
              <div className="w-full">
                <JoinGroup
                  locale={locale}
                  couponCode={couponCode}
                  onCouponCodeChange={onCouponCodeChange}
                  onValidateCode={onValidateCode}
                  isValidating={isValidating}
                  hasValidationMessage={hasValidationMessage}
                  validationMessage={validationMessage}
                  validationMessageType={validationMessageType}
                />
              </div>
              
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
          </Tabs.Content>

          <Tabs.Content value="your-groups">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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