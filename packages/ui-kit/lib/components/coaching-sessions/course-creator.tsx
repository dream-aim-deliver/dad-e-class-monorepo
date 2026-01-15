import { Button } from '../button';
import { UserAvatar } from '../avatar/user-avatar';
import { IconCoachingOffer } from '../icons/icon-coaching-offer';
import { IconAccountInformation } from '../icons/icon-account-information';
import { IconCourse } from '../icons/icon-course';
import { IconGroup } from '../icons/icon-group';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';

export interface CourseCreatorProps extends isLocalAware {
    userRole: string;
    studentName?: string;
    studentImageUrl?: string;
    creatorName?: string;
    creatorImageUrl?: string;
    courseName?: string;
    courseImageUrl?: string;
    groupName?: string;
    onClickStudent?: () => void;
    onClickCreator?: () => void;
    onClickCourse?: () => void;
    onClickGroup?: () => void;
}

/**
 * CourseCreator component for displaying information about the course creator, student, course, and group.
 *
 * @param userRole Determines whether the user is a 'student' or another role.
 * @param studentName The name of the student (if applicable).
 * @param studentImageUrl The image URL of the student.
 * @param creatorName The name of the course creator (if applicable).
 * @param creatorImageUrl The image URL of the course creator.
 * @param courseName The name of the course.
 * @param courseImageUrl The image URL of the course.
 * @param groupName The name of the group.
 * @param onClickStudent Callback triggered when clicking on the student.
 * @param onClickCreator Callback triggered when clicking on the creator.
 * @param onClickCourse Callback triggered when clicking on the course.
 * @param onClickGroup Callback triggered when clicking on the group.
 * @param locale The locale for translation and localization purposes.
 *
 * @example
 * <CourseCreator
 *   userRole="student"
 *   studentName="John Doe"
 *   studentImageUrl="https://example.com/student.jpg"
 *   creatorName="Jane Smith"
 *   creatorImageUrl="https://example.com/creator.jpg"
 *   courseName="React Basics"
 *   courseImageUrl="https://example.com/course.jpg"
 *   groupName="Frontend Developers"
 *   onClickStudent={() => console.log('Student clicked')}
 *   onClickCreator={() => console.log('Creator clicked')}
 *   onClickCourse={() => console.log('Course clicked')}
 *   onClickGroup={() => console.log('Group clicked')}
 *   locale="en"
 * />
 */

export const CourseCreator: React.FC<CourseCreatorProps> = ({
    userRole,
    studentName,
    studentImageUrl,
    creatorName,
    creatorImageUrl,
    courseName,
    courseImageUrl,
    groupName,
    onClickStudent,
    onClickCourse,
    onClickCreator,
    onClickGroup,
    locale,
}) => {
    const dictionary = getDictionary(locale);
    const coachText = dictionary.components.coachingSessionCard.coachText;
    const studentText = dictionary.components.coachingSessionCard.studentText;
    const courseText = dictionary.components.coachingSessionCard.courseText;
    const groupText = dictionary.components.coachingSessionCard.groupText;
    return (
        <div className="flex flex-col items-start w-full gap-1">
            <div className="flex flex-wrap items-center gap-1 w-full">
                <div className="flex items-center gap-1 text-sm text-text-secondary">
                    {userRole === 'student' ? (
                        <>
                            <IconCoachingOffer size="4" />
                            <p className="text-sm text-text-secondary">{coachText}</p>
                        </>
                    ) : (
                        <>
                            <IconAccountInformation size="4" />
                            <p className="text-sm text-text-secondary">{studentText}</p>
                        </>
                    )}
                </div>
                <Button
                    size="small"
                    variant="text"
                    className="flex gap-1 p-0 h-8 max-w-full"
                    text={userRole === 'student' ? creatorName : studentName}
                    onClick={userRole === 'student' ? onClickCreator : onClickStudent}
                    hasIconLeft
                    iconLeft={
                        <UserAvatar
                            size="xSmall"
                            imageUrl={
                                userRole === 'student' ? creatorImageUrl : studentImageUrl
                            }
                        />
                    }
                />
            </div>
            {courseName && (
                <div className="flex flex-wrap items-center gap-1 w-full">
                    <div className="flex items-center gap-1 text-sm text-text-secondary">
                        <IconCourse size="4" />
                        <p className="text-sm text-text-secondary">{courseText}</p>
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
            )}
            {groupName && (
                <div className="flex flex-wrap items-center gap-1 w-full">
                    <div className="flex items-center gap-1 text-sm text-text-secondary">
                        <IconGroup size="4" data-testid="briefcase-icon" />
                        <p className="text-sm text-text-secondary">{groupText}</p>
                    </div>
                    <Button
                        size="small"
                        variant="text"
                        className="p-0 max-w-full"
                        text={groupName}
                        onClick={onClickGroup}
                    />
                </div>
            )}
        </div>
    );
};