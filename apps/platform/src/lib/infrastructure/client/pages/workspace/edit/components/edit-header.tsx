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
    const isSuperAdmin = roles.includes('superadmin');
    const canPublish = isSuperAdmin && courseStatus === 'draft';
    const canArchive = isSuperAdmin && courseStatus === 'live';

    const publishMutation = trpc.publishCourse.useMutation();
    const archiveMutation = trpc.archiveCourse.useMutation();
    const utils = trpc.useUtils();

    // Modal states
    const [publishConfirmModal, setPublishConfirmModal] = useState(false);
    const [archiveConfirmModal, setArchiveConfirmModal] = useState(false);
    const [errorModal, setErrorModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
    }>({
        isOpen: false,
        title: '',
        message: '',
    });
    const [successModal, setSuccessModal] = useState<{
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

                setSuccessModal({
                    isOpen: true,
                    title: dictionary.components.editHeader.publishSuccessTitle,
                    message: dictionary.components.editHeader.publishSuccess,
                });
                // ✅ No reload needed - query invalidation handles UI update
            } else {
                const errorMessage = (result as any).data?.message || dictionary.components.editHeader.publishErrorGeneric;
                setErrorModal({
                    isOpen: true,
                    title: dictionary.components.editHeader.publishErrorTitle,
                    message: `${dictionary.components.editHeader.publishError}: ${errorMessage}`,
                });
            }
        } catch (error: any) {
            setErrorModal({
                isOpen: true,
                title: dictionary.components.editHeader.publishErrorTitle,
                message: `${dictionary.components.editHeader.publishError}: ${error.message || dictionary.components.editHeader.publishErrorGeneric}`,
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

                setSuccessModal({
                    isOpen: true,
                    title: dictionary.components.editHeader.archiveSuccessTitle,
                    message: dictionary.components.editHeader.archiveSuccess,
                });

                // Reload after user acknowledges success
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                const errorMessage = (result as any).data?.message || dictionary.components.editHeader.archiveErrorGeneric;
                setErrorModal({
                    isOpen: true,
                    title: dictionary.components.editHeader.archiveErrorTitle,
                    message: `${dictionary.components.editHeader.archiveError}: ${errorMessage}`,
                });
            }
        } catch (error: any) {
            setErrorModal({
                isOpen: true,
                title: dictionary.components.editHeader.archiveErrorTitle,
                message: `${dictionary.components.editHeader.archiveError}: ${error.message || dictionary.components.editHeader.archiveErrorGeneric}`,
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
                </div>
            </div>

            {/* Publish Confirmation Modal */}
            <ConfirmationModal
            type="accept"
            isOpen={publishConfirmModal}
            onClose={() => setPublishConfirmModal(false)}
            onConfirm={handlePublishConfirm}
            title={dictionary.components.editHeader.publishConfirmationTitle}
            message={`${dictionary.components.editHeader.publishConfirmation}\n\n${dictionary.components.editHeader.publishRequirements}`}
            confirmText={dictionary.components.editHeader.confirmPublish}
            cancelText={dictionary.components.editHeader.cancel}
            locale={locale}
            isLoading={publishMutation.isPending}
        />

        {/* Archive Confirmation Modal */}
        <ConfirmationModal
            type="accept"
            isOpen={archiveConfirmModal}
            onClose={() => setArchiveConfirmModal(false)}
            onConfirm={handleArchiveConfirm}
            title={dictionary.components.editHeader.archiveConfirmationTitle}
            message={dictionary.components.editHeader.archiveConfirmation}
            confirmText={dictionary.components.editHeader.confirmArchive}
            cancelText={dictionary.components.editHeader.cancel}
            locale={locale}
            isLoading={archiveMutation.isPending}
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
    </>
    );
}
