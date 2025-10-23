import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { Button } from '../button';
import { cn } from '../../utils/style-utils';

interface CoachingAvailabilityCardProps extends isLocalAware {
    availability?: {
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
    sessionLabel,
}: {
    startTime: Date;
    endTime: Date;
    title: string;
    onClick?: () => void;
    sessionLabel: string;
}) {
    return (
        <div
            className={cn(
                'bg-action-default border border-neutral-700 rounded-md p-4 flex flex-col',
                { 'cursor-pointer': !!onClick },
            )}
            onClick={onClick}
        >
            <h6 className="text-text-primary-inverted">{sessionLabel}</h6>
            <h5 className="text-text-primary-inverted">{title}</h5>
            <p className="text-text-primary-inverted text-sm">
                {formatTime(startTime)} - {formatTime(endTime)}
            </p>
        </div>
    );
}

export function CoachingAvailabilityCard({
    locale,
    availability,
    coachingSessions,
    onRequest,
}: CoachingAvailabilityCardProps) {
    const dictionary = getDictionary(locale);
    const getCoachingSessions = () => {
        return (
            coachingSessions.length > 0 && (
                <div className="flex flex-col gap-2">
                    {coachingSessions.map((session, index) => (
                        <CoachingSessionCard
                            key={`coaching-session-${index}`}
                            startTime={session.startTime}
                            endTime={session.endTime}
                            title={session.title}
                            onClick={session.onClick}
                            sessionLabel={
                                dictionary?.components
                                    ?.coachingAvailabilityCard?.session
                            }
                        />
                    ))}
                </div>
            )
        );
    };

    if (!availability) {
        return getCoachingSessions();
    }

    return (
        <div className="bg-button-secondary-fill rounded-md p-4 flex flex-col gap-4">
            <div
                className={cn('flex flex-row justify-between items-center', {
                    'cursor-pointer': !!availability.onClick,
                })}
                onClick={availability.onClick}
            >
                <div>
                    <h6 className="text-action-default">
                        {
                            dictionary?.components?.coachingAvailabilityCard
                                ?.availability
                        }
                    </h6>
                    <p className="text-text-primary text-md">
                        {formatTime(availability.startTime)} -{' '}
                        {formatTime(availability.endTime)}
                    </p>
                </div>
                {onRequest && (
                    <Button
                        variant="primary"
                        text={
                            dictionary?.components?.coachingAvailabilityCard
                                ?.requestButton
                        }
                        onClick={onRequest}
                    />
                )}
            </div>
            {getCoachingSessions()}
        </div>
    );
}
