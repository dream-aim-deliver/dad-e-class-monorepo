import React from 'react';
type options = {
    label: string;
    isSelected: boolean;
}
interface SingleChoicePreviewProps {
    title: string;
    options: options[];
    onChange?: (option: string) => void;
    filled?: boolean;
}
import { RadioButton } from './radio-button';

export default function SingleChoicePreview({
    title,
    options,
    onChange,
    filled = false,
}: SingleChoicePreviewProps) {
    return (
        <div className="flex flex-col gap-4 text-text-primary">
            <h5 className="">{title}</h5>
            <div className='flex flex-col gap-4'>
                {options?.map((option) => (
                    <RadioButton
                        value=''
                        key={option.label}
                        name={option.label}
                        withText={true}
                        disabled={filled}
                        checked={option.isSelected}
                        onChange={() => onChange(option.label)}
                    />))
                }
            </div>
        </div>
    )
}

