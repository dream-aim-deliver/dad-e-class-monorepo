'use client';

import { useState, useEffect } from 'react';
import { TextAreaInput } from '../../text-areaInput';
import { CheckBox } from '../../checkbox';
import { AccordionBuilder, AccordionBuilderItem } from '../../accordion-builder';
import { fileMetadata, viewModels } from '@maany_shr/e-class-models';
import { z } from 'zod';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';

type AccordionType = z.infer<typeof viewModels.HomePageSchema>['accordion'];

interface HowItWorksSectionProps extends isLocalAware {
    value: AccordionType;
    onChange: (value: AccordionType) => void;
    onFileUpload: (
        fileRequest: fileMetadata.TFileUploadRequest,
        uploadType: "upload_home_page_accordion_item",
        abortSignal?: AbortSignal
    ) => Promise<fileMetadata.TFileMetadata>;
    onFileDelete: (id: string) => void;
    onFileDownload: (id: string) => void;
    uploadProgress?: number;
}

export default function HowItWorksSection({
    value,
    onChange,
    onFileUpload,
    onFileDelete,
    onFileDownload,
    uploadProgress,
    locale
}: HowItWorksSectionProps) {
    const dictionary = getDictionary(locale);
    const t = dictionary.components.cmsSections.howItWorksSection;
    const handleAccordionChange = (newAccordionData: AccordionType) => {
        onChange?.(newAccordionData);
    };

    const handleFieldChange = (field: string, fieldValue: string | boolean) => {
        const newAccordionData = {
            ...value,
            [field]: fieldValue
        } as AccordionType;
        handleAccordionChange(newAccordionData);
    };

    // State for builder items - initialize from value
    const [builderItems, setBuilderItems] = useState<AccordionBuilderItem[]>(() => {
        return (value?.items || []).map(item => ({
            title: item?.title || '',
            content: item?.content || '',
            // Map iconImage from server format to ImageFile format
            icon: item?.iconImage ? {
                status: 'available' as const,
                id: item.iconImage.id,
                name: item.iconImage.name,
                thumbnailUrl: item.iconImage.downloadUrl,
                size: item.iconImage.size,
                category: 'image' as const,
                url: item.iconImage.downloadUrl,
            } : null,
        }));
    });

    // Sync builderItems with value changes ONLY when items count changes
    // This prevents the infinite loop when user is typing
    useEffect(() => {
        const valueItemsLength = value?.items?.length || 0;
        const builderItemsLength = builderItems.length;

        // Only sync if the number of items changed (items added/removed from server)
        if (valueItemsLength !== builderItemsLength) {
            const items = (value?.items || []).map(item => ({
                title: item?.title || '',
                content: item?.content || '',
                // Map iconImage from server format to ImageFile format
                icon: item?.iconImage ? {
                    status: 'available' as const,
                    id: item.iconImage.id,
                    name: item.iconImage.name,
                    thumbnailUrl: item.iconImage.downloadUrl,
                    size: item.iconImage.size,
                    category: 'image' as const,
                    url: item.iconImage.downloadUrl,
                } : null,
            }));
            setBuilderItems(items);
        }
    }, [value?.items?.length]);

    // Update value when builderItems change (from user input)
    const handleBuilderItemsChange = (newItems: AccordionBuilderItem[] | ((prev: AccordionBuilderItem[]) => AccordionBuilderItem[])) => {
        const items = typeof newItems === 'function' ? newItems(builderItems) : newItems;
        setBuilderItems(items);

        const accordionItems = items.map((item, index) => ({
            title: item.title,
            content: item.content,
            position: index + 1,
            // Use the icon from builderItems (which includes uploaded icons)
            // Map TFileMetadata to the expected iconImage format
            iconImage: (item.icon && item.icon.name && item.icon.id !== undefined && item.icon.size !== undefined) ? {
                name: item.icon.name,
                id: item.icon.id,
                size: item.icon.size,
                category: 'image' as const,
                downloadUrl: item.icon.url || '',
            } : null,
        }));

        handleAccordionChange({
            ...value,
            items: accordionItems
        });
    };

    const handleIconUpload = async (
        metadata: fileMetadata.TFileUploadRequest,
        signal: AbortSignal,
    ): Promise<fileMetadata.TFileMetadata> => {
        return onFileUpload(metadata, "upload_home_page_accordion_item", signal);
    };

    const handleIconDownload = (index: number) => {
        const item = value?.items?.[index];
        if (item?.iconImage?.id) {
            onFileDownload(item.iconImage.id);
        }
    };

    return (
        <div className="w-full p-6 border border-card-fill rounded-medium bg-card-fill flex flex-col gap-6">
            <h2>{t.heading}</h2>

            <div className="flex flex-col gap-4">
                <TextAreaInput
                    label={t.titleLabel}
                    value={value?.title || ''}
                    setValue={(v) => handleFieldChange('title', v)}
                    placeholder={t.titlePlaceholder}
                />

                <CheckBox
                    name="showNumbers"
                    value="showNumbers"
                    label={t.showNumbersLabel}
                    className="text-base-white"
                    checked={value?.showNumbers ?? true}
                    withText={true}
                    onChange={() => handleFieldChange('showNumbers', !(value?.showNumbers ?? true))}
                />
            </div>

            <div className="flex flex-col gap-4">
                <AccordionBuilder
                    items={builderItems}
                    setItems={handleBuilderItemsChange}
                    onIconChange={handleIconUpload}
                    onIconDownload={handleIconDownload}
                    uploadProgress={uploadProgress}
                    locale="en"
                />
            </div>
        </div>
    );
}