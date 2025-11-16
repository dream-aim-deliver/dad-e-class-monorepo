import { getDictionary, TLocale } from '@maany_shr/e-class-translations';
import {
    Button,
    IconEyeShow,
    IconEyeHide,
    IconSave,
    Badge,
    ConfirmationModal,
} from '@maany_shr/e-class-ui-kit';
import { useState } from 'react';
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

    const publishMutation = trpc.publishCourse.useMutation();
    const archiveMutation = trpc.archiveCourse.useMutation();
    const deleteMutation = trpc.deleteCourse.useMutation();
    const utils = trpc.useUtils();

    // Confirmation modal states
    const [publishConfirmModal, setPublishConfirmModal] = useState(false);
    const [archiveConfirmModal, setArchiveConfirmModal] = useState(false);
    const [deleteConfirmModal, setDeleteConfirmModal] = useState(false);

    // Success/Error modal states
    const [successModal, setSuccessModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
    }>({
        isOpen: false,
        title: '',
        message: '',
    });

    const [errorModal, setErrorModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
    }>({
        isOpen: false,
        title: '',
        message: '',
    });

    const handlePublishConfirm = async () => {
        setPublishConfirmModal(false);
        try {
            const result = await publishMutation.mutateAsync({ courseSlug: slug });
            if (result.success) {
                // Invalidate queries to refetch updated data
                utils.listUserCourses.invalidate();
                utils.getEnrolledCourseDetails.invalidate({ courseSlug: slug });
                utils.listPlatformCoursesShort.invalidate();
                utils.getOffersPageOutline.invalidate();
                utils.getHomePage.invalidate();

                // Show success modal
                setSuccessModal({
                    isOpen: true,
                    title: dictionary.components.editHeader.publishSuccess,
                    message: 'Course is now live!',
                });
            } else {
                const errorMessage = (result as any).data?.message || dictionary.components.editHeader.publishError;
                setErrorModal({
                    isOpen: true,
                    title: dictionary.components.editHeader.publishError,
                    message: errorMessage,
                });
            }
        } catch (error: any) {
            setErrorModal({
                isOpen: true,
                title: dictionary.components.editHeader.publishError,
                message: error.message || dictionary.components.editHeader.publishError,
            });
        }
    };

    const handleArchiveConfirm = async () => {
        setArchiveConfirmModal(false);
        try {
            const result = await archiveMutation.mutateAsync({ courseSlug: slug });
            if (result.success) {
                // Invalidate queries to refetch updated data
                utils.listUserCourses.invalidate();

                // Show success modal
                setSuccessModal({
                    isOpen: true,
                    title: dictionary.components.editHeader.archiveSuccess,
                    message: 'Reloading page...',
                });

                // Reload after showing success
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                const errorMessage = (result as any).data?.message || dictionary.components.editHeader.archiveError;
                setErrorModal({
                    isOpen: true,
                    title: dictionary.components.editHeader.archiveError,
                    message: errorMessage,
                });
            }
        } catch (error: any) {
            setErrorModal({
                isOpen: true,
                title: dictionary.components.editHeader.archiveError,
                message: error.message || dictionary.components.editHeader.archiveError,
            });
        }
    };

    const handleDeleteConfirm = async () => {
        setDeleteConfirmModal(false);
        try {
            const result = await deleteMutation.mutateAsync({ courseSlug: slug });
            if (result.success) {
                // Invalidate queries to refetch updated data
                utils.listUserCourses.invalidate();
                utils.listPlatformCoursesShort.invalidate();
                utils.getOffersPageOutline.invalidate();
                utils.getHomePage.invalidate();

                // Show success modal
                setSuccessModal({
                    isOpen: true,
                    title: dictionary.components.editHeader.deleteSuccess,
                    message: 'Redirecting to workspace courses...',
                });

                // Redirect after showing success
                setTimeout(() => {
                    router.push('/workspace/courses');
                }, 2000);
            } else {
                const errorMessage = (result as any).data?.message || dictionary.components.editHeader.deleteError;
                setErrorModal({
                    isOpen: true,
                    title: dictionary.components.editHeader.deleteError,
                    message: errorMessage,
                });
            }
        } catch (error: any) {
            setErrorModal({
                isOpen: true,
                title: dictionary.components.editHeader.deleteError,
                message: error.message || dictionary.components.editHeader.deleteError,
            });
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
        <>
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
                            onClick={() => setPublishConfirmModal(true)}
                            disabled={isSaving || isPreviewing || publishMutation.isPending}
                        />
                    )}
                    {canArchive && (
                        <Button
                            variant="primary"
                            text={dictionary.components.editHeader.archiveCourse}
                            onClick={() => setArchiveConfirmModal(true)}
                            disabled={isSaving || isPreviewing || archiveMutation.isPending}
                        />
                    )}
                    {canDelete && (
                        <Button
                            variant="primary"
                            text={dictionary.components.editHeader.deleteCourse}
                            onClick={() => setDeleteConfirmModal(true)}
                            disabled={isSaving || isPreviewing || deleteMutation.isPending}
                            className="!bg-red-700 hover:!bg-red-800 active:!bg-red-900"
                        />
                    )}
                </div>
            </div>

            {/* Publish Confirmation Modal - with your specific localized messages */}
            <ConfirmationModal
                type="accept"
                isOpen={publishConfirmModal}
                onClose={() => setPublishConfirmModal(false)}
                onConfirm={handlePublishConfirm}
                title={dictionary.components.editHeader.publishCourse}
                message={`${dictionary.components.editHeader.publishConfirmation}\n\n${dictionary.components.editHeader.publishRequirements}`}
                confirmText={publishMutation.isPending ? 'Publishing...' : 'Publish Course'}
                cancelText="Cancel"
                locale={locale}
                isLoading={publishMutation.isPending}
            />

            {/* Archive Confirmation Modal */}
            <ConfirmationModal
                type="accept"
                isOpen={archiveConfirmModal}
                onClose={() => setArchiveConfirmModal(false)}
                onConfirm={handleArchiveConfirm}
                title={dictionary.components.editHeader.archiveCourse}
                message={dictionary.components.editHeader.archiveConfirmation}
                confirmText={archiveMutation.isPending ? 'Archiving...' : 'Archive Course'}
                cancelText="Cancel"
                locale={locale}
                isLoading={archiveMutation.isPending}
            />

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                type="accept"
                isOpen={deleteConfirmModal}
                onClose={() => setDeleteConfirmModal(false)}
                onConfirm={handleDeleteConfirm}
                title={dictionary.components.editHeader.deleteCourse}
                message={dictionary.components.editHeader.deleteConfirmation}
                confirmText={deleteMutation.isPending ? 'Deleting...' : 'Delete Course'}
                cancelText="Cancel"
                locale={locale}
                isLoading={deleteMutation.isPending}
            />

            {/* Success Modal */}
            <ConfirmationModal
                type="accept"
                isOpen={successModal.isOpen}
                onClose={() => setSuccessModal({ ...successModal, isOpen: false })}
                onConfirm={() => setSuccessModal({ ...successModal, isOpen: false })}
                title={successModal.title}
                message={successModal.message}
                confirmText="OK"
                locale={locale}
            />

            {/* Error Modal */}
            <ConfirmationModal
                type="accept"
                isOpen={errorModal.isOpen}
                onClose={() => setErrorModal({ ...errorModal, isOpen: false })}
                onConfirm={() => setErrorModal({ ...errorModal, isOpen: false })}
                title={errorModal.title}
                message={errorModal.message}
                confirmText="OK"
                locale={locale}
            />
        </>
    );
}
