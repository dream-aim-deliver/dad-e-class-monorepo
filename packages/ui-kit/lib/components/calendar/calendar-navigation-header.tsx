'use client';

import { isLocalAware, getDictionary } from '@maany_shr/e-class-translations';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../button';

type CalendarViewType = 'weekly' | 'monthly';
type UserRole = 'coach' | 'student';

interface CalendarNavigationHeaderProps extends isLocalAware {
    currentDate: Date;
    setCurrentDate: (date: Date) => void;
    viewType: CalendarViewType;
    viewTabs?: React.ReactNode;
    onDateClick?: (date: Date) => void;
    userRole?: UserRole;
}

const getWeekStart = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
};

export function CalendarNavigationHeader({
    currentDate,
    setCurrentDate,
    viewType,
    locale,
    viewTabs,
    onDateClick,
    userRole = 'coach',
}: CalendarNavigationHeaderProps) {
    const dictionary = getDictionary(locale);

    const getSectionHeading = () => {
        if (viewType === 'weekly') {
            const startDate = getWeekStart(currentDate);
            const firstMonth = startDate.toLocaleDateString(locale, {
                month: 'long',
                year: 'numeric',
            });
            const endDate = new Date(
                startDate.getFullYear(),
                startDate.getMonth(),
                startDate.getDate() + 6,
            );
            const lastMonth = endDate.toLocaleDateString(locale, {
                month: 'long',
                year: 'numeric',
            });
            if (firstMonth === lastMonth) {
                return firstMonth;
            }
            return `${firstMonth} - ${lastMonth}`;
        } else {
            // Monthly view
            return currentDate.toLocaleDateString(locale, {
                month: 'long',
                year: 'numeric',
            });
        }
    };

    const changeDate = (difference: 1 | -1) => {
        if (viewType === 'weekly') {
            setCurrentDate(
                new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                    currentDate.getDate() + difference * 7,
                ),
            );
        } else {
            // Monthly view
            setCurrentDate(
                new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth() + difference,
                    1,
                ),
            );
        }
    };

    return (
        <div className="flex flex-row mb-4 items-center justify-between">
            <div className="flex flex-row items-center space-x-6">
                <Button
                    variant="secondary"
                    text={dictionary.components.calendar.today}
                    onClick={() => {
                        const today = new Date();
                        setCurrentDate(today);
                        if (viewType === 'monthly' && onDateClick) {
                            onDateClick(today);
                        }
                    }}
                    size="small"
                />
                <ChevronLeft
                    className="cursor-pointer text-base-brand-500"
                    onClick={() => changeDate(-1)}
                />
                <ChevronRight
                    className="cursor-pointer text-base-brand-500"
                    onClick={() => changeDate(1)}
                />
                <h3> {getSectionHeading()} </h3>
            </div>
            {viewTabs && (
                <div className='flex flex-row gap-7 items-center'>
                    <div className='flex flex-row items-center gap-2'>
                        <div className='w-3 h-3 rounded-full bg-action-semi-transparent-strong'></div>
                        <p className='text-text-primary font-important text-sm'>
                            {userRole === 'student'
                                ? dictionary.components.calendar.coachAvailability
                                : dictionary.components.calendar.availability}
                        </p>
                    </div>
                    <div className='flex flex-row items-center gap-2'>
                        <div className='w-3 h-3 rounded-full bg-action-default'></div>
                        <p className='text-text-primary font-important text-sm'>
                            {userRole === 'student'
                                ? dictionary.components.calendar.yourMeeting
                                : dictionary.components.calendar.meeting}
                        </p>
                    </div>
                    <div>{viewTabs}</div>
                </div>
            )}
        </div>
    );
}
