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

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteSuccess, setDeleteSuccess] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const publishMutation = trpc.publishCourse.useMutation();
    const archiveMutation = trpc.archiveCourse.useMutation();
    const deleteMutation = trpc.deleteCourse.useMutation();
    const utils = trpc.useUtils();

    const handlePublish = async () => {
        const confirmed = window.confirm(
            dictionary.components.editHeader.publishConfirmation +
            '\n\n' +
            dictionary.components.editHeader.publishRequirements
        );

        if (!confirmed) return;

        try {
            const result = await publishMutation.mutateAsync({ courseSlug: slug });
            if (result.success) {
                // Invalidate queries to refetch updated data
                utils.listUserCourses.invalidate();
                utils.getEnrolledCourseDetails.invalidate({ courseSlug: slug });
                utils.listPlatformCoursesShort.invalidate();
                utils.getOffersPageOutline.invalidate();
                utils.getHomePage.invalidate();
                alert(dictionary.components.editHeader.publishSuccess);
                // ✅ No reload needed - query invalidation handles UI update
            } else {
                alert(dictionary.components.editHeader.publishError + ': ' + (result as any).data?.message);
            }
        } catch (error: any) {
            alert(dictionary.components.editHeader.publishError + ': ' + error.message);
        }
    };

    const handleArchive = async () => {
        const confirmed = window.confirm(
            dictionary.components.editHeader.archiveConfirmation
        );

        if (!confirmed) return;

        try {
            const result = await archiveMutation.mutateAsync({ courseSlug: slug });
            if (result.success) {
                // Invalidate queries to refetch updated data
                utils.listUserCourses.invalidate();
                alert(dictionary.components.editHeader.archiveSuccess);
                window.location.reload();
            } else {
                alert(dictionary.components.editHeader.archiveError + ': ' + (result as any).data?.message);
            }
        } catch (error: any) {
            alert(dictionary.components.editHeader.archiveError + ': ' + error.message);
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
                        onClick={handlePublish}
                        disabled={isSaving || isPreviewing || publishMutation.isPending}
                    />
                )}
                {canArchive && (
                    <Button
                        variant="primary"
                        text={dictionary.components.editHeader.archiveCourse}
                        onClick={handleArchive}
                        disabled={isSaving || isPreviewing || archiveMutation.isPending}
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

interface DeleteCourseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading: boolean;
    isSuccess: boolean;
    error: string | null;
    locale: TLocale;
}

function DeleteCourseModal({
    isOpen,
    onClose,
    onConfirm,
    isLoading,
    isSuccess,
    error,
    locale,
}: DeleteCourseModalProps) {
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
