import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import {
    CoachesSkeleton,
    CoachesSkeletonProps,
} from '../lib/components/coaches-skeleton';

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
        expect(
            screen.getByText('Many other coaches are waiting for you'),
        ).toBeInTheDocument();
    });

    it('renders the correct number of skeleton items based on screen size', () => {
        // Mock window.innerWidth for different screen sizes
        const originalInnerWidth = window.innerWidth;

        // Test for mobile size
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: 500,
        });
        render(<CoachesSkeleton {...baseProps} />);
        expect(screen.getAllByText('Register to see all').length).toBe(1);

        // Test for tablet size
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: 800,
        });
        render(<CoachesSkeleton {...baseProps} />);
        expect(screen.getAllByText('Register to see all').length).toBe(2);

        // Test for desktop size
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: 1300,
        });
        render(<CoachesSkeleton {...baseProps} />);
        expect(screen.getAllByText('Register to see all').length).toBe(3);

        // Restore original innerWidth
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: originalInnerWidth,
        });
    });

    it('calls onRegister when the register button is clicked', () => {
        render(<CoachesSkeleton {...baseProps} />);
        fireEvent.click(screen.getByTestId('register-button'));
        expect(baseProps.onRegister).toHaveBeenCalled();
    });
});
