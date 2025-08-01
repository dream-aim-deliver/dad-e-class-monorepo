import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { Button } from './button';
import { UserAvatarReel } from './avatar/user-avatar-reel';

interface Student {
    name: string;
    avatarUrl: string;
}

export interface GroupCourseBannerProps extends isLocalAware {
    studentNames: Student[];
    totalStudentCount: number;
    onClickGroupWorkspace: () => void;
}

/**
 * GroupCourseBanner component displays a horizontal banner that highlights other students
 * who are taking the same course and provides a button to access a group workspace.
 *
 * @param {GroupCourseBannerProps} props - Component props
 * @param {Student[]} props.studentNames - List of student objects with name and avatarUrl.
 * @param {number} props.totalStudentCount - Total number of students in the course group.
 * @param {() => void} props.onClickGroupWorkspace - Callback triggered when the "Group Workspace" button is clicked.
 * @param {string} props.locale - Locale string used for localization.
 *
 * The component utilizes localized text from the e-class-translations package.
 * It renders a row with:
 *  - A title
 *  - A `UserAvatarReel` showing student avatars
 *  - A `Button` linking to a group workspace
 *
 * Example usage:
 * ```tsx
 * import { GroupCourseBanner } from './GroupCourseBanner';
 *
 * const students = [
 *   { name: 'Alice', avatarUrl: '/avatars/alice.png' },
 *   { name: 'Bob', avatarUrl: '/avatars/bob.png' },
 * ];
 *
 * const handleWorkspaceClick = () => {
 *   console.log('Navigating to group workspace...');
 * };
 *
 * <GroupCourseBanner
 *   studentNames={students}
 *   totalStudentCount={10}
 *   onClickGroupWorkspace={handleWorkspaceClick}
 *   locale="en"
 * />
 * ```
 */

export const GroupCourseBanner = ({
    studentNames,
    onClickGroupWorkspace,
    totalStudentCount,
    locale,
}: GroupCourseBannerProps) => {
    const dictionary = getDictionary(locale).components.groupCourseBanner;
    return (
        <div className="flex flex-row w-full p-3 items-center gap-16 bg-base-neutral-800 rounded-small border border-base-neutral-700">
            <div className="flex flex-col gap-3 justify-start items-left">
                <p className="text-sm text-text-primary font-important">
                    {' '}
                    {dictionary.takenAlsoBy}{' '}
                </p>
                <div className="flex flex-row items-center gap-4">
                    <UserAvatarReel
                        users={studentNames}
                        totalUsersCount={totalStudentCount}
                        locale={locale}
                        size="medium"
                    />
                </div>
            </div>
            <div className="flex-1 flex justify-end">
                <Button
                    size="medium"
                    variant="primary"
                    text={dictionary.groupWorkspaceButton}
                    onClick={onClickGroupWorkspace}
                />
            </div>
        </div>
    );
};
