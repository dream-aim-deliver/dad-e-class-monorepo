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
import { IconLoaderSpinner } from './icons/icon-loader-spinner';

interface BaseRemoveModalProps extends isLocalAware {
    onClose: () => void;
    onDelete: () => void;
    onBack: () => void;
    isError: boolean;
    isLoading: boolean;
    isDeleted: boolean;
}

export interface LessonRemoveModalProps extends BaseRemoveModalProps {
    lessonTitle: string;
    variant: 'lesson';
}

export interface ModuleRemoveModalProps extends BaseRemoveModalProps {
    moduleTitle: string;
    variant: 'module';
}

export interface CoachRemoveModalProps extends BaseRemoveModalProps {
    coachName: string;
    coachAvatarUrl: string;
    courseTitle: string;
    courseImageUrl: string;
    variant: 'coach';
}

export type RemoveModalProps =
    | LessonRemoveModalProps
    | ModuleRemoveModalProps
    | CoachRemoveModalProps;

/**
 * A modal component for confirming and handling the removal of lessons, modules, or coaches.
 *
 * This component supports three variants, determined by the `variant` prop:
 * - `'lesson'`: Displays a confirmation dialog for removing a lesson, using `lessonTitle`.
 * - `'module'`: Displays a confirmation dialog for removing a module, using `moduleTitle`.
 * - `'coach'`: Displays a confirmation dialog for removing a coach, using `coachName`, `coachAvatarUrl`,
 *   `courseTitle`, and `courseImageUrl`.
 *
 * The modal adapts its content based on the current UI state:
 * - **Default**: Shows a confirmation message with the relevant item details.
 * - **Loading**: Displays a spinner overlay while the deletion is in progress.
 * - **Error**: Displays an error message if the deletion fails.
 * - **Deleted**: Displays a success message after successful deletion.
 *
 * @param variant - Specifies the type of item being removed: 'lesson', 'module', or 'coach'.
 *
 * For `'lesson'` variant:
 * @param lessonTitle - The title of the lesson to be removed.
 *
 * For `'module'` variant:
 * @param moduleTitle - The title of the module to be removed.
 *
 * For `'coach'` variant:
 * @param coachName - The name of the coach to be removed.
 * @param coachAvatarUrl - URL of the coach's avatar.
 * @param courseTitle - The title of the course associated with the coach.
 * @param courseImageUrl - URL of the course's image.
 *
 * Common props:
 * @param onClose - Callback invoked when the modal is closed.
 * @param onDelete - Callback invoked when the delete action is confirmed.
 * @param onBack - Callback invoked when the back button is clicked.
 * @param isError - Whether the modal should show an error message.
 * @param isLoading - Whether the modal should show a loading spinner.
 * @param isDeleted - Whether the item has been successfully deleted.
 * @param locale - The current locale (if component is locale-aware).
 *
 * @returns A JSX element representing the removal confirmation modal.
 */

export const RemoveModal = (props: RemoveModalProps) => {
    const dictionary = getDictionary(props.locale).components.removeModal;

    if (props.isDeleted) {
        return (
            <div className="flex flex-col w-[350px] items-end gap-6 p-6 rounded-lg border border-card-stroke bg-card-fill shadow-[0_4px_12px_rgba(12,10,9,1)] relative">
                <div className="absolute right-0 top-0">
                    <IconButton
                        data-testid="close-modal-button"
                        styles="text"
                        icon={<IconClose />}
                        size="small"
                        onClick={props.onClose}
                        className="text-button-text-text"
                    />
                </div>
                <div className="flex flex-col items-start gap-4 w-full">
                    <div className="flex flex-col gap-4 w-full">
                        <IconSuccess classNames="text-feedback-success-primary size-8" />
                        <h5 className="text-lg text-text-primary text-justify leading-none">
                            {props.variant === 'lesson' &&
                                dictionary.lessonDeleted}
                            {props.variant === 'module' &&
                                dictionary.moduleDeleted}
                            {props.variant === 'coach' &&
                                dictionary.coachRemoved}
                        </h5>
                    </div>
                </div>
                <div className="flex flex-col px-6 py-4 rounded-medium bg-base-neutral-800 border-[1px] border-base-neutral-700 gap-4 w-full">
                    <div className="flex flex-row items-center gap-4">
                        {props.variant === 'lesson' && (
                            <>
                                <IconLesson
                                    classNames="text-text-primary"
                                    size="5"
                                />
                                <p className="text-text-primary">
                                    {props.lessonTitle}
                                </p>
                            </>
                        )}
                        {props.variant === 'module' && (
                            <>
                                <IconModule
                                    classNames="text-text-primary"
                                    size="5"
                                />
                                <p className="text-text-primary">
                                    {props.moduleTitle}
                                </p>
                            </>
                        )}
                        {props.variant === 'coach' && (
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
                                            fullName={props.coachName}
                                            size="xSmall"
                                            imageUrl={props.coachAvatarUrl}
                                        />
                                        <p className="text-sm text-text-primary font-important">
                                            {props.coachName}
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
                                            fullName={props.courseTitle}
                                            size="xSmall"
                                            imageUrl={props.courseImageUrl}
                                            className="rounded-small"
                                        />
                                        <p className="text-sm text-text-primary font-important">
                                            {props.courseTitle}
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
                    onClick={props.onClose}
                    text={dictionary.closeButton}
                />
            </div>
        );
    }

    if (props.isError) {
        return (
            <div className="flex flex-col w-[350px] items-end gap-6 p-6 rounded-lg border border-card-stroke bg-card-fill shadow-[0_4px_12px_rgba(12,10,9,1)] relative">
                <div className="absolute right-0 top-0">
                    <IconButton
                        data-testid="close-modal-button"
                        styles="text"
                        icon={<IconClose />}
                        size="small"
                        onClick={props.onClose}
                        className="text-button-text-text"
                    />
                </div>
                <div className="flex flex-col items-start gap-4 w-full">
                    <div className="flex flex-col gap-4 w-full">
                        <IconError classNames="text-feedback-error-primary size-8" />
                        <h5 className="text-lg text-text-primary leading-none">
                            {props.variant === 'lesson' &&
                                dictionary.errorMessageLesson}
                            {props.variant === 'module' &&
                                dictionary.errorMessageModule}
                            {props.variant === 'coach' &&
                                dictionary.errorMessageCoach}
                        </h5>
                    </div>
                </div>
                <Button
                    variant="primary"
                    size="big"
                    className="w-full"
                    onClick={props.onClose}
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
                    onClick={props.onClose}
                    className="text-button-text-text"
                />
            </div>
            <div className="flex flex-col items-start gap-4 w-full">
                <div className="flex flex-col gap-4 w-full">
                    <h5 className="text-lg text-text-primary text-justify leading-none">
                        {props.variant === 'lesson' && dictionary.titleLesson}
                        {props.variant === 'module' && dictionary.titleModule}
                        {props.variant === 'coach' && dictionary.titleCoach}
                    </h5>
                </div>
            </div>
            <div className="flex flex-col px-6 py-4 rounded-medium bg-base-neutral-800 border-[1px] border-base-neutral-700 gap-4 w-full">
                <div className="flex flex-row items-center gap-4">
                    {props.variant === 'lesson' && (
                        <>
                            <IconLesson
                                classNames="text-text-primary"
                                size="5"
                            />
                            <p className="text-text-primary">
                                {props.lessonTitle}
                            </p>
                        </>
                    )}
                    {props.variant === 'module' && (
                        <>
                            <IconModule
                                classNames="text-text-primary"
                                size="5"
                            />
                            <p className="text-text-primary">
                                {props.moduleTitle}
                            </p>
                        </>
                    )}
                    {props.variant === 'coach' && (
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
                                        fullName={props.coachName}
                                        size="xSmall"
                                        imageUrl={props.coachAvatarUrl}
                                    />
                                    <p className="text-sm text-text-primary font-important">
                                        {props.coachName}
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
                                        fullName={props.courseTitle}
                                        size="xSmall"
                                        imageUrl={props.courseImageUrl}
                                        className="rounded-small"
                                    />
                                    <p className="text-sm text-text-primary font-important">
                                        {props.courseTitle}
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
                    onClick={props.onBack}
                    text={dictionary.backButton}
                    disabled={props.isLoading}
                />
                {props.isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <IconLoaderSpinner classNames="animate-spin h-5 w-5 text-white" />
                    </div>
                )}

                <Button
                    variant="primary"
                    size="big"
                    className="w-full"
                    onClick={props.onDelete}
                    text={dictionary.deleteButton}
                    disabled={props.isLoading}
                />
            </div>
        </div>
    );
};
