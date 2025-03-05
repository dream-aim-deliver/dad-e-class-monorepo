import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CoachBanner } from '../lib/components/coach-banner';
// Mock the dependencies
vi.mock('@maany_shr/e-class-translations', () => ({
    getDictionary: (locale: string) => ({
        components: {
            coachBanner: {
                title: 'Become a Master',
                subtitle: 'Learning Coach',
                description: 'Join our community of expert coaches and help students achieve their goals.',
                buttontext: 'Join Now',
            },
        },
    }),
    isLocalAware: vi.fn(),
}));

vi.mock('./button', () => ({
    Button: ({ text, variant, size, className }: {
        text: string;
        variant: string;
        size: string;
        className: string;
    }) => (
        <button className={`justify-center font-bold transition-colors focus:outline-none 
        ${variant === 'primary' ? 'bg-button-primary-fill text-button-primary-text hover:bg-button-primary-hover-fill active:bg-button-primary-pressed-fill' : ''} 
        ${size === 'big' ? 'px-4 h-[3.5rem] text-xl' : ''} 
        rounded-big ${className} cursor-pointer flex items-center gap-1`}>
            {text}
        </button>
    ),
}));

describe('CoachBanner', () => {
    it('renders with correct title and subtitle', () => {
        render(<CoachBanner locale="en" />);
        const title = screen.getByText(/Become a Master/i);
        const subtitle = screen.getByText(/Learning Coach/i);
        expect(title).toBeInTheDocument();
        expect(subtitle).toBeInTheDocument();
    });

    it('displays description text', () => {
        render(<CoachBanner locale="en" />);
        const description = screen.getByText(
            'Join our community of expert coaches and help students achieve their goals.'
        );
        expect(description).toBeInTheDocument();
    });

    it('renders button with correct text', () => {
        render(<CoachBanner locale="en" />);
        const button = screen.getByRole('button', { name: 'Join Now' });
        expect(button).toBeInTheDocument();
        // Check for key classes that should be present
        expect(button).toHaveClass('bg-button-primary-fill');
        expect(button).toHaveClass('text-button-primary-text');
        expect(button).toHaveClass('h-[3.5rem]');
        expect(button).toHaveClass('self-start');
    });

    it('displays image with correct alt text', () => {
        render(<CoachBanner locale="en" />);
        const image = screen.getByAltText('People working together');
        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute(
            'src',
            'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg'
        );
    });

    it('applies correct container classes', () => {
        const { container } = render(<CoachBanner locale="en" />);
        const banner = container.firstChild;
        expect(banner).toHaveClass(
            'flex',
            'flex-col',
            'items-start',
            'self-stretch',
            'max-w-7xl',
            'mx-auto',
            'py-8',
            'md:py-12',
            'px-[40px]',
            'rounded-[16px]',
            'border',
            'border-solid',
            'border-card-stroke',
            'bg-card-fill'
        );
    });
});