import * as React from "react";
import { Button } from "../button";
import { isLocalAware } from "@maany_shr/e-class-translations";

interface EmptyStateProps extends isLocalAware {
  message: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

/**
 * A reusable EmptyState component that displays a message and a mandatory call-to-action button.
 *
 * @param message The message to display in the empty state.
 * @param buttonText The text to display on the button.
 * @param onButtonClick The function to call when the button is clicked.
 * @param locale The locale for translations.
 *
 * @returns A centered empty state component with a message and a button.
 *
 * @example
 * <EmptyState
 *   message="No courses available"
 *   buttonText="Browse Courses"
 *   onButtonClick={() => navigate("/courses")}
 *   locale="en"
 * />
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  message,
  buttonText,
  onButtonClick,
  locale,
}) => {
  return (
      <div className="flex flex-col md:p-5 p-3 gap-2 rounded-medium border border-card-stroke bg-card-fill w-full lg:min-w-[22rem]">
        {message && <p className="text-text-secondary text-md">{message}</p>}
        {buttonText?.trim() && buttonText && <Button
          variant="primary"
          size="medium"
          className="mt-4"
          onClick={onButtonClick}
          text={buttonText}
        />}
    </div>
  );
};