'use client';

import { TLocale } from '@maany_shr/e-class-translations';
import { useLocale } from 'next-intl';
import { trpc } from '../../../trpc/client';
import React, { useState } from 'react';
import { viewModels } from '@maany_shr/e-class-models';
import { useListStudentCoachingSessionsPresenter } from '../../../hooks/use-list-student-coaching-sessions-presenter';
import { WeeklyHeader } from '@maany_shr/e-class-ui-kit';
import { WeeklyStudentCalendarWrapper } from '../../common/student-calendar-wrappers';

export default function StudentCalendar() {
    const locale = useLocale() as TLocale;
    const [listStudentCoachingSessionsResponse] =
        trpc.listStudentCoachingSessions.useSuspenseQuery({});
    const [
        studentCoachingSessionsViewModel,
        setStudentCoachingSessionsViewModel,
    ] = useState<viewModels.TStudentCoachingSessionsListViewModel | undefined>(
        undefined,
    );
    const { presenter } = useListStudentCoachingSessionsPresenter(
        setStudentCoachingSessionsViewModel,
    );
    presenter.present(
        listStudentCoachingSessionsResponse,
        studentCoachingSessionsViewModel,
    );

    const [currentDate, setCurrentDate] = useState(new Date());

    // TODO: Implement mapping sessions to calendar

    return (
        <div className="flex flex-col h-screen">
            <div className="max-h-full flex-row hidden md:flex">
                <div className="w-full rounded-lg bg-card-fill p-4 flex-1">
                    <WeeklyHeader
                        currentDate={currentDate}
                        setCurrentDate={setCurrentDate}
                        locale={locale}
                    />
                    <WeeklyStudentCalendarWrapper
                        studentCoachingSessionsViewModel={studentCoachingSessionsViewModel}
                        currentDate={currentDate}
                        setCurrentDate={setCurrentDate}
                        // onSessionClick={onSessionClick}
                    />
                </div>
            </div>
            <div className="flex flex-col md:hidden">
                {/* <MonthlyCalendarWrapper
                    coachAvailabilityViewModel={coachAvailabilityViewModel}
                    currentDate={currentDate}
                    setCurrentDate={setCurrentDate}
                    setNewSession={undefined}
                    onAvailabilityClick={onAvailabilityClick}
                /> */}
            </div>
        </div>
    );
}
