import { useMemo } from 'react';
import { IconPlus } from '../icons';

interface AvailabilityCalendarCardProps {
    locale: string;
    start: Date;
    end: Date;
    onClick?: (startTime: Date) => void;
}

export function AvailabilityCalendarCard(props: AvailabilityCalendarCardProps) {
    const formatTime = (date: Date) => {
        return date.toLocaleTimeString(props.locale, {
            hour: '2-digit',
            minute: '2-digit',
            hour12: undefined,
        });
    };

    const timeRange = `${formatTime(props.start)} - ${formatTime(props.end)}`;

    const timeSlots = useMemo(() => {
        const slots: { start: Date; end: Date }[] = [];
        const current = new Date(props.start);
        const endTime = new Date(props.end);

        while (current < endTime) {
            const slotEnd = new Date(current.getTime() + 30 * 60 * 1000); // Add 30 minutes
            if (slotEnd <= endTime) {
                slots.push({
                    start: new Date(current),
                    end: slotEnd,
                });
            }
            current.setTime(current.getTime() + 30 * 60 * 1000);
        }

        return slots;
    }, [props.start, props.end]);

    return (
        <div
            className={`h-full w-full rounded-md bg-action-semi-transparent-medium text-action-default font-semibold text-sm overflow-hidden ${props.onClick ? 'cursor-pointer' : ''}`}
        >
            <div className="relative truncate p-2" title={timeRange}>
                {timeRange}
            </div>

            {props.onClick && (
                <div className="absolute inset-0 z-10">
                    {timeSlots.map((slot, index) => (
                        <div
                            key={index}
                            className="group absolute w-full hover:bg-action-semi-transparent-strong hover:border hover:border-action-default transition-colors duration-150 cursor-pointer flex items-center justify-center"
                            style={{
                                top: `${(index / timeSlots.length) * 100}%`,
                                height: `${100 / timeSlots.length}%`,
                            }}
                            title={formatTime(slot.start)}
                            onClick={() => props.onClick?.(slot.start)}
                        >
                            <span className="invisible group-hover:visible text-action">
                                <IconPlus />
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

interface SessionCalendarCardProps {
    locale: string;
    start: Date;
    end: Date;
    onClick?: () => void;
    title: string;
}

export function SessionCalendarCard(props: SessionCalendarCardProps) {
    const formatTime = (date: Date) => {
        return date.toLocaleTimeString(props.locale, {
            hour: '2-digit',
            minute: '2-digit',
            hour12: undefined,
        });
    };

    const timeRange = `${formatTime(props.start)} - ${formatTime(props.end)}`;

    return (
        <div
            className={`h-full w-full rounded-md bg-action-default text-text-primary-inverted font-semibold p-2 text-sm overflow-hidden ${props.onClick ? 'cursor-pointer' : ''}`}
            onClick={props.onClick}
        >
            <div className="truncate" title={timeRange}>
                {timeRange}
            </div>
            <div className="truncate" title={props.title}>
                {props.title}
            </div>
        </div>
    );
}

interface AnonymousCalendarCardProps {
    locale: string;
    start: Date;
    end: Date;
}

export function AnonymousCalendarCard(props: AnonymousCalendarCardProps) {
    const formatTime = (date: Date) => {
        return date.toLocaleTimeString(props.locale, {
            hour: '2-digit',
            minute: '2-digit',
            hour12: undefined,
        });
    };

    const timeRange = `${formatTime(props.start)} - ${formatTime(props.end)}`;

    return (
        <div
            className={`h-full w-full rounded-md bg-base-neutral-200 text-text-primary-inverted font-semibold p-2 text-sm overflow-hidden`}
        >
            <div className="truncate" title={timeRange}>
                {timeRange}
            </div>
        </div>
    );
}
