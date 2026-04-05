'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { IconCalendar, InputField, Z_INDEX } from '@maany_shr/e-class-ui-kit';
import MonthlyCalendarPicker from './monthly-calendar-picker';
import { useTranslations } from 'next-intl';

interface DatePickerProps {
    selectedDate?: Date;
    onDateSelect: (date: Date) => void;
}

export default function DatePicker({
    selectedDate,
    onDateSelect,
}: DatePickerProps) {
    const t = useTranslations('pages.calendarPage');
    const [datePickerOpen, setDatePickerOpen] = useState(false);
    const triggerRef = useRef<HTMLDivElement>(null);
    const calendarRef = useRef<HTMLDivElement>(null);
    const [calendarStyle, setCalendarStyle] = useState<React.CSSProperties>({});

    const updateCalendarPosition = useCallback(() => {
        if (!triggerRef.current) return;
        const rect = triggerRef.current.getBoundingClientRect();
        setCalendarStyle({
            position: 'fixed',
            top: rect.bottom + 8,
            left: rect.left,
            zIndex: Z_INDEX.POPOVER,
        });
    }, []);

    useEffect(() => {
        if (!datePickerOpen) return;
        updateCalendarPosition();
        window.addEventListener('scroll', updateCalendarPosition, true);
        window.addEventListener('resize', updateCalendarPosition);
        return () => {
            window.removeEventListener('scroll', updateCalendarPosition, true);
            window.removeEventListener('resize', updateCalendarPosition);
        };
    }, [datePickerOpen, updateCalendarPosition]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const target = event.target as Node;
            const inTrigger = triggerRef.current?.contains(target);
            const inCalendar = calendarRef.current?.contains(target);
            if (!inTrigger && !inCalendar) {
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
        <div ref={triggerRef} className="relative">
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
            {datePickerOpen && typeof document !== 'undefined' && createPortal(
                <div ref={calendarRef} style={calendarStyle}>
                    <MonthlyCalendarPicker
                        onDateClick={(date) => {
                            onDateSelect(date);
                            setDatePickerOpen(false);
                        }}
                        selectedDate={selectedDate}
                    />
                </div>,
                (triggerRef.current?.closest('.theme') as HTMLElement) ?? document.body,
            )}
        </div>
    );
}
