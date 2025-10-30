'use client';

import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { TextAreaInput } from '../../text-areaInput';
import { TextInput } from '../../text-input';


type PageTitleType = {
    title: string;
    description: string;
};


interface PageTitleSectionProps extends isLocalAware {
    value: PageTitleType;
    onChange: (value: PageTitleType) => void;
}

export default function PageTitleSection({
    value,
    onChange,
    locale
}: PageTitleSectionProps) {
    const dictionary = getDictionary(locale);
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
                {dictionary.components.cmsSections.pageTitleSection.heading}
            </h3>
            <div className="flex flex-col gap-4">
                <TextInput
                    label={dictionary.components.cmsSections.pageTitleSection.titleLabel}
                    inputField={{
                        value: value.title,
                        setValue: (v) => handleFieldChange('title', v),
                        inputText: dictionary.components.cmsSections.pageTitleSection.titlePlaceholder
                    }}
                />
                <TextAreaInput
                    label={dictionary.components.cmsSections.pageTitleSection.descriptionLabel}
                    value={value.description}
                    setValue={(v) => handleFieldChange('description', v)}
                    placeholder={dictionary.components.cmsSections.pageTitleSection.descriptionPlaceholder}
                />
            </div>
        </div>
    )
}
