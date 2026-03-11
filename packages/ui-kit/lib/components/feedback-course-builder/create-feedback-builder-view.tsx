import { FC } from 'react';
import { TextInput } from '../text-input';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { TextAreaInput } from '../text-areaInput';
import Tooltip from '../tooltip';
import { IconCloudUpload } from '../icons/icon-cloud-upload';
import { Uploader } from '../drag-and-drop-uploader/uploader';
import {
    FeedbackElement,
} from '../course-builder-lesson-component/types';
import { LinkEdit, LinkPreview } from '../links';
import { IconPlus } from '../icons/icon-plus';
import { fileMetadata, shared } from '@maany_shr/e-class-models';

export interface CreateFeedbackProps extends isLocalAware {
    elementInstance: FeedbackElement;
    onChange: (newFeedback: FeedbackElement) => void;
    onFilesChange: (
        file: fileMetadata.TFileUploadRequest,
        abortSignal?: AbortSignal,
    ) => Promise<fileMetadata.TFileMetadata>;
    onImageChange: (
        fileRequest: fileMetadata.TFileUploadRequest,
        abortSignal?: AbortSignal,
    ) => Promise<fileMetadata.TFileMetadata>;
    onDeleteIcon: (index: number) => void;
    onUploadComplete: (file: fileMetadata.TFileMetadata) => void;
    onFileDelete: (id: string) => void;
    onFileDownload: (id: string) => void;
    onLinkDelete: (index: number) => void;
    onLinkEdit: (data: shared.TLink, index: number) => void;
    onLinkDiscard: () => void;
    linkEditIndex: number | null;
    onClickEditLink: (index: number) => void;
    onClickAddLink: () => void;
    uploadProgress?: number;
}

export const CreateFeedbackBuilderView: FC<CreateFeedbackProps> = ({
    elementInstance,
    onChange,
    onFilesChange,
    onUploadComplete,
    onFileDelete,
    onFileDownload,
    onLinkDelete,
    onLinkEdit,
    onClickAddLink,
    onLinkDiscard,
    onImageChange,
    onDeleteIcon,
    locale,
    linkEditIndex,
    onClickEditLink,
    uploadProgress,
}) => {
    const dictionary = getDictionary(locale);

    const handleTitleChange = (newTitle: string) =>
        onChange({
            ...elementInstance,
            title: newTitle,
        });

    const handleDescriptionChange = (newDescription: string) =>
        onChange({
            ...elementInstance,
            description: newDescription,
        });

    return (
        <div className="flex flex-col gap-4 items-start w-full">
            <div className="w-full">
                <TextInput
                    label={
                        dictionary.components.feedback.feedbackBuilder
                            .feedbackTitleText
                    }
                    inputField={{
                        id: 'feedback-title',
                        className: 'w-full',
                        value: elementInstance.title,
                        setValue: handleTitleChange,
                        inputText:
                            dictionary.components.feedback.feedbackBuilder
                                .titlePlaceholderText,
                    }}
                />
            </div>

            <div className="flex flex-col items-start gap-2 w-full">
                <div className="flex gap-1 items-center">
                    <p className="text-sm text-text-secondary leading-[100%]">
                        {
                            dictionary.components.feedback.feedbackBuilder
                                .feedbackDescriptionText
                        }
                    </p>
                    <Tooltip
                        text=""
                        description={
                            dictionary.components.feedback.feedbackBuilder
                                .descriptionPlaceholderText
                        }
                    />
                </div>
                <div className="w-full">
                    <TextAreaInput
                        value={elementInstance.description as string}
                        setValue={handleDescriptionChange}
                        placeholder={
                            dictionary.components.feedback.feedbackBuilder
                                .descriptionPlaceholderText
                        }
                    />
                </div>
            </div>

            <div className="flex flex-col gap-4 p-4 items-start border-1 border-base-neutral-700 rounded-medium w-full">
                <div className="flex gap-1 items-start pb-2 border-b-1 border-divider w-full">
                    <IconCloudUpload classNames="text-text-primary" />
                    <p className="text-sm text-text-primary font-bold leading-[150%]">
                        {
                            dictionary.components.feedback.feedbackBuilder
                                .addResourcesText
                        }
                    </p>
                </div>

                <Uploader
                    type="multiple"
                    variant="generic"
                    files={elementInstance.files ?? []}
                    maxFile={5}
                    onFilesChange={onFilesChange}
                    onDelete={onFileDelete}
                    onDownload={onFileDownload}
                    onUploadComplete={onUploadComplete}
                    locale={locale}
                    className="w-full"
                    maxSize={50} // 50 MB
                    uploadProgress={uploadProgress}
                />

                <div className="flex flex-col items-center justify-center gap-[10px] w-full">
                    {elementInstance.links?.map((link, index) =>
                        linkEditIndex === index ? (
                            <div className="flex flex-col w-full" key={index}>
                                <LinkEdit
                                    locale={locale}
                                    initialTitle={link.title}
                                    initialUrl={link.url}
                                    initialCustomIcon={link.customIcon}
                                    onSave={(title, url, customIcon) =>
                                        onLinkEdit(
                                            { title, url, customIcon },
                                            index,
                                        )
                                    }
                                    onDiscard={() => onLinkDiscard()}
                                    onImageChange={(image, abortSignal) =>
                                        onImageChange(image, abortSignal)
                                    }
                                    onDeleteIcon={() => onDeleteIcon(index)}
                                />
                            </div>
                        ) : (
                            <div className="flex flex-col w-full" key={index}>
                                <LinkPreview
                                    preview
                                    title={link.title as string}
                                    url={link.url as string}
                                    customIcon={link.customIcon}
                                    onEdit={() => onClickEditLink(index)}
                                    onDelete={() => onLinkDelete(index)}
                                />
                            </div>
                        ),
                    )}
                    <div className="flex items-center mt-4 w-full">
                        <div className="flex-grow border-t border-divider"></div>
                        <span
                            onClick={onClickAddLink}
                            className="text-button-primary-fill mx-4 capitalize flex gap-1 items-center text-para-sm font-bold cursor-pointer hover:text-action-hover"
                        >
                            <IconPlus />
                            <span>
                                {
                                    dictionary.components.assignment.replyPanel
                                        .addLinkText
                                }
                            </span>
                        </span>
                        <div className="flex-grow border-t border-divider"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};
