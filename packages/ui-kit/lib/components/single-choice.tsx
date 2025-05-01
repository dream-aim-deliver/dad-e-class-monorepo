import React from "react";
import { RadioButton } from './radio-button';
import { Button } from "./button";
import { IconButton } from "./icon-button";
import { InputField } from "./input-field";
import { IconTrashAlt } from "./icons/icon-trash-alt";

export type optionsType = {
    name: string;
    isSelected?: boolean;
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


type SingleChoiceEditProps = {
    title: string;
    options: { name: string }[];
    setOptions: React.Dispatch<React.SetStateAction<{ name: string }[]>>;
    setTitle: React.Dispatch<React.SetStateAction<string>>;
};

export const SingleChoiceEdit: React.FC<SingleChoiceEditProps> = ({
    title,
    options,
    setOptions,
    setTitle
}) => {
    const handleAddChoice = () => {
        const newOption = {
            name: `Option ${options.length + 1}`
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
            name: value
        };
        setOptions(updatedChoices);
    };

    return (
        <div className="flex flex-col gap-4 mt-4 w-full">
            <div className="w-full">
                <InputField
                    inputText="single-choice-title"
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
                    />
                    <div className="w-full">
                        <InputField
                            className="border-0"
                            inputText="choice-name"
                            value={choice.name}
                            setValue={(value) => handleInputChange(index, value)}
                        />
                    </div>
                    <IconButton
                        styles="text"
                        icon={<IconTrashAlt />}
                        size="medium"
                        onClick={() => handleRemoveChoice(index)}
                    />
                </div>
            ))}
            <Button
                variant="secondary"
                className="w-full"
                onClick={handleAddChoice}
                text="Add choice"
            />
        </div>
    );
};
