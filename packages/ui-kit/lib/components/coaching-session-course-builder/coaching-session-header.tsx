import { getDictionary, isLocalAware } from "@maany_shr/e-class-translations";
import { FC } from "react";
import { IconCoachingSession } from "../icons/icon-coaching-session";

export interface CoachingSessionHeaderProps extends isLocalAware {
    name: string;
    duration: number; // in minutes
};

/**
 * CoachingSessionHeader
 *
 * A presentational component that displays a header for a coaching session.
 * It shows a session icon, a translated label, the session's name, and its duration.
 * The component supports internationalization/localization via the `locale` prop.
 *
 * @param name The name of the coaching session.
 * @param duration The duration of the session in minutes.
 * @param locale (Optional) The locale code for translations.
 *
 * @example
 * <CoachingSessionHeader
 *   name="Session A"
 *   duration={45}
 *   locale="en"
 * />
 */

export const CoachingSessionHeader: FC<CoachingSessionHeaderProps> = ({
    name,
    duration,
    locale,
}) => {
    const dictionary = getDictionary(locale);
    return (
        <div className="flex gap-4 items-center">
            <div className="flex gap-1 w-full">
                <IconCoachingSession
                    classNames="text-base-white"
                />
                <p className="text-base-white font-bold leading-[150%] text-sm">
                    {dictionary.components.coachingSessionCourseBuilder.coachingSessionText}
                </p>
            </div>
            <div className="flex flex-col gap-1 p-2 items-end bg-base-neutral-800 border-1 border-base-neutral-700 rounded-medium">
                <p className="text-text-primary text-md font-bold leading-[120%] whitespace-nowrap">
                    {name}
                </p>
                <p className="text-text-secondary text-sm">
                    {duration} {dictionary.components.coachingSessionCourseBuilder.minutesText}
                </p>
            </div>
        </div>
    );
};