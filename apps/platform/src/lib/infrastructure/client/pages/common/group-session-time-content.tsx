'use client';

import { TLocale } from '@maany_shr/e-class-translations';
import { useLocale, useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import { Button, DefaultError, InputField, Dropdown } from '@maany_shr/e-class-ui-kit';
import DatePicker from './date-picker';
import { trpc } from '../../trpc/cms-client';
import { viewModels } from '@maany_shr/e-class-models';
import { useListCoachingOfferingsPresenter } from '../../hooks/use-coaching-offerings-presenter';

interface CoachingOffering {
    id: number;
    name: string;
    duration: number;
}

interface GroupSessionTimeContentProps {
    startTime?: Date;
    setStartTime: (date: Date) => void;
    selectedOffering?: CoachingOffering;
    setSelectedOffering: (offering: CoachingOffering) => void;
    onSubmit: () => void;
    isSubmitting?: boolean;
    submitError?: string;
    buttonText: string;
}

export default function GroupSessionTimeContent({
    startTime,
    setStartTime,
    selectedOffering,
    setSelectedOffering,
    onSubmit,
    isSubmitting = false,
    submitError,
    buttonText,
}: GroupSessionTimeContentProps) {
    const locale = useLocale() as TLocale;
    const t = useTranslations('pages.calendarPage');

    // Fetch coaching offerings
    const [coachingOfferingsResponse] = trpc.listCoachingOfferings.useSuspenseQuery({});
    const [coachingOfferingsViewModel, setCoachingOfferingsViewModel] =
        useState<viewModels.TCoachingOfferingListViewModel | undefined>(undefined);
    const { presenter } = useListCoachingOfferingsPresenter(setCoachingOfferingsViewModel);
    // @ts-ignore
    presenter.present(coachingOfferingsResponse, coachingOfferingsViewModel);

    const getTimeValue = (time?: Date): string => {
        if (!time) return '';
        return time.toLocaleTimeString(locale, {
            hour: 'numeric',
            minute: '2-digit',
        });
    };

    const [startTimeValue, setStartTimeValue] = useState(() => {
        if (!startTime) return '';
        return getTimeValue(startTime);
    });
    const [hasTimeError, setHasTimeError] = useState(false);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    const parseTimeString = (
        timeStr: string,
    ): { hours: number; minutes: number } | null => {
        const cleanTime = timeStr.trim();

        // Handle 24-hour format (e.g., "14:30", "09:15")
        const time24Match = cleanTime.match(/^(\d{1,2}):(\d{2})$/);
        if (time24Match) {
            const hours = parseInt(time24Match[1], 10);
            const minutes = parseInt(time24Match[2], 10);
            if (hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60) {
                return { hours, minutes };
            }
        }

        // Handle 12-hour format (e.g., "2:30 PM", "11:45 AM", "2 PM")
        const time12Match = cleanTime.match(
            /^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i,
        );
        if (time12Match) {
            let hours = parseInt(time12Match[1], 10);
            const minutes = parseInt(time12Match[2] || '0', 10);
            const meridiem = time12Match[3].toUpperCase();

            if (hours < 1 || hours > 12 || minutes < 0 || minutes >= 60) {
                return null;
            }

            if (meridiem === 'AM' && hours === 12) {
                hours = 0;
            } else if (meridiem === 'PM' && hours !== 12) {
                hours += 12;
            }

            return { hours, minutes };
        }

        return null;
    };

    const handleDateChange = (newDate: Date) => {
        try {
            newDate.setHours(
                startTime?.getHours() ?? 0,
                startTime?.getMinutes() ?? 0,
                0,
                0,
            );
            setStartTime(newDate);
        } catch (error) {
            console.error('Error setting date:', error);
        }
    };

    const handleStartTimeChange = (newTimeValue: string) => {
        if (!startTime) return;

        const parsedTime = parseTimeString(newTimeValue);

        if (!parsedTime) {
            setHasTimeError(true);
            return;
        }

        setHasTimeError(false);

        try {
            const newDate = new Date(startTime);
            newDate.setHours(parsedTime.hours, parsedTime.minutes, 0, 0);
            setStartTime(newDate);
        } catch (error) {
            setHasTimeError(true);
        }
    };

    // Prepare coaching offerings for dropdown
    const coachingOfferingsOptions = React.useMemo(() => {
        if (!coachingOfferingsViewModel || coachingOfferingsViewModel.mode !== 'default') {
            return [];
        }
        
        return coachingOfferingsViewModel.data.offerings.map((offering) => ({
            value: offering.id.toString(),
            label: `${offering.name} (${offering.duration} min)`,
            data: {
                id: offering.id,
                name: offering.name,
                duration: offering.duration,
            },
        }));
    }, [coachingOfferingsViewModel]);

    const handleOfferingChange = (selected: string | string[] | null) => {
        if (typeof selected === 'string') {
            const selectedOption = coachingOfferingsOptions.find(option => option.value === selected);
            if (selectedOption) {
                setSelectedOffering(selectedOption.data as CoachingOffering);
            }
        }
    };

    const isFormValid = !hasTimeError && startTime && selectedOffering && !isSubmitting;

    useEffect(() => {
        handleStartTimeChange(startTimeValue);
    }, [startTimeValue]);

    if (!coachingOfferingsViewModel) {
        return <div>Loading...</div>;
    }

    if (coachingOfferingsViewModel.mode !== 'default') {
        return <DefaultError locale={locale} />;
    }

    return (
        <div className={`flex flex-col gap-3 transition-all duration-300 ${isCalendarOpen ? 'min-h-[550px]' : 'min-h-0'}`}>
            <div className="relative">
                <span className="text-sm text-text-secondary">{t('dateLabel')}</span>
                <DatePicker
                    selectedDate={startTime}
                    onDateSelect={handleDateChange}
                    onCalendarOpenChange={setIsCalendarOpen}
                />
            </div>

            {startTime && (
                <div>
                    <span className="text-sm text-text-secondary">
                        {t('startTimeLabel')}
                    </span>
                    <InputField
                        inputText="Eg. 15:00"
                        value={startTimeValue}
                        setValue={setStartTimeValue}
                    />
                </div>
            )}
            {hasTimeError && (
                <DefaultError
                    locale={locale}
                    title={t('invalidTimeFormatTitle')}
                    description={t('invalidTimeFormatDescription')}
                />
            )}

            {startTime && (
                <div>
                    <span className="text-sm text-text-secondary">
                        {t('groupCoachingOfferings')}
                    </span>
                    <Dropdown
                        type="simple"
                        options={coachingOfferingsOptions}
                        defaultValue={selectedOffering?.id.toString() || ''}
                        onSelectionChange={handleOfferingChange}
                        text={{
                            simpleText: t('selectCoachingOffering')
                        }}
                    />
                </div>
            )}

            {selectedOffering && (
                <div className="p-3 bg-base-neutral-800 rounded-md border border-base-neutral-700">
                    <p className="text-sm text-text-secondary">
                        Selected offering: <span className="text-text-primary font-medium">{selectedOffering.name}</span>
                    </p>
                    <p className="text-sm text-text-secondary">
                        Duration: <span className="text-text-primary">{selectedOffering.duration} minutes</span>
                    </p>
                </div>
            )}

            {submitError && (
                <DefaultError
                    locale={locale}
                    title=""
                    description={submitError}
                />
            )}

            <Button
                variant="primary"
                className="w-full"
                onClick={onSubmit}
                text={buttonText}
                disabled={!isFormValid}
            />
        </div>
    );
}