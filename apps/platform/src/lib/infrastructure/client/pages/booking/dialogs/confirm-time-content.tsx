'use client';

import { TLocale } from '@maany_shr/e-class-translations';
import { useLocale } from 'next-intl';
import React, { useEffect, useState } from 'react';
import {
    Button,
    DefaultError,
    InputField,
} from '@maany_shr/e-class-ui-kit';
import DatePicker from './date-picker';

interface ConfirmTimeContentProps {
    session: ScheduledOffering;
    setSession: React.Dispatch<React.SetStateAction<ScheduledOffering | null>>;
    onSubmit: () => void;
    isSubmitting?: boolean;
}

export default function ConfirmTimeContent({
    session,
    setSession,
    onSubmit,
    isSubmitting = false,
}: ConfirmTimeContentProps) {
    const locale = useLocale() as TLocale;

    const getTimeValue = (time: Date): string => {
        return time.toLocaleTimeString(locale, {
            hour: 'numeric',
            minute: '2-digit',
        });
    };

    const [timeValue, setTimeValue] = useState(() => {
        if (!session.startTime) return '';
        return getTimeValue(session.startTime);
    });
    const [hasTimeError, setHasTimeError] = useState(false);

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
        if (!session.startTime || !session.session?.duration) return;

        try {
            const currentTime = session.startTime;
            newDate.setHours(
                currentTime.getHours(),
                currentTime.getMinutes(),
                0,
                0,
            );

            const newEndTime = new Date(newDate);
            newEndTime.setMinutes(
                newEndTime.getMinutes() + session.session.duration,
            );

            setSession((prevSession) => ({
                ...prevSession!,
                startTime: newDate,
                endTime: newEndTime,
            }));
        } catch (error) {
            // Handle invalid date silently
        }
    };

    const handleTimeChange = (newTimeValue: string) => {
        if (!session.startTime || !session.session?.duration) return;

        const parsedTime = parseTimeString(newTimeValue);

        if (!parsedTime) {
            setHasTimeError(true);
            return;
        }

        setHasTimeError(false);

        try {
            const newDate = new Date(session.startTime);
            newDate.setHours(parsedTime.hours, parsedTime.minutes, 0, 0);

            const newEndTime = new Date(newDate);
            newEndTime.setMinutes(
                newEndTime.getMinutes() + session.session.duration,
            );

            setSession((prevSession) => ({
                ...prevSession!,
                startTime: newDate,
                endTime: newEndTime,
            }));
        } catch (error) {
            setHasTimeError(true);
        }
    };

    useEffect(() => {
        handleTimeChange(timeValue);
    }, [timeValue]);

    if (!session || !session.session || !session.startTime || !session.endTime)
        return null;

    // TODO: format the button during the submission
    return (
        <div className="flex flex-col gap-3">
            <div className="relative">
                <span className="text-sm text-text-secondary">Date</span>
                <DatePicker
                    selectedDate={session.startTime}
                    onDateSelect={handleDateChange}
                />
            </div>
            <div>
                <span className="text-sm text-text-secondary">Start Time</span>
                <InputField
                    inputText="Time"
                    value={timeValue}
                    setValue={setTimeValue}
                />
            </div>
            <div>
                <span className="text-sm text-text-secondary">End Time</span>
                <InputField
                    state="disabled"
                    inputText={getTimeValue(session.endTime)}
                    setValue={() => {
                        // Can't be edited directly
                    }}
                />
            </div>
            {hasTimeError && (
                <DefaultError
                    locale={locale}
                    title=""
                    description="Invalid time format"
                />
            )}
            <Button
                variant="primary"
                className="w-full"
                onClick={onSubmit}
                text="Send request"
                disabled={hasTimeError}
            />
        </div>
    );
}
