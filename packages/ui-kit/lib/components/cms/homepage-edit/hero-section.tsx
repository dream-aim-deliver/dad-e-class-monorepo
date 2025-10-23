'use client';

import { useState } from 'react';
import { TextAreaInput } from '../../text-areaInput';
import { Uploader } from '../../drag-and-drop-uploader/uploader';
import { fileMetadata } from '@maany_shr/e-class-models';
import { z } from 'zod';
import { HomePageSchema } from 'packages/models/src/view-models';

type BannerType = z.infer<typeof HomePageSchema>['banner'];

interface HeroSectionProps {
    initialValue?: BannerType;
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
    initialValue,
    onChange,
    onFileUpload,
    onVideoUpload,
    onFileDelete,
    onFileDownload,
    uploadProgress,
    videoUploadProgress,
}: HeroSectionProps) {
    const [bannerData, setBannerData] = useState<BannerType>(
        initialValue || {
            title: '',
            description: '',
            videoId: '',
            thumbnailUrl: '',
        }
    );
    const [uploadedThumbnail, setUploadedThumbnail] = useState<fileMetadata.TFileMetadata | null>(null);
    const [uploadedVideo, setUploadedVideo] = useState<fileMetadata.TFileMetadataVideo | null>(null);

    const handleFieldChange = (field: string, value: string) => {
        const newBannerData = {
            ...bannerData,
            [field]: value
        } as BannerType;
        setBannerData(newBannerData);
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
        handleFieldChange('thumbnailUrl', file.url as string);
    };

    const handleThumbnailDelete = (id: string) => {
        setUploadedThumbnail(null);
        handleFieldChange('thumbnailUrl', '');
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

    const handleFileDownload = (id: string) => {
        onFileDownload(id);
    };

    return (
        <div className="w-full p-6 border border-card-fill rounded-medium bg-card-fill flex flex-col gap-6">
            <h2>
                Hero section
            </h2>
            <div className="flex flex-col gap-4">
                <TextAreaInput
                    label="Title"
                    value={bannerData?.title || ''}
                    setValue={(value) => handleFieldChange('title', value)}
                    placeholder="Enter the title"
                />
                <TextAreaInput
                    label="Description"
                    value={bannerData?.description || ''}
                    setValue={(value) => handleFieldChange('description', value)}
                    placeholder="Enter the description"
                />

                <div className="flex flex-col gap-2">
                    <label className="text-sm text-text-secondary">Upload Thumbnail</label>
                    <Uploader
                        type="single"
                        variant="image"
                        file={uploadedThumbnail}
                        onDelete={handleThumbnailDelete}
                        onDownload={handleFileDownload}
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
                        onDownload={handleFileDownload}
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