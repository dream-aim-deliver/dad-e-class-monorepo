'use client';

import { useState, useEffect } from 'react';
import { TextAreaInput } from '../../text-areaInput';
import { Uploader } from '../../drag-and-drop-uploader/uploader';
import { fileMetadata, viewModels } from '@maany_shr/e-class-models';
import { z } from 'zod';
import { downloadFile } from '@maany_shr/e-class-ui-kit';

type CoachingOnDemandType = z.infer<typeof viewModels.HomePageSchema>['coachingOnDemand'];

interface CoachingDemandSectionProps {
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
}: CoachingDemandSectionProps) {
    const [uploadedFiles, setUploadedFiles] = useState<{
        desktop?: fileMetadata.TFileMetadata;
        tablet?: fileMetadata.TFileMetadata;
        mobile?: fileMetadata.TFileMetadata;
    }>({});

    // Sync uploadedFiles with value prop when images are loaded from server
    // Only update if the image IDs have actually changed (not just object recreation)
    useEffect(() => {
        const newUploadedFiles: {
            desktop?: fileMetadata.TFileMetadata;
            tablet?: fileMetadata.TFileMetadata;
            mobile?: fileMetadata.TFileMetadata;
        } = {};
        let hasChanges = false;

        if (value.desktopImage) {
            if (!uploadedFiles.desktop || uploadedFiles.desktop.id !== value.desktopImage.id) {
                hasChanges = true;
            }
            newUploadedFiles.desktop = {
                id: value.desktopImage.id,
                name: value.desktopImage.name,
                size: value.desktopImage.size,
                category: value.desktopImage.category,
                url: value.desktopImage.downloadUrl,
            } as fileMetadata.TFileMetadata;
        } else if (uploadedFiles.desktop) {
            hasChanges = true;
        }

        if (value.tabletImage) {
            if (!uploadedFiles.tablet || uploadedFiles.tablet.id !== value.tabletImage.id) {
                hasChanges = true;
            }
            newUploadedFiles.tablet = {
                id: value.tabletImage.id,
                name: value.tabletImage.name,
                size: value.tabletImage.size,
                category: value.tabletImage.category,
                url: value.tabletImage.downloadUrl,
            } as fileMetadata.TFileMetadata;
        } else if (uploadedFiles.tablet) {
            hasChanges = true;
        }

        if (value.mobileImage) {
            if (!uploadedFiles.mobile || uploadedFiles.mobile.id !== value.mobileImage.id) {
                hasChanges = true;
            }
            newUploadedFiles.mobile = {
                id: value.mobileImage.id,
                name: value.mobileImage.name,
                size: value.mobileImage.size,
                category: value.mobileImage.category,
                url: value.mobileImage.downloadUrl,
            } as fileMetadata.TFileMetadata;
        } else if (uploadedFiles.mobile) {
            hasChanges = true;
        }

        if (hasChanges) {
            setUploadedFiles(newUploadedFiles);
        }
    }, [value.desktopImage?.id, value.tabletImage?.id, value.mobileImage?.id]);

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
        setUploadedFiles(prev => ({
            ...prev,
            [deviceType]: file
        }));

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
        setUploadedFiles(prev => {
            const newFiles = { ...prev };
            delete newFiles[deviceType];
            return newFiles;
        });

        const imageField = `${deviceType}Image` as keyof CoachingOnDemandType;
        handleFieldChange(imageField, null);
        onFileDelete(id);
    };

    const handleFileDownload = (deviceType: 'desktop' | 'tablet' | 'mobile') => (id: string) => {
        const file = uploadedFiles[deviceType];
        if (file?.id === id && file.url) {
            downloadFile(file.url, file.name);
        }
    };

    return (
        <div className="w-full p-6 border border-card-fill rounded-medium bg-card-fill flex flex-col gap-6">
            <h2>Coaching On Demand Section</h2>

            <div className="flex flex-col gap-6 transition-all duration-300 ease-in-out">
                <div className="flex flex-col gap-4">
                    <TextAreaInput
                        label="Title"
                        value={value?.title || ''}
                        setValue={(v) => handleFieldChange('title', v)}
                        placeholder="Enter the coaching section title"
                    />

                    <TextAreaInput
                        label="Description"
                        value={value?.description || ''}
                        setValue={(v) => handleFieldChange('description', v)}
                        placeholder="Enter the coaching section description"
                    />

                    {/* Desktop Image Upload */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-text-secondary">Desktop Image</label>
                        <Uploader
                            type="single"
                            variant="image"
                            file={uploadedFiles.desktop || null}
                            onDelete={(id) => handleFileDelete('desktop', id)}
                            onDownload={handleFileDownload('desktop')}
                            onFilesChange={(file, abortSignal) => handleOnFilesChange('desktop', file, abortSignal)}
                            onUploadComplete={(file) => handleUploadComplete('desktop', file)}
                            locale="en"
                            maxSize={10}
                            uploadProgress={uploadProgress}
                        />
                    </div>

                    {/* Tablet Image Upload */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-text-secondary">Tablet Image</label>
                        <Uploader
                            type="single"
                            variant="image"
                            file={uploadedFiles.tablet || null}
                            onDelete={(id) => handleFileDelete('tablet', id)}
                            onDownload={handleFileDownload('tablet')}
                            onFilesChange={(file, abortSignal) => handleOnFilesChange('tablet', file, abortSignal)}
                            onUploadComplete={(file) => handleUploadComplete('tablet', file)}
                            locale="en"
                            maxSize={10}
                            uploadProgress={uploadProgress}
                        />
                    </div>

                    {/* Mobile Image Upload */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-text-secondary">Mobile Image</label>
                        <Uploader
                            type="single"
                            variant="image"
                            file={uploadedFiles.mobile || null}
                            onDelete={(id) => handleFileDelete('mobile', id)}
                            onDownload={handleFileDownload('mobile')}
                            onFilesChange={(file, abortSignal) => handleOnFilesChange('mobile', file, abortSignal)}
                            onUploadComplete={(file) => handleUploadComplete('mobile', file)}
                            locale="en"
                            maxSize={10}
                            uploadProgress={uploadProgress}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
