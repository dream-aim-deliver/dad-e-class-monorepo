import { FC } from "react";
import { getDictionary, isLocalAware } from "@maany_shr/e-class-translations";
import { IconCheck } from "../icons/icon-check";

interface ModuleHeaderProps extends isLocalAware {
    totalModules: number;
    currentModule: number;
    moduleTitle: string;
};

/**
 * ModuleHeader component displays the header for a course module.
 *
 * Shows the current module number, total modules, and the module title,
 * with localized labels and a checkmark icon for visual emphasis.
 *
 * @param totalModules The total number of modules in the course.
 * @param currentModule The current module's number (1-based index).
 * @param moduleTitle The title of the current module.
 * @param locale The locale string used to fetch localized text.
 *
 * @returns A styled header section for a course module, including module progress and title.
 *
 * @example
 * // Render a header for the second module out of five, in English
 * <ModuleHeader
 *   totalModules={5}
 *   currentModule={2}
 *   moduleTitle="React Components"
 *   locale="en"
 * />
 */

export const ModuleHeader: FC<ModuleHeaderProps> = ({
    totalModules,
    currentModule,
    moduleTitle,
    locale,
}) => {
    const dictionary = getDictionary(locale);
    return (
        <div className="flex flex-col gap-[2px]">
            <div className="flex gap-2">
                <p className="text-text-secondary text-xs">
                    {dictionary.components.courseOutline.moduleText}
                </p>
                <div className="flex gap-[2px]">
                    <p className="text-text-secondary text-xs">
                        {currentModule}
                    </p>
                    <p className="text-text-secondary text-xs">
                        /
                    </p>
                    <p className="text-text-secondary text-xs">
                        {totalModules}
                    </p>
                </div>
            </div>
            <div className="flex gap-[2px] items-center">
                <p className="text-sm text-text-primary font-bold">
                    {moduleTitle}
                </p>
                <IconCheck
                    classNames="text-feedback-success-primary"
                />
            </div>
        </div>
    );
};