'use client';

import React, { useEffect, useState } from "react";
import { RadioButton } from './radio-button';
import { Button } from "./button";
import { IconButton } from "./icon-button";
import { InputField } from "./input-field";
import { IconTrashAlt } from "./icons/icon-trash-alt";
import { getDictionary, isLocalAware } from "@maany_shr/e-class-translations";

export type optionsType = {
    id?: string;
    name: string;
    isSelected: boolean;
}
interface SingleChoicePreviewProps {
    title: string;
    options: optionsType[];
    onChange?: (option: string) => void;
    filled?: boolean;
    required: boolean
}


export default function SingleChoicePreview({
    title,
    options,
    onChange,
    filled = false,
    required
}: SingleChoicePreviewProps) {
    return (
        <div className="flex flex-col gap-4 text-text-primary">
            <h3 className="">{title}
                {required && <span className="text-feedback-error-primary ml-1 text-sm">*</span>}
            </h3>
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




interface SingleChoiceEditProps extends isLocalAware {
    initialTitle?: string;
    initialOptions?: optionsType[];
    onChange?: (title: string,options: optionsType[] ) => void;
};

export const SingleChoiceEdit: React.FC<SingleChoiceEditProps> = ({
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
            onChange(title, options );
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
            isSelected: false
        };
        setOptions(updatedChoices);
    };
    
    return (
        <div className="flex flex-col gap-4 mt-4 w-full">
            <div className="w-full">
                <InputField
                    inputText={dictionary.components.lessons.singleChoiceTitle}
                    className="border-0"
                    value={title}
                    setValue={(value) => setTitle(value)}
                />
            </div>
            {options.map((choice, index) => (
                <div key={index} className="flex gap-[10px] items-center">
                    
                    <RadioButton
                        name="single-choice"
                        value={`choice-${index}`}
                        labelClass="w-fit justify-center"
                        disabled={true}
                    />
                    
                    <div className="w-full">
                        <InputField
                            className="border-0"
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
