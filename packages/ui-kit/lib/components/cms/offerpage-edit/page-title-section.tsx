'use client';

import { useState } from 'react';
import { TextAreaInput } from '../../text-areaInput';
import { TextIcon } from 'lucide-react';
import { TextInput } from '../../text-input';


type PageTitleType = {
    title: string;
    description: string;
};


interface PageTitleSectionProps {
    initialValue?: PageTitleType;
    onChange: (value: PageTitleType) => void;
}

export default function PageTitleSection({
    initialValue,
    onChange,
}: PageTitleSectionProps) {
    const [pageData, setPageData] = useState<PageTitleType>({
        title: '',
        description: '',
        ...initialValue
    });

    const handleFieldChange = (field: keyof PageTitleType, value: string) => {
        const newPageData = {
            ...pageData,
            [field]: value
        };
        setPageData(newPageData);
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
                        value: pageData.title,
                        setValue: (value) => handleFieldChange('title', value),
                        inputText: "Enter the page title"
                    }}
                />
                <TextAreaInput
                    label="Description"
                    value={pageData.description}
                    setValue={(value) => handleFieldChange('description', value)}
                    placeholder="Enter the page description"
                />
            </div>
        </div>
    )
}
