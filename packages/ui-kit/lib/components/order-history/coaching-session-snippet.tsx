import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { Badge } from '../badge';

export interface CoachingSessionSnippetProps extends isLocalAware {
    /** The name of the coaching session (e.g. "Quick sprint") */
    sessionName: string;
    /** Duration in minutes (e.g. 20) */
    durationMinutes: number;
    /** Number of sessions of this type (e.g. 2) */
    count: number;
}

/**
 * `CoachingSessionSnippet` is a compact UI component used to display
 * a summary of a specific coaching session type within a purchase or
 * order context.
 *
 * It shows:
 * - The session name (e.g., "Quick sprint")
 * - The duration in minutes (localized label from the dictionary)
 * - A small badge displaying the number of sessions (e.g., ×2)
 *
 * This component is typically used inside order or coaching-related
 * cards, such as the `OrderHistoryCard`, to provide a quick visual
 * reference of what coaching sessions are included.
 *
 * @example
 * ```tsx
 * import { CoachingSessionSnippet } from '../coaching-session-snippet';
 *
 * <CoachingSessionSnippet
 *     locale="en"
 *     sessionName="Quick sprint"
 *     durationMinutes={20}
 *     count={2}
 * />
 * ```
 *
 * @param {CoachingSessionSnippetProps} props - The properties used to render the component.
 * @param {string} props.sessionName - The name of the coaching session (e.g. "Quick sprint").
 * @param {number} props.durationMinutes - The session duration in minutes (e.g. 20).
 * @param {number} props.count - How many sessions of this type are included.
 * @param {string} props.locale - The locale used to fetch localized labels from the dictionary.
 */

export const CoachingSessionSnippet = (props: CoachingSessionSnippetProps) => {
    const dictionary =
        getDictionary(props.locale).components.coachingSessionSnippet;

    return (
        <div className="flex items-center gap-2 bg-base-neutral-800 border border-base-neutral-700 rounded-medium px-3 py-2">
            <p className="text-text-primary font-important text-sm">
                {props.sessionName}
            </p>
            <p className="text-text-secondary text-sm">
                {props.durationMinutes} {dictionary.minutes}
            </p>
            <Badge
                variant="info"
                size="medium"
                text={`x${props.count}`}
            />
        </div>
    );
};
