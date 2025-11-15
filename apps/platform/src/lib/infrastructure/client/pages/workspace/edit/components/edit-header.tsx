import { getDictionary, TLocale } from '@maany_shr/e-class-translations';
import {
    Button,
    IconEyeShow,
    IconEyeHide,
    IconSave,
    Badge,
    Dialog,
    DialogContent,
    DialogBody,
    Banner,
    IconLoaderSpinner,
} from '@maany_shr/e-class-ui-kit';
import { useState, useEffect } from 'react';
import { trpc } from '../../../../trpc/cms-client';
import { useRouter } from 'next/navigation';

interface EditHeaderProps {
    title: string;
    courseTitle: string;
    courseStatus?: 'draft' | 'live' | 'archived';
    onPreview: () => void;
    onSave: () => void;
    disablePreview: boolean;
    isSaving: boolean;
    isPreviewing?: boolean;
    locale: TLocale;
    roles: string[];
    slug: string;
    isReadOnlyContent?: boolean;
}

export default function EditHeader({
    title,
    courseTitle,
    courseStatus,
    onPreview,
    onSave,
    disablePreview,
    isSaving,
    isPreviewing = false,
    locale,
    roles,
    slug,
    isReadOnlyContent = false,
}: EditHeaderProps) {
    const dictionary = getDictionary(locale);
    const router = useRouter();
    const isSuperAdmin = roles.includes('superadmin');
    const canPublish = isSuperAdmin && courseStatus === 'draft';
    const canArchive = isSuperAdmin && courseStatus === 'live';
    const canDelete = isSuperAdmin && courseStatus === 'draft';

    const [showPublishModal, setShowPublishModal] = useState(false);
    const [publishSuccess, setPublishSuccess] = useState(false);
    const [publishError, setPublishError] = useState<string | null>(null);

    const [showArchiveModal, setShowArchiveModal] = useState(false);
    const [archiveSuccess, setArchiveSuccess] = useState(false);
    const [archiveError, setArchiveError] = useState<string | null>(null);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteSuccess, setDeleteSuccess] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const publishMutation = trpc.publishCourse.useMutation();
    const archiveMutation = trpc.archiveCourse.useMutation();
    const deleteMutation = trpc.deleteCourse.useMutation();
    const utils = trpc.useUtils();

    const handlePublishClick = () => {
        setShowPublishModal(true);
        setPublishSuccess(false);
        setPublishError(null);
    };

    const handlePublishConfirm = async () => {
        setPublishError(null);
        try {
            const result = await publishMutation.mutateAsync({ courseSlug: slug });
            if (result.success) {
                // Invalidate queries to refetch updated data
                utils.listUserCourses.invalidate();
                utils.getEnrolledCourseDetails.invalidate({ courseSlug: slug });
                utils.listPlatformCoursesShort.invalidate();
                utils.getOffersPageOutline.invalidate();
                utils.getHomePage.invalidate();

                // Show success state
                setPublishSuccess(true);

                // Wait 3 seconds then close modal
                setTimeout(() => {
                    setShowPublishModal(false);
                    setPublishSuccess(false);
                }, 3000);
            } else {
                setPublishError((result as any).data?.message || dictionary.components.editHeader.publishError);
            }
        } catch (error: any) {
            setPublishError(error.message || dictionary.components.editHeader.publishError);
        }
    };

    const handlePublishCancel = () => {
        if (!publishMutation.isPending && !publishSuccess) {
            setShowPublishModal(false);
            setPublishError(null);
        }
    };

    const handleArchiveClick = () => {
        setShowArchiveModal(true);
        setArchiveSuccess(false);
        setArchiveError(null);
    };

    const handleArchiveConfirm = async () => {
        setArchiveError(null);
        try {
            const result = await archiveMutation.mutateAsync({ courseSlug: slug });
            if (result.success) {
                // Invalidate queries to refetch updated data
                utils.listUserCourses.invalidate();

                // Show success state
                setArchiveSuccess(true);

                // Wait 3 seconds then reload
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            } else {
                setArchiveError((result as any).data?.message || dictionary.components.editHeader.archiveError);
            }
        } catch (error: any) {
            setArchiveError(error.message || dictionary.components.editHeader.archiveError);
        }
    };

    const handleArchiveCancel = () => {
        if (!archiveMutation.isPending && !archiveSuccess) {
            setShowArchiveModal(false);
            setArchiveError(null);
        }
    };

    const handleDeleteClick = () => {
        setShowDeleteModal(true);
        setDeleteSuccess(false);
        setDeleteError(null);
    };

    const handleDeleteConfirm = async () => {
        setDeleteError(null);
        try {
            const result = await deleteMutation.mutateAsync({ courseSlug: slug });
            if (result.success) {
                // Invalidate queries to refetch updated data
                utils.listUserCourses.invalidate();
                utils.listPlatformCoursesShort.invalidate();
                utils.getOffersPageOutline.invalidate();
                utils.getHomePage.invalidate();

                // Show success state
                setDeleteSuccess(true);

                // Wait 5 seconds then redirect
                setTimeout(() => {
                    router.push('/workspace/courses');
                }, 5000);
            } else {
                setDeleteError((result as any).data?.message || dictionary.components.editHeader.deleteError);
            }
        } catch (error: any) {
            setDeleteError(error.message || dictionary.components.editHeader.deleteError);
        }
    };

    const handleDeleteCancel = () => {
        if (!deleteMutation.isPending && !deleteSuccess) {
            setShowDeleteModal(false);
            setDeleteError(null);
        }
    };

    const previewButtonText = isPreviewing
        ? dictionary.components.editHeader.hidePreviewText
        : isReadOnlyContent
            ? dictionary.components.editHeader.previewText
            : disablePreview
                ? dictionary.components.editHeader.saveToPreviewText
                : dictionary.components.editHeader.previewText;

    const getStatusBadgeVariant = (status?: string) => {
        switch (status) {
            case 'draft':
                return 'warningprimary';
            case 'live':
                return 'successprimary';
            case 'archived':
                return 'info';
            default:
                return 'info';
        }
    };

    const getStatusText = (status?: string) => {
        switch (status) {
            case 'draft':
                return dictionary.components.editHeader.statusDraft;
            case 'live':
                return dictionary.components.editHeader.statusLive;
            case 'archived':
                return dictionary.components.editHeader.statusArchived;
            default:
                return '';
        }
    };

    return (
        <div className="flex md:flex-row flex-col md:items-center justify-between gap-5 bg-neutral-950/50 sticky top-18 z-50 p-2">
            <div className="flex flex-col gap-2">
                <h1>{title}</h1>
                {courseStatus && (
                    <Badge
                        text={getStatusText(courseStatus)}
                        variant={getStatusBadgeVariant(courseStatus)}
                        size="medium"
                        className='w-fit'
                    />
                )}
            </div>
            <div className="flex sm:flex-row flex-col sm:items-center gap-3">
                <Button
                    variant="text"
                    iconLeft={isPreviewing ? <IconEyeHide /> : <IconEyeShow />}
                    hasIconLeft
                    text={previewButtonText}
                    className="px-0"
                    onClick={onPreview}
                    disabled={disablePreview || isSaving}
                />
                <Button
                    variant="primary"
                    iconLeft={<IconSave />}
                    hasIconLeft
                    text={
                        isSaving
                            ? dictionary.components.editHeader.savingText
                            : dictionary.components.editHeader.saveText
                    }
                    onClick={onSave}
                    disabled={isSaving || isPreviewing}
                />
                {canPublish && (
                    <Button
                        variant="primary"
                        text={dictionary.components.editHeader.publishCourse}
                        onClick={handlePublishClick}
                        disabled={isSaving || isPreviewing}
                    />
                )}
                {canArchive && (
                    <Button
                        variant="primary"
                        text={dictionary.components.editHeader.archiveCourse}
                        onClick={handleArchiveClick}
                        disabled={isSaving || isPreviewing}
                    />
                )}
                {canDelete && (
                    <Button
                        variant="primary"
                        text={dictionary.components.editHeader.deleteCourse}
                        onClick={handleDeleteClick}
                        disabled={isSaving || isPreviewing}
                        className="!bg-red-700 hover:!bg-red-800 active:!bg-red-900"
                    />
                )}
            </div>
            {showPublishModal && (
                <PublishCourseModal
                    isOpen={showPublishModal}
                    onClose={handlePublishCancel}
                    onConfirm={handlePublishConfirm}
                    isLoading={publishMutation.isPending}
                    isSuccess={publishSuccess}
                    error={publishError}
                    locale={locale}
                />
            )}
            {showArchiveModal && (
                <ArchiveCourseModal
                    isOpen={showArchiveModal}
                    onClose={handleArchiveCancel}
                    onConfirm={handleArchiveConfirm}
                    isLoading={archiveMutation.isPending}
                    isSuccess={archiveSuccess}
                    error={archiveError}
                    locale={locale}
                />
            )}
            {showDeleteModal && (
                <DeleteCourseModal
                    isOpen={showDeleteModal}
                    onClose={handleDeleteCancel}
                    onConfirm={handleDeleteConfirm}
                    isLoading={deleteMutation.isPending}
                    isSuccess={deleteSuccess}
                    error={deleteError}
                    locale={locale}
                />
            )}
        </div>
    );
}

interface CourseActionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading: boolean;
    isSuccess: boolean;
    error: string | null;
    locale: TLocale;
}

function PublishCourseModal({
    isOpen,
    onClose,
    onConfirm,
    isLoading,
    isSuccess,
    error,
    locale,
}: CourseActionModalProps) {
    const dictionary = getDictionary(locale);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()} defaultOpen={false}>
            <DialogContent
                showCloseButton={!isLoading && !isSuccess}
                closeOnOverlayClick={!isLoading && !isSuccess}
                closeOnEscape={!isLoading && !isSuccess}
                className="max-w-md"
            >
                <DialogBody>
                    <div className="flex flex-col gap-4">
                        <div>
                            <h2 className="text-xl font-semibold text-text-primary mb-2">
                                {dictionary.components.editHeader.publishCourse}
                            </h2>
                            <p className="text-text-secondary mb-2">
                                {dictionary.components.editHeader.publishConfirmation}
                            </p>
                            <p className="text-text-secondary text-sm whitespace-pre-line">
                                {dictionary.components.editHeader.publishRequirements}
                            </p>
                        </div>

                        {error && (
                            <Banner
                                style="error"
                                title={dictionary.components.editHeader.publishError}
                                description={error}
                            />
                        )}

                        {isSuccess && (
                            <Banner
                                style="success"
                                title={dictionary.components.editHeader.publishSuccess}
                                description="Course is now live!"
                            />
                        )}

                        {!isSuccess && (
                            <div className="flex gap-3 justify-end">
                                <Button
                                    variant="secondary"
                                    text="Cancel"
                                    onClick={onClose}
                                    disabled={isLoading}
                                />
                                <Button
                                    variant="primary"
                                    text={isLoading ? 'Publishing...' : 'Publish Course'}
                                    onClick={onConfirm}
                                    disabled={isLoading}
                                    iconLeft={isLoading ? <IconLoaderSpinner classNames="animate-spin" /> : undefined}
                                    hasIconLeft={isLoading}
                                />
                            </div>
                        )}
                    </div>
                </DialogBody>
            </DialogContent>
        </Dialog>
    );
}

function ArchiveCourseModal({
    isOpen,
    onClose,
    onConfirm,
    isLoading,
    isSuccess,
    error,
    locale,
}: CourseActionModalProps) {
    const dictionary = getDictionary(locale);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()} defaultOpen={false}>
            <DialogContent
                showCloseButton={!isLoading && !isSuccess}
                closeOnOverlayClick={!isLoading && !isSuccess}
                closeOnEscape={!isLoading && !isSuccess}
                className="max-w-md"
            >
                <DialogBody>
                    <div className="flex flex-col gap-4">
                        <div>
                            <h2 className="text-xl font-semibold text-text-primary mb-2">
                                {dictionary.components.editHeader.archiveCourse}
                            </h2>
                            <p className="text-text-secondary">
                                {dictionary.components.editHeader.archiveConfirmation}
                            </p>
                        </div>

                        {error && (
                            <Banner
                                style="error"
                                title={dictionary.components.editHeader.archiveError}
                                description={error}
                            />
                        )}

                        {isSuccess && (
                            <Banner
                                style="success"
                                title={dictionary.components.editHeader.archiveSuccess}
                                description="Reloading page..."
                            />
                        )}

                        {!isSuccess && (
                            <div className="flex gap-3 justify-end">
                                <Button
                                    variant="secondary"
                                    text="Cancel"
                                    onClick={onClose}
                                    disabled={isLoading}
                                />
                                <Button
                                    variant="primary"
                                    text={isLoading ? 'Archiving...' : 'Archive Course'}
                                    onClick={onConfirm}
                                    disabled={isLoading}
                                    iconLeft={isLoading ? <IconLoaderSpinner classNames="animate-spin" /> : undefined}
                                    hasIconLeft={isLoading}
                                />
                            </div>
                        )}
                    </div>
                </DialogBody>
            </DialogContent>
        </Dialog>
    );
}

function DeleteCourseModal({
    isOpen,
    onClose,
    onConfirm,
    isLoading,
    isSuccess,
    error,
    locale,
}: CourseActionModalProps) {
    const dictionary = getDictionary(locale);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()} defaultOpen={false}>
            <DialogContent
                showCloseButton={!isLoading && !isSuccess}
                closeOnOverlayClick={!isLoading && !isSuccess}
                closeOnEscape={!isLoading && !isSuccess}
                className="max-w-md"
            >
                <DialogBody>
                    <div className="flex flex-col gap-4">
                        <div>
                            <h2 className="text-xl font-semibold text-text-primary mb-2">
                                {dictionary.components.editHeader.deleteCourse}
                            </h2>
                            <p className="text-text-secondary">
                                {dictionary.components.editHeader.deleteConfirmation}
                            </p>
                        </div>

                        {error && (
                            <Banner
                                style="error"
                                title={dictionary.components.editHeader.deleteError}
                                description={error}
                            />
                        )}

                        {isSuccess && (
                            <Banner
                                style="success"
                                title={dictionary.components.editHeader.deleteSuccess}
                                description="Redirecting to workspace courses..."
                            />
                        )}

                        {!isSuccess && (
                            <div className="flex gap-3 justify-end">
                                <Button
                                    variant="secondary"
                                    text="Cancel"
                                    onClick={onClose}
                                    disabled={isLoading}
                                />
                                <Button
                                    variant="primary"
                                    text={isLoading ? 'Deleting...' : 'Delete Course'}
                                    onClick={onConfirm}
                                    disabled={isLoading}
                                    iconLeft={isLoading ? <IconLoaderSpinner classNames="animate-spin" /> : undefined}
                                    hasIconLeft={isLoading}
                                    className="!bg-red-700 hover:!bg-red-800 active:!bg-red-900"
                                />
                            </div>
                        )}
                    </div>
                </DialogBody>
            </DialogContent>
        </Dialog>
    );
}
