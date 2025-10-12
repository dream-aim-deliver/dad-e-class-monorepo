import { isLocalAware } from '@maany_shr/e-class-translations';
import { Button } from '../button';

interface CoachingAvailabilityCardProps extends isLocalAware {
    availability: {
        startTime: Date;
        endTime: Date;
        onClick?: () => void;
    };
    coachingSessions: {
        startTime: Date;
        endTime: Date;
        onClick?: () => void;
        title: string;
    }[];
    onRequest?: () => void;
}

function formatTime(date: Date) {
    return date.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
    });
}

function CoachingSessionCard({
    startTime,
    endTime,
    title,
    onClick,
}: {
    startTime: Date;
    endTime: Date;
    title: string;
    onClick?: () => void;
}) {
    return (
        <div
            className="bg-card-stroke border border-neutral-700 rounded-md p-4 flex flex-col"
            onClick={onClick}
        >
            <div className="text-text-secondary text-sm">Session</div>
            <div className="text-text-primary font-medium">{title}</div>
            <div className="text-text-primary">
                {formatTime(startTime)} - {formatTime(endTime)}
            </div>
        </div>
    );
}

export function CoachingAvailabilityCard({
    availability,
    coachingSessions,
    onRequest,
}: CoachingAvailabilityCardProps) {
    // TODO: Implement handling sessions outside of availability

    return (
        <div className="bg-card-fill rounded-md p-4 flex flex-col gap-4 border border-card-stroke">
            <div
                className="flex flex-row justify-between items-center"
                onClick={availability.onClick}
            >
                <div>
                    <div className="text-text-secondary text-sm">
                        Availability
                    </div>
                    <div className="text-text-primary">
                        {formatTime(availability.startTime)} -{' '}
                        {formatTime(availability.endTime)}
                    </div>
                </div>
                {onRequest && (
                    <Button
                        variant="primary"
                        text="Request"
                        onClick={onRequest}
                    />
                )}
            </div>
            {coachingSessions.length > 0 && (
                <div className="flex flex-col gap-2">
                    {coachingSessions.map((session, index) => (
                        <CoachingSessionCard
                            key={`coaching-session-${index}`}
                            startTime={session.startTime}
                            endTime={session.endTime}
                            title={session.title}
                            onClick={session.onClick}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
