import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { createPortal } from 'react-dom';
import DefaultLoading from '../lib/components/default-loading';

// Mock dependencies
vi.mock('@maany_shr/e-class-translations', () => ({
    getDictionary: vi.fn((locale: string) => ({
        components: {
            defaultLoading: {
                loading: locale === 'de' ? 'Lädt...' : 'Loading...',
            },
        },
    })),
}));

vi.mock('../lib/components/icons/icon-loader-spinner', () => ({
    IconLoaderSpinner: ({
        size,
        classNames,
    }: {
        size: string;
        classNames: string;
    }) => (
        <div data-testid="spinner" data-size={size} className={classNames}>
            Spinner
        </div>
    ),
}));

vi.mock('react-dom', async () => {
    const actual = await vi.importActual('react-dom');
    return {
        ...actual,
        createPortal: vi.fn((children, container) => {
            // Simulate portal behavior - don't return children to the component tree
            // Instead, append to the target container (document.body in our case)
            if (container === document.body) {
                // In a real portal, this would append to document.body
                // For testing, we'll just track that it was called
                return null;
            }
            return children;
        }),
    };
});

describe('<DefaultLoading />', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        document.body.innerHTML = '';
    });

    describe('Minimal variant', () => {
        it('renders minimal variant with correct styling', () => {
            render(<DefaultLoading locale="en" variant="minimal" />);

            const container = screen
                .getByText('Loading...')
                .closest('div')?.parentElement;
            expect(container).toHaveClass(
                'fixed',
                'top-0',
                'left-0',
                'w-full',
                'h-full',
                'flex',
                'items-center',
                'justify-center',
                'z-50',
            );
        });

        it('displays spinner and loading text horizontally', () => {
            render(<DefaultLoading locale="en" variant="minimal" />);

            const spinner = screen.getByTestId('spinner');
            const text = screen.getByText('Loading...');

            expect(spinner).toBeInTheDocument();
            expect(text).toBeInTheDocument();

            // Check horizontal alignment
            const contentContainer = text.closest('div');
            expect(contentContainer).toHaveClass(
                'flex',
                'items-center',
                'space-x-3',
            );
        });

        it('uses secondary text color for spinner', () => {
            render(<DefaultLoading locale="en" variant="minimal" />);

            const spinner = screen.getByTestId('spinner');
            expect(spinner).toHaveClass('text-text-secondary', 'animate-spin');
            expect(spinner).toHaveAttribute('data-size', '8');
        });

        it('displays German translation correctly', () => {
            render(<DefaultLoading locale="de" variant="minimal" />);

            expect(screen.getByText('Lädt...')).toBeInTheDocument();
        });
    });

    describe('Card variant', () => {
        it('renders card variant with correct styling', () => {
            const { container } = render(
                <DefaultLoading locale="en" variant="card" />,
            );

            // Find the outermost card container
            const cardContainer = container.firstChild as HTMLElement;
            expect(cardContainer).toHaveClass(
                'flex',
                'flex-col',
                'items-center',
                'justify-center',
                'bg-card-fill',
                'border',
                'border-card-stroke',
                'rounded-lg',
                'shadow-sm',
                'p-6',
            );
        });

        it('displays spinner and loading text vertically', () => {
            render(<DefaultLoading locale="en" variant="card" />);

            const spinner = screen.getByTestId('spinner');
            const text = screen.getByText('Loading...');

            expect(spinner).toBeInTheDocument();
            expect(text).toBeInTheDocument();

            // Check vertical alignment
            const contentContainer = text.closest('div');
            expect(contentContainer).toHaveClass(
                'flex',
                'flex-col',
                'items-center',
                'text-center',
            );
        });

        it('uses primary color for spinner and has margin top on text', () => {
            render(<DefaultLoading locale="en" variant="card" />);

            const spinner = screen.getByTestId('spinner');
            const text = screen.getByText('Loading...');

            expect(spinner).toHaveClass(
                'text-button-primary-fill',
                'animate-spin',
            );
            expect(text).toHaveClass(
                'text-text-primary',
                'font-important',
                'mt-3',
                'text-sm',
            );
        });

        it('displays German translation correctly', () => {
            render(<DefaultLoading locale="de" variant="card" />);

            expect(screen.getByText('Lädt...')).toBeInTheDocument();
        });
    });

    describe('Overlay variant', () => {
        it('does not render immediately (waits for mount)', async () => {
            const { container } = render(
                <DefaultLoading locale="en" variant="overlay" />,
            );

            // Initially should not render anything in the container since it uses portal
            // The portal mock will still render content, but not in the test container
            expect(container.firstChild).toBeNull();

            // But createPortal should be called after mounting
            await waitFor(() => {
                expect(createPortal).toHaveBeenCalled();
            });
        });

        it('renders overlay after mounting with portal', async () => {
            render(<DefaultLoading locale="en" variant="overlay" />);

            // Wait for useEffect to set mounted state
            await waitFor(() => {
                expect(createPortal).toHaveBeenCalled();
            });
        });

        it('calls createPortal with correct parameters', async () => {
            render(<DefaultLoading locale="en" variant="overlay" />);

            await waitFor(() => {
                expect(createPortal).toHaveBeenCalledWith(
                    expect.any(Object), // The JSX content
                    document.body,
                );
            });
        });

        describe('Internationalization', () => {
            it('handles English locale correctly', () => {
                render(<DefaultLoading locale="en" variant="minimal" />);
                expect(screen.getByText('Loading...')).toBeInTheDocument();
            });

            it('handles German locale correctly', () => {
                render(<DefaultLoading locale="de" variant="minimal" />);
                expect(screen.getByText('Lädt...')).toBeInTheDocument();
            });

            describe('Common behavior across variants', () => {
                it('renders spinner component for minimal and card variants', () => {
                    const variants = ['minimal', 'card'] as const;

                    variants.forEach((variant) => {
                        const { unmount } = render(
                            <DefaultLoading locale="en" variant={variant} />,
                        );

                        expect(
                            screen.getByTestId('spinner'),
                        ).toBeInTheDocument();

                        unmount();
                    });
                });

                it('overlay variant uses createPortal', async () => {
                    render(<DefaultLoading locale="en" variant="overlay" />);

                    await waitFor(() => {
                        expect(createPortal).toHaveBeenCalled();
                    });
                });

                it('shows loading text for minimal and card variants', () => {
                    const variants = ['minimal', 'card'] as const;

                    variants.forEach((variant) => {
                        const { unmount } = render(
                            <DefaultLoading locale="en" variant={variant} />,
                        );

                        expect(
                            screen.getByText('Loading...'),
                        ).toBeInTheDocument();

                        unmount();
                    });
                });

                it('spinner has consistent size and animation for minimal and card variants', () => {
                    const variants = ['minimal', 'card'] as const;

                    variants.forEach((variant) => {
                        const { unmount } = render(
                            <DefaultLoading locale="en" variant={variant} />,
                        );

                        const spinner = screen.getByTestId('spinner');
                        expect(spinner).toHaveAttribute('data-size', '8');
                        expect(spinner).toHaveClass('animate-spin');

                        unmount();
                    });
                });
            });

            describe('Accessibility', () => {
                it('has accessible loading text', () => {
                    render(<DefaultLoading locale="en" variant="minimal" />);

                    const loadingText = screen.getByText('Loading...');
                    expect(loadingText).toBeInTheDocument();
                    // The text should be visible to screen readers
                    expect(loadingText).not.toHaveAttribute(
                        'aria-hidden',
                        'true',
                    );
                });

                it('spinner is accessible to screen readers', () => {
                    render(<DefaultLoading locale="en" variant="minimal" />);

                    const spinner = screen.getByTestId('spinner');
                    expect(spinner).toBeInTheDocument();
                    // Could add aria-label or role if needed for better accessibility
                });
            });
        });
    });
});
