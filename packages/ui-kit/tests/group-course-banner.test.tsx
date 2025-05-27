import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import {
    GroupCourseBanner,
    GroupCourseBannerProps,
} from '../lib/components/group-course-banner';

// Mock dependencies
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

describe('GroupCourseBanner', () => {
    const baseProps: GroupCourseBannerProps = {
        locale: 'en',
        studentsName: 'Alice Smith, Bob Johnson and 22 others',
        onClickGroupWorkspace: vi.fn(),
        children: <div data-testid="avatar-reel">Avatar Reel</div>,
    };

    it('renders with students name and avatar reel', () => {
        render(<GroupCourseBanner {...baseProps} />);

        expect(screen.getByText('Taken also by')).toBeInTheDocument();
        expect(screen.getByTestId('avatar-reel')).toBeInTheDocument();
        expect(
            screen.getByText('Alice Smith, Bob Johnson and 22 others'),
        ).toBeInTheDocument();
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

        expect(baseProps.onClickGroupWorkspace).toHaveBeenCalledTimes(1);
    });
});
