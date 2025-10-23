import { useState, useEffect } from 'react';
import { TextAreaInput } from '../../text-areaInput';
import { CheckBox } from '../../checkbox';
import { AccordionBuilder, AccordionBuilderItem } from '../../accordion-builder';
import { fileMetadata } from '@maany_shr/e-class-models';
import { z } from 'zod';
import { HomePageSchema } from 'packages/models/src/view-models';

type AccordionType = z.infer<typeof HomePageSchema>['accordion'];

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

    const handleFieldChange = (field: keyof Omit<AccordionType, 'items'>, value: string | boolean) => {
        const newAccordionData = {
            ...accordionData,
            [field]: value
        };
        handleAccordionChange(newAccordionData);
    };

    const handleItemsChange = (items: AccordionBuilderItem[]) => {
        const newItems = items.map((item, index) => ({
            title: item.title,
            content: item.content,
            position: index + 1,
            iconImageUrl: item.icon?.url || null,
        }));
        handleAccordionChange({
            ...accordionData,
            items: newItems
        });
    };

    const handleIconUpload = async (
        metadata: fileMetadata.TFileUploadRequest,
        signal: AbortSignal,
    ): Promise<fileMetadata.TFileMetadata> => {
        return onFileUpload(metadata, "upload_home_page_accordion_item", signal);
    };

    const handleIconDownload = (index: number) => {
        const item = accordionData.items[index];
        if (item?.iconImageUrl) {
            onFileDownload(item.iconImageUrl);
        }
    };

    // Convert schema items to AccordionBuilderItem format
    const builderItems: AccordionBuilderItem[] = accordionData.items.map(item => ({
        title: item.title,
        content: item.content,
        icon: item.iconImageUrl ? { url: item.iconImageUrl } : { url: null },
    }));

    return (
        <div className="w-full p-6 border border-card-fill rounded-medium bg-card-fill flex flex-col gap-6">
            <h2>How It Works Section</h2>

            <div className="flex flex-col gap-4">
                <TextAreaInput
                    label="Title"
                    value={accordionData.title}
                    setValue={(value) => handleFieldChange('title', value)}
                    placeholder="Enter the how it works section title"
                />

                <CheckBox
                    name="showNumbers"
                    value="showNumbers"
                    label="Show Numbers"
                    className="text-base-white"
                    checked={accordionData.showNumbers}
                    withText={true}
                    onChange={() => handleFieldChange('showNumbers', !accordionData.showNumbers)}
                />
            </div>

            <div className="flex flex-col gap-4">
                <AccordionBuilder
                    items={builderItems}
                    setItems={handleItemsChange}
                    onIconChange={handleIconUpload}
                    onIconDownload={handleIconDownload}
                    uploadProgress={uploadProgress}
                    locale="en"
                />
            </div>
        </div>
    );
}