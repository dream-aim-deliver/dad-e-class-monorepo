import { getDictionary, isLocalAware } from "@maany_shr/e-class-translations";
import { TCoachingOffer } from "packages/models/src/coaching-offer";
import { FC } from "react";
import { Badge } from "../badge";

export interface CoachingSessionCardProps extends TCoachingOffer , isLocalAware {
    used: number;
    included: number;
};

/**
 * A coaching session card component displaying session details and usage tracking.
 *
 * @param title - The title/name of the coaching session.
 * @param duration - Duration of the session in minutes.
 * @param used - Number of sessions used/consumed.
 * @param included - Total sessions available in the package.
 * @param locale - Locale string for internationalization (inherited from `isLocalAware`).
 *
 * @example
 * <CoachingSessionCard
 *   title="Career Coaching"
 *   duration={60}
 *   used={3}
 *   included={10}
 *   locale="en"
 * />
 *
 * @remarks
 * - Uses `Badge` component to display usage ratio (e.g., "3/10 used")
 * - Integrates with dictionary system for localized text
 * - Responsive layout with mobile-first sizing
 */

export const CoachingSessionCard: FC<CoachingSessionCardProps> = ({
    title,
    duration,
    used,
    included ,
    locale
}) => {
    const dictionary = getDictionary(locale);
    return (
        <div className="flex p-2 gap-2 items-center bg-base-neutral-800 border-1 border-base-neutral-700 rounded-medium min-w-[219px] md:w-auto w-full">
            <div className="flex flex-col items-start gap-1 w-full">
                <p className="text-sm text-text-primary font-bold leading-[100%]">
                    {title}
                </p>
                <p className="text-sm text-text-secondary leading-[100%]">
                    {`${duration} ${dictionary.components.coachingSessionTracker.minuteText}`}
                </p>
            </div>
            <Badge 
                text={`${used}/${included} ${dictionary.components.coachingSessionTracker.usedText}`} 
                variant="info" 
                size="big"
                className="py-1" 
            />
        </div>
    )
};