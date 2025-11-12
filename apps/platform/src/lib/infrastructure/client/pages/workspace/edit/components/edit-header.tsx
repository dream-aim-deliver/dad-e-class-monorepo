import { getDictionary, TLocale } from '@maany_shr/e-class-translations';
import {
    Button,
    IconEyeShow,
    IconEyeHide,
    IconSave,
    Badge,
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
            </div>
        </div>
    );
}
