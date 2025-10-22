'use client';

import { TLocale } from '@maany_shr/e-class-translations';
import { useLocale, useTranslations } from 'next-intl';
import { trpc } from '../../../trpc/client';
import React, { useState } from 'react';
import { useCaseModels, viewModels } from '@maany_shr/e-class-models';
import { useGetCoachAvailabilityPresenter } from '../../../hooks/use-coach-availability-presenter';
import { DefaultError, DefaultLoading, Tabs } from '@maany_shr/e-class-ui-kit';
import { AddAvailabilityDialog } from './components/add-availability-dialog';
import { CalendarView } from './components/calendar-view';
import { AvailabilityDetailsDialog } from './components/availability-details-dialog';
import { useSession } from 'next-auth/react';
import StudentCalendar from './student-calendar';

function CalendarContent() {
    const locale = useLocale() as TLocale;
    const t = useTranslations('pages.calendarPage');
    const [currentDate, setCurrentDate] = useState(new Date());

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
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h2>{t('yourCalendarTitle')}</h2>
                <AddAvailabilityDialog
                    isOpen={isAddDialogOpen}
                    onOpenChange={setIsAddDialogOpen}
                    onSuccess={handleAvailabilityAdded}
                />
            </div>
            {chosenAvailability && (
                <AvailabilityDetailsDialog
                    isOpen={isDetailsDialogOpen}
                    onOpenChange={setIsDetailsDialogOpen}
                    availability={chosenAvailability}
                    onDeleteSuccess={handleAvailabilityDeleted}
                />
            )}
            <CalendarView
                coachAvailabilityViewModel={coachAvailabilityViewModel}
                currentDate={currentDate}
                setCurrentDate={setCurrentDate}
                locale={locale}
                onAvailabilityClick={(availability) => {
                    setChosenAvailability(availability);
                    setIsDetailsDialogOpen(true);
                }}
            />
        </div>
    );
}

export default function CoachCalendar() {
    const session = useSession();
    const t = useTranslations('pages.calendarPage');
    const isStudent = session.data?.user?.roles?.includes('student');
    const tabContentClass = 'mt-4';

    if (isStudent) {
        return (
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
        );
    }

    return <CalendarContent />;
}
