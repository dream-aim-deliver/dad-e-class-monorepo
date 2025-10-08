'use client';

import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { useState } from 'react';
import { Button } from '../button';
import { InputField } from '../input-field';

interface CreateEditCategoryTopicModalProps extends isLocalAware {
    mode: 'create' | 'edit';
    type: 'category' | 'topic';
    initialValue?: string;
    onSave: (name: string) => void;
    onDelete?: () => void;
    onClose: () => void;
}

export default function CreateEditCategoryTopicModal(
    props: CreateEditCategoryTopicModalProps,
) {
    const dictionary = getDictionary(props.locale).components
        .editCategoryTopicModal;

    const [value, setValue] = useState<string>(props.initialValue || '');

    const isEditMode = props.mode === 'edit';
    const showDeleteButton = isEditMode && props.onDelete;

    // Get the localized title based on mode and type
    const getTitle = () => {
        if (isEditMode) {
            return props.type === 'category'
                ? dictionary.editCategoryTitle
                : dictionary.editTopicTitle;
        }
        return props.type === 'category'
            ? dictionary.createCategoryTitle
            : dictionary.createTopicTitle;
    };

    return (
        <div className="flex flex-col gap-2">
            {/* Header */}
            <div className="flex flex-col items-start gap-3 w-full">
                <h3 className="text-text-primary font-bold">{getTitle()}</h3>
            </div>

            {/* Input Field */}
            <div className="flex flex-col gap-1 w-full">
                <p className="text-sm text-text-secondary">
                    {props.type === 'category'
                        ? dictionary.categoryName
                        : dictionary.topicName}
                </p>
                <InputField
                    value={value}
                    setValue={setValue}
                    inputText={
                        props.type === 'category'
                            ? dictionary.categoryPlaceholder
                            : dictionary.topicPlaceholder
                    }
                />
            </div>

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
                    text={isEditMode ? dictionary.save : dictionary.create}
                    onClick={() => props.onSave(value)}
                    disabled={!value.trim()}
                />
            </div>
        </div>
    );
}
