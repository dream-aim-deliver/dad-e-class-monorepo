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
import ConfirmTimeContent from '../common/confirm-time-content';

interface NewAvailability {
    startTime?: Date;
    endTime?: Date;
}

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
    const [newAvailability, setNewAvailability] = useState<NewAvailability>({
        startTime: undefined,
        endTime: undefined,
    });
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const addAvailabilityMutation = trpc.addAvailability.useMutation();
    const [addAvailabilityError, setAddAvailabilityError] = useState<
        string | undefined
    >(undefined);

    const onSubmit = () => {
        if (!newAvailability.startTime || !newAvailability.endTime) {
            setAddAvailabilityError('Please select both start and end times.');
            return;
        }
        if (newAvailability.startTime >= newAvailability.endTime) {
            setAddAvailabilityError(
                'End time must be after start time.',
            );
            return;
        }
        // TODO: Add validation for minimum duration 

        setAddAvailabilityError(undefined);


        addAvailabilityMutation.mutate(
            {
                startTime: newAvailability.startTime.toISOString(),
                endTime: newAvailability.endTime.toISOString(),
            },
            {
                onSuccess: (result) => {
                    if (result.success) {
                        refetchCoachAvailability();
                        setIsDialogOpen(false);
                        setAddAvailabilityError(undefined);
                    } else {
                        // TODO: Determine specific error message from result errorType
                        setAddAvailabilityError("Failed to add availability");
                    }
                },
                onError: () => {
                    setAddAvailabilityError("Failed to add availability");
                },
            },
        );
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
                <Dialog
                    defaultOpen={false}
                    open={isDialogOpen}
                    onOpenChange={() => {
                        setNewAvailability({
                            startTime: undefined,
                            endTime: undefined,
                        });
                        setIsDialogOpen(!isDialogOpen);
                        setAddAvailabilityError(undefined);
                    }}
                >
                    <DialogTrigger asChild>
                        <Button variant="primary" text="Add Availability" />
                    </DialogTrigger>
                    <DialogContent
                        showCloseButton
                        closeOnOverlayClick
                        closeOnEscape
                    >
                        <ConfirmTimeContent
                            startTime={newAvailability.startTime}
                            endTime={newAvailability.endTime}
                            setStartTime={(date: Date) =>
                                setNewAvailability((prev) =>
                                    prev ? { ...prev, startTime: date } : prev,
                                )
                            }
                            setEndTime={(date: Date) =>
                                setNewAvailability((prev) =>
                                    prev ? { ...prev, endTime: date } : prev,
                                )
                            }
                            isSubmitting={addAvailabilityMutation.isPending}
                            onSubmit={onSubmit}
                            submitError={addAvailabilityError}
                        />
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
