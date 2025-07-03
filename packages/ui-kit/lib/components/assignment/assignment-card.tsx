import { FC } from "react";
import { Button } from "../button";
import { assignment, fileMetadata, role, shared } from '@maany_shr/e-class-models';
import { AssignmentHeader } from "./assignment-header";
import { getDictionary, isLocalAware } from "@maany_shr/e-class-translations";
import { Message } from "./message";
import { cn } from "../../utils/style-utils";
import { FilePreview } from "../drag-and-drop-uploader/file-preview";
import { LinkEdit, LinkPreview } from "../link";

export interface AssignmentCardProps extends assignment.TAssignment, isLocalAware {
    role: Omit<role.TRole, 'visitor' | 'admin'>;
    assignmentId: number;
    linkEditIndex: number;
    onFileDownload: (id: number) => void;
    onFileDelete: (id: number, fileId: number, type: 'file') => void;
    onLinkDelete: (id: number, linkId: number, type: 'link') => void;
    onChange: (files: fileMetadata.TFileMetadata[], links: shared.TLink[], linkEditIndex?: number) => void;
    onClickCourse: () => void;
    onClickUser: () => void;
    onClickGroup: () => void;
    onClickView: () => void;
};

export const AssignmentCard: FC<AssignmentCardProps> = ({
    role,
    assignmentId,
    title,
    description,
    files,
    links,
    course,
    module,
    lesson,
    status,
    replies,
    student,
    groupName,
    linkEditIndex,
    onFileDelete,
    onFileDownload,
    onLinkDelete,
    onChange,
    onClickCourse,
    onClickUser,
    onClickGroup,
    onClickView,
    locale,
}) => {
    const dictionary = getDictionary(locale);
    const getLatestReply = (replies: assignment.TAssignmentReply[]) => {
        if (replies.length === 0) return undefined;
        return replies.reduce((latest, current) =>
            new Date(current.timestamp) > new Date(latest.timestamp) ? current : latest
        );
    };

    const handleSaveLink = (index: number) => {
        const updatedLinks = [...links];
        updatedLinks[index] = {
            ...updatedLinks[index],
        };
        onChange(files, updatedLinks, null);
    };

    const handleLinkEdit = (data: shared.TLink, index: number) => {
        const updatedLinks = [...links];
        updatedLinks[index] = data;
        onChange(files, updatedLinks, index);
    };

    const handleOnClickLinkEdit = (index: number) => {
        onChange(files, links, index);
    };

    return (
        <div
            className={cn(
                "flex flex-col p-4 bg-card-fill border-1 border-card-stroke rounded-medium",
                replies.length > 0 ? 'gap-2' : 'gap-4'
            )}>
            <AssignmentHeader
                title={title}
                course={course}
                module={module}
                lesson={lesson}
                status={status}
                student={student}
                groupName={groupName}
                onClickCourse={onClickCourse}
                onClickUser={onClickUser}
                onClickGroup={onClickGroup}
                locale={locale}
                role={role}
            />
            {replies.length > 0 ? (
                (() => {
                    const latestReply = getLatestReply(replies);
                    return latestReply ? (
                        <div className="flex flex-col gap-2">
                            <h6 className="text-md text-text-primary font-bold leading-[120%]">
                                {dictionary.components.assignment.assignmentCard.lastActivityText}
                            </h6>
                            <Message
                                reply={latestReply}
                                linkEditIndex={linkEditIndex}
                                onFileDownload={onFileDownload}
                                onFileDelete={onFileDelete}
                                onLinkDelete={onLinkDelete}
                                onChange={onChange}
                                locale={locale}
                            />
                        </div>
                    ) : null;
                })()
            ) : (
                <div className="flex flex-col gap-4 items-start w-full">
                    <p className="text-md text-text-primary leading-[150%]">
                        {description}
                    </p>
                    <div className="flex flex-col gap-2 w-full">
                        {files.map((file, index) => (
                            <FilePreview
                                key={index}
                                uploadResponse={file}
                                index={index}
                                onDelete={() => onFileDelete(assignmentId, file.id, 'file')}
                                onDownload={() => onFileDownload(file.id)}
                                locale={locale}
                                onCancelUpload={() => onFileDelete(assignmentId, file.id, 'file')}
                                className="bg-transparent p-0"
                                isDeleteAllowed={role === 'coach'}
                            />
                        ))}
                        {links.map((link, index) =>
                            linkEditIndex === index ?
                                (
                                    <div className="flex flex-col w-full" key={index}>
                                        <LinkEdit
                                            locale={locale}
                                            title={link.title}
                                            url={link.url}
                                            onSave={() => handleSaveLink(index)}
                                            onDiscard={() => onLinkDelete(assignmentId, link.linkId, 'link')}
                                            onChange={(data) => handleLinkEdit(data, index)}
                                        />
                                    </div>
                                ) : (
                                    <div className="flex flex-col w-full" key={index}>
                                        <LinkPreview
                                            preview={role === 'coach'}
                                            title={link.title}
                                            url={link.url}
                                            onEdit={() => handleOnClickLinkEdit(index)}
                                            onDelete={() => onLinkDelete(assignmentId, link.linkId, 'link')}
                                            className="w-full"
                                        />
                                    </div>
                                )
                        )}
                    </div>
                </div>
            )}
            <Button
                variant="secondary"
                size="medium"
                text={dictionary.components.assignment.assignmentCard.viewText}
                onClick={onClickView}
            />
        </div>
    );
};