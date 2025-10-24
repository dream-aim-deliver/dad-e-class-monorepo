'use client';

import { useState } from 'react';
import { TextAreaInput } from '../../text-areaInput';
import { Uploader } from '../../drag-and-drop-uploader/uploader';
import { fileMetadata, viewModels } from '@maany_shr/e-class-models';
import { z } from 'zod';

type CoachingOnDemandType = z.infer<typeof viewModels.HomePageSchema>['coachingOnDemand'];

interface CoachingDemandSectionProps {
    initialValue?: CoachingOnDemandType;
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
    initialValue,
    onChange,
    onFileUpload,
    onFileDelete,
    onFileDownload,
    uploadProgress,
}: CoachingDemandSectionProps) {
    const [coachingData, setCoachingData] = useState<CoachingOnDemandType>(
        initialValue || {
            title: '',
            description: '',
            desktopImage: null,
            tabletImage: null,
            mobileImage: null,
        }
    );

    const [uploadedFiles, setUploadedFiles] = useState<{
        desktop?: fileMetadata.TFileMetadata;
        tablet?: fileMetadata.TFileMetadata;
        mobile?: fileMetadata.TFileMetadata;
    }>({});

    const handleCoachingChange = (newCoachingData: CoachingOnDemandType) => {
        setCoachingData(newCoachingData);
        onChange?.(newCoachingData);
    };

    const handleFieldChange = (field: string, value: string | { id: string; name: string; size: number; category: 'image'; downloadUrl: string } | null) => {
        const newCoachingData = {
            ...coachingData,
            [field]: value
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

    const handleFileDownload = (id: string) => {
        onFileDownload(id);
    };

    return (
        <div className="w-full p-6 border border-card-fill rounded-medium bg-card-fill flex flex-col gap-6">
            <h2>Coaching On Demand Section</h2>

            <div className="flex flex-col gap-6 transition-all duration-300 ease-in-out">
                <div className="flex flex-col gap-4">
                    <TextAreaInput
                        label="Title"
                        value={coachingData?.title || ''}
                        setValue={(value) => handleFieldChange('title', value)}
                        placeholder="Enter the coaching section title"
                    />

                    <TextAreaInput
                        label="Description"
                        value={coachingData?.description || ''}
                        setValue={(value) => handleFieldChange('description', value)}
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
                            onDownload={handleFileDownload}
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
                            onDownload={handleFileDownload}
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
                            onDownload={handleFileDownload}
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
