'use client';

import { TLocale } from '@maany_shr/e-class-translations';
import { useLocale } from 'next-intl';
import { trpc } from '../../trpc/client';
import React, { useState } from 'react';
import { viewModels } from '@maany_shr/e-class-models';
import { useGetCoachAvailabilityPresenter } from '../../hooks/use-coach-availability-presenter';
import {
    Button,
    DefaultError,
    DefaultLoading,
    Dialog,
    DialogContent,
    DialogTrigger,
    WeeklyHeader,
} from '@maany_shr/e-class-ui-kit';
import {
    MonthlyCalendarWrapper,
    WeeklyCalendarWrapper,
} from '../common/calendar-wrappers';

export default function UserCalendar() {
    const locale = useLocale() as TLocale;

    const [coachAvailabilityResponse, { refetch: refetchCoachAvailability }] =
        trpc.getCoachAvailability.useSuspenseQuery({});
    const [coachAvailabilityViewModel, setCoachAvailabilityViewModel] =
        useState<viewModels.TCoachAvailabilityViewModel | undefined>(undefined);
    const { presenter } = useGetCoachAvailabilityPresenter(
        setCoachAvailabilityViewModel,
    );
    presenter.present(coachAvailabilityResponse, coachAvailabilityViewModel);

    const [currentDate, setCurrentDate] = useState(new Date());

    const addAvailabilityMutation = trpc.addAvailability.useMutation();

    if (!coachAvailabilityViewModel) {
        return <DefaultLoading locale={locale} />;
    }

    if (coachAvailabilityViewModel.mode !== 'default') {
        return <DefaultError locale={locale} />;
    }

    // TODO: Integrate add availability functionality

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h2>Your Calendar</h2>
                <Dialog
                    defaultOpen={false}
                    open={undefined}
                    onOpenChange={() => {}}
                >
                    <DialogTrigger asChild>
                        <Button
                            variant="primary"
                            text="Add Availability"
                        />
                    </DialogTrigger>
                    <DialogContent
                        showCloseButton
                        closeOnOverlayClick
                        closeOnEscape
                    >
                        <span>Add Availability</span>
                    </DialogContent>
                </Dialog>
            </div>
            <div className="flex flex-col h-screen">
                <div className="max-h-full flex-row hidden md:flex">
                    <div className="w-full rounded-lg bg-card-fill p-4 flex-1">
                        <WeeklyHeader
                            currentDate={currentDate}
                            setCurrentDate={setCurrentDate}
                            locale={locale}
                        />
                        <WeeklyCalendarWrapper
                            coachAvailabilityViewModel={
                                coachAvailabilityViewModel
                            }
                            currentDate={currentDate}
                            setCurrentDate={setCurrentDate}
                        />
                    </div>
                </div>
                <div className="flex flex-col md:hidden">
                    <MonthlyCalendarWrapper
                        coachAvailabilityViewModel={coachAvailabilityViewModel}
                        currentDate={currentDate}
                        setCurrentDate={setCurrentDate}
                        setNewSession={() => {}}
                    />
                </div>
            </div>
        </div>
    );
}
