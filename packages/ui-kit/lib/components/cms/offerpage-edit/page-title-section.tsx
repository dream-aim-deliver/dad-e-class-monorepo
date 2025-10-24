'use client';

import { TextAreaInput } from '../../text-areaInput';
import { TextIcon } from 'lucide-react';
import { TextInput } from '../../text-input';


type PageTitleType = {
    title: string;
    description: string;
};


interface PageTitleSectionProps {
    value: PageTitleType;
    onChange: (value: PageTitleType) => void;
}

export default function PageTitleSection({
    value,
    onChange,
}: PageTitleSectionProps) {
    const handleFieldChange = (field: keyof PageTitleType, fieldValue: string) => {
        const newPageData = {
            ...value,
            [field]: fieldValue
        };
        onChange?.(newPageData);
    };

    return (
        <div className="w-full p-6 border border-card-fill rounded-medium bg-card-fill flex flex-col gap-6">
            <h3>
                Page Title
            </h3>
            <div className="flex flex-col gap-4">
                <TextInput
                    label="Title"
                    inputField={{
                        value: value.title,
                        setValue: (v) => handleFieldChange('title', v),
                        inputText: "Enter the page title"
                    }}
                />
                <TextAreaInput
                    label="Description"
                    value={value.description}
                    setValue={(v) => handleFieldChange('description', v)}
                    placeholder="Enter the page description"
                />
            </div>
        </div>
    )
}
