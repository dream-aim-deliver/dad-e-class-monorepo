import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CoachesSkeleton, CoachesSkeletonProps } from '../lib/components/coaches-skeleton';

// Mock dependencies
vi.mock('@maany_shr/e-class-translations', () => ({
    getDictionary: (locale: string) => ({
        components: {
            coachesSkeleton: {
                title: 'Many other coaches are waiting for you',
                registerButton: 'Register to see all',
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
            data-testid="register-button"
            onClick={onClick}
            className={`button-${variant} button-${size}`}
        >
            {text}
        </button>
    ),
}));

describe('CoachesSkeleton', () => {
    const baseProps: CoachesSkeletonProps = {
        locale: 'en',
        onRegister: vi.fn(),
    };

    it('renders with the correct title', () => {
        render(<CoachesSkeleton {...baseProps} />);
        expect(screen.getByText('Many other coaches are waiting for you')).toBeInTheDocument();
    });

    it('renders the correct number of skeleton items based on screen size', () => {
        // Mock window.innerWidth for different screen sizes
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: 1280, // xl: desktop
        });
        render(<CoachesSkeleton {...baseProps} />);
        Object.defineProperty(window, 'innerWidth', {
            value: 768, // md: tablet
        });
        render(<CoachesSkeleton {...baseProps} />);
        Object.defineProperty(window, 'innerWidth', {
            value: 480, // mobile
        });
        render(<CoachesSkeleton {...baseProps} />);
    });

    it('calls onRegister when the register button is clicked', () => {
        render(<CoachesSkeleton {...baseProps} />);
        fireEvent.click(screen.getByTestId('register-button'));
        expect(baseProps.onRegister).toHaveBeenCalled();
    });
});