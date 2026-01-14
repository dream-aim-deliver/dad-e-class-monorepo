'use client';

import { TLocale } from '@maany_shr/e-class-translations';
import { useLocale, useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import { Button, DefaultError, InputField } from '@maany_shr/e-class-ui-kit';
import DatePicker from './date-picker';

interface ConfirmTimeContentProps {
    startTime?: Date;
    endTime?: Date;
    setStartTime: (date: Date) => void;
    setEndTime: (date: Date) => void;
    duration?: number;
    onSubmit: () => void;
    isSubmitting?: boolean;
    submitError?: { title: string; description: string };
    buttonText: string;
}

export default function ConfirmTimeContent({
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    onSubmit,
    duration,
    isSubmitting = false,
    submitError,
    buttonText,
}: ConfirmTimeContentProps) {
    const locale = useLocale() as TLocale;
    const t = useTranslations('pages.calendarPage');

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
    const [endTimeValue, setEndTimeValue] = useState(() => {
        if (!endTime) return '';
        return getTimeValue(endTime);
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

            const newEndTime = new Date(newDate);
            if (duration) {
                newEndTime.setMinutes(newEndTime.getMinutes() + duration);
                setEndTime(newEndTime);
            } else if (endTime) {
                newEndTime.setMinutes(endTime.getMinutes());
                setEndTime(newEndTime);
            }

            setStartTime(newDate);
        } catch (error) {
            // Handle invalid date silently
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

            const newEndTime = new Date(newDate);
            if (duration) {
                newEndTime.setMinutes(newEndTime.getMinutes() + duration);
                setEndTime(newEndTime);
            }

            setStartTime(newDate);
        } catch (error) {
            setHasTimeError(true);
        }
    };

    const handleEndTimeChange = (newTimeValue: string) => {
        if (duration !== undefined) {
            // End time is derived from start time + duration; ignore manual changes
            return;
        }

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
            setEndTime(newDate);
        } catch (error) {
            setHasTimeError(true);
        }
    };

    const submitTime = () => {
        // TODO: show error of start time not set (internal error state)
        if (!startTimeValue || !endTimeValue) return;
        if (hasTimeError) return;
        onSubmit();
    };

    useEffect(() => {
        handleStartTimeChange(startTimeValue);
    }, [startTimeValue]);

    useEffect(() => {
        handleEndTimeChange(endTimeValue);
    }, [endTimeValue]);

    // TODO: format the button during the submission
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
                <div className='flex flex-row gap-6 items-center'>
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
                    <div>
                        <span className="text-sm text-text-secondary">
                            {t('endTimeLabel')}
                        </span>
                        <InputField
                            className="text-text-primary"
                            state={
                                duration !== undefined ? 'disabled' : undefined
                            }
                            inputText={
                                duration !== undefined ? getTimeValue(endTime) : "Eg. 16:00"
                            }
                            value={duration !== undefined ? undefined : endTimeValue}
                            setValue={setEndTimeValue}
                        />
                    </div>
                </div>
            )}
            {hasTimeError && (
                <DefaultError
                    locale={locale}
                    title={t('invalidTimeFormatTitle')}
                    description={t('invalidTimeFormatDescription')}
                />
            )}
            {submitError && (
                <DefaultError
                    locale={locale}
                    title={submitError.title}
                    description={submitError.description}
                />
            )}
            <Button
                variant="primary"
                className="w-full"
                onClick={submitTime}
                text={buttonText}
                disabled={hasTimeError || !startTime || !endTime || isSubmitting}
            />
        </div>
    );
}
