"use client";

import { FC } from "react";
import { Button } from "../button";
import { IconCoachingSession } from "../icons/icon-coaching-session";
import Tooltip from "../tooltip";
import { TextAreaInput } from "../text-areaInput";
import { fileMetadata, shared } from '@maany_shr/e-class-models';
import { getDictionary, isLocalAware } from "@maany_shr/e-class-translations";
import { Uploader } from "../drag-and-drop-uploader/uploader";
import { LinkEdit, LinkPreview } from "../links";
import { IconPlus } from "../icons/icon-plus";
import Banner from "../banner";

export interface FeedbackReplyPanelProps extends isLocalAware {
    comment: string;
    linkEditIndex: number | null;
    files: fileMetadata.TFileMetadata[];
    links: shared.TLinkWithId[];
    onChangeComment: (comment: string) => void;
    onFileDownload: (id: string) => void;
    onFileDelete: (fileId: string) => void;
    onLinkDelete: (index: number) => void;
    onLinkDiscard: (index: number) => void;
    onFilesChange: (file: fileMetadata.TFileUploadRequest, abortSignal?: AbortSignal) => Promise<fileMetadata.TFileMetadata>;
    onImageChange: (fileRequest: fileMetadata.TFileUploadRequest, abortSignal?: AbortSignal) => Promise<fileMetadata.TFileMetadata>;
    onDeleteIcon: (index: number) => void;
    onUploadComplete: (file: fileMetadata.TFileMetadata) => void;
    onCreateLink: (data: shared.TLinkWithId, index: number) => void;
    onClickEditLink: (index: number) => void;
    onClickAddLink: () => void;
    onClickSendMessage: () => void;
    isSending?: boolean;
    showSuccessBanner?: boolean;
    onCloseSuccessBanner?: () => void;
    showErrorBanner?: boolean;
    onCloseErrorBanner?: () => void;
};

export const FeedbackReplyPanel: FC<FeedbackReplyPanelProps> = ({
    comment,
    files,
    links,
    linkEditIndex,
    onChangeComment,
    onFileDownload,
    onFileDelete,
    onLinkDelete,
    onLinkDiscard,
    onFilesChange,
    onUploadComplete,
    onCreateLink,
    onClickEditLink,
    onClickAddLink,
    onImageChange,
    onDeleteIcon,
    onClickSendMessage,
    locale,
    isSending,
    showSuccessBanner,
    onCloseSuccessBanner,
    showErrorBanner,
    onCloseErrorBanner,
}) => {
    const dictionary = getDictionary(locale);

    const isFormInvalid = !comment && files.length === 0 && links.length === 0;

    return (
        <div className="flex flex-col gap-[27px] p-4 bg-base-neutral-800 border-1 border-base-neutral-700 rounded-medium">
            {showSuccessBanner && (
                <Banner
                    title={dictionary.components.assignment.replyPanel.messageSentSuccessText}
                    style="success"
                    closeable={true}
                    onClose={onCloseSuccessBanner}
                />
            )}
            {showErrorBanner && (
                <Banner
                    title={dictionary.components.assignment.replyPanel.messageSentErrorText}
                    style="error"
                    closeable={true}
                    onClose={onCloseErrorBanner}
                />
            )}
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between pb-2 border-b-1 border-divider">
                    <div className="flex gap-1 items-center justify-center">
                        <IconCoachingSession fill='text-primary' />
                        <p className="md:text-sm text-xs text-text-primary font-bold leading-[150%]">
                            {dictionary.components.assignment.replyPanel.replyText}
                        </p>
                    </div>
                </div>
                <Uploader
                    type="multiple"
                    variant="generic"
                    files={files}
                    maxFile={5}
                    onFilesChange={(file, abortSignal) => onFilesChange(file, abortSignal)}
                    onDelete={(id) => onFileDelete(id)}
                    onDownload={(id) => onFileDownload(id)}
                    onUploadComplete={(file) => onUploadComplete(file)}
                    locale={locale}
                    className="w-full"
                    maxSize={50} // 50 MB
                />
                <div className="flex flex-col items-center justify-center gap-[10px] w-full">
                    {links.map((link, index) =>
                        linkEditIndex === index ?
                            (
                                <div className="flex flex-col w-full" key={index}>
                                    <LinkEdit
                                        locale={locale}
                                        initialTitle={link.title as string}
                                        initialUrl={link.url as string}
                                        initialCustomIcon={link.customIcon}
                                        onSave={(title, url, customIcon) => onCreateLink({ title, url, customIcon, linkId: link.linkId as number }, index)}
                                        onDiscard={() => onLinkDiscard(index)}
                                        onImageChange={(image, abortSignal) => onImageChange(image, abortSignal)}
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
                            )
                    )}
                    <div className="flex items-center mt-4 w-full">
                        <div className="flex-grow border-t border-divider"></div>
                        <span
                            onClick={onClickAddLink}
                            className="text-button-primary-fill mx-4 capitalize flex gap-1 items-center text-para-sm font-bold cursor-pointer hover:text-action-hover"
                        >
                            <IconPlus />
                            <span>{dictionary.components.assignment.replyPanel.addLinkText}</span>
                        </span>
                        <div className="flex-grow border-t border-divider"></div>
                    </div>
                </div>
                <div className="flex flex-col gap-2 items-start w-full">
                    <div className="flex gap-1 justify-center items-center">
                        <p className="text-sm text-text-primary font-bold leading-[150%]">
                            {dictionary.components.assignment.replyPanel.yourCommentsText}:
                        </p>
                        <div className="flex items-center justify-center">
                            <Tooltip
                                text=''
                                description={dictionary.components.assignment.replyPanel.replyPlaceholderText}
                                tipPosition='right'
                            />
                        </div>
                    </div>
                    <div className="w-full">
                        <TextAreaInput
                            value={comment}
                            setValue={(comment) => onChangeComment(comment)}
                            className="w-full"
                            placeholder={dictionary.components.assignment.replyPanel.replyPlaceholderText}
                        />
                    </div>
                </div>
                <Button
                    size="medium"
                    variant="primary"
                    text={isSending ? dictionary.components.assignment.replyPanel.sendingMessageText : dictionary.components.assignment.replyPanel.sendMessageText}
                    onClick={onClickSendMessage}
                    disabled={isFormInvalid || isSending}
                />
            </div>
        </div>
    );
};
