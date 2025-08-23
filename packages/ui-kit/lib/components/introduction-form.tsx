import { fileMetadata } from '@maany_shr/e-class-models';
import { Uploader } from './drag-and-drop-uploader/uploader';
import RichTextEditor from './rich-text-element/editor';
import { SectionHeading } from './text';
import { deserialize, serialize } from './rich-text-element/serializer';
import { Descendant } from 'slate';
import { useState } from 'react';

interface IntroductionProps {
    courseVersion: number | null;
    introductionText?: Descendant[];
    setIntroductionText: (text: Descendant[]) => void;
    onFileChange: (
        file: fileMetadata.TFileUploadRequest,
        abortSignal?: AbortSignal,
    ) => Promise<fileMetadata.TFileMetadata>;
    onUploadComplete: (file: fileMetadata.TFileMetadataImage) => void;
    onDelete: (id: string) => void;
    onDownload: (id: string) => void;
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
    return (
        <div className="flex flex-col gap-4">
            <SectionHeading text="Introduction" />
            <div className="flex flex-col gap-2">
                <label htmlFor="introduction" className="text-text-secondary">
                    Course introduction (600 characters max)
                </label>
                <RichTextEditor
                    key={`introduction-${props.courseVersion}`}
                    name="introduction"
                    placeholder="Write course introduction"
                    initialValue={props.introductionText}
                    locale="en"
                    onLoseFocus={() => {}}
                    onDeserializationError={() => {}}
                    onChange={(value) => props.setIntroductionText(value)}
                />
            </div>
            <div className="flex flex-col gap-2">
                <label className="text-text-secondary">
                    Introduction video
                </label>
                <Uploader
                    onDownload={() => {}}
                    onDelete={() => {}}
                    variant="video"
                    onFilesChange={() => {
                        throw Error('File upload failed');
                    }}
                    onUploadComplete={() => {}}
                    locale="en"
                    type="single"
                    maxSize={15}
                    file={null}
                />
            </div>
        </div>
    );
}
