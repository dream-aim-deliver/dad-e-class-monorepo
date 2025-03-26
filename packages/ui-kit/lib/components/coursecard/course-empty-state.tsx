// course-empty-state.tsx
import * as React from "react";
import { Button } from "../button";
import { isLocalAware, getDictionary } from "@maany_shr/e-class-translations";

interface EmptyStateProps extends isLocalAware {
    message?: string;
    buttonText?: string; // Optional
    onButtonClick?: () => void; // Optional
}

/**
 * A reusable EmptyState component that displays a message and an optional call-to-action button.
 *
 * @param message The message to display in the empty state.
 * @param buttonText The text to display on the button (optional).
 * @param onButtonClick The function to call when the button is clicked (optional).
 *
 * @returns A centered empty state component with a message and optional button.
 *
 * @example
 * <EmptyState message="No courses available" />
 * <EmptyState message="You haven't enrolled in any courses yet" buttonText="Browse Courses" onButtonClick={() => console.log("Browse clicked")} />
 */
export const EmptyState: React.FC<EmptyStateProps> = ({ message, buttonText, onButtonClick }) => {
    return (
        <div className="flex justify-center items-center w-full p-10 rounded-2xl border border-solid bg-card-fill border-card-stroke max-md:px-5 ">
            <div className="flex flex-col justify-center items-center self-stretch my-auto text-center">
                {message && <div className="text-base text-white">{message}</div>}
                {buttonText && onButtonClick && (
                    <Button 
                        variant="primary" 
                        size="medium" 
                        className="mt-4" 
                        onClick={onButtonClick} 
                        text={buttonText} 
                    />
                )}
            </div>
        </div>
    );
};

export const CourseEmptyState: React.FC<isLocalAware> = ({ locale }) => {
    const dictionary = getDictionary(locale);

    return (
        <EmptyState
            message={dictionary.components.courseCard.courseEmptyState.message}
            buttonText={dictionary.components.courseCard.courseEmptyState.buttonText}
            onButtonClick={() => console.log("Browse courses")}
            locale={locale}
        />
    );
};