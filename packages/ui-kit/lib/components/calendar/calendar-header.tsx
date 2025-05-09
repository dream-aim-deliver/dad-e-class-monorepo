import React from 'react';
import { Button } from '../button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Event } from './event';

type CalendarHeaderProps = {
  viewType: string;
  onNavigation: (action: 'next' | 'prev' | 'today') => void;
  onViewChange: (view: string) => void;
  formatDate: (date: Date, viewType: string) => string;
  coachAvailability: Event[];
  yourMeetings: Event[];
  isVariantTwo?: boolean;
};

const viewOptions = [
  { label: 'Week', value: 'timeGridWeek' },
  { label: 'Month', value: 'dayGridMonth' },
];

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  viewType,
  onNavigation,
  onViewChange,
  formatDate,
  coachAvailability,
  yourMeetings,
  isVariantTwo = false,
}) => {
  const handleViewTypeChange = (value: string) => {
    console.log('Changing view to:', value);
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
            text="Today"
          />
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-4">
            {isVariantTwo ? (
              <>
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4 rounded-full bg-action-semi-transparent-medium"></span>
                  <span className="text-sm font-medium text-text-primary">Availability</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4 rounded-full bg-action-default"></span>
                  <span className="text-sm font-medium text-text-primary">Meeting</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4 rounded-full bg-action-semi-transparent-medium"></span>
                  <span className="text-sm font-medium text-text-primary">Coach's Availability</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4 rounded-full bg-action-default"></span>
                  <span className="text-sm font-medium text-text-primary">Your Meeting</span>
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