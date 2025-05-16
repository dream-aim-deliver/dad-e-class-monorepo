import { FC, useState } from "react";
import { CoachingSessionTypes } from "../course-builder-lesson-component/types";
import { RadioButton } from "../radio-button";
import { getDictionary } from "@maany_shr/e-class-translations";

/**
 * A component that allows users to select a coaching session type from a list of options.
 * Each option is displayed as a radio button with the session's name and duration.
 *
 * @param type The type of the coaching session.
 * @param id The unique ID of the coaching session.
 * @param order The order of the coaching session in the list.
 * @param coachingSessionTypes An array of available coaching session types, each containing:
 *   - `id`: The unique ID of the session type.
 *   - `name`: The name of the session type.
 *   - `duration`: The duration of the session in minutes.
 * @param onChange Callback function triggered when the selected session type changes.
 *   The function receives an object containing:
 *   - `type`: The type of the coaching session.
 *   - `id`: The unique ID of the coaching session.
 *   - `order`: The order of the coaching session.
 *   - `coaching_offering_type_id`: The ID of the selected session type.
 *
 * @example
 * <CoachingSessionBuilderView
 *   type="individual"
 *   id={1}
 *   order={2}
 *   coachingSessionTypes={[
 *     { id: 1, name: "Session A", duration: 30 },
 *     { id: 2, name: "Session B", duration: 60 },
 *   ]}
 *   onChange={(data) => console.log(data)}
 * />
 */

export const CoachingSessionBuilderView: FC<CoachingSessionTypes> = ({
    type,
    id,
    order,
    coachingSessionTypes,
    onChange,
    locale,
}) => {
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const dictionary = getDictionary(locale);

    const handleChange = (value: string) => {
        const numValue = Number(value);
        setSelectedId(numValue);
        onChange({
            type,
            id,
            order,
            coaching_offering_type_id: numValue,
        });
    };
    return (
        <div className="flex flex-col gap-4 w-full items-start justify-center">
            {coachingSessionTypes.map((session) => (
                <div key={session.id} className="flex gap-4 items-center">
                    <div className="w-fit flex items-center">
                        <RadioButton
                            name={`coaching-session-${id}`}
                            value={String(session.id)}
                            checked={selectedId === session.id}
                            onChange={handleChange}
                            size="medium"
                        />
                    </div>
                    <div className="flex gap-1 items-center">
                        <span className="text-text-primary text-sm leading-[100%] font-bold">
                            {session.name}
                        </span>
                        <span className="text-text-secondary text-sm leading-[100%]">
                            {session.duration} {dictionary.components.coachingSessionCourseBuilder.minText}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
};