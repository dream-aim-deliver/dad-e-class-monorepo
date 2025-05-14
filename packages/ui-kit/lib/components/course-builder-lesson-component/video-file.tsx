import { useState } from "react";
import {  CourseElementTemplate, CourseElementType, DesignerComponentProps, FormComponentProps } from "../course-builder/types";
import DesignerLayout from "./designer-layout";
import { getDictionary } from "@maany_shr/e-class-translations";
import { IconCloudDownload } from "../icons/icon-cloud-download";
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

export function DesignerComponent({ elementInstance, locale, onUpClick, onDownClick, onDeleteClick }: DesignerComponentProps) {
    if (elementInstance.type !== CourseElementType.VideoFile) return null;
    const dictionary = getDictionary(locale);
    const [file, setFile] = useState<UploadedFileType | null>(null);

    const handleFilesChange = async (files: UploadedFileType[]): Promise<UploadResponse> => {
        if (files.length > 0) {
            const currentFile = files[0];
            setFile(currentFile);

            return new Promise((resolve) => {
                setTimeout(() => {
                    const response: UploadResponse = {
                        videoId: `image-${Math.random().toString(36).substr(2, 9)}`,
                        thumbnailUrl: URL.createObjectURL(currentFile.file),
                        fileSize: currentFile.file.size,
                    };
                    setFile({
                        ...currentFile,
                        isUploading: false,
                        responseData: response
                    });
                    resolve(response);
                }, 5000);
            });
        }
        setFile(null);
        return Promise.resolve({
            imageId: '',
            imageThumbnailUrl: '',
            fileSize: 0
        });
    };

    const handleDelete = () => {
        setFile(null);
    };

    const handleDownload = () => {
        //handle download logic here
    };

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
                onFilesChange={handleFilesChange}
                onDelete={handleDelete}
                onDownload={handleDownload}
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