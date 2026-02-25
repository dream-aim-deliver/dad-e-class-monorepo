import { FC } from 'react';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { Button } from './button';
import { ProgressBar } from './progress-bar';

export interface CourseProgressBarProps extends isLocalAware {
    percentage: number;
    onClickResume?: () => void;
    /** Hide the Resume/Begin button. Useful when user is already viewing the course. */
    hideButton?: boolean;
}

/**
 * A component that displays the progress of a course with a visual progress bar and a resume button.
 *
 * @param percentage The current progress of the course as a percentage (0-100).
 * @param onClickResume Callback function triggered when the "Resume" button is clicked.
 * @param locale The current locale for internationalization, used to fetch translated text.
 *
 * @returns A `div` containing the progress information and a "Resume" button.
 *
 * @example
 * <CourseProgressBar
 * percentage={65}
 * onClickResume={() => console.log("Resume clicked!")}
 * locale="en"
 * />
 */

export const CourseProgressBar: FC<CourseProgressBarProps> = ({
    percentage,
    onClickResume,
    locale,
    hideButton = false,
}) => {
    const dictionary = getDictionary(locale);

    // Choose button text based on progress
    const buttonText =
        percentage === 0
            ? dictionary.components.courseProgressBar.beginText
            : dictionary.components.courseProgressBar.resumeText;

    return (
        <div className="flex p-2 gap-4 items-center justify-between w-fit h-fit bg-card-fill border-1 border-card-stroke rounded-medium">
            <div className="flex gap-2 items-center w-full">
                <div className="flex flex-col gap-3 min-w-[97px] w-full">
                    <p className="text-xs text-text-secondary font-bold leading-[100%]">
                        {dictionary.components.courseProgressBar.progressText}
                    </p>
                    <ProgressBar progress={percentage} type="progress" />
                </div>
                <p className="text-sm font-bold text-text-primary">
                    {Number((percentage ?? 0).toFixed(2))}%
                </p>
            </div>
            {!hideButton && onClickResume && (
                <Button
                    variant="text"
                    size="small"
                    className="px-0"
                    onClick={onClickResume}
                    text={buttonText}
                />
            )}
        </div>
    );
};
