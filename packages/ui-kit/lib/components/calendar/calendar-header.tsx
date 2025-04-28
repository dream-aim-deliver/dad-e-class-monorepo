import React from 'react';
import { Button } from '../button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Tabs, TabList } from '../tabs/tab';
import { cn } from '../../utils/style-utils';

type Event = {
  id: string;
  title: string;
  description: string;
  start: string;
  end: string;
  attendees?: string;
};

type CalendarHeaderProps = {
  viewType: string;
  onNavigation: (action: 'next' | 'prev' | 'today') => void;
  onViewChange: (view: string) => void;
  formatDate: (date: Date, viewType: string) => string;
  coachAvailability: Event[];
  yourMeetings: Event[];
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
            <div className="flex items-center space-x-2">
              <span className="w-4 h-4 rounded-full bg-action-semi-transparent-medium"></span>
              <span className="text-sm font-medium text-text-primary">Coach's Availability</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-4 h-4 rounded-full bg-action-default"></span>
              <span className="text-sm font-medium text-text-primary">Your Meeting</span>
            </div>
          </div>
          {/* <div className="flex space-x-2">
            <Tabs.Root
              defaultTab={viewType}
              onValueChange={(value) => onViewChange(value)}
              className="flex"
            >
              <Tabs.List className="flex space-x-2" variant="small">
                {viewOptions.map((option) => (
                  <Tabs.Trigger
                    key={option.value}
                    value={option.value}
                    className={cn(
                      'px-3 py-1 text-sm font-medium rounded-md',
                      viewType === option.value
                        ? 'bg-base-neutral-700 text-white'
                        : 'bg-transparent text-gray-500 hover:bg-base-neutral-700/10'
                    )}
                  >
                    {option.label}
                  </Tabs.Trigger>
                ))}
              </Tabs.List>
            </Tabs.Root>

          </div> */}
          <div className="flex space-x-2">
            {viewOptions.map((option) => (
              <Button
                key={option.value}
                onClick={() => handleViewTypeChange(option.value)}
                variant={viewType === option.value ? 'primary' : 'secondary'}
                text={option.label}
                size='medium'
              />
            ))}
          </div>  
        </div>
      </div>
    </div>
  );
};