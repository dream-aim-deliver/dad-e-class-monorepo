import { getDictionary, isLocalAware } from "@maany_shr/e-class-translations";
import React, { FC } from "react";
import { Button } from "../button";

export interface CoachingSessionTrackerProps extends isLocalAware {
    children: React.ReactNode;
    /** When provided, shows the "Buy Sessions" button. When undefined, button is hidden. */
    onClickBuySessions?: () => void;
};

/**
 * A container component for managing and displaying coaching sessions with a "Buy More" action.
 *
 * @param children - Coaching session cards (typically `CoachingSessionCard` components)
 * @param onClickBuySessions - Callback for the "Buy More Sessions" button click
 * @param locale - Locale string for internationalization (inherited from `isLocalAware`)
 *
 * @example
 * <CoachingSessionTracker 
 *   onClickBuySessions={handlePurchase} 
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
    onClickBuySessions,
    locale
}) => {
    const dictionary = getDictionary(locale);
    const hasChildren = React.Children.count(children) > 0;
    return (
        <div className="flex md:flex-row flex-col p-4 gap-4 bg-card-fill border-1 border-card-stroke rounded-medium items-center w-full">
            <div className="flex flex-col gap-2 items-start w-full">
                <p className="text-xs lg:text-sm text-text-secondary font-important">
                    {hasChildren ?
                        dictionary.components.coachingSessionTracker.coachingSessionText :
                        dictionary.components.coachingSessionTracker.noCoachingSessionText
                    }
                </p>
                <div className="flex gap-2 pr-2 flex-wrap max-h-[7.1rem] overflow-y-auto relative scrollable-container">
                    {children}
                    {/* Scrollbar styling */}
                    <style>{`
                        .scrollable-container::-webkit-scrollbar {
                            width: 8px;
                            height: 8px;
                        }
                        .scrollable-container::-webkit-scrollbar-track {
                            background: var(--color-base-neutral-800);
                            border-radius: 4px;
                        }
                        .scrollable-container::-webkit-scrollbar-thumb {
                            background: var(--color-base-neutral-400);
                            border-radius: 4px;
                        }
                        .scrollable-container::-webkit-scrollbar-thumb:hover {
                            background: var(--color-base-neutral-500);
                            cursor: pointer;
                        }
                    `}</style>
                </div>
            </div>
            {onClickBuySessions && (
                <Button
                    onClick={onClickBuySessions}
                    variant="secondary"
                    size="medium"
                    text={hasChildren ?
                        dictionary.components.coachingSessionTracker.buyMoreSessionsText :
                        dictionary.components.coachingSessionTracker.buyCoachingSessionsText
                    }
                    className='md:w-auto w-full'
                />
            )}
        </div>
    )
};