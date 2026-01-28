import { Button } from '../button';
import { UserAvatar } from '../avatar/user-avatar';
import { IconCoachingOffer } from '../icons/icon-coaching-offer';
import { IconAccountInformation } from '../icons/icon-account-information';
import { IconCourse } from '../icons/icon-course';
import { IconGroup } from '../icons/icon-group';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';

export interface CourseCreatorProps extends isLocalAware {
    userRole: 'student' | 'coach';
    sessionType: 'student' | 'group';
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
 * @param userRole Determines whether the user is a 'student' or 'coach'.
 * @param sessionType Determines whether the session is 'student' (1:1) or 'group'.
 * @param studentName The name of the student (required for coach viewing student sessions).
 * @param studentImageUrl The image URL of the student.
 * @param creatorName The name of the course creator (required for student view).
 * @param creatorImageUrl The image URL of the course creator.
 * @param courseName The name of the course.
 * @param courseImageUrl The image URL of the course.
 * @param groupName The name of the group (required for group sessions).
 * @param onClickStudent Callback triggered when clicking on the student.
 * @param onClickCreator Callback triggered when clicking on the creator.
 * @param onClickCourse Callback triggered when clicking on the course.
 * @param onClickGroup Callback triggered when clicking on the group.
 * @param locale The locale for translation and localization purposes.
 *
 * @example
 * <CourseCreator
 *   userRole="student"
 *   sessionType="student"
 *   creatorName="Jane Smith"
 *   creatorImageUrl="https://example.com/creator.jpg"
 *   courseName="React Basics"
 *   courseImageUrl="https://example.com/course.jpg"
 *   onClickCreator={() => console.log('Creator clicked')}
 *   onClickCourse={() => console.log('Course clicked')}
 *   locale="en"
 * />
 */

export const CourseCreator: React.FC<CourseCreatorProps> = ({
    userRole,
    sessionType,
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

    // For group sessions (coach view), show group info in the first row instead of student
    const isGroupSession = sessionType === 'group' && userRole === 'coach';

    return (
        <div className="flex flex-col items-start w-full gap-1">
            {isGroupSession && groupName ? (
                // Group session: Show group info as the primary row
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
            ) : (
                // Student session or student view: Show student/coach info
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
            )}
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
            {/* Only show group row for non-group sessions (student sessions that also have a group) */}
            {!isGroupSession && groupName && (
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
