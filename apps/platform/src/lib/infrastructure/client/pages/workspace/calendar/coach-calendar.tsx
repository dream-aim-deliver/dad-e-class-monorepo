'use client';

import { TLocale } from '@maany_shr/e-class-translations';
import { useLocale, useTranslations } from 'next-intl';
import { trpc } from '../../../trpc/cms-client';
import React, { useState, useEffect } from 'react';
import { useCaseModels, viewModels } from '@maany_shr/e-class-models';
import { useGetCoachAvailabilityPresenter } from '../../../hooks/use-coach-availability-presenter';
import {
    Breadcrumbs,
    DefaultError,
    DefaultLoading,
    Tabs,
    CalendarNavigationHeader,
    Divider,
} from '@maany_shr/e-class-ui-kit';
import { AddAvailabilityDialog } from './components/add-availability-dialog';
import { AddRecurringAvailabilityDialog } from './components/add-recurring-availability-dialog';
import { DeleteRecurringAvailabilityDialog } from './components/delete-recurring-availability-dialog';
import { AvailabilityDetailsDialog } from './components/availability-details-dialog';
import { SessionDetailsDialog } from './components/session-details-dialog';
import { useSession } from 'next-auth/react';
import StudentCalendar from './student-calendar';
import {
    MonthlyCoachCalendarWrapper,
    WeeklyCoachCalendarWrapper,
} from '../../common/coach-calendar-wrappers';
import { useRouter } from 'next/navigation';

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

    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isRecurringDialogOpen, setIsRecurringDialogOpen] = useState(false);
    const [isDeleteRecurringDialogOpen, setIsDeleteRecurringDialogOpen] = useState(false);
    const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

    const [chosenAvailability, setChosenAvailability] = useState<
        useCaseModels.TAvailability | undefined
    >(undefined);

    const [isSessionDetailsDialogOpen, setIsSessionDetailsDialogOpen] = useState(false);
    const [chosenSession, setChosenSession] = useState<{
        id: number;
        title: string;
        startTime: Date;
        endTime: Date;
    } | undefined>(undefined);

    const [coachAvailabilityResponse, { refetch: refetchCoachAvailability }] =
        trpc.getCoachAvailability.useSuspenseQuery({});
    const [coachAvailabilityViewModel, setCoachAvailabilityViewModel] =
        useState<viewModels.TCoachAvailabilityViewModel | undefined>(undefined);
    const { presenter } = useGetCoachAvailabilityPresenter(
        setCoachAvailabilityViewModel,
    );
    // @ts-ignore
    presenter.present(coachAvailabilityResponse, coachAvailabilityViewModel);

    const handleAvailabilityAdded = () => {
        refetchCoachAvailability();
        setIsAddDialogOpen(false);
    };

    const handleRecurringAvailabilityAdded = () => {
        refetchCoachAvailability();
        setIsRecurringDialogOpen(false);
    };

    const handleRecurringAvailabilityDeleted = () => {
        refetchCoachAvailability();
        setIsDeleteRecurringDialogOpen(false);
    };

    const handleAvailabilityDeleted = () => {
        refetchCoachAvailability();
        setIsDetailsDialogOpen(false);
    };

    const handleSessionClick = (sessionId: number) => {
        if (!coachAvailabilityViewModel || coachAvailabilityViewModel.mode !== 'default') return;
        const session = coachAvailabilityViewModel.data.mySessions.find(s => s.id === sessionId);
        if (!session) return;
        setChosenSession({
            id: session.id,
            title: `${session.sessionType?.startsWith('group-') ? 'Group Session' : 'Individual'}: ${session.coachingOfferingName}`,
            startTime: new Date(session.startTime),
            endTime: new Date(session.endTime),
        });
        setIsSessionDetailsDialogOpen(true);
    };

    const handleSessionCancelSuccess = () => {
        refetchCoachAvailability();
        setIsSessionDetailsDialogOpen(false);
        setChosenSession(undefined);
    };

    if (!coachAvailabilityViewModel || !currentDate) {
        return <DefaultLoading locale={locale} />;
    }

    if (coachAvailabilityViewModel.mode !== 'default') {
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
                <h1>{t('yourCalendarTitle')}</h1>

                <div className="flex gap-2 flex-wrap">
                    <AddAvailabilityDialog
                        isOpen={isAddDialogOpen}
                        onOpenChange={setIsAddDialogOpen}
                        onSuccess={handleAvailabilityAdded}
                    />
                    <AddRecurringAvailabilityDialog
                        isOpen={isRecurringDialogOpen}
                        onOpenChange={setIsRecurringDialogOpen}
                        onSuccess={handleRecurringAvailabilityAdded}
                    />
                    <DeleteRecurringAvailabilityDialog
                        isOpen={isDeleteRecurringDialogOpen}
                        onOpenChange={setIsDeleteRecurringDialogOpen}
                        onSuccess={handleRecurringAvailabilityDeleted}
                        availabilities={coachAvailabilityViewModel.data.availability}
                    />
                </div>
            </div>
            <Divider className="my-4" />

            {chosenAvailability && (
                <AvailabilityDetailsDialog
                    isOpen={isDetailsDialogOpen}
                    onOpenChange={setIsDetailsDialogOpen}
                    availability={chosenAvailability}
                    onDeleteSuccess={handleAvailabilityDeleted}
                />
            )}

            {chosenSession && (
                <SessionDetailsDialog
                    isOpen={isSessionDetailsDialogOpen}
                    onOpenChange={setIsSessionDetailsDialogOpen}
                    sessionId={chosenSession.id}
                    sessionTitle={chosenSession.title}
                    startTime={chosenSession.startTime}
                    endTime={chosenSession.endTime}
                    onCancelSuccess={handleSessionCancelSuccess}
                />
            )}

            <Tabs.Root
                defaultTab="weekly"
                onValueChange={(value) =>
                    setCurrentView(value as 'weekly' | 'monthly')
                }
            >
                <div className="flex flex-col h-full">
                    {/* Desktop view with header and calendar */}
                    <div className="h-[calc(100dvh-370px)] flex-row hidden md:flex">
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
                                <WeeklyCoachCalendarWrapper
                                    coachAvailabilityViewModel={
                                        coachAvailabilityViewModel
                                    }
                                    currentDate={currentDate}
                                    setCurrentDate={setCurrentDate}
                                    onAvailabilityClick={(availability) => {
                                        setChosenAvailability(availability);
                                        setIsDetailsDialogOpen(true);
                                    }}
                                    onSessionClick={handleSessionClick}
                                />
                            </Tabs.Content>
                            <Tabs.Content
                                value="monthly"
                                className="flex-1 min-h-0"
                            >
                                <MonthlyCoachCalendarWrapper
                                    coachAvailabilityViewModel={
                                        coachAvailabilityViewModel
                                    }
                                    currentDate={currentDate}
                                    setCurrentDate={setCurrentDate}
                                    selectedDate={selectedDate}
                                    setSelectedDate={setSelectedDate}
                                    onAvailabilityClick={(availability) => {
                                        setChosenAvailability(availability);
                                        setIsDetailsDialogOpen(true);
                                    }}
                                    onSessionClick={handleSessionClick}
                                    variant="full"
                                />
                            </Tabs.Content>
                        </div>
                    </div>
                    {/* Mobile view - always shows monthly */}
                    <div className="flex flex-col md:hidden">
                        <MonthlyCoachCalendarWrapper
                            coachAvailabilityViewModel={
                                coachAvailabilityViewModel
                            }
                            currentDate={currentDate}
                            setCurrentDate={setCurrentDate}
                            onAvailabilityClick={(availability) => {
                                setChosenAvailability(availability);
                                setIsDetailsDialogOpen(true);
                            }}
                            onSessionClick={handleSessionClick}
                        />
                    </div>
                </div>
            </Tabs.Root>
        </div>
    );
}

export default function CoachCalendar() {
    const session = useSession();
    const locale = useLocale() as TLocale;
    const t = useTranslations('pages.calendarPage');
    const router = useRouter();
    const breadcrumbsTranslations = useTranslations('components.breadcrumbs');
    const isStudent = session.data?.user?.roles?.includes('student');
    const tabContentClass = 'mt-4';

    // Wait for session to be authenticated before making authenticated queries
    if (session.status === 'loading') {
        return <DefaultLoading locale={locale} />;
    }

    if (isStudent) {
        return (
            <div className="flex flex-col space-y-2">
                <Breadcrumbs
                    items={[
                        {
                            label: breadcrumbsTranslations('home'),
                            onClick: () => router.push('/'),
                        },
                        {
                            label: breadcrumbsTranslations('workspace'),
                            onClick: () => router.push('/workspace/'),
                        },
                        {
                            label: breadcrumbsTranslations('yourCalendar'),
                            onClick: () => {
                                // Nothing should happen on clicking the current page
                            },
                        },
                    ]}
                />
                <Tabs.Root defaultTab="coach">
                    <Tabs.List>
                        <Tabs.Trigger value="coach" isLast={false}>
                            {t('coachTab')}
                        </Tabs.Trigger>
                        <Tabs.Trigger value="student" isLast={true}>
                            {t('studentTab')}
                        </Tabs.Trigger>
                    </Tabs.List>
                    <Tabs.Content value="coach" className={tabContentClass}>
                        <CalendarContent />
                    </Tabs.Content>
                    <Tabs.Content value="student" className={tabContentClass}>
                        <StudentCalendar hideBreadcrumbs={true} />
                    </Tabs.Content>
                </Tabs.Root>
            </div>
        );
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
                        label: breadcrumbsTranslations('yourCalendar'),
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
