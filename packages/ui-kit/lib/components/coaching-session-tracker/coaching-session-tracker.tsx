import { getDictionary, isLocalAware } from "@maany_shr/e-class-translations";
import { FC } from "react";
import { Button } from "../button";

export interface CoachingSessionTrackerProps extends isLocalAware {
    children: React.ReactNode;
    onClickByMoreSessions: () => void;
};

/**
 * A container component for managing and displaying coaching sessions with a "Buy More" action.
 *
 * @param children - Coaching session cards (typically `CoachingSessionCard` components)
 * @param onClickByMoreSessions - Callback for the "Buy More Sessions" button click
 * @param locale - Locale string for internationalization (inherited from `isLocalAware`)
 *
 * @example
 * <CoachingSessionTracker 
 *   onClickByMoreSessions={handlePurchase} 
 *   locale="en"
 * >
 *   <CoachingSessionCard {...session1} />
 *   <CoachingSessionCard {...session2} />
 * </CoachingSessionTracker>
 *
 * @remarks
 * - Responsive layout (column on mobile, row on desktop)
 * - Includes localized text for section header and button
 * - Uses `Button` component with secondary styling for purchases
 * - Flexible wrapping layout for session cards
 */

export const CoachingSessionTracker: FC<CoachingSessionTrackerProps> = ({
    children,
    onClickByMoreSessions,
    locale
}) => {
    const dictionary = getDictionary(locale);
    return (
        <div className="flex md:flex-row flex-col p-4 gap-4 bg-card-fill border-1 border-card-stroke rounded-medium items-center w-full">
            <div className="flex flex-col gap-2 items-start w-full">
                <p className="text-xs text-text-secondary font-bold">
                    {dictionary.components.coachingSessionTracker.coachingSessionText}
                </p>
                <div className="flex gap-2 flex-wrap">
                    {children}
                </div>
            </div>
            <Button 
                onClick={onClickByMoreSessions} 
                variant="secondary" 
                size="medium" 
                text={dictionary.components.coachingSessionTracker.buyMoreSessionsText}
                className='md:w-auto w-full'
            />
        </div>
    )
};