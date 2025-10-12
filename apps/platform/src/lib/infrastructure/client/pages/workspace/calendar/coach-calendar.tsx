'use client';

import { TLocale } from '@maany_shr/e-class-translations';
import { useLocale } from 'next-intl';
import { trpc } from '../../../trpc/client';
import React, { useState } from 'react';
import { useCaseModels, viewModels } from '@maany_shr/e-class-models';
import { useGetCoachAvailabilityPresenter } from '../../../hooks/use-coach-availability-presenter';
import { DefaultError, DefaultLoading } from '@maany_shr/e-class-ui-kit';
import { AddAvailabilityDialog } from './components/add-availability-dialog';
import { CalendarView } from './components/calendar-view';
import { AvailabilityDetailsDialog } from './components/availability-details-dialog';

export default function CoachCalendar() {
    const locale = useLocale() as TLocale;
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
                <h2>Your Calendar</h2>
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
