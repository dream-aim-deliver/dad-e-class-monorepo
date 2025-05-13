import { FC, useEffect, useState } from "react";
import RichTextEditor from "../rich-text-element/editor";
import { IconNotes } from "../icons/icon-notes";
import { getDictionary, isLocalAware } from "@maany_shr/e-class-translations";
import Banner from "../banner";
import { IconSave } from "../icons/icon-save";
import { LessonNoteBuilderViewType } from "../course-builder-lesson-component/types";

/**
 * LessonNoteBuilderView Component
 * 
 * @component
 * @props {LessonNoteBuilderViewType} props - The component props.
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
 *   onChange={(value) => console.log('Notes updated:', value)}
 *   placeholder="Write your lesson notes here..."
 *   locale="en"
 * />
 * ```
 */

export const LessonNoteBuilderView: FC<LessonNoteBuilderViewType> = ({
    initialValue,
    onChange,
    children,
    placeholder,
    locale,
}) => { 
    const dictionary = getDictionary(locale);
    const [value, setValue] = useState<string>('');
    const [notesNotSaved, setNotesNotSaved] = useState<boolean>(false);

    // set the initial value of editor
    useEffect(() => {
        if(initialValue) {
            setValue(initialValue);
        }
    }, [initialValue]);

    // function to handle the loss of focus from the editor
    const handleLoseFocus = (value: string) => {
        onChange(value);
        setNotesNotSaved(false);
    };

    // function to handle the change in the editor
    const handleChange = (value: any) => {
        if(!notesNotSaved)
            setNotesNotSaved(true);
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
            />
            {children}
            {notesNotSaved && !children && (
                <Banner 
                    title={dictionary.components.lessonNotes.notesNotSavedText}
                    style='error'
                />
            )}
        </div>
    );
};

