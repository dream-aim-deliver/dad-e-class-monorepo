import { fileMetadata, shared } from '@maany_shr/e-class-models';
import { AssignmentStatus } from '../course-builder-lesson-component/types';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { IconAssignment } from '../icons/icon-assignment';
import { Badge } from '../badge';
import { Button } from '../button';
import { UserAvatar } from '../avatar/user-avatar';
import { IconGroup } from '../icons/icon-group';
import { FilePreview } from '../drag-and-drop-uploader/file-preview';
import { LinkPreview } from '../links';

interface AssignmentHeaderProps extends isLocalAware {
    title: string;
    course: {
        title: string;
        imageUrl?: string;
    };
    onClickCourse: () => void;
    group?: {
        name: string;
    };
    onClickGroup: () => void;
    student?: {
        name: string;
        username: string;
        avatarUrl?: string;
        isYou: boolean;
    };
    onClickUser: () => void;
    modulePosition: number;
    lessonPosition: number;
    status: AssignmentStatus;
    description: string;
}

export function AssignmentHeader({
    title,
    course,
    group,
    student,
    modulePosition,
    lessonPosition,
    status,
    locale,
    onClickCourse,
    onClickUser,
    onClickGroup,
}: AssignmentHeaderProps) {
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
            {status === AssignmentStatus.AwaitingReview && (
                <Badge
                    text={
                        dictionary.components.assignment.assignmentCard
                            .awaitingReviewText
                    }
                    variant="warningprimary"
                    size="medium"
                    className="w-fit"
                />
            )}
            {status === AssignmentStatus.Passed && (
                <Badge
                    text={
                        dictionary.components.assignment.assignmentCard
                            .passedText
                    }
                    variant="successprimary"
                    size="medium"
                    className="w-fit"
                />
            )}
            {status === AssignmentStatus.AwaitingReviewLongTime && (
                <Badge
                    text={
                        dictionary.components.assignment.assignmentCard
                            .longWaitText
                    }
                    variant="errorprimary"
                    size="medium"
                    className="w-fit"
                />
            )}
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
                {student && !student.isYou && (
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
                {group && (
                    <div className="flex items-center gap-1 w-full">
                        <div className="flex items-center gap-1 text-sm text-text-secondary">
                            <IconGroup size="4" data-testid="briefcase-icon" />
                            <p className="text-sm text-text-secondary">
                                {
                                    dictionary.components.assignment
                                        .assignmentCard.groupText
                                }
                            </p>
                        </div>
                        <Button
                            size="small"
                            variant="text"
                            className="p-0 max-w-full truncate"
                            title={group.name}
                            text={group.name}
                            onClick={onClickGroup}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

interface AssignmentModalContentProps
    extends isLocalAware,
        AssignmentHeaderProps {
    resources: fileMetadata.TFileMetadata[];
    links: shared.TLink[];
    onFileDownload: (fileMetadata: fileMetadata.TFileMetadata) => void;
}

export function AssignmentModalContent({
    resources,
    links,
    locale,
    onFileDownload,
    ...props
}: AssignmentModalContentProps) {
    const dictionary = getDictionary(locale);

    return (
        <div className="flex flex-col gap-4">
            {/* Assignment Icon & Label */}
            <div className="flex items-center gap-2">
                <span className="p-1 bg-base-neutral-700 rounded-small">
                    <IconAssignment size="4" classNames="text-text-primary" />
                </span>
                <p className="text-sm font-bold text-text-primary leading-[150%]">
                    {
                        dictionary.components.assignment.assignmentModal
                            .assignmentText
                    }
                </p>
            </div>

            <div className="w-full h-[1px] bg-divider" />

            <AssignmentHeader {...props} locale={locale} />

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
