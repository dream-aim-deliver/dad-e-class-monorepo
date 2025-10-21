'use client';

import * as React from 'react';
import { InputField } from '../input-field';
import { TextAreaInput } from '../text-areaInput';
import { Uploader } from '../drag-and-drop-uploader/uploader';
import { CheckBox } from '../checkbox';
import { AccordionBuilder, type AccordionBuilderItem } from '../accordion-builder';
import { TLocale, getDictionary } from '@maany_shr/e-class-translations';
import { fileMetadata } from '@maany_shr/e-class-models';

export interface PackageDetailsFormData {
    // Package details
    packageTitle: string;
    packageDescription: string;
    featuredImage: fileMetadata.TFileMetadata | null;
    
    // Accordion configuration
    accordionTitle: string;
    showListItemNumbers: boolean;
    accordionItems: AccordionBuilderItem[];
}

export interface PackageDetailsStepProps {
    // Form data
    formData: PackageDetailsFormData;
    onFormDataChange: (updates: Partial<PackageDetailsFormData>) => void;
    
    // File upload handlers
    handlePackageImageUpload: (
        file: fileMetadata.TFileUploadRequest,
        abortSignal?: AbortSignal
    ) => Promise<fileMetadata.TFileMetadata>;
    handleAccordionIconUpload: (
        file: fileMetadata.TFileUploadRequest,
        abortSignal?: AbortSignal
    ) => Promise<fileMetadata.TFileMetadata>;
    
    // Optional progress/error for featured image upload
    uploadProgress?: number;
    errorMessage?: string;

    // Featured image actions
    onDeleteFeaturedImage?: (id: string) => void;
    onDownloadFeaturedImage?: (id: string) => void;

    // Accordion icon upload
    iconUploadProgress?: number;
    onDownloadAccordionIcon?: (id: string) => void;

    locale: TLocale;
}

/**
 * PackageDetailsStep
 *
 * A component for Step 1 of the Create Package flow, handling package details
 * and accordion configuration. This component manages all the form inputs
 * related to package information, featured image upload, and accordion items.
 *
 * Features:
 * - Package title and description input
 * - Featured image upload with drag-and-drop support
 * - Accordion title and configuration
 * - Dynamic accordion items with icon uploads
 * - Rich text editor for accordion content
 * - Auto-opening of new accordion items
 *
 * Props:
 * @param {PackageDetailsFormData} formData - Current form data containing all package details
 * @param {function} onFormDataChange - Function to update form data with partial updates
 * @param {function} handlePackageImageUpload - Handler for featured image upload
 * @param {function} handleAccordionIconUpload - Handler for accordion icon upload
 * @param {number} uploadProgress - Optional upload progress for featured image
 * @param {string} errorMessage - Optional error message for featured image upload
 * @param {function} onDeleteFeaturedImage - Optional handler for deleting featured image
 * @param {function} onDownloadFeaturedImage - Optional handler for downloading featured image
 * @param {number} iconUploadProgress - Optional upload progress for accordion icons
 * @param {function} onDownloadAccordionIcon - Optional handler for downloading accordion icons
 * @param {TLocale} locale - Current locale for translations
 *
 * Usage:
 * ```tsx
 * <PackageDetailsStep
 *   formData={formData}
 *   onFormDataChange={onFormDataChange}
 *   handlePackageImageUpload={handlePackageImageUpload}
 *   handleAccordionIconUpload={handleAccordionIconUpload}
 *   uploadProgress={uploadProgress}
 *   errorMessage={errorMessage}
 *   onDeleteFeaturedImage={onDeleteFeaturedImage}
 *   onDownloadFeaturedImage={onDownloadFeaturedImage}
 *   iconUploadProgress={iconUploadProgress}
 *   onDownloadAccordionIcon={onDownloadAccordionIcon}
 *   locale={locale}
 * />
 * ```
 */

export const PackageDetailsStep: React.FC<PackageDetailsStepProps> = ({
    formData,
    onFormDataChange,
    handlePackageImageUpload,
    handleAccordionIconUpload,
    uploadProgress,
    errorMessage,
    onDeleteFeaturedImage,
    onDownloadFeaturedImage,
    iconUploadProgress,
    onDownloadAccordionIcon,
    locale,
}) => {
    const dictionary = getDictionary(locale);
    const {
        packageTitle,
        packageDescription,
        featuredImage,
        accordionTitle,
        showListItemNumbers,
        accordionItems,
    } = formData;
    const handleOnFilesChange = async (
        file: fileMetadata.TFileUploadRequest,
        abortSignal?: AbortSignal,
    ) => {
        return handlePackageImageUpload(file, abortSignal);
    };

    const handleOnUploadComplete = (file: fileMetadata.TFileMetadata) => {
        if (file.category !== 'image') {
            console.error('Uploaded file is not an image');
            return;
        }
        onFormDataChange({ featuredImage: file });
    };

    const handleOnDelete = (id: string) => {
        onDeleteFeaturedImage?.(id);
        if (featuredImage?.id === id) {
            onFormDataChange({ featuredImage: null });
        }
    };

    const handleOnDownload = (id: string) => {
        onDownloadFeaturedImage?.(id);
    };

    return (
        <div className="flex flex-col border border-card-stroke bg-card-fill p-6 gap-6 w-full rounded-medium">
            <h3 className="text-text-primary">
                {dictionary.components.packageDetailsStep.title}
            </h3>
            
            {/* Package Title */}
            <TextAreaInput
                label={dictionary.components.packageDetailsStep.packageTitleLabel}
                value={packageTitle}
                setValue={(value) => onFormDataChange({ packageTitle: value })}
                placeholder={dictionary.components.packageDetailsStep.packageTitlePlaceholder}
            />

            {/* Package Description */}
            <TextAreaInput
                label={dictionary.components.packageDetailsStep.packageDescriptionLabel}
                value={packageDescription}
                setValue={(value) => onFormDataChange({ packageDescription: value })}
                placeholder={dictionary.components.packageDetailsStep.packageDescriptionPlaceholder}
            />

            {/* Featured Image */}
            <div className="flex flex-col space-y-2">
                <label className="text-sm text-text-secondary">{dictionary.components.packageDetailsStep.featuredImageLabel}</label>
                <Uploader
                    type="single"
                    variant="image"
                    file={featuredImage}
                    maxSize={15}
                    locale={locale}
                    onFilesChange={handleOnFilesChange}
                    onUploadComplete={handleOnUploadComplete}
                    onDelete={handleOnDelete}
                    onDownload={handleOnDownload}
                    uploadProgress={uploadProgress}
                    isDeletionAllowed
                    className="mb-2"
                />
                {errorMessage && (
                    <p className="text-sm text-red-500">{errorMessage}</p>
                )}
            </div>

            {/* Accordion Section */}
            <div className="flex flex-col space-y-4">
                <h3 className="text-lg font-semibold text-text-primary">{dictionary.components.packageDetailsStep.accordionSectionTitle}</h3>

                {/* Accordion Title */}
                <InputField
                    inputText={dictionary.components.packageDetailsStep.accordionTitlePlaceholder}
                    value={accordionTitle}
                    setValue={(value) => onFormDataChange({ accordionTitle: value })}
                />

                {/* Show List Item Numbers Checkbox */}
                <CheckBox
                    name="showListItemNumbers"
                    value={showListItemNumbers.toString()}
                    checked={showListItemNumbers}
                    onChange={() => onFormDataChange({ showListItemNumbers: !showListItemNumbers })}
                    label={dictionary.components.packageDetailsStep.showNumbersCheckbox}
                    labelClass="text-white"
                    withText={true}
                />

                <AccordionBuilder
                    items={accordionItems}
                    setItems={(items) => {
                        if (typeof items === 'function') {
                            onFormDataChange({ accordionItems: items(accordionItems) });
                        } else {
                            onFormDataChange({ accordionItems: items });
                        }
                    }}
                    onIconChange={handleAccordionIconUpload}
                    onIconDownload={(index: number) => {
                        const id = accordionItems[index]?.icon?.id as string | undefined;
                        if (id) onDownloadAccordionIcon?.(id);
                    }}
                    uploadProgress={iconUploadProgress}
                    locale={locale}
                />
            </div>
        </div>
    );
};
