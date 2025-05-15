import { useState } from "react";
import {  CourseElementTemplate, CourseElementType, DesignerComponentProps, FormComponentProps } from "../course-builder/types";
import DesignerLayout from "./designer-layout";
import { getDictionary } from "@maany_shr/e-class-translations";
import { UploadedFileType, Uploader, UploadResponse } from "../drag-and-drop/uploader";
import {  VideoFilePreview } from "./types";
import { VideoPlayer } from "../video-player";
import { IconVideo } from "../icons/icon-video";

const videoFileElement: CourseElementTemplate = {
    type: CourseElementType.VideoFile,
    designerBtnElement: {
        icon: IconVideo,
        label: "Video"
    },
    designerComponent: DesignerComponent,
    formComponent: FormComponent
};
interface videoFileEditProps extends DesignerComponentProps  {
  onFilesChange: (files: UploadedFileType[]) => Promise<UploadResponse>;
  onFileDelete: () => void;
  onFileDownload: () => void;
  file: UploadedFileType | null;
}
export function DesignerComponent({ elementInstance, locale, onUpClick, onDownClick, onDeleteClick,file,onFilesChange, onFileDelete,onFileDownload}: videoFileEditProps) {
    if (elementInstance.type !== CourseElementType.VideoFile) return null;
    const dictionary = getDictionary(locale);
    return (
        <DesignerLayout
            type={elementInstance.type}
            title={dictionary.components.courseBuilder.videoFileText}
            icon={<IconVideo classNames="w-6 h-6" />}
            onUpClick={() => onUpClick(elementInstance.id)}
            onDownClick={() => onDownClick(elementInstance.id)}
            onDeleteClick={() => onDeleteClick(elementInstance.id)}
            locale={locale}
            courseBuilder={true}
        >
            <Uploader
                type="single"
                variant="video"
                file={file}
                onFilesChange={onFilesChange}
                onDelete={onFileDelete}
                onDownload={onFileDownload}
                locale={locale}
            />
        </DesignerLayout>
    );
}

/**
 * Form Component for Download Files
 * Renders the rich text content in the form view
 */
export function FormComponent({ elementInstance, locale }: FormComponentProps) {
    if (elementInstance.type !== CourseElementType.VideoFile) return null;
    const [error, setError] = useState<string | null>(null);

   return (
    <section className="w-ful">
        <VideoPlayer
        videoId={(elementInstance as VideoFilePreview).VideoId}
        locale={locale}
        onErrorCallback={(error)=>{
           setError(error);
        }}
        />
    </section>
   )
}

export default videoFileElement;