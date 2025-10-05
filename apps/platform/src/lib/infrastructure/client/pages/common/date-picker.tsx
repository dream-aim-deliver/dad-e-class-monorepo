'use client';

import React, { useState } from 'react';
import { IconCalendar, InputField } from '@maany_shr/e-class-ui-kit';
import MonthlyCalendarPicker from './monthly-calendar-picker';

interface DatePickerProps {
    selectedDate?: Date;
    onDateSelect: (date: Date) => void;
}

export default function DatePicker({
    selectedDate,
    onDateSelect,
}: DatePickerProps) {
    const [datePickerOpen, setDatePickerOpen] = useState(false);

    const getCurrentDateValue = (): string => {
        if (!selectedDate) return '';
        return selectedDate.toISOString().split('T')[0];
    };

    return (
        <>
            <InputField
                inputText="Date"
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
        </>
    );
}
