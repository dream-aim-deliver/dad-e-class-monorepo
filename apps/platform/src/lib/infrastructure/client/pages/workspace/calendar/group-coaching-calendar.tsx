'use client';

import { TLocale } from '@maany_shr/e-class-translations';
import { useLocale, useTranslations } from 'next-intl';
import { trpc } from '../../../trpc/client';
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
import { AddGroupSessionDialog } from './components/add-group-session-dialog';
import { useSession } from 'next-auth/react';
import {
    MonthlyGroupCoachingCalendarWrapper,
    WeeklyGroupCoachingCalendarWrapper,
} from '../../common/group-coaching-calendar-wrappers';
import { useRouter } from 'next/navigation';
import { useListGroupCoachingSessionsPresenter } from '../../../hooks/use-list-group-coaching-sessions-presenter';
import { useListCoachCoachingSessionsPresenter } from '../../../hooks/use-list-coach-coaching-sessions-presenter';

function CalendarContent() {
    const locale = useLocale() as TLocale;
    const t = useTranslations('pages.calendarPage');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentView, setCurrentView] = useState<'weekly' | 'monthly'>(
        'weekly',
    );
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
        undefined,
    );
    const [newSessionStart, setNewSessionStart] = useState<Date | undefined>(
        undefined,
    );

    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    // Fetch group coaching sessions
    const [groupCoachingSessionsResponse, { refetch: refetchGroupSessions }] =
        trpc.listGroupCoachingSessions.useSuspenseQuery({});
    const [groupCoachingSessionsViewModel, setGroupCoachingSessionsViewModel] =
        useState<viewModels.TListGroupCoachingSessionsViewModel | undefined>(undefined);
    const { presenter: groupSessionsPresenter } = useListGroupCoachingSessionsPresenter(
        setGroupCoachingSessionsViewModel,
    );

    // Fetch coach's individual coaching sessions
    const [coachCoachingSessionsResponse, { refetch: refetchCoachSessions }] =
        trpc.listCoachCoachingSessions.useSuspenseQuery({});
    const [coachCoachingSessionsViewModel, setCoachCoachingSessionsViewModel] =
        useState<viewModels.TListCoachCoachingSessionsViewModel | undefined>(undefined);
    const { presenter: coachSessionsPresenter } = useListCoachCoachingSessionsPresenter(
        setCoachCoachingSessionsViewModel,
    );

    // Present data to view models using useEffect
    useEffect(() => {
        groupSessionsPresenter.present(groupCoachingSessionsResponse, groupCoachingSessionsViewModel);
    }, [groupCoachingSessionsResponse, groupSessionsPresenter, groupCoachingSessionsViewModel]);

    useEffect(() => {
        coachSessionsPresenter.present(coachCoachingSessionsResponse, coachCoachingSessionsViewModel);
    }, [coachCoachingSessionsResponse, coachSessionsPresenter, coachCoachingSessionsViewModel]);

    const handleGroupSessionAdded = () => {
        refetchGroupSessions();
        refetchCoachSessions();
        setIsAddDialogOpen(false);
        setNewSessionStart(undefined);
    };

    const handleNewSessionStart = (startTime: Date) => {
        setNewSessionStart(startTime);
        setIsAddDialogOpen(true);
    };

    if (!groupCoachingSessionsViewModel || !coachCoachingSessionsViewModel) {
        return <DefaultLoading locale={locale} />;
    }

    if (groupCoachingSessionsViewModel.mode !== 'default' || coachCoachingSessionsViewModel.mode !== 'default') {
        return <DefaultError locale={locale} />;
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mt-4">
                <h1>{t('groupCoachingTitle')}</h1>
            </div>
            <Divider className="my-4" />

            <AddGroupSessionDialog
                isOpen={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}
                onSuccess={handleGroupSessionAdded}
                initialStartTime={newSessionStart}
            />

            <Tabs.Root
                defaultTab="weekly"
                onValueChange={(value) =>
                    setCurrentView(value as 'weekly' | 'monthly')
                }
            >
                <div className="flex flex-col h-full">
                    {/* Desktop view with header and calendar */}
                    <div className="h-[800px] flex-row hidden md:flex">
                        <div className="w-full rounded-lg bg-card-fill p-4 flex flex-col">
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
                                    groupCoachingSessionsViewModel={groupCoachingSessionsViewModel}
                                    coachCoachingSessionsViewModel={coachCoachingSessionsViewModel}
                                    currentDate={currentDate}
                                    setCurrentDate={setCurrentDate}
                                    setNewSessionStart={handleNewSessionStart}
                                />
                            </Tabs.Content>
                            <Tabs.Content
                                value="monthly"
                                className="flex-1 min-h-0"
                            >
                                <MonthlyGroupCoachingCalendarWrapper
                                    groupCoachingSessionsViewModel={groupCoachingSessionsViewModel}
                                    coachCoachingSessionsViewModel={coachCoachingSessionsViewModel}
                                    currentDate={currentDate}
                                    setCurrentDate={setCurrentDate}
                                    selectedDate={selectedDate}
                                    setSelectedDate={setSelectedDate}
                                    setNewSessionStart={handleNewSessionStart}
                                    variant="full"
                                />
                            </Tabs.Content>
                        </div>
                    </div>
                    {/* Mobile view - always shows monthly */}
                    <div className="flex flex-col md:hidden">
                        <MonthlyGroupCoachingCalendarWrapper
                            groupCoachingSessionsViewModel={groupCoachingSessionsViewModel}
                            coachCoachingSessionsViewModel={coachCoachingSessionsViewModel}
                            currentDate={currentDate}
                            setCurrentDate={setCurrentDate}
                            setNewSessionStart={handleNewSessionStart}
                        />
                    </div>
                </div>
            </Tabs.Root>
        </div>
    );
}

export default function GroupCoachingCalendar() {
    const session = useSession();
    const router = useRouter();
    const breadcrumbsTranslations = useTranslations('components.breadcrumbs');
    const isCoach = session.data?.user?.roles?.includes('coach');

    if (!isCoach) {
        router.push('/workspace/calendar');
        return null;
    }

    return (
        <div className="flex flex-col space-y-2">
            <Breadcrumbs
                items={[
                    {
                        label: breadcrumbsTranslations('home'),
                        onClick: () => router.push('/'),
                    },
                    {
                        label: breadcrumbsTranslations('dashboard'),
                        onClick: () => router.push('/workspace/dashboard'),
                    },
                    {
                        label: breadcrumbsTranslations('calendar'),
                        onClick: () => router.push('/workspace/calendar'),
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