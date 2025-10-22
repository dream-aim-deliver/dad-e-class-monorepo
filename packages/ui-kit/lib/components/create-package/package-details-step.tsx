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

interface FeaturedImageUploadHandlers {
    onUpload: (file: fileMetadata.TFileUploadRequest, abortSignal?: AbortSignal) => Promise<fileMetadata.TFileMetadata>;
    onDelete: (id: string) => void;
    onDownload: (id: string) => void;
    uploadProgress: number;
    errorMessage: string;
}

interface AccordionIconUploadHandlers {
    onUpload: (file: fileMetadata.TFileUploadRequest, abortSignal?: AbortSignal) => Promise<fileMetadata.TFileMetadata>;
    onDelete: (id: string) => void;
    onDownload: (id: string) => void;
    uploadProgress: number;
    errorMessage: string;
}

export interface PackageDetailsStepProps {
    // Form data
    formData: PackageDetailsFormData;
    onFormDataChange: (updates: Partial<PackageDetailsFormData>) => void;
    
    // Structured upload handlers
    featuredImageUpload: FeaturedImageUploadHandlers;
    accordionIconUpload: AccordionIconUploadHandlers;
    
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
 * @param {FeaturedImageUploadHandlers} featuredImageUpload - Structured handlers for featured image upload operations
 * @param {AccordionIconUploadHandlers} accordionIconUpload - Structured handlers for accordion icon upload operations
 * @param {TLocale} locale - Current locale for translations
 *
 * Usage:
 * ```tsx
 * <PackageDetailsStep
 *   formData={formData}
 *   onFormDataChange={onFormDataChange}
 *   featuredImageUpload={{
 *     onUpload: handlePackageImageUpload,
 *     onDelete: handleDeleteFeaturedImage,
 *     onDownload: handleDownloadFeaturedImage,
 *     uploadProgress: packageImageProgress,
 *     errorMessage: packageImageError
 *   }}
 *   accordionIconUpload={{
 *     onUpload: handleAccordionIconUpload,
 *     onDelete: handleDeleteAccordionIcon,
 *     onDownload: handleDownloadAccordionIcon,
 *     uploadProgress: iconUploadProgress,
 *     errorMessage: iconUploadError
 *   }}
 *   locale={locale}
 * />
 * ```
 */

export const PackageDetailsStep: React.FC<PackageDetailsStepProps> = ({
    formData,
    onFormDataChange,
    featuredImageUpload,
    accordionIconUpload,
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
        return featuredImageUpload.onUpload(file, abortSignal);
    };

    const handleOnUploadComplete = (file: fileMetadata.TFileMetadata) => {
        if (file.category !== 'image') {
            console.error('Uploaded file is not an image');
            return;
        }
        onFormDataChange({ featuredImage: file });
    };

    const handleOnDelete = (id: string) => {
        featuredImageUpload.onDelete(id);
        if (featuredImage?.id === id) {
            onFormDataChange({ featuredImage: null });
        }
    };

    const handleOnDownload = (id: string) => {
        featuredImageUpload.onDownload(id);
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
                    uploadProgress={featuredImageUpload.uploadProgress}
                    isDeletionAllowed
                    className="mb-2"
                />
                {featuredImageUpload.errorMessage && (
                    <p className="text-sm text-red-500">{featuredImageUpload.errorMessage}</p>
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
                            const newItems = items(accordionItems);
                            // Check if any icons were removed and call onDelete
                            accordionItems.forEach((oldItem, index) => {
                                const newItem = newItems[index];
                                if (oldItem.icon && !newItem?.icon && oldItem.icon.id) {
                                    accordionIconUpload.onDelete(oldItem.icon.id);
                                }
                            });
                            onFormDataChange({ accordionItems: newItems });
                        } else {
                            // Check if any icons were removed and call onDelete
                            accordionItems.forEach((oldItem, index) => {
                                const newItem = items[index];
                                if (oldItem.icon && !newItem?.icon && oldItem.icon.id) {
                                    accordionIconUpload.onDelete(oldItem.icon.id);
                                }
                            });
                            onFormDataChange({ accordionItems: items });
                        }
                    }}
                    onIconChange={accordionIconUpload.onUpload}
                    onIconDownload={(index: number) => {
                        const id = accordionItems[index]?.icon?.id as string | undefined;
                        if (id) accordionIconUpload.onDownload(id);
                    }}
                    uploadProgress={accordionIconUpload.uploadProgress}
                    locale={locale}
                />
            </div>
        </div>
    );
};
