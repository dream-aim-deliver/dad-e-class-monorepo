import { isLocalAware } from '@maany_shr/e-class-translations';
import { Button } from '../button';

interface CoachingAvailabilityCardProps extends isLocalAware {
    startTime: Date;
    endTime: Date;
    onClick: () => void;
}

export function CoachingAvailabilityCard({
    startTime,
    endTime,
    onClick,
}: CoachingAvailabilityCardProps) {
    const formatDate = (date: Date) => {
        return date.toLocaleTimeString(undefined, {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="bg-card-fill rounded-md p-4 flex flex-row justify-between items-center border border-card-stroke">
            <div>
                <div className="text-text-secondary text-sm">
                    Availability
                </div>
                <div className="text-text-primary">
                    {formatDate(startTime)} - {formatDate(endTime)}
                </div>
            </div>
            <Button variant="primary" text="Request" onClick={onClick} />
        </div>
    );
}
