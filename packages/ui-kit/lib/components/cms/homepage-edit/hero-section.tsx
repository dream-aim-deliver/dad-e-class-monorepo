import { useState } from 'react';
import { TextAreaInput } from '../../text-areaInput';
import { TextInput } from '../../text-input';
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
    onFileDelete: (id: string) => void;
    onFileDownload: (id: string) => void;
    uploadProgress?: number;
}

export default function HeroSection({
    initialValue,
    onChange,
    onFileUpload,
    onFileDelete,
    onFileDownload,
    uploadProgress,
}: HeroSectionProps) {
    const [bannerData, setBannerData] = useState<BannerType>({
        title: '',
        description: '',
        videoId: null,
        thumbnailUrl: null,
        ...initialValue
    });
    const [uploadedFile, setUploadedFile] = useState<fileMetadata.TFileMetadata | null>(null);

    const handleFieldChange = (field: keyof BannerType, value: string | null) => {
        const newBannerData = {
            ...bannerData,
            [field]: value
        };
        setBannerData(newBannerData);
        onChange?.(newBannerData);
    };

    const handleOnFilesChange = async (
        file: fileMetadata.TFileUploadRequest,
        abortSignal?: AbortSignal,
    ) => {
        return onFileUpload(file, "upload_home_page_hero_image", abortSignal);
    };

    const handleUploadComplete = (file: fileMetadata.TFileMetadata) => {
        setUploadedFile(file);
        handleFieldChange('thumbnailUrl', file.url);
    };

    const handleFileDelete = (id: string) => {
        setUploadedFile(null);
        handleFieldChange('thumbnailUrl', null);
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
            <form className="flex flex-col gap-4">
                <TextAreaInput
                    label="Title"
                    value={bannerData.title}
                    setValue={(value) => handleFieldChange('title', value)}
                    placeholder="Enter the title"
                />
                <TextAreaInput
                    label="Description"
                    value={bannerData.description}
                    setValue={(value) => handleFieldChange('description', value)}
                    placeholder="Enter the description"
                />

                <div className="flex flex-col gap-2">
                    <label className="text-sm text-text-secondary">Upload Thumbnail</label>
                    <Uploader
                        type="single"
                        variant="image"
                        file={uploadedFile}
                        onDelete={handleFileDelete}
                        onDownload={handleFileDownload}
                        onFilesChange={handleOnFilesChange}
                        onUploadComplete={handleUploadComplete}
                        locale="en"
                        maxSize={10}
                        uploadProgress={uploadProgress}
                    />
                </div>
                <TextInput
                    label="Video ID"
                    inputField={{
                        inputText: "Enter video ID",
                        value: bannerData.videoId || '',
                        setValue: (value) => handleFieldChange('videoId', value || null)
                    }}
                />
            </form>
        </div>
    )
}