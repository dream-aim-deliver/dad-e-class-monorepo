import { UserAvatar } from './user-avatar';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';

interface User {
    avatarUrl: string;
    name: string;
}

interface UserAvatarReelProps extends isLocalAware {
    users: User[];
    totalUsersCount: number;
    size?: 'medium' | 'large';
}

/**
 * `UserAvatarReel` displays a compact horizontal list of user avatars,
 * showing up to three user avatars followed by a "+N" indicator if there are
 * more users than displayed. It also displays a textual summary of the users'
 * names with localized "and", "other", and "others" labels.
 *
 * The component supports two sizes: "medium" and "large".
 *
 * If no users are provided or `totalUsersCount` is zero, it returns null (renders nothing).
 *
 * ### Example usage:
 * ```tsx
 * <UserAvatarReel
 *   users={[
 *     { name: 'Alice Johnson', avatarUrl: 'https://example.com/alice.jpg' },
 *     { name: 'Bob Smith', avatarUrl: 'https://example.com/bob.jpg' },
 *     { name: 'Charlie Davis', avatarUrl: 'https://example.com/charlie.jpg' },
 *     { name: 'Diana Clark', avatarUrl: 'https://example.com/diana.jpg' }
 *   ]}
 *   totalUsersCount={10}
 *   size="large"
 *   locale="en"
 * />
 * ```
 *
 * @component
 * @param {UserAvatarReelProps} props - Props for UserAvatarReel component.
 * @param {User[]} props.users - Array of user objects to display avatars for.
 * @param {number} props.totalUsersCount - Total number of users, including those not shown.
 * @param {'medium' | 'large'} [props.size='medium'] - Size of avatars to display.
 * @param {string} props.locale - Locale string to fetch translations.
 *
 * @returns {JSX.Element | null} A list of user avatars with a textual summary, or null if no users.
 */

export const UserAvatarReel = ({
    totalUsersCount,
    locale,
    users,
    size = 'medium',
}: UserAvatarReelProps) => {
    const dictionary = getDictionary(locale).components.userAvatarReel;

    const normalizedUsers = users.map((user) => ({
        fullName: user.name,
        avatarUrl: user.avatarUrl,
    }));

    const formatUserNamesText = (
        users: typeof normalizedUsers,
        totalCount: number,
    ): string => {
        if (users.length === 0) return '';
        const and = dictionary.andLabel;
        const other = dictionary.otherLabel;
        const others = dictionary.othersLabel;

        if (users.length === 1) {
            const othersCount = totalCount - 1;
            if (othersCount === 0) {
                return users[0].fullName;
            } else if (othersCount === 1) {
                return `${users[0].fullName} ${and} 1 ${other}`;
            } else {
                return `${users[0].fullName} ${and} ${othersCount} ${others}`;
            }
        }

        if (users.length === 2) {
            const othersCount = totalCount - 2;
            if (othersCount === 0) {
                return `${users[0].fullName} ${and} ${users[1].fullName}`;
            } else if (othersCount === 1) {
                return `${users[0].fullName}, ${users[1].fullName} ${and} 1 ${other}`;
            } else {
                return `${users[0].fullName}, ${users[1].fullName} ${and} ${othersCount} ${others}`;
            }
        }

        const othersCount = totalCount - users.length;
        if (othersCount === 0) {
            if (users.length === 3) {
                return `${users[0].fullName}, ${users[1].fullName} ${and} ${users[2].fullName}`;
            }
            return `${users[0].fullName}, ${users[1].fullName}, ${users[2].fullName} ${and} ${users.length - 3} ${others}`;
        } else {
            return `${users[0].fullName}, ${users[1].fullName}, ${users[2].fullName} ${and} ${othersCount} ${others}`;
        }
    };

    if (!users || totalUsersCount === 0) return null;

    const maxVisible = 3;
    const visibleUsers = normalizedUsers.slice(0, maxVisible);
    const remainingCount = totalUsersCount - maxVisible;

    const sizeClasses = {
        medium: 'w-12 h-12 text-sm',
        large: 'w-16 h-16 text-base',
    };

    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="flex -space-x-3">
                {visibleUsers.map((user, index) => (
                    <UserAvatar
                        key={index}
                        size={size}
                        fullName={user.fullName}
                        imageUrl={user.avatarUrl}
                        className="rounded-full"
                    />
                ))}
                {remainingCount > 0 && (
                    <div
                        className={`flex items-center justify-center ${sizeClasses[size]} text-text-secondary font-important bg-neutral-700 border border-neutral-600 rounded-full`}
                    >
                        +{remainingCount}
                    </div>
                )}
            </div>
            <p className="text-text-primary">
                {formatUserNamesText(normalizedUsers, totalUsersCount)}
            </p>
        </div>
    );
};
