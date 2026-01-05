import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { EmptyState } from '../lib/components/course-card/empty-state';

// Mock the translation module
vi.mock('@maany_shr/e-class-translations', () => ({
  isLocalAware: vi.fn(),
  TLocale: String,
}));

// Mock the Button component
vi.mock('../lib/components/button', () => ({
  Button: ({ text, variant, size, className, onClick }: {
    text: string;
    variant: string;
    size: string;
    className: string;
    onClick: () => void;
  }) => (
    <button
      className={`justify-center font-bold transition-colors focus:outline-none 
        ${variant === 'primary' ? 'bg-button-primary-fill text-button-primary-text hover:bg-button-primary-hover-fill' : ''} 
        ${size === 'medium' ? 'px-4 h-[2.5rem]' : ''} 
        rounded-big ${className}`}
      onClick={onClick}
      data-testid="custom-button"
    >
      {text}
    </button>
  ),
}));

describe('EmptyState', () => {
  const defaultProps = {
    message: 'No data available',
    buttonText: 'Take Action',
    onButtonClick: vi.fn(),
    locale: 'en' as 'en' | 'de',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with provided message and button text', () => {
    render(<EmptyState {...defaultProps} />);
    expect(screen.getByText('No data available')).toBeInTheDocument();
    expect(screen.getByTestId('custom-button')).toHaveTextContent('Take Action');
  });

  it('applies correct container classes', () => {
    const { container } = render(<EmptyState {...defaultProps} />);
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass(
      'flex',
      'flex-col',
      'md:p-5',
      'p-3',
      'gap-2',
      'rounded-medium',
      'border',
      'border-card-stroke',
      'bg-card-fill',
      'w-full',
      'lg:min-w-[22rem]'
    );
  });

  it('applies correct button classes', () => {
    render(<EmptyState {...defaultProps} />);
    const button = screen.getByTestId('custom-button');
    expect(button).toHaveClass(
      'justify-center',
      'font-bold',
      'transition-colors',
      'focus:outline-none',
      'bg-button-primary-fill',
      'text-button-primary-text',
      'hover:bg-button-primary-hover-fill',
      'px-4',
      'h-[2.5rem]',
      'rounded-big',
      'mt-4'
    );
  });

  it('calls onButtonClick when button is clicked', () => {
    const mockClick = vi.fn();
    render(<EmptyState {...defaultProps} onButtonClick={mockClick} />);
    const button = screen.getByTestId('custom-button');
    fireEvent.click(button);
    expect(mockClick).toHaveBeenCalledTimes(1);
  });


  it('renders with different locale', () => {
    render(
      <EmptyState
        {...defaultProps}
        locale="de"
        message="Keine Daten verfügbar"
        buttonText="Aktion ausführen"
      />
    );
    expect(screen.getByText('Keine Daten verfügbar')).toBeInTheDocument();
    expect(screen.getByTestId('custom-button')).toHaveTextContent('Aktion ausführen');
  });

  it('renders with course-specific message and button text', () => {
    render(
      <EmptyState
        {...defaultProps}
        message="No courses available"
        buttonText="Browse Courses"
      />
    );
    expect(screen.getByText('No courses available')).toBeInTheDocument();
    expect(screen.getByTestId('custom-button')).toHaveTextContent('Browse Courses');
  });

  it('renders with creator-specific message and button text', () => {
    render(
      <EmptyState
        {...defaultProps}
        message="You haven’t created any courses yet"
        buttonText="Create a Course"
      />
    );
    expect(screen.getByText('You haven’t created any courses yet')).toBeInTheDocument();
    expect(screen.getByTestId('custom-button')).toHaveTextContent('Create a Course');
  });

  it('renders with coach-specific message and button text', () => {
    render(
      <EmptyState
        {...defaultProps}
        message="You haven’t enrolled in any coaching groups yet"
        buttonText="Join a Group"
      />
    );
    expect(screen.getByText('You haven’t enrolled in any coaching groups yet')).toBeInTheDocument();
    expect(screen.getByTestId('custom-button')).toHaveTextContent('Join a Group');
  });
});