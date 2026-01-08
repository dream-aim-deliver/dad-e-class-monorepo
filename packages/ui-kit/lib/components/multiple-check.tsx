'use client';

import { useEffect, useState } from 'react';
import { CheckBox } from './checkbox';
import { InputField } from './input-field';
import { IconButton } from './icon-button';
import { IconTrashAlt } from './icons/icon-trash-alt';
import { Button } from './button';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';

export type optionsType = {
    id?: string;
    name: string;
    isSelected: boolean;
}
interface MultipleChoicePreviewProps {
    title: string;
    options: optionsType[];
    onChange?: (option: string) => void;
    filled?: boolean;
    required?: boolean;
}


export default function MultipleChoicePreview({
    title,
    options,
    onChange,
    filled = false,
    required
}: MultipleChoicePreviewProps) {

    return (
        <div className="flex flex-col gap-4 text-text-primary">
            <h5 className="">{title}
                {required && <span className="text-feedback-error-primary ml-1 text-sm">*</span>}
            </h5>
            <div className='flex flex-col gap-4'>
                {options.map((option) => (
                    <CheckBox
                        name={option.name}
                        value={option.name}
                        key={option.name}
                        label={option.name}
                        disabled={filled}

                        checked={option.isSelected}
                        onChange={() => onChange?.(option.name)}
                        withText
                    />
                ))
                }
            </div>
        </div>
    )
}

interface MultipleChoiceEditProps extends isLocalAware {
    initialTitle?: string;
    initialOptions?: optionsType[];
    onChange?: (title: string, options: optionsType[]) => void;
};

export const MultipleChoiceEdit: React.FC<MultipleChoiceEditProps> = ({
    initialTitle = '',
    initialOptions = [],
    onChange,
    locale
}) => {
    const dictionary = getDictionary(locale);
    const [title, setTitle] = useState(initialTitle);
    const [options, setOptions] = useState(initialOptions);

    useEffect(() => {
        if (onChange) {
            onChange(title, options);
        }
    }, [title, options]);

    const handleAddChoice = () => {
        const newOption = {
            name: '',
            isSelected: false
        };
        setOptions([...options, newOption]);
    };

    const handleRemoveChoice = (index: number) => {
        const updatedChoices = options.filter((_, i) => i !== index);
        setOptions(updatedChoices);
    };

    const handleInputChange = (index: number, value: string) => {
        const updatedChoices = [...options];
        updatedChoices[index] = {
            name: value,
            isSelected: updatedChoices[index].isSelected
        };
        setOptions(updatedChoices);
    };

    return (
        <div className="flex flex-col gap-4 mt-4 w-full">
            <div className="w-full">
                <InputField
                    inputText={dictionary.components.lessons.multiChoiceTitle}
                    className="border-0"
                    value={title}
                    setValue={(value) => setTitle(value)}
                />
            </div>
            {options.map((choice, index) => (
                <div key={index} className="flex gap-[10px] items-center">
                    <div className="w-fit flex items-center">
                        <CheckBox
                            disabled={true}
                            name="multi-choice"
                            value={`choice-${index}`}
                        />
                    </div>
                    <div className="w-full">
                        <InputField
                            className="border-0 w-full"
                            inputText={dictionary.components.lessons.choiceInput}
                            value={choice.name}
                            setValue={(value) => handleInputChange(index, value)}
                        />
                    </div>
                    <IconButton
                        styles="text"
                        icon={<IconTrashAlt />}
                        size="medium"
                        onClick={() => handleRemoveChoice(index)}
                        title={dictionary.components.formRenderer.delete}
                    />
                </div>
            ))}
            <Button
                variant="secondary"
                className="w-full"
                onClick={handleAddChoice}
                text={dictionary.components.lessons.addChoice}
            />
        </div>
    );
};