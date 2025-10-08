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

export function CoachingAvailabilityCard({
    availability,
    coachingSessions,
    onRequest,
}: CoachingAvailabilityCardProps) {
    // TODO: map coaching sessions
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
        </div>
    );
}
