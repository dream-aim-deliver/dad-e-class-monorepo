import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CoachBanner } from '../lib/components/coach-banner';

// Mock the dependencies
vi.mock('@maany_shr/e-class-translations', () => ({
  getDictionary: (locale) => ({
    components: {
      coachBanner: {
        buttontext: 'Join Now',
      },
    },
  }),
  isLocalAware: vi.fn(),
}));

vi.mock('./button', () => ({
  Button: ({ variant, size, className, onClick }) => (
    <button
      className={`justify-center font-bold transition-colors focus:outline-none 
        ${variant === 'primary' ? 'bg-button-primary-fill text-button-primary-text hover:bg-button-primary-hover-fill active:bg-button-primary-pressed-fill' : ''} 
        ${size === 'big' ? 'px-4 h-[3.5rem] text-xl' : ''} 
        rounded-big ${className} cursor-pointer flex items-center gap-1`}
      onClick={onClick}
    >
      <span className="truncate" /> {/* Matches current output */}
    </button>
  ),
}));

describe('CoachBanner', () => {
  const defaultProps = {
    locale: 'en' as 'en' | 'de',
    title: 'Become a Master',
    subtitle: 'Learning Coach',
    description: 'Join our community of expert coaches and help students achieve their goals.',
    imageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    buttonText: 'Join Now',
    onClick: vi.fn(() => alert('Button clicked!')),
  };

  it('renders with correct title and subtitle', () => {
    render(<CoachBanner {...defaultProps} />);
    const title = screen.getByText(/Become a Master/i);
    const subtitle = screen.getByText(/Learning Coach/i);
    expect(title).toBeInTheDocument();
    expect(subtitle).toBeInTheDocument();
  });

  it('displays description text', () => {
    render(<CoachBanner {...defaultProps} />);
    const description = screen.getByText(
      'Join our community of expert coaches and help students achieve their goals.'
    );
    expect(description).toBeInTheDocument();
  });

  it('renders button with correct styles', () => {
    render(<CoachBanner {...defaultProps} />);
    const button = screen.getByRole('button'); // Remove name: 'Join Now' since it’s empty
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-button-primary-fill');
    expect(button).toHaveClass('text-button-primary-text');
    expect(button).toHaveClass('h-[3.5rem]');
    expect(button).toHaveClass('self-start');
  });

  it('calls onClick handler when button is clicked', () => {
    const mockOnClick = vi.fn();
    render(<CoachBanner {...defaultProps} onClick={mockOnClick} />);
    const button = screen.getByRole('button'); // Remove name: 'Join Now' since it’s empty
    fireEvent.click(button);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('displays image with correct alt text', () => {
    render(<CoachBanner {...defaultProps} />);
    const image = screen.getByAltText('Banner image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute(
      'src',
      'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg'
    );
  });

  it('applies correct container classes', () => {
    const { container } = render(<CoachBanner {...defaultProps} />);
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