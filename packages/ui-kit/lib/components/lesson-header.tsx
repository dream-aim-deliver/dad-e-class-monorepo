import { getDictionary, isLocalAware } from "@maany_shr/e-class-translations";
import { FC, useEffect } from "react";
import { ModulePagination } from "./module-pagination";
import { Button } from "./button";
import { IconEyeShow } from "./icons/icon-eye-show";
import { IconEyeHide } from "./icons/icon-eye-hide";
import { cn } from "../utils/style-utils";

export interface LessonHeaderProps extends isLocalAware {
    currentModule: number;
    totalModules: number;
    moduleTitle: string;
    currentLesson: number;
    totalLessons: number;
    lessonTitle: string;
    showNotes: boolean;
    className?: string;
    onClickPrevious: () => void;
    onClickNext: () => void;
    onClick: () => void;
};

/**
 * A reusable header component for lessons within a module.
 * Displays module and lesson information, supports navigation between lessons,
 * and provides a toggle for showing or hiding notes.
 *
 * @param currentModule The current module number being displayed.
 * @param totalModules The total number of modules in the course.
 * @param moduleTitle The title of the current module.
 * @param currentLesson The current lesson number within the module.
 * @param totalLessons The total number of lessons in the module.
 * @param lessonTitle The title of the current lesson.
 * @param showNotes Whether the notes are currently visible.
 * @param className Optional additional CSS classes for custom styling.
 * @param onClickPrevious Callback triggered when the user clicks the "Previous" button.
 * @param onClickNext Callback triggered when the user clicks the "Next" button.
 * @param onClick Callback triggered when the user clicks the "Show/Hide Notes" button or presses Alt+N.
 * @param locale The current locale string used to fetch localized dictionary content (from isLocalAware).
 *
 * @example
 * <LessonHeader
 *   currentModule={1}
 *   totalModules={5}
 *   moduleTitle="Introduction to Programming"
 *   currentLesson={1}
 *   totalLessons={10}
 *   lessonTitle="Getting Started"
 *   showNotes={false}
 *   className="custom-class"
 *   onClickPrevious={() => handlePrev()}
 *   onClickNext={() => handleNext()}
 *   onClick={() => toggleNotes()}
 *   locale="en"
 * />
 */
export const LessonHeader: FC<LessonHeaderProps> = ({
    currentLesson,
    totalLessons,
    moduleTitle,
    currentModule,
    totalModules,
    lessonTitle,
    className,
    showNotes,
    onClickPrevious,
    onClickNext,
    onClick,
    locale,
}) => {
    const dictionary = getDictionary(locale);

    // Add this useEffect for Alt+N hotkey
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Check for Alt+N (case-insensitive)
            if ((event.altKey || event.ctrlKey) && (event.key === "n" || event.key === "N")) {
                event.preventDefault();
                onClick();
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClick]);

    return (
        <div className={cn("flex justify-between items-center w-full md:flex-row flex-col gap-4", className)}>
            <div className="flex flex-col gap-4 items-start">
                <p className="text-text-secondary text-md font-bold leading-[120%]">
                    {dictionary.components.lessonHeader.moduleText} {currentModule} / {totalModules} {moduleTitle}
                </p>
                <p className="text-text-primary text-3xl font-bold leading-[100%] tracking-[-0.64px]">
                    {lessonTitle}
                </p>
            </div>
            <div className="flex flex-col gap-2 items-center">
                <ModulePagination
                    currentIndex={currentLesson - 1}
                    totalLessons={totalLessons}
                    onPrevious={onClickPrevious}
                    onNext={onClickNext}
                    locale={locale}
                    className="p-0 w-full"
                />
                <Button
                    variant="secondary"
                    size="small"
                    text={showNotes ? dictionary.components.lessonHeader.showNotesText : dictionary.components.lessonHeader.hideNotesText}
                    hasIconLeft
                    iconLeft={showNotes ? <IconEyeShow /> : <IconEyeHide />}
                    onClick={onClick}
                    className="p-0 w-full"
                />
            </div>
        </div>
    )
}