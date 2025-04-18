import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { EmptyState, CourseEmptyState } from '../lib/components/coursecard/course-empty-state';

// Mock the translation dictionary
vi.mock('@maany_shr/e-class-translations', () => ({
  getDictionary: (locale: string) => ({
    components: {
      courseCard: {
        courseEmptyState: {
          message: `No courses available (${locale})`,
          message2: `Create a course (${locale})`,
          buttonText: `Browse Courses (${locale})`,
        },
      },
    },
  }),
  isLocalAware: vi.fn(),
}));

// Mock the Button component
vi.mock('../button', () => ({
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
  it('renders with provided message and button text', () => {
    const handleClick = vi.fn();
    render(
      <EmptyState
        message="No data available"
        buttonText="Try Again"
        onButtonClick={handleClick}
        locale="en"
      />
    );
    expect(screen.getByText('No data available')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Try Again' })).toBeInTheDocument();
  });

  it('does not render button when buttonText or onButtonClick is missing', () => {
    render(<EmptyState message="No data available" locale="en" />);
    expect(screen.getByText('No data available')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('applies correct container classes', () => {
    const handleClick = vi.fn();
    const { container } = render(
      <EmptyState
        message="No data"
        buttonText="Refresh"
        onButtonClick={handleClick}
        locale="en"
      />
    );
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass(
      'flex',
      'justify-center',
      'items-center',
      'w-full',
      'p-10',
      'rounded-2xl',
      'border',
      'border-solid',
      'bg-card-fill',
      'border-card-stroke',
      'max-md:px-5'
    );
  });

  it('calls onButtonClick when button is clicked', () => {
    const mockClick = vi.fn();
    render(
      <EmptyState
        message="Test message"
        buttonText="Click Me"
        onButtonClick={mockClick}
        locale="en"
      />
    );
    const button = screen.getByRole('button', { name: 'Click Me' });
    fireEvent.click(button);
    expect(mockClick).toHaveBeenCalledTimes(1);
  });


  it('does not render message when not provided', () => {
    render(<EmptyState locale="en" />);
    expect(screen.queryByText(/.+/)).not.toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});

describe('CourseEmptyState', () => {
  it.each([
    ['student', 'No courses available (en)', true],
    ['visitor', 'No courses available (en)', true],
    ['creator', 'Create a course (en)', false],
    ['coach', 'Create a course (en)', false],
  ])('renders correct message for %s context and shows button: %s', (context, expectedMessage, showButton) => {
    const handleClick = vi.fn();
    render(
      <CourseEmptyState
        locale="en"
        context={context as any}
        onButtonClick={handleClick}
      />
    );
    expect(screen.getByText(expectedMessage)).toBeInTheDocument();
    if (showButton) {
      expect(screen.getByRole('button', { name: `Browse Courses (en)` })).toBeInTheDocument();
    } else {
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    }
  });

  it('calls onButtonClick for student context when button is clicked', () => {
    const mockClick = vi.fn();
    render(
      <CourseEmptyState
        locale="en"
        context="student"
        onButtonClick={mockClick}
      />
    );
    const button = screen.getByRole('button', { name: 'Browse Courses (en)' });
    fireEvent.click(button);
    expect(mockClick).toHaveBeenCalledTimes(1);
  });

  it('does not render button for creator when onButtonClick is provided', () => {
    const mockClick = vi.fn();
    render(
      <CourseEmptyState
        locale="en"
        context="creator"
        onButtonClick={mockClick}
      />
    );
    expect(screen.getByText('Create a course (en)')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('handles different locales with button when onButtonClick is provided', () => {
    const handleClick = vi.fn();
    render(
      <CourseEmptyState
        locale="de"
        context="student"
        onButtonClick={handleClick}
      />
    );
    expect(screen.getByText('No courses available (de)')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Browse Courses (de)' })).toBeInTheDocument();
  });

  it('renders default message for undefined context', () => {
    render(<CourseEmptyState locale="en" />);
    expect(screen.getByText('No courses available (en)')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});