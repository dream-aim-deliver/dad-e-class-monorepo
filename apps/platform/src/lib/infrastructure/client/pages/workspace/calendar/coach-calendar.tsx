'use client';

import { TLocale } from '@maany_shr/e-class-translations';
import { useLocale, useTranslations } from 'next-intl';
import { trpc } from '../../../trpc/client';
import React, { useState } from 'react';
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
import { AvailabilityDetailsDialog } from './components/availability-details-dialog';
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
    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentView, setCurrentView] = useState<'weekly' | 'monthly'>(
        'weekly',
    );
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
        undefined,
    );

    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

    const [chosenAvailability, setChosenAvailability] = useState<
        useCaseModels.TAvailability | undefined
    >(undefined);

    const [coachAvailabilityResponse, { refetch: refetchCoachAvailability }] =
        trpc.getCoachAvailability.useSuspenseQuery({});
    const [coachAvailabilityViewModel, setCoachAvailabilityViewModel] =
        useState<viewModels.TCoachAvailabilityViewModel | undefined>(undefined);
    const { presenter } = useGetCoachAvailabilityPresenter(
        setCoachAvailabilityViewModel,
    );
    presenter.present(coachAvailabilityResponse, coachAvailabilityViewModel);

    const handleAvailabilityAdded = () => {
        refetchCoachAvailability();
        setIsAddDialogOpen(false);
    };

    const handleAvailabilityDeleted = () => {
        refetchCoachAvailability();
        setIsDetailsDialogOpen(false);
    };

    if (!coachAvailabilityViewModel) {
        return <DefaultLoading locale={locale} />;
    }

    if (coachAvailabilityViewModel.mode !== 'default') {
        return <DefaultError locale={locale} />;
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mt-4">
                <h1>{t('yourCalendarTitle')}</h1>

                <AddAvailabilityDialog
                    isOpen={isAddDialogOpen}
                    onOpenChange={setIsAddDialogOpen}
                    onSuccess={handleAvailabilityAdded}
                />
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
                        />
                    </div>
                </div>
            </Tabs.Root>
        </div>
    );
}

export default function CoachCalendar() {
    const session = useSession();
    const t = useTranslations('pages.calendarPage');
    const router = useRouter();
    const breadcrumbsTranslations = useTranslations('components.breadcrumbs');
    const isStudent = session.data?.user?.roles?.includes('student');
    const tabContentClass = 'mt-4';

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
                        <StudentCalendar />
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
