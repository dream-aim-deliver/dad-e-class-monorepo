import React from 'react';
import { Button } from '../button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Event } from './event';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';

interface CalendarHeaderProps extends isLocalAware {
  viewType: string;
  onNavigation: (action: 'next' | 'prev' | 'today') => void;
  onViewChange: (view: string) => void;
  formatDate: (date: Date, viewType: string) => string;
  coachAvailability: Event[];
  yourMeetings: Event[];
  isVariantTwo?: boolean;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  viewType,
  onNavigation,
  onViewChange,
  formatDate,
  coachAvailability,
  yourMeetings,
  isVariantTwo = false,
  locale,
}) => {
  const dictionary = getDictionary(locale);
  const viewOptions = [
    { label: dictionary.components.calendar.week, value: 'timeGridWeek' },
    { label: dictionary.components.calendar.month, value: 'dayGridMonth' },
  ];

  const handleViewTypeChange = (value: string) => {
    onViewChange(value);
  };
  return (
    <div className="border-b border-[var(--color-divider)] p-6">
      <div className="flex flex-row items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-semibold text-text-primary">
            {formatDate(new Date(), viewType)}
          </h2>
          <Button
            variant="text"
            size="small"
            onClick={() => onNavigation('prev')}
            className="p-2"
            hasIconLeft
            iconLeft={<ChevronLeft className="w-6 h-6" />}
          />
          <Button
            variant="text"
            size="small"
            onClick={() => onNavigation('next')}
            className="p-2"
            hasIconLeft
            iconLeft={<ChevronRight className="w-6 h-6" />}
          />
          <Button
            variant="secondary"
            size="small"
            onClick={() => onNavigation('today')}
            className="px-4"
            text={'Today'}
          />
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-4">
            {isVariantTwo ? (
              <>
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4 rounded-full bg-action-semi-transparent-medium"></span>
                  <span className="text-sm font-medium text-text-primary">{dictionary.components.calendar.availability}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4 rounded-full bg-action-default"></span>
                  <span className="text-sm font-medium text-text-primary">{dictionary.components.calendar.meeting}</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4 rounded-full bg-action-semi-transparent-medium"></span>
                  <span className="text-sm font-medium text-text-primary">{dictionary.components.calendar.coachAvailability}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4 rounded-full bg-action-default"></span>
                  <span className="text-sm font-medium text-text-primary">{dictionary.components.calendar.yourMeeting}</span>
                </div>
              </>
            )}
          </div>
          <div className="flex space-x-2">
            {viewOptions.map((option) => (
              <Button
                key={option.value}
                onClick={() => handleViewTypeChange(option.value)}
                variant={viewType === option.value ? 'primary' : 'secondary'}
                text={option.label}
                size="medium"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};