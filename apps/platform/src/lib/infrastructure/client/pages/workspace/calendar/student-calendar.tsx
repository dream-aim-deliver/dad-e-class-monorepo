'use client';

import { TLocale } from '@maany_shr/e-class-translations';
import { useLocale, useTranslations } from 'next-intl';
import { trpc } from '../../../trpc/cms-client';
import React, { useState, useEffect } from 'react';
import { viewModels } from '@maany_shr/e-class-models';
import { useListStudentCoachingSessionsPresenter } from '../../../hooks/use-list-student-coaching-sessions-presenter';
import {
    Breadcrumbs,
    CalendarNavigationHeader,
    DefaultLoading,
    Divider,
    Tabs,
} from '@maany_shr/e-class-ui-kit';
import {
    WeeklyStudentCalendarWrapper,
    MonthlyStudentCalendarWrapper,
} from '../../common/student-calendar-wrappers';
import { useRouter } from 'next/navigation';

interface StudentCalendarProps {
    hideBreadcrumbs?: boolean;
}

export default function StudentCalendar({ hideBreadcrumbs = false }: StudentCalendarProps) {
    const locale = useLocale() as TLocale;
    const t = useTranslations('pages.calendarPage');
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
        // @ts-ignore
        listStudentCoachingSessionsResponse,
        studentCoachingSessionsViewModel,
    );

    const [currentDate, setCurrentDate] = useState<Date | undefined>(undefined);
    const [currentView, setCurrentView] = useState<'weekly' | 'monthly'>(
        'weekly',
    );
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
        undefined,
    );

    // Initialize date on client side only to avoid hydration mismatch
    useEffect(() => {
        setCurrentDate(new Date());
    }, []);

    const router = useRouter();
    const currentLocale = locale;
    const handleSessionClick = (_sessionId: number | string) => {
        router.push(`/${currentLocale}/workspace/coaching-sessions`);
    };
    const breadcrumbsTranslations = useTranslations('components.breadcrumbs');

    // Wait for client-side date initialization to avoid hydration mismatch
    if (!currentDate) {
        return <DefaultLoading locale={locale} />;
    }

    return (
        <Tabs.Root
            defaultTab="weekly"
            onValueChange={(value) =>
                setCurrentView(value as 'weekly' | 'monthly')
            }
        >
            <div className="flex flex-col h-full">
                {!hideBreadcrumbs && (
                    <Breadcrumbs
                        items={[
                            {
                                label: breadcrumbsTranslations('home'),
                                onClick: () => router.push(`/${locale}`),
                            },
                            {
                                label: breadcrumbsTranslations('workspace'),
                                onClick: () => router.push(`/${locale}/workspace/`),
                            },
                            {
                                label: breadcrumbsTranslations('yourCalendar'),
                                onClick: () => {
                                    // Nothing should happen on clicking the current page
                                },
                            },
                        ]}
                    />
                )}
                <h1>{t('yourCalendarTitle')}</h1>
                <Divider className="my-4" />
                {/* Desktop view with header and calendar */}
                <div className="h-[calc(100dvh-300px)] flex-row hidden md:flex">
                    <div className="w-full rounded-lg bg-card-fill p-4 flex flex-col overflow-hidden">
                        <CalendarNavigationHeader
                            currentDate={currentDate}
                            setCurrentDate={setCurrentDate}
                            locale={locale}
                            viewType={currentView}
                            onDateClick={(date: Date) => setSelectedDate(date)}
                            userRole="student"
                            viewTabs={
                                <Tabs.List className="bg-base-neutral-800 border border-base-neutral-700">
                                    <Tabs.Trigger value="weekly" isLast={false}>
                                        {t('weeklyView')}
                                    </Tabs.Trigger>
                                    <Tabs.Trigger value="monthly" isLast={true}>
                                        {t('monthlyView')}
                                    </Tabs.Trigger>
                                </Tabs.List>
                            }
                        />
                        <Tabs.Content value="weekly" className="flex-1 min-h-0">
                            <WeeklyStudentCalendarWrapper
                                studentCoachingSessionsViewModel={
                                    studentCoachingSessionsViewModel
                                }
                                currentDate={currentDate}
                                setCurrentDate={setCurrentDate}
                                onSessionClick={handleSessionClick}
                            />
                        </Tabs.Content>
                        <Tabs.Content
                            value="monthly"
                            className="flex-1 min-h-0"
                        >
                            <MonthlyStudentCalendarWrapper
                                studentCoachingSessionsViewModel={
                                    studentCoachingSessionsViewModel
                                }
                                currentDate={currentDate}
                                setCurrentDate={setCurrentDate}
                                selectedDate={selectedDate}
                                setSelectedDate={setSelectedDate}
                                variant="full"
                                onSessionClick={handleSessionClick}
                            />
                        </Tabs.Content>
                    </div>
                </div>
                {/* Mobile view - always shows monthly */}
                <div className="flex flex-col md:hidden">
                    <MonthlyStudentCalendarWrapper
                        studentCoachingSessionsViewModel={
                            studentCoachingSessionsViewModel
                        }
                        currentDate={currentDate}
                        setCurrentDate={setCurrentDate}
                        onSessionClick={handleSessionClick}
                    />
                </div>
            </div>
        </Tabs.Root>
    );
}
