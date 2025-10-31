'use client';

import { TextAreaInput } from '../text-areaInput';
import { TextInput } from '../text-input';
import { Uploader } from '../drag-and-drop-uploader/uploader';
import { fileMetadata } from '@maany_shr/e-class-models';
import { downloadFile } from '../../utils/file-utils';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';

interface BannerItemType {
    title: string;
    description: string;
    image: {
        id: string;
        name: string;
        size: number;
        category: 'image';
        downloadUrl: string;
    } | null;
    buttonText: string;
    buttonLink: string;
}

interface BannerSectionProps extends isLocalAware {
    value: BannerItemType;
    onChange: (value: BannerItemType) => void;
    onFileUpload: (
        fileRequest: fileMetadata.TFileUploadRequest,
        uploadType: "upload_coaching_page_banner_image",
        abortSignal?: AbortSignal
    ) => Promise<fileMetadata.TFileMetadata>;
    onFileDelete: (id: string) => void;
    onFileDownload: (id: string) => void;
    onImageUploadComplete?: (fileId: string | null) => void;
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
    locale
}: BannerSectionProps) {
    const dictionary = getDictionary(locale);
    const t = dictionary.components.cmsSections.bannerSection;

    // Derive uploadedFile from value prop - single source of truth
    const uploadedFile: fileMetadata.TFileMetadata | null = value.image ? {
        id: value.image.id,
        name: value.image.name,
        size: value.image.size,
        category: value.image.category,
        url: value.image.downloadUrl,
        thumbnailUrl: value.image.downloadUrl,
        status: "available" as const
    } : null;

    const handleFieldChange = (field: keyof BannerItemType, fieldValue: string | null) => {
        const newBannerData = {
            ...value,
            [field]: fieldValue
        };
        onChange?.(newBannerData);
    };

    const handleOnFilesChange = async (
        file: fileMetadata.TFileUploadRequest,
        abortSignal?: AbortSignal,
    ) => {
        return onFileUpload(file, "upload_coaching_page_banner_image", abortSignal);
    };

    const handleUploadComplete = (file: fileMetadata.TFileMetadata) => {
        // Update image object with uploaded file metadata
        const newBannerData = {
            ...value,
            image: {
                id: file.id,
                name: file.name,
                size: file.size,
                category: 'image' as const,
                downloadUrl: file.url as string,
            },
        };
        onChange?.(newBannerData);
        // Notify parent component of the file ID
        onImageUploadComplete?.(file.id);
    };

    const handleFileDelete = (id: string) => {
        // Clear image object
        const newBannerData = {
            ...value,
            image: null,
        };
        onChange?.(newBannerData);
        onFileDelete(id);
        // Notify parent that image was deleted
        onImageUploadComplete?.(null);
    };

    const handleFileDownload = (id: string) => {
        if (uploadedFile?.id === id && uploadedFile.url && uploadedFile.name) {
            downloadFile(uploadedFile.url, uploadedFile.name);
        }
    };

    return (
        <div className="w-full p-6 border border-card-fill rounded-medium bg-card-fill flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <h3>{t.heading}</h3>
            </div>

            <div className="flex flex-col gap-6 transition-all duration-300 ease-in-out">
                <div className="rounded-medium flex flex-col gap-3 border-base-neutral-700 bg-base-neutral-800 p-4 transition-all duration-300 ease-in-out">
                    <div className="flex justify-between items-center border-b border-b-divider pb-2">
                        <h3 className="text-lg font-semibold transition-colors duration-200">Banner Content</h3>
                    </div>

                    <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                        <div className="flex flex-col gap-2 w-full">
                            <label className="text-sm text-text-secondary">{t.uploadBannerImageLabel}</label>
                            <Uploader
                                type="single"
                                variant="image"
                                file={uploadedFile}
                                onDelete={handleFileDelete}
                                onDownload={handleFileDownload}
                                onFilesChange={handleOnFilesChange}
                                onUploadComplete={handleUploadComplete}
                                locale={locale}
                                maxSize={10}
                                uploadProgress={uploadProgress}
                            />
                        </div>

                        <TextInput
                            label={t.titleLabel}
                            inputField={{
                                inputText: t.titlePlaceholder,
                                value: value.title,
                                setValue: (v) => handleFieldChange('title', v)
                            }}
                        />

                        <TextAreaInput
                            label={t.descriptionLabel}
                            value={value.description}
                            setValue={(v) => handleFieldChange('description', v)}
                            placeholder={t.descriptionPlaceholder}
                        />

                        <TextInput
                            label={t.buttonTextLabel}
                            inputField={{
                                inputText: t.buttonTextPlaceholder,
                                value: value.buttonText,
                                setValue: (v) => handleFieldChange('buttonText', v)
                            }}
                        />

                        <TextInput
                            label={t.buttonLinkLabel}
                            inputField={{
                                inputText: t.buttonLinkPlaceholder,
                                value: value.buttonLink,
                                setValue: (v) => handleFieldChange('buttonLink', v)
                            }}
                        />
                    </form>
                </div>
            </div>
        </div>
    );
}
