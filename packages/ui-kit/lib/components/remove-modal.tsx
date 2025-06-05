import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { Button } from './button';
import { IconClose } from './icons/icon-close';
import { IconCoachingOffer } from './icons/icon-coaching-offer';
import { IconLesson } from './icons/icon-lesson';
import { IconSuccess } from './icons/icon-success';
import { IconCourse } from './icons/icon-course';
import { IconModule } from './icons/icon-module';
import { IconError } from './icons/icon-error';
import { UserAvatar } from './avatar/user-avatar';
import { IconButton } from './icon-button';
import React from 'react';
import { IconLoaderSpinner } from './icons/icon-loader-spinner';

export interface RemoveModalProps extends isLocalAware {
    onClose: () => void;
    onDelete: () => void;
    onBack: () => void;
    coachName: string;
    coachAvatarUrl: string;
    courseTitle: string;
    courseImageUrl: string;
    lessonTitle: string;
    moduleTitle: string;
    variant: 'coach' | 'lesson' | 'module';
    isError: boolean;
    isLoading: boolean;
    deleted: boolean;
}

/**
 * A modal component for confirming and handling the removal of lessons, modules, or coaches.
 *
 * The modal displays different content based on the current state:
 * - Default: Shows a confirmation message and details about the item to be removed.
 * - Loading: Shows a spinner overlay while the deletion is in progress.
 * - Error: Shows an error message if the deletion fails.
 * - Deleted: Shows a success message after successful deletion.
 *
 * @param lessonTitle - The title of the lesson to be removed (if applicable).
 * @param moduleTitle - The title of the module to be removed (if applicable).
 * @param courseTitle - The title of the course associated with the coach (if applicable).
 * @param coachAvatarUrl - The avatar URL of the coach (if applicable).
 * @param courseImageUrl - The image URL of the course (if applicable).
 * @param coachName - The name of the coach (if applicable).
 * @param onClose - Callback invoked when the modal is closed.
 * @param onDelete - Callback invoked when the delete action is confirmed.
 * @param onBack - Callback invoked when the back button is clicked.
 * @param variant - The type of item being removed: 'lesson', 'module', or 'coach'.
 * @param locale - The locale used for dictionary translations.
 * @param isError - Whether an error state should be displayed.
 * @param isLoading - Whether a loading spinner should be displayed.
 * @param deleted - Whether the item has already been deleted (initial state).
 *
 * @returns The modal JSX element for removing an item, with appropriate content for each state.
 */
export const RemoveModal = ({
    lessonTitle,
    moduleTitle,
    courseTitle,
    coachAvatarUrl,
    courseImageUrl,
    coachName,
    onClose,
    onDelete,
    onBack,
    variant,
    locale,
    isError = false,
    isLoading = false,
    deleted: initialDeleted = false,
}: RemoveModalProps) => {
    const [deleted, setDeleted] = React.useState(initialDeleted);

    React.useEffect(() => {
        setDeleted(initialDeleted);
    }, [initialDeleted]);

    const dictionary = getDictionary(locale).components.removeModal;

    if (deleted) {
        return (
            <div className="flex flex-col w-[350px] items-end gap-6 p-6 rounded-lg border border-card-stroke bg-card-fill shadow-[0_4px_12px_rgba(12,10,9,1)] relative">
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
                <div className="flex flex-col items-start gap-4 w-full">
                    <div className="flex flex-col gap-4 w-full">
                        <IconSuccess classNames="text-feedback-success-primary size-8" />
                        <h5 className="text-lg text-text-primary text-justify leading-none">
                            {variant === 'lesson' && dictionary.lessonDeleted}
                            {variant === 'module' && dictionary.moduleDeleted}
                            {variant === 'coach' && dictionary.coachRemoved}
                        </h5>
                    </div>
                </div>
                <div className="flex flex-col px-6 py-4 rounded-medium bg-base-neutral-800 border-[1px] border-base-neutral-700 gap-4 w-full">
                    <div className="flex flex-row items-center gap-4">
                        {variant === 'lesson' && (
                            <>
                                <IconCourse
                                    classNames="text-text-primary"
                                    size="5"
                                />
                                <p className="text-text-primary">
                                    {lessonTitle}
                                </p>
                            </>
                        )}
                        {variant === 'module' && (
                            <>
                                <IconModule
                                    classNames="text-text-primary"
                                    size="5"
                                />
                                <p className="text-text-primary">
                                    {moduleTitle}
                                </p>
                            </>
                        )}
                        {variant === 'coach' && (
                            <>
                                <div className="flex flex-col items-left gap-3">
                                    <div className="flex flex-row gap-2 items-center">
                                        <IconCoachingOffer
                                            classNames="text-text-primary"
                                            size="5"
                                        />
                                        <p className="text-sm text-text-primary">
                                            {dictionary.coach}
                                        </p>
                                        <UserAvatar
                                            fullName={coachName}
                                            size="xSmall"
                                            imageUrl={coachAvatarUrl}
                                        />
                                        <p className="text-sm text-text-primary font-important">
                                            {coachName}
                                        </p>
                                    </div>
                                    <div className="flex flex-row gap-2 items-center">
                                        <IconCourse
                                            classNames="text-text-primary"
                                            size="5"
                                        />
                                        <p className="text-sm text-text-primary">
                                            {dictionary.course}
                                        </p>
                                        <UserAvatar
                                            fullName={courseTitle}
                                            size="xSmall"
                                            imageUrl={courseImageUrl}
                                            className="rounded-small"
                                        />
                                        <p className="text-sm text-text-primary font-important">
                                            {courseTitle}
                                        </p>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
                <Button
                    variant="primary"
                    size="big"
                    className="w-full"
                    onClick={onClose}
                    text={dictionary.closeButton}
                />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col w-[350px] items-end gap-6 p-6 rounded-lg border border-card-stroke bg-card-fill shadow-[0_4px_12px_rgba(12,10,9,1)] relative">
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
                <div className="flex flex-col items-start gap-4 w-full">
                    <div className="flex flex-col gap-4 w-full">
                        <IconError classNames="text-feedback-error-primary size-8" />
                        <h5 className="text-lg text-text-primary leading-none">
                            {variant === 'lesson' &&
                                dictionary.errorMessageLesson}
                            {variant === 'module' &&
                                dictionary.errorMessageModule}
                            {variant === 'coach' &&
                                dictionary.errorMessageCoach}
                        </h5>
                    </div>
                </div>
                <Button
                    variant="primary"
                    size="big"
                    className="w-full"
                    onClick={onClose}
                    text={dictionary.closeButton}
                />
            </div>
        );
    }

    return (
        <div className="flex flex-col w-[350px] items-end gap-6 p-6 rounded-lg border border-card-stroke bg-card-fill shadow-[0_4px_12px_rgba(12,10,9,1)] relative">
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
            <div className="flex flex-col items-start gap-4 w-full">
                <div className="flex flex-col gap-4 w-full">
                    <h5 className="text-lg text-text-primary text-justify leading-none">
                        {variant === 'lesson' && dictionary.titleLesson}
                        {variant === 'module' && dictionary.titleModule}
                        {variant === 'coach' && dictionary.titleCoach}
                    </h5>
                </div>
            </div>
            <div className="flex flex-col px-6 py-4 rounded-medium bg-base-neutral-800 border-[1px] border-base-neutral-700 gap-4 w-full">
                <div className="flex flex-row items-center gap-4">
                    {variant === 'lesson' && (
                        <>
                            <IconLesson
                                classNames="text-text-primary"
                                size="5"
                            />
                            <p className="text-text-primary">{lessonTitle}</p>
                        </>
                    )}
                    {variant === 'module' && (
                        <>
                            <IconModule
                                classNames="text-text-primary"
                                size="5"
                            />
                            <p className="text-text-primary">{moduleTitle}</p>
                        </>
                    )}
                    {variant === 'coach' && (
                        <>
                            <div className="flex flex-col items-left gap-3">
                                <div className="flex flex-row gap-2 items-center">
                                    <IconCoachingOffer
                                        classNames="text-text-primary"
                                        size="5"
                                    />
                                    <p className="text-sm text-text-primary">
                                        {dictionary.coach}
                                    </p>
                                    <UserAvatar
                                        fullName={coachName}
                                        size="xSmall"
                                        imageUrl={coachAvatarUrl}
                                    />
                                    <p className="text-sm text-text-primary font-important">
                                        {coachName}
                                    </p>
                                </div>
                                <div className="flex flex-row gap-2 items-center">
                                    <IconCourse
                                        classNames="text-text-primary"
                                        size="5"
                                    />
                                    <p className="text-sm text-text-primary">
                                        {dictionary.course}
                                    </p>
                                    <UserAvatar
                                        fullName={courseTitle}
                                        size="xSmall"
                                        imageUrl={courseImageUrl}
                                        className="rounded-small"
                                    />
                                    <p className="text-sm text-text-primary font-important">
                                        {courseTitle}
                                    </p>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
            <div className="flex flex-row gap-2 w-full">
                <Button
                    variant="secondary"
                    size="big"
                    className="w-full"
                    onClick={onBack}
                    text={dictionary.backButton}
                    disabled={isLoading}
                />
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <IconLoaderSpinner classNames="animate-spin h-5 w-5 text-white" />
                    </div>
                )}

                <Button
                    variant="primary"
                    size="big"
                    className="w-full"
                    onClick={onDelete}
                    text={dictionary.deleteButton}
                    disabled={isLoading}
                />
            </div>
        </div>
    );
};
