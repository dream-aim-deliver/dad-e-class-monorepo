'use client';

import { useState } from 'react';
import { TextAreaInput } from '../text-areaInput';
import { TextInput } from '../text-input';
import { Uploader } from '../drag-and-drop-uploader/uploader';
import { fileMetadata } from '@maany_shr/e-class-models';

interface BannerItemType {
    title: string;
    description: string;
    imageUrl: string | null;
    buttonText: string;
    buttonUrl: string;
}

interface BannerSectionProps {
    value: BannerItemType;
    onChange: (value: BannerItemType) => void;
    onFileUpload: (
        fileRequest: fileMetadata.TFileUploadRequest,
        uploadType: "upload_coaching_page_banner_image",
        abortSignal?: AbortSignal
    ) => Promise<fileMetadata.TFileMetadata>;
    onFileDelete: (id: string) => void;
    onFileDownload: (id: string) => void;
    onImageUploadComplete?: (fileId: string) => void;
    uploadProgress?: number;
}

export default function BannerSection({
    value,
    onChange,
    onFileUpload,
    onFileDelete,
    onFileDownload,
    onImageUploadComplete,
    uploadProgress,
}: BannerSectionProps) {
    const [uploadedFile, setUploadedFile] = useState<fileMetadata.TFileMetadata | null>(null);

    const handleBannerChange = (newBannerData: BannerItemType) => {
        onChange?.(newBannerData);
    };

    const handleFieldChange = (field: keyof BannerItemType, fieldValue: string | null) => {
        const newBannerData = {
            ...value,
            [field]: fieldValue
        };
        handleBannerChange(newBannerData);
    };

    const handleOnFilesChange = async (
        file: fileMetadata.TFileUploadRequest,
        abortSignal?: AbortSignal,
    ) => {
        return onFileUpload(file, "upload_coaching_page_banner_image", abortSignal);
    };

    const handleUploadComplete = (file: fileMetadata.TFileMetadata) => {
        setUploadedFile(file);
        handleFieldChange('imageUrl', file.url as string | null);
        // Notify parent component of the file ID
        onImageUploadComplete?.(file.id as string);
    };

    const handleFileDelete = (id: string) => {
        setUploadedFile(null);
        handleFieldChange('imageUrl', null);
        onFileDelete(id);
        // Notify parent that image was deleted
        onImageUploadComplete?.(null as any);
    };

    const handleFileDownload = (id: string) => {
        onFileDownload(id);
    };

    return (
        <div className="w-full p-6 border border-card-fill rounded-medium bg-card-fill flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <h3>Banner Section</h3>
            </div>

            <div className="flex flex-col gap-6 transition-all duration-300 ease-in-out">
                <div className="rounded-medium flex flex-col gap-3 border-base-neutral-700 bg-base-neutral-800 p-4 transition-all duration-300 ease-in-out">
                    <div className="flex justify-between items-center border-b border-b-divider pb-2">
                        <h3 className="text-lg font-semibold transition-colors duration-200">Banner Content</h3>
                    </div>

                    <form className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2 w-full">
                            <label className="text-sm text-text-secondary">Upload Banner Image</label>
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
                            label="Title"
                            inputField={{
                                inputText: "Enter the title",
                                value: value.title,
                                setValue: (v) => handleFieldChange('title', v)
                            }}
                        />

                        <TextAreaInput
                            label="Description"
                            value={value.description}
                            setValue={(v) => handleFieldChange('description', v)}
                            placeholder="Enter the description"
                        />

                        <TextInput
                            label="Button Text"
                            inputField={{
                                inputText: "Enter button text",
                                value: value.buttonText,
                                setValue: (v) => handleFieldChange('buttonText', v)
                            }}
                        />

                        <TextInput
                            label="Button Link"
                            inputField={{
                                inputText: "Enter button URL",
                                value: value.buttonUrl,
                                setValue: (v) => handleFieldChange('buttonUrl', v)
                            }}
                        />
                    </form>
                </div>
            </div>
        </div>
    );
}
