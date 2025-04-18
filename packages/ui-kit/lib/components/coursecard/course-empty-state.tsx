import * as React from "react";
import { Button } from "../button";
import { isLocalAware, getDictionary, TLocale } from "@maany_shr/e-class-translations";

interface EmptyStateProps extends isLocalAware {
    message?: string;
    buttonText?: string;
    onButtonClick?: () => void;
}

/**
 * A reusable EmptyState component that displays a message and an optional call-to-action button.
 *
 * @param message The message to display in the empty state.
 * @param buttonText The text to display on the button (optional).
 * @param onButtonClick The function to call when the button is clicked (optional).
 * @param locale The locale for translations.
 *
 * @returns A centered empty state component with a message and optional button.
 *
 * @example
 * <EmptyState message="No courses available" />
 * <EmptyState message="You haven't enrolled in any courses yet" buttonText="Browse Courses" onButtonClick={() => navigate("/courses")} locale="en" />
 */
export const EmptyState: React.FC<EmptyStateProps> = ({ message, buttonText, onButtonClick, locale }) => {
    return (
        <div className="flex justify-center items-center w-full p-10 rounded-2xl border border-solid bg-card-fill border-card-stroke max-md:px-5">
            <div className="flex flex-col justify-center items-center self-stretch my-auto text-center">
                {message && <p className="text-base text-white">{message}</p>}
                {buttonText?.trim() && onButtonClick && (
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

interface CourseEmptyStateProps extends isLocalAware {
    context?: 'creator' | 'coach' | 'student' | 'visitor';
    onButtonClick?: () => void;
}

/**
 * A specialized EmptyState for courses, with user-type-specific messaging and button visibility.
 *
 * @param locale The locale for translations (e.g., 'en', 'de').
 * @param context The user type context to determine the message and button ('creator', 'coach', 'student', 'visitor').
 * @param onButtonClick The function to call when the button is clicked (optional, shown for student/visitor).
 *
 * @returns An EmptyState component with localized message and conditional button.
 *
 * @example
 * <CourseEmptyState locale="en" context="creator" />
 * <CourseEmptyState locale="de" context="student" onButtonClick={() => navigate("/courses")} />
 */
export const CourseEmptyState: React.FC<CourseEmptyStateProps> = ({ locale, context, onButtonClick }) => {
    const dictionary = getDictionary(locale);
    const isCreatorOrCoach = context === 'creator' || context === 'coach';
    const showButton = !!onButtonClick && (context === 'student' || context === 'visitor');

    return (
        <EmptyState
            message={
                isCreatorOrCoach
                    ? dictionary.components.courseCard.courseEmptyState.message2
                    : dictionary.components.courseCard.courseEmptyState.message
            }
            buttonText={showButton ? dictionary.components.courseCard.courseEmptyState.buttonText : undefined}
            onButtonClick={showButton ? onButtonClick : undefined}
            locale={locale}
        />
    );
};