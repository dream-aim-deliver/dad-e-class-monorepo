import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { FC } from 'react';
import {
    FeedbackElement,
} from '../course-builder-lesson-component/types';
import { IconChat } from '../icons/icon-chat';
import { FilePreview } from '../drag-and-drop-uploader/file-preview';
import { LinkPreview } from '../links';
import { fileMetadata } from '@maany_shr/e-class-models';

interface FeedbackStudentView extends isLocalAware {
    elementInstance: FeedbackElement;
    onFileDownload: (fileMetadata: fileMetadata.TFileMetadata) => void;
    viewButton?: React.ReactNode;
}

export const FeedbackBuilderView: FC<FeedbackStudentView> = ({
    elementInstance,
    onFileDownload,
    viewButton,
    locale,
}) => {
    const dictionary = getDictionary(locale);

    return (
        <div className="flex flex-col gap-4 items-start bg-base-neutral-800 border-1 border-divider rounded-medium p-4 w-full">
            <div className="flex gap-1 items-center justify-center">
                <IconChat classNames="text-text-primary" />
                <p className="text-sm text-text-primary font-bold leading-[150%]">
                    {dictionary.components.lessons.feedback}
                </p>
            </div>
            <div className="w-full h-[1px] bg-divider" />
            <div className="flex flex-col gap-4 items-start w-full">
                <h4 className="text-xl text-text-primary font-bold leading-[120%]">
                    {elementInstance.title}
                </h4>
                <p className="text-md text-text-primary leading-[150%]">
                    {elementInstance.description}
                </p>
                <div className="flex flex-col gap-2 items-start w-full">
                    {elementInstance.files?.map((file, index) => (
                        <FilePreview
                            key={`file-preview-${index}`}
                            uploadResponse={file}
                            locale={locale}
                            readOnly={true}
                            deletion={{ isAllowed: false }}
                            onDownload={() => file.id && onFileDownload(file)}
                        />
                    ))}
                    {elementInstance.links?.map((link, index) => (
                        <div className="flex flex-col w-full" key={`link-preview-${index}`}>
                            <LinkPreview
                                preview={false}
                                title={link.title as string}
                                url={link.url as string}
                            />
                        </div>
                    ))}
                </div>
            </div>
            {viewButton}
        </div>
    );
};
