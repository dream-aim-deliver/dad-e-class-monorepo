'use client';

import React, { useState, useRef, useEffect } from 'react';
import { IconCalendar, InputField } from '@maany_shr/e-class-ui-kit';
import MonthlyCalendarPicker from './monthly-calendar-picker';
import { useTranslations } from 'next-intl';

interface DatePickerProps {
    selectedDate?: Date;
    onDateSelect: (date: Date) => void;
    onCalendarOpenChange?: (isOpen: boolean) => void;
}

export default function DatePicker({
    selectedDate,
    onDateSelect,
    onCalendarOpenChange,
}: DatePickerProps) {
    const t = useTranslations('pages.calendarPage');
    const [datePickerOpen, setDatePickerOpen] = useState(false);
    const datePickerRef = useRef<HTMLDivElement>(null);

    // Notify parent when calendar open state changes
    useEffect(() => {
        onCalendarOpenChange?.(datePickerOpen);
    }, [datePickerOpen, onCalendarOpenChange]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                datePickerRef.current &&
                !datePickerRef.current.contains(event.target as Node)
            ) {
                setDatePickerOpen(false);
            }
        }

        if (datePickerOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [datePickerOpen]);

    const getCurrentDateValue = (): string => {
        if (!selectedDate) return '';
        return selectedDate.toLocaleDateString();
    };

    return (
        <div ref={datePickerRef} className="relative">
            <InputField
                inputText={t('dateLabel')}
                value={getCurrentDateValue()}
                setValue={() => {
                    // Can't be edited directly
                }}
                hasRightContent
                rightContent={
                    <span
                        onClick={() => {
                            setDatePickerOpen((prev) => !prev);
                        }}
                        className="text-base-brand-500 cursor-pointer"
                    >
                        <IconCalendar />
                    </span>
                }
            />
            {datePickerOpen && (
                <div className="absolute top-full left-0 mt-2 z-40">
                    <MonthlyCalendarPicker
                        onDateClick={(date) => {
                            onDateSelect(date);
                            setDatePickerOpen(false);
                        }}
                        selectedDate={selectedDate}
                    />
                </div>
            )}
        </div>
    );
}
