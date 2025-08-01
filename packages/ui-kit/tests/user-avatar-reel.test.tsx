import { render, screen } from '@testing-library/react';
import { UserAvatarReel } from '../lib/components/avatar/user-avatar-reel';

describe('UserAvatarReel Component', () => {
    const users = [
        { name: 'Alice Smith', avatarUrl: 'https://example.com/alice.jpg' },
        { name: 'Bob Johnson', avatarUrl: 'https://example.com/bob.jpg' },
        { name: 'Charlie Brown', avatarUrl: 'https://example.com/charlie.jpg' },
        { name: 'Diana Prince', avatarUrl: 'https://example.com/diana.jpg' },
    ];

    it('renders multiple avatars', () => {
        render(
            <UserAvatarReel users={users} totalUsersCount={4} locale="en" />,
        );

        const avatars = screen.getAllByRole('img');
        expect(avatars.length).toBeLessThanOrEqual(3); // max 3 visible
        expect(screen.getByText('+1')).toBeInTheDocument();
    });

    it('renders a single avatar correctly', () => {
        const oneUser = [users[0]];
        render(
            <UserAvatarReel users={oneUser} totalUsersCount={1} locale="en" />,
        );

        const avatar = screen.getByRole('img');
        expect(avatar).toBeInTheDocument();
        expect(screen.queryByText('+')).not.toBeInTheDocument();
    });

    it('renders nothing if users are empty', () => {
        const { container } = render(
            <UserAvatarReel users={[]} totalUsersCount={0} locale="en" />,
        );
        expect(container).toBeEmptyDOMElement();
    });

    it('renders mixed avatar types (image + initials fallback)', () => {
        const mixedUsers = [
            { name: 'Anna A.', avatarUrl: 'https://example.com/aa.jpg' },
            { name: 'Ben B.', avatarUrl: '' }, // should fallback to initials
            { name: 'Cecilia C.', avatarUrl: 'https://example.com/cc.jpg' },
        ];

        render(
            <UserAvatarReel
                users={mixedUsers}
                totalUsersCount={3}
                locale="en"
            />,
        );

        expect(screen.getAllByRole('img').length).toBe(2);
        expect(screen.getByText('BB')).toBeInTheDocument();
    });

    it('renders overflow indicator correctly', () => {
        render(
            <UserAvatarReel users={users} totalUsersCount={10} locale="en" />,
        );
        expect(screen.getByText('+7')).toBeInTheDocument();
    });
});
