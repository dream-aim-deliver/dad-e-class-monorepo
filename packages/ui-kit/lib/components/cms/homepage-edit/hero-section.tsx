'use client';

import { useState, useEffect } from 'react';
import { TextAreaInput } from '../../text-areaInput';
import { Uploader } from '../../drag-and-drop-uploader/uploader';
import { fileMetadata, viewModels } from '@maany_shr/e-class-models';
import { z } from 'zod';
import { downloadFile } from '@maany_shr/e-class-ui-kit';

type BannerType = z.infer<typeof viewModels.HomePageSchema>['banner'];

interface HeroSectionProps {
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
}: HeroSectionProps) {
    const [uploadedThumbnail, setUploadedThumbnail] = useState<fileMetadata.TFileMetadata | null>(null);
    const [uploadedVideo, setUploadedVideo] = useState<fileMetadata.TFileMetadataVideo | null>(null);

    // Sync uploaded files with value prop when data is loaded from server
    // Only update if the image ID has actually changed (not just object recreation)
    useEffect(() => {
        const thumbnailImageId = value.thumbnailImage?.id;
        const currentThumbnailId = uploadedThumbnail?.id;

        if (value.thumbnailImage && thumbnailImageId !== currentThumbnailId) {
            // Image ID changed or didn't exist - update state
            setUploadedThumbnail({
                id: value.thumbnailImage.id,
                name: value.thumbnailImage.name,
                size: value.thumbnailImage.size,
                category: value.thumbnailImage.category,
                url: value.thumbnailImage.downloadUrl,
            } as fileMetadata.TFileMetadata);
        } else if (!value.thumbnailImage && uploadedThumbnail) {
            // Thumbnail was removed
            setUploadedThumbnail(null);
        }

        // Note: videoId is stored as string, not a full video object in the schema
        // Video state is handled differently - we don't pre-populate it from server
    }, [value.thumbnailImage?.id]);

    const handleFieldChange = (field: string, fieldValue: string | { id: string; name: string; size: number; category: 'image'; downloadUrl: string } | null) => {
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
        setUploadedThumbnail(file);
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
        setUploadedThumbnail(null);
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
        setUploadedVideo(videoFile);
        // Store the video playback ID
        handleFieldChange('videoId', (videoFile.videoId as string) || '');
    };

    const handleVideoDelete = (id: string) => {
        setUploadedVideo(null);
        handleFieldChange('videoId', '');
        onFileDelete(id);
    };

    const handleThumbnailDownload = (id: string) => {
        if (uploadedThumbnail?.id === id && uploadedThumbnail.url) {
            downloadFile(uploadedThumbnail.url, uploadedThumbnail.name);
        }
    };

    const handleVideoDownload = (id: string) => {
        if (uploadedVideo?.id === id && uploadedVideo.url) {
            downloadFile(uploadedVideo.url, uploadedVideo.name);
        }
    };

    return (
        <div className="w-full p-6 border border-card-fill rounded-medium bg-card-fill flex flex-col gap-6">
            <h2>
                Hero section
            </h2>
            <div className="flex flex-col gap-4">
                <TextAreaInput
                    label="Title"
                    value={value?.title || ''}
                    setValue={(v) => handleFieldChange('title', v)}
                    placeholder="Enter the title"
                />
                <TextAreaInput
                    label="Description"
                    value={value?.description || ''}
                    setValue={(v) => handleFieldChange('description', v)}
                    placeholder="Enter the description"
                />

                <div className="flex flex-col gap-2">
                    <label className="text-sm text-text-secondary">Upload Thumbnail</label>
                    <Uploader
                        type="single"
                        variant="image"
                        file={uploadedThumbnail}
                        onDelete={handleThumbnailDelete}
                        onDownload={handleThumbnailDownload}
                        onFilesChange={handleOnThumbnailChange}
                        onUploadComplete={handleThumbnailUploadComplete}
                        locale="en"
                        maxSize={10}
                        uploadProgress={uploadProgress}
                    />
                </div>

                <div className="flex flex-col gap-2 bg-card-fill border-1 border-card-stroke rounded-md p-4">
                    <h6 className="text-sm font-semibold text-text-primary">
                        Hero Video
                    </h6>
                    <p className="text-sm text-text-secondary mb-2">
                        Upload a video for the hero section. The video will be displayed prominently on the homepage.
                    </p>
                    <Uploader
                        type="single"
                        variant="video"
                        file={uploadedVideo}
                        onDelete={handleVideoDelete}
                        onDownload={handleVideoDownload}
                        onFilesChange={handleOnVideoChange}
                        onUploadComplete={handleVideoUploadComplete}
                        locale="en"
                        maxSize={2000000}
                        uploadProgress={videoUploadProgress}
                        isDeletionAllowed
                    />
                </div>
            </div>
        </div>
    )
}