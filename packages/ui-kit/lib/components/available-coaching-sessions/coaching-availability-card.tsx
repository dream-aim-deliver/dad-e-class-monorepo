import { isLocalAware } from '@maany_shr/e-class-translations';
import { Button } from '../button';

interface RequestCoachingAvailabilityCardProps extends isLocalAware {
    startTime: Date;
    endTime: Date;
    onClick: () => void;
}

function formatTime(date: Date) {
    return date.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
    });
}

export function RequestCoachingAvailabilityCard({
    startTime,
    endTime,
    onClick,
}: RequestCoachingAvailabilityCardProps) {
    return (
        <div className="bg-card-fill rounded-md p-4 flex flex-row justify-between items-center border border-card-stroke">
            <div>
                <div className="text-text-secondary text-sm">Availability</div>
                <div className="text-text-primary">
                    {formatTime(startTime)} - {formatTime(endTime)}
                </div>
            </div>
            <Button variant="primary" text="Request" onClick={onClick} />
        </div>
    );
}

interface OwnerCoachingAvailabilityCardProps extends isLocalAware {
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
}

export function OwnerCoachingAvailabilityCard({
    availability,
    coachingSessions,
}: OwnerCoachingAvailabilityCardProps) {
    return (
        <div className="bg-card-fill rounded-md p-4 flex flex-row justify-between items-center border border-card-stroke">
            <div className="bg-brand-500">
                <div className="text-text-primary">
                    {formatTime(availability.startTime)} -{' '}
                    {formatTime(availability.endTime)}
                </div>
            </div>
        </div>
    );
}
