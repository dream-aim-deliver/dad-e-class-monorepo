import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import {
    GroupCourseBanner,
    GroupCourseBannerProps,
} from '../lib/components/group-course-banner';

// Mock translations
vi.mock('@maany_shr/e-class-translations', () => ({
    getDictionary: (locale: string) => ({
        components: {
            groupCourseBanner: {
                takenAlsoBy: 'Taken also by',
                groupWorkspaceButton: 'Go to Group Workspace',
            },
        },
    }),
    isLocalAware: vi.fn(),
}));

// Mock Button
vi.mock('../lib/components/button', () => ({
    Button: ({
        text,
        onClick,
        variant,
        size,
    }: {
        text: string;
        onClick: () => void;
        variant: string;
        size: string;
    }) => (
        <button
            data-testid="group-workspace-button"
            onClick={onClick}
            className={`button-${variant} button-${size}`}
        >
            {text}
        </button>
    ),
}));

// Mock UserAvatarReel
vi.mock('../lib/components/avatar/user-avatar-reel', () => ({
    UserAvatarReel: ({
        users,
        totalUsersCount,
        locale,
    }: {
        users: { name: string; avatarUrl: string }[];
        totalUsersCount: number;
        locale: string;
    }) => (
        <div data-testid="avatar-reel">
            Mocked Avatar Reel for {users.length} users, locale: {locale}
        </div>
    ),
}));

describe('GroupCourseBanner', () => {
    const mockOnClick = vi.fn();

    const baseProps: GroupCourseBannerProps = {
        locale: 'en',
        studentNames: [
            { name: 'Alice Smith', avatarUrl: '/avatars/alice.png' },
            { name: 'Bob Johnson', avatarUrl: '/avatars/bob.png' },
        ],
        totalStudentCount: 24,
        onClickGroupWorkspace: mockOnClick,
    };

    it('renders with localized text and avatar reel', () => {
        render(<GroupCourseBanner {...baseProps} />);

        expect(screen.getByText('Taken also by')).toBeInTheDocument();
        expect(screen.getByTestId('avatar-reel')).toBeInTheDocument();
    });

    it('renders the group workspace button', () => {
        render(<GroupCourseBanner {...baseProps} />);

        const button = screen.getByTestId('group-workspace-button');
        expect(button).toBeInTheDocument();
        expect(button).toHaveTextContent('Go to Group Workspace');
    });

    it('calls onClickGroupWorkspace when button is clicked', () => {
        render(<GroupCourseBanner {...baseProps} />);

        const button = screen.getByTestId('group-workspace-button');
        fireEvent.click(button);

        expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
});
