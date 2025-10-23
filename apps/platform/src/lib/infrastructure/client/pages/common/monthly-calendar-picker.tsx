import { TLocale } from '@maany_shr/e-class-translations';
import { MonthlyCalendar } from '@maany_shr/e-class-ui-kit';
import { useLocale } from 'next-intl';
import { useState } from 'react';

interface MonthlyCalendarPickerProps {
    onDateClick: (date: Date) => void;
    selectedDate?: Date;
}

export default function MonthlyCalendarPicker({
    onDateClick,
    selectedDate,
}: MonthlyCalendarPickerProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const locale = useLocale() as TLocale;
    // Placeholder for a calendar picker component
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
