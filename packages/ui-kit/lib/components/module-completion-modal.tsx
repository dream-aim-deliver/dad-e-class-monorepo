import { getDictionary, isLocalAware } from "@maany_shr/e-class-translations";
import { FC } from "react";
import { IconButton } from "./icon-button";
import { IconClose } from "./icons/icon-close";
import { Button } from "./button";
import { IconModule } from "./icons/icon-module";
import { IconSuccess } from "./icons/icon-success";
import { IconChevronRight } from "./icons/icon-chevron-right";

export interface ModuleCompletionModalProps extends isLocalAware {
    currentModule: number;
    totalModules: number;
    moduleTitle: string;
    onClose: () => void;
    onClickNextModule: () => void;
}

/**
 * A modal dialog shown when a user completes a module.
 * Displays a success badge, module information, and a button to proceed to the next module.
 * Supports localization via the `locale` prop.
 *
 * @param currentModule The current module number (1-based).
 * @param totalModules The total number of modules.
 * @param moduleTitle The title of the completed module.
 * @param onClose Function to close the modal.
 * @param onClickNextModule Function to go to the next module.
 * @param locale (Optional) The current locale for translations.
 *
 * @example
 * <ModuleCompletionModal
 *   currentModule={3}
 *   totalModules={10}
 *   moduleTitle="Introduction to AI"
 *   onClose={() => setShowModal(false)}
 *   onClickNextModule={goToNextModule}
 *   locale="en"
 * />
 */

export const ModuleCompletionModal: FC<ModuleCompletionModalProps> = ({
    currentModule,
    totalModules,
    moduleTitle,
    onClose,
    onClickNextModule,
    locale,
}) => {
    const dictionary = getDictionary(locale);
    return (
        <div className="flex flex-col items-end gap-6 p-6 rounded-lg border-1 border-card-stroke bg-card-fill max-w-auto shadow-[0_4px_12px_rgba(12,10,9,1)] relative">
            {/* Close button to close the modal */}
            <div className="absolute right-0 top-0">
                <IconButton
                    data-testid="close-modal-button"
                    styles="text"
                    icon={<IconClose />}
                    size="small"
                    onClick={onClose}
                    className="text-button-text-text"
                />
            </div>
            <div className="flex flex-col items-start gap-4 w-full pt-2">
                <div className="flex flex-col gap-3 w-full">
                    <div className="flex flex-col gap-3 items-start">
                        <IconSuccess classNames="text-feedback-success-primary" />
                        <p className="text-text-primary text-lg font-bold leading-[120%]">
                            {dictionary.components.moduleCompletionModal.moduleCompletedText}
                        </p>
                    </div>
                    <div className="flex gap-2 items-center bg-base-neutral-800 border-1 border-base-neutral-700 rounded-medium w-full p-3">
                        <div className="flex flex-col gap-1 w-full">
                            <p className="text-text-secondary text-xs">
                                {dictionary.components.moduleCompletionModal.moduleText} {currentModule}/{totalModules}
                            </p>
                            <p className="text-text-primary text-sm font-bold">
                                {moduleTitle}
                            </p>
                        </div>
                        <IconModule 
                            classNames="text-text-primary"
                        />
                    </div>
                    <p className="text-text-secondary text-sm leading-[150%]">
                        {dictionary.components.moduleCompletionModal.descriptionText}
                    </p>
                </div>
                <Button 
                    variant="primary"
                    hasIconRight
                    iconRight={<IconChevronRight />}
                    text={dictionary.components.moduleCompletionModal.goToNextModuleText}
                    onClick={onClickNextModule}
                    size='medium'
                    className="w-full"
                />
            </div>
        </div>
    );
};