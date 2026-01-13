import { TLocale } from '@maany_shr/e-class-translations';
import { MonthlyCalendar } from '@maany_shr/e-class-ui-kit';
import { useLocale } from 'next-intl';
import { useState, useEffect } from 'react';

interface MonthlyCalendarPickerProps {
    onDateClick: (date: Date) => void;
    selectedDate?: Date;
}

export default function MonthlyCalendarPicker({
    onDateClick,
    selectedDate,
}: MonthlyCalendarPickerProps) {
    const [currentDate, setCurrentDate] = useState<Date | undefined>(undefined);
    const locale = useLocale() as TLocale;

    // Initialize date on client side only to avoid hydration mismatch
    useEffect(() => {
        setCurrentDate(new Date());
    }, []);

    // Wait for client-side initialization
    if (!currentDate) {
        return null;
    }

    return (
        <MonthlyCalendar
            locale={locale}
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            onDateClick={onDateClick}
            selectedDate={selectedDate}
            variant="compact"
        />
    );
}
