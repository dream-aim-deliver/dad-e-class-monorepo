'use client';

import { useState, useEffect } from 'react';
import { TextAreaInput } from '../../text-areaInput';
import { CheckBox } from '../../checkbox';
import { AccordionBuilder, AccordionBuilderItem } from '../../accordion-builder';
import { fileMetadata, viewModels } from '@maany_shr/e-class-models';
import { z } from 'zod';

type AccordionType = z.infer<typeof viewModels.HomePageSchema>['accordion'];

interface HowItWorksSectionProps {
    initialValue?: AccordionType;
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
    initialValue,
    onChange,
    onFileUpload,
    onFileDelete,
    onFileDownload,
    uploadProgress,
}: HowItWorksSectionProps) {
    const [accordionData, setAccordionData] = useState<AccordionType>({
        title: initialValue?.title ?? '',
        showNumbers: initialValue?.showNumbers ?? true,
        items: initialValue?.items ?? [],
    });


    useEffect(() => {
        if (initialValue) {
            setAccordionData({
                title: initialValue.title ?? '',
                showNumbers: initialValue.showNumbers ?? true,
                items: initialValue.items ?? [],
            });
        }
    }, [initialValue]);

    const handleAccordionChange = (newAccordionData: AccordionType) => {
        setAccordionData(newAccordionData);
        onChange?.(newAccordionData);
    };

    const handleFieldChange = (field: string, value: string | boolean) => {
        const newAccordionData = {
            ...accordionData,
            [field]: value
        } as AccordionType;
        handleAccordionChange(newAccordionData);
    };

    // State for builder items
    const [builderItems, setBuilderItems] = useState<AccordionBuilderItem[]>([]);

    // Sync builderItems with accordionData changes
    useEffect(() => {
        const items = (accordionData?.items || []).map(item => ({
            title: item?.title || '',
            content: item?.content || '',
            icon: null, // TODO: Map iconImageUrl to proper file object when backend provides it
        }));
        setBuilderItems(items);
    }, [accordionData]);

    // Update accordionData when builderItems change
    useEffect(() => {
        if (builderItems.length === 0 && (!accordionData?.items || accordionData.items.length === 0)) {
            return; // Skip initial empty state
        }

        const newItems = builderItems.map((item, index) => ({
            title: item.title,
            content: item.content,
            position: index + 1,
            iconImage: null, // Will be set when user uploads
        }));

        handleAccordionChange({
            ...accordionData,
            items: newItems
        });
    }, [builderItems]);

    const handleIconUpload = async (
        metadata: fileMetadata.TFileUploadRequest,
        signal: AbortSignal,
    ): Promise<fileMetadata.TFileMetadata> => {
        return onFileUpload(metadata, "upload_home_page_accordion_item", signal);
    };

    const handleIconDownload = (index: number) => {
        const item = accordionData?.items?.[index];
        if (item?.iconImage?.id) {
            onFileDownload(item.iconImage.id);
        }
    };

    return (
        <div className="w-full p-6 border border-card-fill rounded-medium bg-card-fill flex flex-col gap-6">
            <h2>How It Works Section</h2>

            <div className="flex flex-col gap-4">
                <TextAreaInput
                    label="Title"
                    value={accordionData?.title || ''}
                    setValue={(value) => handleFieldChange('title', value)}
                    placeholder="Enter the how it works section title"
                />

                <CheckBox
                    name="showNumbers"
                    value="showNumbers"
                    label="Show Numbers"
                    className="text-base-white"
                    checked={accordionData?.showNumbers ?? true}
                    withText={true}
                    onChange={() => handleFieldChange('showNumbers', !(accordionData?.showNumbers ?? true))}
                />
            </div>

            <div className="flex flex-col gap-4">
                <AccordionBuilder
                    items={builderItems}
                    setItems={setBuilderItems}
                    onIconChange={handleIconUpload}
                    onIconDownload={handleIconDownload}
                    uploadProgress={uploadProgress}
                    locale="en"
                />
            </div>
        </div>
    );
}