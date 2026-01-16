'use client';

import { useMemo } from 'react';
import { TextAreaInput } from '../../text-areaInput';
import { Uploader } from '../../drag-and-drop-uploader/uploader';
import { fileMetadata, viewModels } from '@maany_shr/e-class-models';
import { z } from 'zod';
import { downloadFile } from '../../../utils/file-utils';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';

type CoachingOnDemandType = z.infer<typeof viewModels.HomePageSchema>['coachingOnDemand'];

interface CoachingDemandSectionProps extends isLocalAware {
    value: CoachingOnDemandType;
    onChange: (value: CoachingOnDemandType) => void;
    onFileUpload: (
        fileRequest: fileMetadata.TFileUploadRequest,
        uploadType: "upload_home_page_coaching_on_demand_banner_desktop" | "upload_home_page_coaching_on_demand_banner_tablet" | "upload_home_page_coaching_on_demand_banner_mobile",
        abortSignal?: AbortSignal
    ) => Promise<fileMetadata.TFileMetadata>;
    onFileDelete: (id: string) => void;
    onFileDownload: (id: string) => void;
    uploadProgress?: number;
}

export default function CoachingDemandSection({
    value,
    onChange,
    onFileUpload,
    onFileDelete,
    onFileDownload,
    uploadProgress,
    locale
}: CoachingDemandSectionProps) {
    const dictionary = getDictionary(locale)
    const t = dictionary.components.cmsSections.coachingDemandSection;
    const uploadedFiles = useMemo(() => {
        const files: {
            desktop?: fileMetadata.TFileMetadataImage;
            tablet?: fileMetadata.TFileMetadataImage;
            mobile?: fileMetadata.TFileMetadataImage;
        } = {};

        if (value.desktopImage) {
            files.desktop = {
                id: value.desktopImage.id,
                name: value.desktopImage.name,
                size: value.desktopImage.size,
                category: value.desktopImage.category as 'image',
                url: value.desktopImage.downloadUrl,
                thumbnailUrl: value.desktopImage.downloadUrl,
                status: "available" as const
            } as fileMetadata.TFileMetadataImage;
        }

        if (value.tabletImage) {
            files.tablet = {
                id: value.tabletImage.id,
                name: value.tabletImage.name,
                size: value.tabletImage.size,
                category: value.tabletImage.category as 'image',
                url: value.tabletImage.downloadUrl,
                thumbnailUrl: value.tabletImage.downloadUrl,
                status: "available" as const
            } as fileMetadata.TFileMetadataImage;
        }

        if (value.mobileImage) {
            files.mobile = {
                id: value.mobileImage.id,
                name: value.mobileImage.name,
                size: value.mobileImage.size,
                category: value.mobileImage.category as 'image',
                url: value.mobileImage.downloadUrl,
                thumbnailUrl: value.mobileImage.downloadUrl,
                status: "available" as const
            } as fileMetadata.TFileMetadataImage;
        }

        return files;
    }, [value.desktopImage, value.tabletImage, value.mobileImage]);

    const handleCoachingChange = (newCoachingData: CoachingOnDemandType) => {
        onChange?.(newCoachingData);
    };

    const handleFieldChange = (field: string, fieldValue: string | { id: string; name: string; size: number; category: 'image'; downloadUrl: string } | null) => {
        const newCoachingData = {
            ...value,
            [field]: fieldValue
        } as CoachingOnDemandType;
        handleCoachingChange(newCoachingData);
    };

    const handleOnFilesChange = async (
        deviceType: 'desktop' | 'tablet' | 'mobile',
        file: fileMetadata.TFileUploadRequest,
        abortSignal?: AbortSignal,
    ) => {
        const uploadTypeMap = {
            desktop: "upload_home_page_coaching_on_demand_banner_desktop" as const,
            tablet: "upload_home_page_coaching_on_demand_banner_tablet" as const,
            mobile: "upload_home_page_coaching_on_demand_banner_mobile" as const,
        };
        return onFileUpload(file, uploadTypeMap[deviceType], abortSignal);
    };

    const handleUploadComplete = (deviceType: 'desktop' | 'tablet' | 'mobile', file: fileMetadata.TFileMetadata) => {
        const imageField = `${deviceType}Image` as keyof CoachingOnDemandType;
        const imageObject = {
            id: file.id?.toString() ?? '',
            name: file.name ?? '',
            size: file.size ?? 0,
            category: 'image' as const,
            downloadUrl: file.url ?? ''
        };
        handleFieldChange(imageField, imageObject);
    };

    const handleFileDelete = (deviceType: 'desktop' | 'tablet' | 'mobile', id: string) => {
        const imageField = `${deviceType}Image` as keyof CoachingOnDemandType;
        handleFieldChange(imageField, null);
        onFileDelete(id);
    };

    const handleFileDownload = (deviceType: 'desktop' | 'tablet' | 'mobile') => (id: string) => {
        const file = uploadedFiles[deviceType];
        if (file?.id === id && file.url && file.name) {
            downloadFile(file.url, file.name);
        }
    };

    return (
        <div className="w-full p-6 border border-card-fill rounded-medium bg-card-fill flex flex-col gap-6">
            <h2>{t.heading}</h2>

            <div className="flex flex-col gap-6 transition-all duration-300 ease-in-out">
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

                    {/* Desktop Image Upload */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-text-secondary">{t.desktopImageLabel}</label>
                        <Uploader
                            type="single"
                            variant="image"
                            file={uploadedFiles.desktop || null}
                            onDelete={(id) => handleFileDelete('desktop', id)}
                            onDownload={handleFileDownload('desktop')}
                            onFilesChange={(file, abortSignal) => handleOnFilesChange('desktop', file, abortSignal)}
                            onUploadComplete={(file) => handleUploadComplete('desktop', file)}
                            locale="en"
                            maxSize={20} // 20 MB
                            uploadProgress={uploadProgress}
                        />
                    </div>

                    {/* Tablet Image Upload */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-text-secondary">{t.tabletImageLabel}</label>
                        <Uploader
                            type="single"
                            variant="image"
                            file={uploadedFiles.tablet || null}
                            onDelete={(id) => handleFileDelete('tablet', id)}
                            onDownload={handleFileDownload('tablet')}
                            onFilesChange={(file, abortSignal) => handleOnFilesChange('tablet', file, abortSignal)}
                            onUploadComplete={(file) => handleUploadComplete('tablet', file)}
                            locale="en"
                            maxSize={20} // 20 MB
                            uploadProgress={uploadProgress}
                        />
                    </div>

                    {/* Mobile Image Upload */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-text-secondary">{t.mobileImageLabel}</label>
                        <Uploader
                            type="single"
                            variant="image"
                            file={uploadedFiles.mobile || null}
                            onDelete={(id) => handleFileDelete('mobile', id)}
                            onDownload={handleFileDownload('mobile')}
                            onFilesChange={(file, abortSignal) => handleOnFilesChange('mobile', file, abortSignal)}
                            onUploadComplete={(file) => handleUploadComplete('mobile', file)}
                            locale={locale}
                            maxSize={20} // 20 MB
                            uploadProgress={uploadProgress}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
