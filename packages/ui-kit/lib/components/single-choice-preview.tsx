import React from 'react';
export type optionsType = {
    name: string;
    isSelected?: boolean;
}
interface SingleChoicePreviewProps {
    title: string;
    options: optionsType[];
    onChange?: (option: string) => void;
    filled?: boolean;
    required:boolean
}
import { RadioButton } from './radio-button';

export default function SingleChoicePreview({
    title,
    options,
    onChange,
    filled = false,
    required
}: SingleChoicePreviewProps) {
    return (
        <div className="flex flex-col gap-4 text-text-primary">
            <h5 className="">{title}
                {required && <span className="text-feedback-error-primary ml-1 text-sm">*</span>}
            </h5>
            <div className='flex flex-col gap-4'>
                {options?.map((option) => (
                    <div key={option.name} className="flex items-center">
                        <RadioButton
                            value=''
                            name={option.name}
                            label={option.name}
                            withText={true}
                            disabled={filled}
                            checked={option.isSelected}
                            onChange={() => onChange?.(option.name)}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

