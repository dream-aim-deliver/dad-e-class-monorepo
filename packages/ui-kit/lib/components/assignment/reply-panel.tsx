import { FC, useEffect, useState } from "react";
import { Button } from "../button";
import { IconCoachingSession } from "../icons/icon-coaching-session";
import Tooltip from "../tooltip";
import { TextAreaInput } from "../text-areaInput";
import { IconAssignmentPassed } from "../icons/icon-assignment-passed";
import { assignment, fileMetadata, role, shared } from '@maany_shr/e-class-models';
import { getDictionary, isLocalAware } from "@maany_shr/e-class-translations";
import { Uploader } from "../drag-and-drop-uploader/uploader";
import { LinkEdit, LinkPreview } from "../link";
import { IconPlus } from "../icons/icon-plus";

export interface ReplyPanelProps extends isLocalAware {
    role: Omit<role.TRole, 'visitor' | 'admin'>;
    replyId: number;
    sender: assignment.TAssignmentReplySender;
    onFileDownload: (id: number) => void;
    onFileDelete: (replyId: number, fileId: number, type: 'file') => void;
    onLinkDelete: (replyId: number, linkId: number, type: 'link') => void;
    onFilesChange: (files: fileMetadata.TFileUploadRequest[]) => Promise<fileMetadata.TFileMetadata>;
    onCreateLink?: (data: shared.TLink) => Promise<shared.TLink>;
    onClickPassed?: (reply: assignment.TAssignmentReply) => void;
    onClickSendMessage: (reply: assignment.TAssignmentReply) => void;
};


export const ReplyPanel: FC<ReplyPanelProps> = ({
    role,
    replyId,
    sender,
    onFileDownload,
    onFileDelete,
    onLinkDelete,
    onFilesChange,
    onCreateLink,
    onClickPassed,
    onClickSendMessage,
    locale
}) => {
    const [comment, setComment] = useState<string>('');
    const [linkEdit, setLinkEdit] = useState<number>(null);
    const [files, setFiles] = useState<fileMetadata.TFileMetadata[]>([]);
    const [links, setLinks] = useState<shared.TLink[]>([]);

    const dictionary = getDictionary(locale);

    const handleFileDelete = (id: number) => {
        const updatedFiles = files.filter((file) => file.id !== id);
        setFiles(updatedFiles);
        onFileDelete(replyId, id, 'file');
        console.log('manish manish');
    };

    const handleFileUpload = async (files: fileMetadata.TFileUploadRequest[]) => {
        if (!files || files.length === 0) return;

        const file = files[0];
        const processingFile: fileMetadata.TFileMetadata = {
            id: Date.now(),
            name: file.name,
            mimeType: file.file.type || 'application/pdf',
            size: file.file.size,
            checksum: 'processing',
            status: 'processing',
            category: 'document',
            url: '',
        };

        setFiles(prev => [...prev, processingFile]);

        const uploadedFile = await onFilesChange([file]);

        setFiles(prev => [
            ...prev.filter(f => !(f.name === file.name && f.status === 'processing')),
            uploadedFile,
        ]);

        return uploadedFile;
    };

    const handleLinkChange = (index: number, data: shared.TLink) => {
        const updatedLinks = [...links];
        updatedLinks[index] = data;
        setLinks(updatedLinks);
    }

    const handleSaveLink = async (index: number) => {
        const updatedLinks = [...links];
        let newLink = await onCreateLink(updatedLinks[index]);
        updatedLinks[index] = newLink;
        setLinks(updatedLinks);
        setLinkEdit(null);
    };

    const handleLinkDelete = (index: number, linkId: number) => {
        const updatedLinks = links.filter((_, i) => i !== index);
        setLinks(updatedLinks);
        onLinkDelete(replyId, linkId, 'link');
        setLinkEdit(null);
    };

    const handleAddLink = async () => {
        let newLink = await onCreateLink({
            url: '',
            title: ''
        });
        setLinks((prev) => [...prev, newLink]);
        setLinkEdit(links.length);
    };

    const handleSendMessage = () => {
        const hasResources = files.length > 0 || links.length > 0;

        const baseReply = {
            timestamp: new Date().toISOString(),
            sender,
            replyId,
        };

        const reply: assignment.TAssignmentReply = hasResources
            ? {
                ...baseReply,
                type: 'resources',
                comment,
                files,
                links,
            }
            : {
                ...baseReply,
                type: 'text',
                comment,
            };

        onClickSendMessage(reply);
        setComment('');
        setFiles([]);
        setLinks([]);
        setLinkEdit(null);
    };

    const handleClickPassed = () => {
        const reply: assignment.TAssignmentReply = {
            timestamp: new Date().toISOString(),
            sender,
            replyId,
            type: 'passed',
        };

        onClickPassed?.(reply);
    };

    return (
        <div className="flex flex-col gap-[27px] p-4 bg-base-neutral-800 border-1 border-base-neutral-700 rounded-medium">
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between pb-2 border-b-1 border-divider">
                    <div className="flex gap-1 items-center justify-center">
                        <IconCoachingSession fill='text-primary' />
                        <p className="text-sm text-text-primary font-bold leading-[150%]">
                            {dictionary.components.assignment.replyPanel.replyText}
                        </p>
                    </div>
                    {role === 'coach' && (
                        <Button
                            variant="text"
                            size="medium"
                            iconLeft={<IconAssignmentPassed />}
                            hasIconLeft
                            text={dictionary.components.assignment.replyPanel.markAsPassedText}
                            onClick={handleClickPassed}
                        />
                    )}
                </div>
                <Uploader
                    type="single"
                    variant="generic"
                    file={files[0]}
                    // maxFile={5}
                    onFilesChange={(file) => handleFileUpload(file)}
                    onDelete={(id) => handleFileDelete(id)}
                    onDownload={(id) => onFileDownload(id)}
                    locale={locale}
                    className="w-full"
                    maxSize={5}
                    filePreviewClassName="bg-transparent p-0"
                />
                <div className="flex flex-col items-center justify-center gap-[10px] w-full">
                    {links.map((link, index) =>
                        linkEdit === index ?
                            (
                                <div className="flex flex-col w-full" key={index}>
                                    <LinkEdit
                                        locale={locale}
                                        title={link.title}
                                        url={link.url}
                                        onSave={() => handleSaveLink(index)}
                                        onDiscard={() => handleLinkDelete(index, link.linkId)}
                                        onChange={(data) => handleLinkChange(index, data)}
                                    />
                                </div>
                            ) : (
                                <div className="flex flex-col w-full" key={index}>
                                    <LinkPreview
                                        preview
                                        title={link.title}
                                        url={link.url}
                                        onEdit={() => setLinkEdit(index)}
                                        onDelete={() => handleLinkDelete(index, link.linkId)}
                                        className="w-full"
                                    />
                                </div>
                            )
                    )}
                    <div className="flex items-center mt-4 w-full">
                        <div className="flex-grow border-t border-divider"></div>
                        <span
                            onClick={handleAddLink}
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
                            setValue={setComment}
                            className="w-full"
                            placeholder={dictionary.components.assignment.replyPanel.replyPlaceholderText}
                        />
                    </div>
                </div>
                <Button
                    size='medium'
                    variant="primary"
                    text={dictionary.components.assignment.replyPanel.sendMessageText}
                    onClick={handleSendMessage}
                    disabled={!comment && files.length === 0 && links.length === 0}
                />
            </div>
        </div>
    );
};