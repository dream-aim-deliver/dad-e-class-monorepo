import { FC } from "react";
import { Badge } from "../badge";
import { role, fileMetadata, shared } from '@maany_shr/e-class-models';
import { Button } from "../button";
import { UserAvatar } from "../avatar/user-avatar";
import { IconGroup } from "../icons/icon-group";
import { getDictionary, isLocalAware } from "@maany_shr/e-class-translations";

export interface AssignmentHeaderProps extends isLocalAware {
    assignmentId?: number;
    title?: string;
    description?: string;
    files?: fileMetadata.TFileMetadata[];
    links?: shared.TLinkWithId[];
    course?: {
        title?: string;
        imageUrl?: string;
    };
    module?: number;
    lesson?: number;
    status?: string;
    student?: {
        name?: string;
        image?: string;
    };
    groupName?: string;
    role: Omit<role.TRole, 'visitor' | 'admin' | 'superadmin'>;
    onClickCourse: () => void;
    onClickUser: () => void;
    onClickGroup: () => void;
}

export const AssignmentHeader: FC<AssignmentHeaderProps> = ({
    title,
    course,
    module,
    lesson,
    status,
    student,
    groupName,
    role,
    onClickCourse,
    onClickUser,
    onClickGroup,
    locale
}) => {
    const dictionary = getDictionary(locale);

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
                <p className="text-sm text-text-secondary font-bold leading-[100%]">
                    {dictionary.components.assignment.assignmentCard.moduleText} {module}, {dictionary.components.assignment.assignmentCard.lessonText} {lesson}
                </p>
                <h4 className="text-xl text-text-primary font-bold leading-[120%]">
                    {title}
                </h4>
            </div>
            {status === 'AwaitingReview' && (
                <Badge
                    text={dictionary.components.assignment.assignmentCard.awaitingReviewText}
                    variant="warningprimary"
                    size="medium"
                    className="w-fit"
                />
            )}
            {status === 'Passed' && (
                <Badge
                    text={dictionary.components.assignment.assignmentCard.passedText}
                    variant="successprimary"
                    size="medium"
                    className="w-fit"
                />
            )}
            {status === 'AwaitingForLongTime' && (
                <Badge
                    text={dictionary.components.assignment.assignmentCard.longWaitText}
                    variant="errorprimary"
                    size="medium"
                    className="w-fit"
                />
            )}
            <div className="flex flex-wrap gap-x-6 items-center">
                {course && (
                    <div className="flex gap-[13px] items-center w-full">
                        <p className="text-sm text-text-secondary leading-[100%]">
                            {dictionary.components.assignment.assignmentCard.courseText}:
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
                {role === 'coach' && student && (
                    <div className="flex gap-[13px] items-center w-full">
                        <p className="text-sm text-text-secondary leading-[100%]">
                            {dictionary.components.assignment.assignmentCard.studentText}:
                        </p>
                        <Button
                            size="small"
                            variant="text"
                            className="p-0 gap-1 text-sm truncate"
                            text={student.name}
                            onClick={onClickUser}
                            title={student.name}
                            hasIconLeft
                            iconLeft={
                                <UserAvatar
                                    size="xSmall"
                                    imageUrl={student.image}
                                />
                            }
                        />
                    </div>
                )}
                {groupName && (
                    <div className="flex items-center gap-1 w-full">
                        <div className="flex items-center gap-1 text-sm text-text-secondary">
                            <IconGroup size="4" data-testid="briefcase-icon" />
                            <p className="text-sm text-text-secondary">{dictionary.components.assignment.assignmentCard.groupText}</p>
                        </div>
                        <Button
                            size="small"
                            variant="text"
                            className="p-0 max-w-full truncate"
                            title={groupName}
                            text={groupName}
                            onClick={onClickGroup}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};