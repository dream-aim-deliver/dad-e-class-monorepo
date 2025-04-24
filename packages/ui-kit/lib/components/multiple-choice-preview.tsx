
import react from 'react';

type options = {
    label: string;
    isSelected: boolean;
}
interface MultipleChoicePreviewProps {
    title: string;
    options: options[];
    onChange?: (option: string) => void;
    filled?: boolean;
}
import { CheckBox } from './checkbox';

export default function MultipleChoicePreview({
    title,
    options,
    onChange,
    filled = false,
}: MultipleChoicePreviewProps) {

    return (
        <div className="flex flex-col gap-4 text-text-primary">
            <h5 className="">{title}</h5>
            <div className='flex flex-col gap-4'>
                {options.map((option) => (
                    <CheckBox
                    name={option.label}
                    value={option.label}
                    key={option.label}
                   label={option.label}
                   disabled={filled}
                   checked={option.isSelected}
                   onChange={() => onChange(option.label)}
                   withText
                    />
                ))
                }
            </div>
        </div>
    )
}

