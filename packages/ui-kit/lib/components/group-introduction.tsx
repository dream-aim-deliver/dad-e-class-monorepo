import { getDictionary, isLocalAware } from "@maany_shr/e-class-translations";
import { FC } from "react";
import { Badge } from "./badge";
import { IconCoachingOffer, IconCourse, IconGroup } from "./icons";
import { Button } from "./button";
import { UserAvatar } from "./avatar/user-avatar";

interface CoachProps {
    name: string;
    surname: string;
    id: number;
    username: string;
    isCurrentUser: boolean;
    avatarUrl?: string | null | undefined;
};

interface GroupIntroductionProps extends isLocalAware {
    groupName: string;
    courseName: string;
    coaches: CoachProps[];
    courseImageUrl?: string;
    actualStudentCount: number;
    maxStudentCount?: number | null;
    onClickCourse: () => void;
    onClickUser: (username: string) => void;
};

/**
 * A reusable GroupIntroduction component that displays group information including group name, course details,
 * coach information, and student count. Supports responsive layouts and localization capabilities.
 *
 * @param locale The current locale for the component, determining the language of displayed text.
 * @param groupName The name of the group to be displayed as the main heading.
 * @param coaches An array of coach objects containing details about each coach.
 * @param courseName The name of the course associated with the group.
 * @param courseImageUrl Optional URL for the course image displayed next to the course name.
 * @param actualStudentCount The current number of students enrolled in the group.
 * @param maxStudentCount The maximum number of students allowed in the group.
 * @param onClickCourse Callback function triggered when the course button is clicked.
 * @param onClickUser Callback function triggered when the coach button is clicked (only when isYou is false).
 *
 * @example
 * <GroupIntroduction
 *   locale="en"
 *   groupName="Advanced Mathematics Group"
 *   courseName="Calculus I"
 *   coaches ={[{ name: "John", surname: "Doe", id: 1, username: "johndoe", isCurrentUser: false, avatarUrl: "https://example.com/johndoe.jpg" }]}
 *   courseImageUrl="https://example.com/course.jpg"
 *   actualStudentCount={15}
 *   maxStudentCount={20}
 *   onClickCourse={() => console.log('Course clicked')}
 *   onClickUser={() => console.log('Coach profile clicked')}
 * />
 */
export const GroupIntroduction: FC<GroupIntroductionProps> = ({
    groupName,
    courseName,
    coaches,
    courseImageUrl,
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
                    text={maxStudentCount != null
                        ? `${actualStudentCount}/${maxStudentCount} ${t.students}`
                        : `${actualStudentCount} ${t.students}`}
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
                    {coaches.length === 0 ? (
                        <span className="text-sm text-text-secondary">{t.noCoach}</span>
                    ) : (
                        <>
                            <div className="flex items-center gap-1 text-sm text-text-secondary">
                                <IconCoachingOffer size='5' data-testid="briefcase-icon" />
                                <span>{t.coach}</span>
                            </div>
                            {coaches.map((coach) => {
                                const displayName = (coach.name || coach.surname)
                                    ? `${coach.name} ${coach.surname}`.trim()
                                    : coach.username;
                                return (
                                    <div
                                        key={coach.id}
                                        className="flex items-center gap-4"
                                    >
                                        {!coach.isCurrentUser ? (
                                            <Button
                                                size="small"
                                                variant="text"
                                                className="flex gap-1 p-0 h-8 max-w-full"
                                                text={displayName}
                                                hasIconLeft
                                                iconLeft={
                                                    <UserAvatar
                                                        size="xSmall"
                                                        imageUrl={coach.avatarUrl || undefined}
                                                        fullName={displayName}
                                                    />
                                                }
                                                onClick={() => onClickUser(coach.username)}
                                            />
                                        ) : (
                                            <div className="flex gap-1 items-center">
                                                <UserAvatar
                                                    size="xSmall"
                                                    imageUrl={coach.avatarUrl || undefined}
                                                    fullName={displayName}
                                                />
                                                <p className="text-base-white text-sm font-bold">
                                                    {t.you}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
