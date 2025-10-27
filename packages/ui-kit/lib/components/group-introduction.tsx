import { getDictionary, isLocalAware } from "@maany_shr/e-class-translations";
import { FC } from "react";
import { Badge } from "./badge";
import { IconCoachingOffer, IconCourse, IconGroup } from "./icons";
import { Button } from "./button";
import { UserAvatar } from "./avatar/user-avatar";

export interface GroupIntroductionProps extends isLocalAware {
    groupName: string;
    courseName: string;
    isYou: boolean;
    coachName: string;
    courseImageUrl?: string;
    coachImageUrl?: string;
    actualStudentCount: number;
    maxStudentCount: number;
    onClickCourse: () => void;
    onClickUser: () => void;
};

export const GroupIntroduction: FC<GroupIntroductionProps> = ({
    groupName,
    courseName,
    isYou,
    coachName,
    courseImageUrl,
    coachImageUrl,
    actualStudentCount,
    maxStudentCount,
    locale,
    onClickCourse,
    onClickUser,
}) => {
    const t = getDictionary(locale).components.groupIntroduction;

    return (
        <div className='flex flex-col items-start gap-3 w-full'>
            <h1 className='text-text-primary md:text-4xl text-2xl font-bold'>
                {groupName}
            </h1>
            <div className="flex gap-4 items-center flex-wrap">
                <Badge
                    hasIconLeft
                    iconLeft={<IconGroup size='4' />}
                    text={`${actualStudentCount}/${maxStudentCount} ${t.students}`}
                    variant="info"
                    className="text-sm"
                />
                <div className="flex flex-wrap items-center gap-1">
                    <div className="flex items-center gap-1 text-sm text-text-secondary">
                        <IconCourse size="4" />
                        <p className="text-sm text-text-secondary">
                            {t.course}
                        </p>
                    </div>
                    <Button
                        size="small"
                        variant="text"
                        className="flex gap-1 p-0 h-8 max-w-full"
                        text={courseName}
                        onClick={onClickCourse}
                        hasIconLeft
                        iconLeft={
                            <UserAvatar
                                className="rounded-small"
                                size="xSmall"
                                imageUrl={courseImageUrl}
                            />
                        }
                    />
                </div>
                <div className="flex flex-wrap items-center gap-1">
                    <div className="flex items-center gap-1 text-sm text-text-secondary">
                        <IconCoachingOffer size='5' data-testid="briefcase-icon" />
                        <span>{t.coach}</span>
                    </div>
                    {!isYou ? (
                        <Button
                            size="small"
                            variant="text"
                            className="flex gap-1 p-0 h-8 max-w-full"
                            text={coachName}
                            hasIconLeft
                            iconLeft={
                                <UserAvatar
                                    size="xSmall"
                                    imageUrl={coachImageUrl}
                                    fullName={coachName}
                                />
                            }
                            onClick={onClickUser}
                        />
                    ) : (
                        <div className="flex gap-1 items-center">
                            <UserAvatar
                                size="xSmall"
                                imageUrl={coachImageUrl}
                                fullName={coachName}
                            />
                            <p className="text-base-white text-sm font-bold">
                                {t.you}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};