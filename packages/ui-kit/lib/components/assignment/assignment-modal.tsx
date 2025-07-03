import { FC } from "react";
import { IconButton } from "../icon-button";
import { IconClose } from "../icons/icon-close";
import { IconAssignment } from "../icons/icon-assignment";
import { AssignmentHeader } from "./assignment-header";
import { getDictionary, isLocalAware } from "@maany_shr/e-class-translations";
import { assignment, fileMetadata, role, shared } from "@maany_shr/e-class-models";
import { FilePreview } from "../drag-and-drop-uploader/file-preview";
import { LinkEdit, LinkPreview } from "../link";

export interface AssignmentModalProps extends Omit<assignment.TAssignment, 'replies'>, isLocalAware {
    role: Omit<role.TRole, 'visitor' | 'admin'>;
    assignmentId: number;
    linkEditIndex: number;
    children?: React.ReactNode;
    onFileDownload: (id: number) => void;
    onFileDelete: (id: number, fileId: number, type: 'file') => void;
    onLinkDelete: (id: number, linkId: number, type: 'link') => void;
    onLinkEdit?: (id: number) => void;
    onChange: (files: fileMetadata.TFileMetadata[], links: shared.TLink[], linkEditIndex?: number) => void;
    onClickCourse: () => void;
    onClickUser: () => void;
    onClickGroup: () => void;
    onClose: () => void;
};

export const AssignmentModal: FC<AssignmentModalProps> = ({
    role,
    assignmentId,
    linkEditIndex,
    children,
    title,
    description,
    course,
    module,
    lesson,
    status,
    student,
    groupName,
    files,
    links,
    onFileDelete,
    onFileDownload,
    onLinkDelete,
    onChange,
    onClickCourse,
    onClickUser,
    onClickGroup,
    onClose,
    locale
}) => {
    const dictionary = getDictionary(locale);

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
        <div className="flex flex-col gap-4 p-6 bg-card-fill border-1 border-card-stroke rounded-medium shadow-[0_4px_12px_0_base-neutral-950] relative">
            {/* Close button to close the modal */}
            <div className="absolute right-0 top-0">
                <IconButton
                    data-testid="close-modal-button"
                    styles="text"
                    icon={<IconClose />}
                    size="small"
                    onClick={onClose}
                    className="text-button-text-text"
                />
            </div>

            <div className="flex flex-col gap-[11px] items-start">
                <div className="flex gap-2 items-center justify-center">
                    <div className="flex justify-center items-center p-1 bg-base-neutral-700 rounded-small">
                        <IconAssignment size='4' classNames="text-text-primary" />
                    </div>
                    <p className="text-sm text-text-primary font-bold leading-[150%]">
                        {dictionary.components.assignment.assignmentModal.assignmentText}
                    </p>
                </div>
                <div
                    className="w-full h-[1px] bg-divider"
                />
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
                <div
                    className="w-full h-[1px] bg-divider"
                />
            </div>

            <div className="flex flex-col gap-4 items-start w-full">
                <p className="text-md text-text-primary leading-[150%]">
                    {description}
                </p>
                {files.map((file, index) => (
                    <FilePreview
                        key={index}
                        uploadResponse={file}
                        index={index}
                        onDelete={() => onFileDelete(assignmentId, file.id, 'file')}
                        onDownload={() => onFileDownload(file.id)}
                        locale={locale}
                        onCancelUpload={() => onFileDelete(assignmentId, file.id, 'file')}
                        className="bg-transparent p-0 w-full"
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
            {children}
        </div>
    )
};