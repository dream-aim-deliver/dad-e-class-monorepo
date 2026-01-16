'use client';

import { useMemo } from 'react';
import { TextAreaInput } from '../../text-areaInput';
import { Uploader } from '../../drag-and-drop-uploader/uploader';
import { fileMetadata, viewModels } from '@maany_shr/e-class-models';
import { z } from 'zod';
import { downloadFile } from '../../../utils/file-utils';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';

type BannerType = z.infer<typeof viewModels.HomePageSchema>['banner'];

interface HeroSectionProps extends isLocalAware {
    value: BannerType;
    onChange: (value: BannerType) => void;
    onFileUpload: (
        fileRequest: fileMetadata.TFileUploadRequest,
        uploadType: "upload_home_page_hero_image",
        abortSignal?: AbortSignal
    ) => Promise<fileMetadata.TFileMetadata>;
    onVideoUpload: (
        fileRequest: fileMetadata.TFileUploadRequest,
        abortSignal?: AbortSignal
    ) => Promise<fileMetadata.TFileMetadata>;
    onFileDelete: (id: string) => void;
    onFileDownload: (id: string) => void;
    uploadProgress?: number;
    videoUploadProgress?: number;
}

export default function HeroSection({
    value,
    onChange,
    onFileUpload,
    onVideoUpload,
    onFileDelete,
    onFileDownload,
    uploadProgress,
    videoUploadProgress,
    locale
}: HeroSectionProps) {
    const dictionary = getDictionary(locale);
    const t = dictionary.components.cmsSections.heroSection;
    const uploadedThumbnail = useMemo(() => {
        if (!value.thumbnailImage) return null;

        const thumbnail = {
            id: value.thumbnailImage.id,
            name: value.thumbnailImage.name,
            size: value.thumbnailImage.size,
            category: value.thumbnailImage.category as 'image',
            url: value.thumbnailImage.downloadUrl,
            thumbnailUrl: value.thumbnailImage.downloadUrl, // Use same URL for thumbnail
            status: "available" as const
        } as fileMetadata.TFileMetadataImage;

        return thumbnail;
    }, [value.thumbnailImage]);

    // Transform backend video object to TFileMetadataVideo for display
    const uploadedVideo = useMemo(() => {
        if (!value.video) {
            return null;
        }

        // Backend returns video object with downloadUrl and playbackId
        // Transform to TFileMetadataVideo for UI components
        return {
            id: value.video.id,
            name: value.video.name,
            size: value.video.size,
            category: 'video' as const,
            url: value.video.downloadUrl,
            thumbnailUrl: value.video.thumbnailUrl || value.video.downloadUrl,
            videoId: value.video.playbackId ?? null,
            status: "available" as const
        } as fileMetadata.TFileMetadataVideo;
    }, [value.video]);

    const handleFieldChange = (
        field: string,
        fieldValue: string |
            { id: string; name: string; size: number; category: 'image'; downloadUrl: string } |
            { id: string; name: string; size: number; category: 'video'; downloadUrl: string; thumbnailUrl: string | null; playbackId: string | null } |
            null
    ) => {
        const newBannerData = {
            ...value,
            [field]: fieldValue
        } as BannerType;
        onChange?.(newBannerData);
    };

    const handleOnThumbnailChange = async (
        file: fileMetadata.TFileUploadRequest,
        abortSignal?: AbortSignal,
    ) => {
        return onFileUpload(file, "upload_home_page_hero_image", abortSignal);
    };

    const handleThumbnailUploadComplete = (file: fileMetadata.TFileMetadata) => {
        const imageObject = {
            id: file.id?.toString() ?? '',
            name: file.name ?? '',
            size: file.size ?? 0,
            category: 'image' as const,
            downloadUrl: file.url ?? ''
        };
        handleFieldChange('thumbnailImage', imageObject);
    };

    const handleThumbnailDelete = (id: string) => {
        // No local state update needed - just notify parent
        handleFieldChange('thumbnailImage', null);
        onFileDelete(id);
    };

    const handleOnVideoChange = async (
        file: fileMetadata.TFileUploadRequest,
        abortSignal?: AbortSignal,
    ) => {
        return onVideoUpload(file, abortSignal);
    };

    const handleVideoUploadComplete = (file: fileMetadata.TFileMetadata) => {
        const videoFile = file as fileMetadata.TFileMetadataVideo;
        // Transform TFileMetadataVideo back to backend format for storage
        // Assert non-null since these fields are required after successful upload
        const backendVideo = {
            id: videoFile.id!,
            name: videoFile.name!,
            size: videoFile.size!,
            category: 'video' as const,
            downloadUrl: videoFile.url!,
            thumbnailUrl: videoFile.thumbnailUrl || videoFile.url!,
            playbackId: videoFile.videoId || null,
        };
        handleFieldChange('video', backendVideo);
    };

    const handleVideoDelete = (id: string) => {
        // Clear the video object from banner state
        handleFieldChange('video', null);
        onFileDelete(id);
    };

    const handleThumbnailDownload = (id: string) => {
        if (uploadedThumbnail?.id === id && uploadedThumbnail.url && uploadedThumbnail.name) {
            downloadFile(uploadedThumbnail.url, uploadedThumbnail.name);
        }
    };

    const handleVideoDownload = (id: string) => {
        if (uploadedVideo?.id === id && uploadedVideo.url && uploadedVideo.name) {
            downloadFile(uploadedVideo.url, uploadedVideo.name);
        }
    };

    return (
        <div className="w-full p-6 border border-card-fill rounded-medium bg-card-fill flex flex-col gap-6">
            <h2>{t.heading}</h2>
            <div className="flex flex-col gap-4">
                <TextAreaInput
                    label={t.titleLabel}
                    value={value?.title || ''}
                    setValue={(v) => handleFieldChange('title', v)}
                    placeholder={t.titlePlaceholder}
                />
                <TextAreaInput
                    label={t.descriptionLabel}
                    value={value?.description || ''}
                    setValue={(v) => handleFieldChange('description', v)}
                    placeholder={t.descriptionPlaceholder}
                />

                <div className="flex flex-col gap-2">
                    <label className="text-sm text-text-secondary">{t.uploadThumbnailLabel}</label>
                    <Uploader
                        type="single"
                        variant="image"
                        file={uploadedThumbnail}
                        onDelete={handleThumbnailDelete}
                        onDownload={handleThumbnailDownload}
                        onFilesChange={handleOnThumbnailChange}
                        onUploadComplete={handleThumbnailUploadComplete}
                        locale={locale}
                        maxSize={20} // 20 MB
                        uploadProgress={uploadProgress}
                    />
                </div>

                <div className="flex flex-col gap-2 bg-card-fill border-1 border-card-stroke rounded-md p-4">
                    <h6 className="text-sm font-semibold text-text-primary">{t.heroVideoTitle}</h6>
                    <p className="text-sm text-text-secondary mb-2">{t.heroVideoDescription}</p>
                    <Uploader
                        type="single"
                        variant="video"
                        file={uploadedVideo}
                        onDelete={handleVideoDelete}
                        onDownload={handleVideoDownload}
                        onFilesChange={handleOnVideoChange}
                        onUploadComplete={handleVideoUploadComplete}
                        locale="en"
                        maxSize={5120} // 5 GB
                        uploadProgress={videoUploadProgress}
                        isDeletionAllowed
                    />
                </div>
            </div>
        </div>
    )
}
