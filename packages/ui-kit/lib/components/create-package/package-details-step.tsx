'use client';

import * as React from 'react';
import { InputField } from '../input-field';
import { TextAreaInput } from '../text-areaInput';
import { Uploader } from '../drag-and-drop-uploader/uploader';
import { CheckBox } from '../checkbox';
import { AccordionBuilder, type AccordionBuilderItem } from '../accordion-builder';
import { TLocale } from '@maany_shr/e-class-translations';
import { fileMetadata } from '@maany_shr/e-class-models';

export interface PackageDetailsStepProps {
    // Package details state
    packageTitle: string;
    setPackageTitle: (title: string) => void;
    packageDescription: string;
    setPackageDescription: (description: string) => void;
    featuredImage: fileMetadata.TFileMetadata | null;
    setFeaturedImage: (image: fileMetadata.TFileMetadata | null) => void;
    
    // Accordion state
    accordionTitle: string;
    setAccordionTitle: (title: string) => void;
    showListItemNumbers: boolean;
    setShowListItemNumbers: (show: boolean) => void;
    accordionItems: AccordionBuilderItem[];
    setAccordionItems: React.Dispatch<React.SetStateAction<AccordionBuilderItem[]>>;
    
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
 * @param {string} packageTitle - Current package title value
 * @param {function} setPackageTitle - Function to update package title
 * @param {string} packageDescription - Current package description value
 * @param {function} setPackageDescription - Function to update package description
 * @param {fileMetadata.TFileMetadata | null} featuredImage - Current package image
 * @param {function} setFeaturedImage - Function to update package image
 * @param {string} accordionTitle - Current accordion title value
 * @param {function} setAccordionTitle - Function to update accordion title
 * @param {boolean} showListItemNumbers - Whether to show list item numbers
 * @param {function} setShowListItemNumbers - Function to toggle list item numbers
 * @param {AccordionItemData[]} accordionItems - Array of accordion items
 * @param {function} setAccordionItems - Function to update accordion items
 * @param {string[]} openAccordionItems - Array of open accordion item IDs
 * @param {function} setOpenAccordionItems - Function to update open accordion items
 * @param {function} handlePackageImageUpload - Handler for featured image upload
 * @param {function} handleAccordionIconUpload - Handler for accordion icon upload
 * @param {TLocale} locale - Current locale for translations
 *
 * Usage:
 * ```tsx
 * <PackageDetailsStep
 *   packageTitle={packageTitle}
 *   setPackageTitle={setPackageTitle}
 *   packageDescription={packageDescription}
 *   setPackageDescription={setPackageDescription}
 *   featuredImage={featuredImage}
 *   uploadProgress={uploadProgress}
 *   errorMessage={errorMessage}
 *   setFeaturedImage={setFeaturedImage}
 *   accordionTitle={accordionTitle}
 *   setAccordionTitle={setAccordionTitle}
 *   showListItemNumbers={showListItemNumbers}
 *   setShowListItemNumbers={setShowListItemNumbers}
 *   accordionItems={accordionItems}
 *   setAccordionItems={setAccordionItems}
 *   openAccordionItems={openAccordionItems}
 *   setOpenAccordionItems={setOpenAccordionItems}
 *   handlePackageImageUpload={handlePackageImageUpload}
 *   handleAccordionIconUpload={handleAccordionIconUpload}
 *   locale={locale}
 * />
 * ```
 */

export const PackageDetailsStep: React.FC<PackageDetailsStepProps> = ({
    packageTitle,
    setPackageTitle,
    packageDescription,
    setPackageDescription,
    featuredImage,
    setFeaturedImage,
    accordionTitle,
    setAccordionTitle,
    showListItemNumbers,
    setShowListItemNumbers,
    accordionItems,
    setAccordionItems,
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
        setFeaturedImage(file);
    };

    const handleOnDelete = (id: string) => {
        onDeleteFeaturedImage?.(id);
        if (featuredImage?.id === id) {
            setFeaturedImage(null);
        }
    };

    const handleOnDownload = (id: string) => {
        onDownloadFeaturedImage?.(id);
    };

    return (
        <div className="flex flex-col border border-card-stroke bg-card-fill p-6 gap-6 w-full rounded-medium">
            <h3 className="text-text-primary">
                Package details
            </h3>
            
            {/* Package Title */}
            <TextAreaInput
                label="Package Title"
                value={packageTitle}
                setValue={setPackageTitle}
                placeholder="Max 70 characters"
            />

            {/* Package Description */}
            <TextAreaInput
                label="Package Description"
                value={packageDescription}
                setValue={setPackageDescription}
                placeholder="Max 320 characters"
            />

            {/* Featured Image */}
            <div className="flex flex-col space-y-2">
                <label className="text-sm text-text-secondary">Featured Image</label>
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
                {/* TODO: Consider surfacing i18n-friendly error messages here */}
                {errorMessage && (
                    <p className="text-sm text-red-500">{errorMessage}</p>
                )}
            </div>

            {/* Accordion Section */}
            <div className="flex flex-col space-y-4">
                <h3 className="text-lg font-semibold text-text-primary">Accordion</h3>

                {/* Accordion Title */}
                <InputField
                    inputText="accordion-title"
                    value={accordionTitle}
                    setValue={setAccordionTitle}
                />

                {/* Show List Item Numbers Checkbox */}
                <CheckBox
                    name="showListItemNumbers"
                    value={showListItemNumbers.toString()}
                    checked={showListItemNumbers}
                    onChange={() => setShowListItemNumbers(!showListItemNumbers)}
                    label="Show list item numbers in public view"
                    labelClass="text-white"
                    withText={true}
                />

                <AccordionBuilder
                    items={accordionItems}
                    setItems={setAccordionItems}
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
