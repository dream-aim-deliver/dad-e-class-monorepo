'use client';

/**
 * NOT WIRED TO ANY ROUTE - TBD if we need this
 *
 * Purpose: General coach calendar showing ALL coaching sessions for the logged-in coach
 * across all courses/groups. This is meant to be an overview calendar, as opposed to
 * the specific group calendar at /workspace/courses/[slug]/groups/[groupId]/calendar
 * which shows sessions for a single group.
 */

import { TLocale } from '@maany_shr/e-class-translations';
import { useLocale, useTranslations } from 'next-intl';
import { trpc } from '../../../trpc/cms-client';
import React, { useState, useEffect } from 'react';
import { viewModels } from '@maany_shr/e-class-models';
import {
    Breadcrumbs,
    DefaultError,
    DefaultLoading,
    Tabs,
    CalendarNavigationHeader,
    Divider,
} from '@maany_shr/e-class-ui-kit';
import { useSession } from 'next-auth/react';
import {
    MonthlyGroupCoachingCalendarWrapper,
    WeeklyGroupCoachingCalendarWrapper,
} from '../../common/group-coaching-calendar-wrappers';
import { useRouter } from 'next/navigation';
import { useListCoachCoachingSessionsPresenter } from '../../../hooks/use-list-coach-coaching-sessions-presenter';

function CalendarContent() {
    const locale = useLocale() as TLocale;
    const t = useTranslations('pages.calendarPage');
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

    // Fetch coach's coaching sessions (includes all sessions for this coach)
    const [coachCoachingSessionsResponse] =
        trpc.listCoachCoachingSessions.useSuspenseQuery({});
    const [coachCoachingSessionsViewModel, setCoachCoachingSessionsViewModel] =
        useState<viewModels.TListCoachCoachingSessionsViewModel | undefined>(undefined);
    const { presenter: coachSessionsPresenter } = useListCoachCoachingSessionsPresenter(
        setCoachCoachingSessionsViewModel,
    );

    useEffect(() => {
        if (coachCoachingSessionsResponse) {
            // @ts-ignore - Follow standard pattern used throughout codebase
            coachSessionsPresenter.present(coachCoachingSessionsResponse, coachCoachingSessionsViewModel);
        }
    }, [coachCoachingSessionsResponse, coachSessionsPresenter, coachCoachingSessionsViewModel]);

    if (!coachCoachingSessionsViewModel || !currentDate) {
        return <DefaultLoading locale={locale} />;
    }

    if (coachCoachingSessionsViewModel.mode !== 'default') {
        return (
            <DefaultError
                type="simple"
                locale={locale}
                title={t('error.title')}
                description={t('error.description')}
            />
        );
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mt-4">
                <h1>{t('groupCoachingTitle')}</h1>
            </div>
            <Divider className="my-4" />

            <Tabs.Root
                defaultTab="weekly"
                onValueChange={(value) =>
                    setCurrentView(value as 'weekly' | 'monthly')
                }
            >
                <div className="flex flex-col h-full">
                    {/* Desktop view with header and calendar */}
                    <div className="h-[calc(100dvh-300px)] flex-row hidden md:flex">
                        <div className="w-full rounded-lg bg-card-fill p-4 flex flex-col overflow-hidden">
                            <CalendarNavigationHeader
                                currentDate={currentDate}
                                setCurrentDate={setCurrentDate}
                                locale={locale}
                                viewType={currentView}
                                onDateClick={(date) => setSelectedDate(date)}
                                userRole="coach"
                                viewTabs={
                                    <Tabs.List className="bg-base-neutral-800 border border-base-neutral-700">
                                        <Tabs.Trigger
                                            value="weekly"
                                            isLast={false}
                                        >
                                            {t('weeklyView')}
                                        </Tabs.Trigger>
                                        <Tabs.Trigger
                                            value="monthly"
                                            isLast={true}
                                        >
                                            {t('monthlyView')}
                                        </Tabs.Trigger>
                                    </Tabs.List>
                                }
                            />
                            <Tabs.Content
                                value="weekly"
                                className="flex-1 min-h-0"
                            >
                                <WeeklyGroupCoachingCalendarWrapper
                                    groupCoachingSessionsViewModel={undefined}
                                    coachCoachingSessionsViewModel={coachCoachingSessionsViewModel}
                                    currentDate={currentDate}
                                    setCurrentDate={setCurrentDate}
                                />
                            </Tabs.Content>
                            <Tabs.Content
                                value="monthly"
                                className="flex-1 min-h-0"
                            >
                                <MonthlyGroupCoachingCalendarWrapper
                                    groupCoachingSessionsViewModel={undefined}
                                    coachCoachingSessionsViewModel={coachCoachingSessionsViewModel}
                                    currentDate={currentDate}
                                    setCurrentDate={setCurrentDate}
                                    selectedDate={selectedDate}
                                    setSelectedDate={setSelectedDate}
                                    variant="full"
                                />
                            </Tabs.Content>
                        </div>
                    </div>
                    {/* Mobile view - always shows monthly */}
                    <div className="flex flex-col md:hidden">
                        <MonthlyGroupCoachingCalendarWrapper
                            groupCoachingSessionsViewModel={undefined}
                            coachCoachingSessionsViewModel={coachCoachingSessionsViewModel}
                            currentDate={currentDate}
                            setCurrentDate={setCurrentDate}
                        />
                    </div>
                </div>
            </Tabs.Root>
        </div>
    );
}

export default function GroupCoachingCalendar() {
    const locale = useLocale() as TLocale;
    const session = useSession();
    const router = useRouter();
    const breadcrumbsTranslations = useTranslations('components.breadcrumbs');
    const isCoach = session.data?.user?.roles?.includes('coach');

    if (!isCoach) {
        router.push(`/${locale}/workspace/calendar`);
        return null;
    }

    return (
        <div className="flex flex-col space-y-2">
            <Breadcrumbs
                items={[
                    {
                        label: breadcrumbsTranslations('home'),
                        onClick: () => router.push(`/${locale}`),
                    },
                    {
                        label: breadcrumbsTranslations('dashboard'),
                        onClick: () => router.push(`/${locale}/workspace/dashboard`),
                    },
                    {
                        label: breadcrumbsTranslations('calendar'),
                        onClick: () => router.push(`/${locale}/workspace/calendar`),
                    },
                    {
                        label: breadcrumbsTranslations('groupCoachingCalendar'),
                        onClick: () => {
                            // Nothing should happen on clicking the current page
                        },
                    },
                ]}
            />
            <CalendarContent />
        </div>
    );
}
