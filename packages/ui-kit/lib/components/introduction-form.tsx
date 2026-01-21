'use client';

import { fileMetadata } from '@maany_shr/e-class-models';
import { Uploader } from './drag-and-drop-uploader/uploader';
import RichTextEditor from './rich-text-element/editor';
import { SectionHeading } from './text';
import { deserialize, serialize } from './rich-text-element/serializer';
import { Descendant } from 'slate';
import { useEffect, useState } from 'react';
import DefaultError from './default-error';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';

interface IntroductionProps extends isLocalAware {
    courseVersion: number | null;
    introductionText?: Descendant[];
    setIntroductionText: (text: Descendant[]) => void;
    videoFile: fileMetadata.TFileMetadataVideo | null;
    onFileChange: (
        file: fileMetadata.TFileUploadRequest,
        abortSignal?: AbortSignal,
    ) => Promise<fileMetadata.TFileMetadata>;
    onUploadComplete: (file: fileMetadata.TFileMetadata) => void;
    onDelete: (id: string) => void;
    onDownload: (id: string) => void;
    uploadError: string | undefined;
    uploadProgress?: number;
}

export interface CourseIntroductionForm {
    introductionText?: Descendant[];
    setIntroductionText: (text: Descendant[]) => void;

    serializeIntroductionText: () => string;
    parseIntroductionText: (text: string) => void;
}

export const useCourseIntroductionForm = (): CourseIntroductionForm => {
    const [introductionText, setIntroductionText] = useState<Descendant[]>([]);

    const parseIntroductionText = (text: string) => {
        setIntroductionText(
            deserialize({ serializedData: text, onError: console.error }),
        );
    };

    const serializeIntroductionText = () => {
        return serialize(introductionText);
    };

    return {
        introductionText,
        setIntroductionText,
        serializeIntroductionText,
        parseIntroductionText,
    };
};

export function IntroductionForm(props: IntroductionProps) {
    const [editorKey, setEditorKey] = useState(0);

    const dictionary = getDictionary(props.locale);

    useEffect(() => {
        setEditorKey((prevKey) => prevKey + 1);
    }, [props.courseVersion]);

    return (
        <div className="flex flex-col gap-4">
            <SectionHeading text={dictionary.components.introductionForm.introductionText} />
            <div className="flex flex-col gap-2">
                <label htmlFor="introduction" className="text-text-secondary text-sm lg:text-md">
                    {dictionary.components.introductionForm.courseIntroductionText}
                </label>
                <RichTextEditor
                    key={`introduction-${editorKey}`}
                    name="introduction"
                    placeholder={dictionary.components.introductionForm.courseIntroductionPlaceholderText}
                    initialValue={props.introductionText}
                    locale={props.locale}
                    onLoseFocus={() => {
                        // The text is already saved on change
                    }}
                    onDeserializationError={console.error}
                    onChange={(value) => props.setIntroductionText(value)}
                />
            </div>
            <div className="flex flex-col gap-2 bg-card-fill border-1 border-card-stroke rounded-md p-4">
                <h6 >
                    {dictionary.components.introductionForm.introductionVideoText}
                </h6>
                <Uploader
                    onDownload={props.onDownload}
                    onDelete={props.onDelete}
                    variant="video"
                    onFilesChange={props.onFileChange}
                    onUploadComplete={props.onUploadComplete}
                    locale={props.locale}
                    type="single"
                    maxSize={2000000}
                    file={props.videoFile}
                    isDeletionAllowed
                    uploadProgress={props.uploadProgress}
                />
                <p className="text-xs text-text-secondary mt-2">
                    {dictionary.components.uploadingSection.uploadVideo.processingHelperText}
                </p>
                {props.uploadError && (
                    <DefaultError
                        type="simple"
                        locale={props.locale}
                        title="Upload failed"
                        description={props.uploadError}
                    />
                )}
            </div>
        </div>
    );
}