interface AvailabilityCalendarCardProps {
    locale: string;
    start: Date;
    end: Date;
    onClick?: () => void;
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

    return (
        <div
            className={`h-full w-full rounded-md bg-action-semi-transparent-medium text-action-default font-semibold p-2 text-sm overflow-hidden ${props.onClick ? 'cursor-pointer' : ''}`}
            onClick={props.onClick}
        >
            <div className="truncate" title={timeRange}>
                {timeRange}
            </div>
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