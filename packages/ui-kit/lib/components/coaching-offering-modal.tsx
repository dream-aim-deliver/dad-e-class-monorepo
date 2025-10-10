'use client';

import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { useState } from 'react';
import { Button } from './button';
import { InputField } from './input-field';
import { TextAreaInput } from './text-areaInput';

interface CoachingOfferingData {
    title: string;
    description: string;
    duration: string;
    price: string;
}

interface CoachingOfferingModalProps extends isLocalAware {
    mode: 'create' | 'edit';
    initialValue?: CoachingOfferingData;
    onSave: (data: CoachingOfferingData) => void;
    onDelete?: () => void;
    onClose: () => void;
}

export default function CoachingOfferingModal(
    props: CoachingOfferingModalProps,
) {
    const dictionary = getDictionary(props.locale).components
        .coachingOfferingModal;

    const [title, setTitle] = useState<string>(props.initialValue?.title || '');
    const [description, setDescription] = useState<string>(
        props.initialValue?.description || '',
    );
    const [duration, setDuration] = useState<string>(
        props.initialValue?.duration || '',
    );
    const [price, setPrice] = useState<string>(props.initialValue?.price || '');

    const isEditMode = props.mode === 'edit';
    const showDeleteButton = isEditMode && props.onDelete;

    const isFormValid = () => {
        return (
            title.trim() &&
            description.trim() &&
            duration.trim() &&
            price.trim()
        );
    };

    const handleSave = () => {
        if (isFormValid()) {
            props.onSave({
                title,
                description,
                duration,
                price,
            });
        }
    };

    return (
        <div className="flex flex-col gap-2">
            {/* Header */}
            <div className="flex flex-col items-start gap-3 w-full">
                <h3 className="text-text-primary font-bold">
                    {isEditMode ? dictionary.editTitle : dictionary.createTitle}
                </h3>
            </div>

            {/* Input Fields */}
            {isEditMode ? (
                <div className="flex flex-col gap-4 w-full">
                    {/* Summary Card */}
                    <div className="bg-neutral-800 rounded-lg p-3 flex flex-row items-center justify-center gap-8">
                        <div className="flex justify-between items-start flex flex-col">
                            <h6>
                                {title}
                            </h6>
                            <p className="text-sm text-text-secondary">
                                {duration} {dictionary.minutes}
                            </p>
                        </div>
                        <p className="text-text-primary font-important text-sm">
                            {props.initialValue?.price}
                        </p>
                    </div>

                    {/* New Price */}
                    <TextAreaInput
                        label={dictionary.newPriceLabel}
                        value={price}
                        setValue={setPrice}
                        placeholder={dictionary.pricePlaceholder}
                    />

                    {/* Description */}
                    <TextAreaInput
                        label={dictionary.descriptionLabel}
                        value={description}
                        setValue={setDescription}
                        placeholder={dictionary.descriptionPlaceholder}
                    />
                </div>
            ) : (
                <div className="flex flex-col gap-2 w-full">
                    {/* Title */}
                    <TextAreaInput
                        label={dictionary.titleLabel}
                        value={title}
                        setValue={setTitle}
                        placeholder={dictionary.titlePlaceholder}
                    />

                    {/* Description */}
                    <TextAreaInput
                        label={dictionary.descriptionLabel}
                        value={description}
                        setValue={setDescription}
                        placeholder={dictionary.descriptionPlaceholder}
                    />

                    {/* Duration */}
                    <TextAreaInput
                        label={dictionary.durationLabel}
                        value={duration}
                        setValue={setDuration}
                        placeholder={dictionary.durationPlaceholder}
                    />

                    {/* Price */}
                    <TextAreaInput
                        label={dictionary.priceLabel}
                        value={price}
                        setValue={setPrice}
                        placeholder={dictionary.pricePlaceholder}
                    />
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 w-full">
                <Button
                    className="w-full"
                    variant="secondary"
                    size="medium"
                    text={dictionary.goBack}
                    onClick={props.onClose}
                />

                <Button
                    className="w-full"
                    variant="primary"
                    size="medium"
                    text={isEditMode ? dictionary.confirm : dictionary.add}
                    onClick={handleSave}
                    disabled={!isFormValid()}
                />
            </div>
        </div>
    );
}
