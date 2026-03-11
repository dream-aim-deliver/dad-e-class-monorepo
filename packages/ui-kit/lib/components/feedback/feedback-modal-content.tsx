import React from 'react';
import { fileMetadata, shared } from '@maany_shr/e-class-models';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { Badge } from '../badge';
import { Button } from '../button';
import { UserAvatar } from '../avatar/user-avatar';
import { FilePreview } from '../drag-and-drop-uploader/file-preview';
import { LinkPreview } from '../links';
import { IconChat } from '../icons/icon-chat';

interface FeedbackHeaderProps extends isLocalAware {
    title: string;
    course: {
        title: string;
        imageUrl?: string;
    };
    onClickCourse: () => void;
    student?: {
        name: string;
        username: string;
        avatarUrl?: string;
    };
    onClickUser: () => void;
    modulePosition: number;
    lessonPosition: number;
    description: string;
}

function FeedbackHeader({
    title,
    course,
    student,
    modulePosition,
    lessonPosition,
    locale,
    onClickCourse,
    onClickUser,
}: FeedbackHeaderProps) {
    const dictionary = getDictionary(locale);

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
                <p className="text-sm text-text-secondary font-bold leading-[100%]">
                    {dictionary.components.assignment.assignmentCard.moduleText}{' '}
                    {modulePosition},{' '}
                    {dictionary.components.assignment.assignmentCard.lessonText}{' '}
                    {lessonPosition}
                </p>
                <h4 className="text-xl text-text-primary font-bold leading-[120%]">
                    {title}
                </h4>
            </div>
            <div className="flex flex-wrap gap-x-6 items-center">
                {course && (
                    <div className="flex gap-[13px] items-center w-full">
                        <p className="text-sm text-text-secondary leading-[100%]">
                            {
                                dictionary.components.assignment.assignmentCard
                                    .courseText
                            }
                            :
                        </p>
                        <Button
                            size="small"
                            variant="text"
                            className="p-0 gap-1 text-sm truncate"
                            text={course.title}
                            onClick={onClickCourse}
                            title={course.title}
                            hasIconLeft
                            iconLeft={
                                <UserAvatar
                                    className="rounded-small"
                                    size="xSmall"
                                    imageUrl={course.imageUrl}
                                />
                            }
                        />
                    </div>
                )}
                {student && (
                    <div className="flex gap-[13px] items-center w-full">
                        <p className="text-sm text-text-secondary leading-[100%]">
                            {
                                dictionary.components.assignment.assignmentCard
                                    .studentText
                            }
                            :
                        </p>
                        <Button
                            size="small"
                            variant="text"
                            className="p-0 gap-1 text-sm truncate"
                            text={student.username}
                            onClick={onClickUser}
                            title={student.username}
                            hasIconLeft
                            iconLeft={
                                <UserAvatar
                                    size="xSmall"
                                    imageUrl={student.avatarUrl}
                                    fullName={student.username}
                                />
                            }
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

interface FeedbackModalContentProps
    extends isLocalAware,
        FeedbackHeaderProps {
    resources: fileMetadata.TFileMetadata[];
    links: shared.TLink[];
    onFileDownload: (fileMetadata: fileMetadata.TFileMetadata) => void;
}

export function FeedbackModalContent({
    resources,
    links,
    locale,
    onFileDownload,
    ...props
}: FeedbackModalContentProps) {
    const dictionary = getDictionary(locale);

    return (
        <div className="flex flex-col gap-4">
            {/* Icon & Label */}
            <div className="flex items-center gap-2">
                <span className="p-1 bg-base-neutral-700 rounded-small">
                    <IconChat size="4" classNames="text-text-primary" />
                </span>
                <p className="text-sm font-bold text-text-primary leading-[150%]">
                    {dictionary.components.feedback.feedbackBuilder.feedbackText}
                </p>
            </div>

            <div className="w-full h-[1px] bg-divider" />

            <FeedbackHeader {...props} locale={locale} />

            {resources.map((file, index) => (
                <FilePreview
                    key={`file-preview-${index}`}
                    uploadResponse={file}
                    locale={locale}
                    readOnly={true}
                    deletion={{ isAllowed: false }}
                    onDownload={() => onFileDownload(file)}
                />
            ))}

            {links.map((link, index) => (
                <div
                    className="flex flex-col w-full"
                    key={`link-preview-${index}`}
                >
                    <LinkPreview
                        preview={false}
                        title={link.title as string}
                        url={link.url as string}
                    />
                </div>
            ))}
        </div>
    );
}
