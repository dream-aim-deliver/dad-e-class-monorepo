'use client';

import { FC, useState } from "react";
import RichTextEditor from "../rich-text-element/editor";
import { IconNotes } from "../icons/icon-notes";
import { getDictionary, isLocalAware } from "@maany_shr/e-class-translations";
import Banner from "../banner";
import { IconSave } from "../icons/icon-save";

/**
 * LessonNoteBuilderView Component
 * 
 * @component
 * @props {LessonNoteBuilderViewType} props - The component props.
 * Note: the `onChange` function should return a boolean indicating whether the notes were saved successfully.
 * @props {string} props.initialValue - The initial value of the lesson notes.
 * @props {(value: string) => void} props.onChange - Callback function triggered when the notes are updated.
 * @props {string} props.placeholder - Placeholder text for the rich text editor.
 * @props {string} props.locale - The locale used to fetch the appropriate dictionary for translations.
 *
 * @returns {JSX.Element} A styled card component that provides a rich text editor for creating or editing lesson notes, with options to save changes.
 * 
 * @example Standard usage
 * ```
 * <LessonNoteBuilderView
 *   initialValue="This is a sample note."
 *   onChange={(value) => {
 *     console.log('Notes updated:', value);
 *     return Math.random() < 0.5; // Simulate 50% save success
 *   }}
 *   placeholder="Write your lesson notes here..."
 *   locale="en"
 * />
 * ```
 */

export interface LessonNoteBuilderViewType extends isLocalAware {
    id: number;
    initialValue: string;
    onChange: (value: string) => boolean;
    children?: React.ReactNode;
    placeholder: string;
    onDeserializationError: (message: string, error: Error) => void;
};


export const LessonNoteBuilderView: FC<LessonNoteBuilderViewType> = ({
    initialValue,
    onChange,
    children,
    placeholder,
    locale,
    onDeserializationError
}) => {
    const dictionary = getDictionary(locale);
    const [value, setValue] = useState<string>(initialValue);
    const [notesSaved, setNotesSaved] = useState<boolean>(true);

    // function to handle the loss of focus from the editor
    const handleLoseFocus = (value: string) => {
        const savedSuccess = onChange(value);
        setNotesSaved(savedSuccess);
    };

    // function to handle the change in the editor
    const handleChange = (value: any) => {
        if (notesSaved)
            setNotesSaved(false);
        setValue(value);
    };

    return (
        <div className="flex flex-col gap-4 p-4 bg-card-fill border-1 border-stroke rounded-medium">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center justify-center gap-4">
                    <div className="p-2 bg-base-neutral-800 border-1 border-base-neutral-700 rounded-medium">
                        <IconNotes
                            classNames="text-text-primary"
                            size="6"
                        />
                    </div>
                    <p className="text-text-primary text-xl font-bold leading-[120%]">
                        {dictionary.components.lessonNotes.lessonNotesText}
                    </p>
                </div>
                <div
                    className="p-2 bg-base-neutral-800 border-1 border-base-neutral-700 rounded-medium cursor-pointer"
                    onClick={() => handleLoseFocus(value)}
                    title={dictionary.components.lessonNotes.saveNotesText}
                >
                    <IconSave
                        classNames="text-text-primary"
                        size="6"
                    />
                </div>
            </div>
            <RichTextEditor
                name='lessonNote'
                placeholder={placeholder}
                initialValue={value}
                onLoseFocus={handleLoseFocus}
                onChange={handleChange}
                locale={locale}
                onDeserializationError={onDeserializationError}
            />
            {children}
            {!notesSaved && !children && (
                <Banner
                    title={dictionary.components.lessonNotes.notesNotSavedText}
                    style='error'
                />
            )}
        </div>
    );
};

