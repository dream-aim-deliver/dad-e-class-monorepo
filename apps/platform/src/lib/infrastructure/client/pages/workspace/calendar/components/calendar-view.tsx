'use client';

import { TLocale } from '@maany_shr/e-class-translations';
import { useCaseModels, viewModels } from '@maany_shr/e-class-models';
import { CalendarNavigationHeader } from '@maany_shr/e-class-ui-kit';
import {
    MonthlyCoachCalendarWrapper,
    WeeklyCoachCalendarWrapper,
} from '../../../common/coach-calendar-wrappers';

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
        <div className="flex flex-col h-full">
            <div className="h-[calc(100vh-250px)] flex-row hidden md:flex">
                <div className="w-full rounded-lg bg-card-fill p-4 flex flex-col">
                    <CalendarNavigationHeader
                        currentDate={currentDate}
                        setCurrentDate={setCurrentDate}
                        locale={locale}
                        viewType="weekly"
                    />
                    <div className="flex-1 min-h-0">
                        <WeeklyCoachCalendarWrapper
                            coachAvailabilityViewModel={coachAvailabilityViewModel}
                            currentDate={currentDate}
                            setCurrentDate={setCurrentDate}
                            onAvailabilityClick={onAvailabilityClick}
                        />
                    </div>
                </div>
            </div>
            <div className="flex flex-col md:hidden">
                <MonthlyCoachCalendarWrapper
                    coachAvailabilityViewModel={coachAvailabilityViewModel}
                    currentDate={currentDate}
                    setCurrentDate={setCurrentDate}
                    onAvailabilityClick={onAvailabilityClick}
                />
            </div>
        </div>
    );
}
