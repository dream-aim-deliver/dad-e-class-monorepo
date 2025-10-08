'use client';

import { TLocale } from '@maany_shr/e-class-translations';
import { useCaseModels, viewModels } from '@maany_shr/e-class-models';
import { WeeklyHeader } from '@maany_shr/e-class-ui-kit';
import {
    MonthlyCalendarWrapper,
    WeeklyCalendarWrapper,
} from '../../../common/calendar-wrappers';

interface CalendarViewProps {
    coachAvailabilityViewModel: viewModels.TCoachAvailabilityViewModel;
    currentDate: Date;
    setCurrentDate: (date: Date) => void;
    locale: TLocale;
    onAvailabilityClick?: (availability: useCaseModels.TAvailability) => void;
}

export function CalendarView({
    coachAvailabilityViewModel,
    currentDate,
    setCurrentDate,
    locale,
    onAvailabilityClick,
}: CalendarViewProps) {
    return (
        <div className="flex flex-col h-screen">
            <div className="max-h-full flex-row hidden md:flex">
                <div className="w-full rounded-lg bg-card-fill p-4 flex-1">
                    <WeeklyHeader
                        currentDate={currentDate}
                        setCurrentDate={setCurrentDate}
                        locale={locale}
                    />
                    <WeeklyCalendarWrapper
                        coachAvailabilityViewModel={coachAvailabilityViewModel}
                        currentDate={currentDate}
                        setCurrentDate={setCurrentDate}
                        onAvailabilityClick={onAvailabilityClick}
                    />
                </div>
            </div>
            <div className="flex flex-col md:hidden">
                <MonthlyCalendarWrapper
                    coachAvailabilityViewModel={coachAvailabilityViewModel}
                    currentDate={currentDate}
                    setCurrentDate={setCurrentDate}
                    setNewSession={() => {}}
                />
            </div>
        </div>
    );
}
