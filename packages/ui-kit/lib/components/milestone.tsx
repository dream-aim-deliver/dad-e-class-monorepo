import { FC } from "react";
import { IconMilestone } from "./icons/icon-milestone";
import { getDictionary, isLocalAware } from "@maany_shr/e-class-translations";
import { IconCheck } from "./icons/icon-check";
import { cn } from "../utils/style-utils";

export interface MilestoneProps extends isLocalAware {
    completed: boolean;
};

/**
 * Milestone component that visually represents a milestone status.
 *
 * @param completed A boolean indicating whether the milestone has been completed.
 * @param locale The locale string used for fetching localized text.
 *
 * @returns A styled milestone indicator with an icon, localized text, and a checkmark if completed.
 *
 * @example
 * // Render a completed milestone with English locale
 * <Milestone completed={true} locale="en" />
 *
 * @example
 * // Render an incomplete milestone with German locale
 * <Milestone completed={false} locale="de" />
 */


export const Milestone: FC<MilestoneProps> = ({
    completed,
    locale
}) => {
    const disctionary = getDictionary(locale);
    return (
        <div 
            role='milestone-container'
            className="flex justify-center items-center gap-2 w-full min-w-[13.5rem] h-[2rem] bg-base-neutral-800 border-1 border-base-neutral-700 rounded-medium"
        >
            <IconMilestone classNames={cn(`${completed ? 'text-feedback-success-primary' : 'text-text-secondary'}`)} />
            <p className="text-sm font-bold text-text-primary">
                {disctionary.components.milestone.milestoneText}
            </p>
            {completed && (
                <IconCheck classNames="text-feedback-success-primary" />
            )}
        </div>
    );
};