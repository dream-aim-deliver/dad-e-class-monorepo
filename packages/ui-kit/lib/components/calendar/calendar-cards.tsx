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
            className="h-full w-full rounded-md bg-action-semi-transparent-medium text-action-default font-semibold p-2 text-sm cursor-pointer"
            onClick={props.onClick}
        >
            {timeRange}
        </div>
    );
}

export function SessionCalendarCard() {

}