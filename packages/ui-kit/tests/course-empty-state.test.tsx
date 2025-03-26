import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { EmptyState, CourseEmptyState } from '../lib/components/coursecard/course-empty-state'; // Adjust the import path

// Mock the dependencies
vi.mock('@maany_shr/e-class-translations', () => ({
  getDictionary: (locale: string) => ({
    components: {
      courseCard: {
        courseEmptyState: {
          message: 'You haven’t enrolled in any courses yet',
          buttonText: 'Browse Courses',
        },
      },
    },
  }),
  isLocalAware: vi.fn(),
}));

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
    >
      {text}
    </button>
  ),
}));

describe('EmptyState', () => {
  it('renders with provided message and button text', () => {
    const handleClick = vi.fn(); // Use a mock function instead of empty arrow
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

  it('applies correct container classes', () => {
    const handleClick = vi.fn(); // Use a mock function instead of empty arrow
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
      'border-card-stroke'
    );
  });

  it('calls onButtonClick when button is clicked', async () => {
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
    await button.click();
    expect(mockClick).toHaveBeenCalledTimes(1);
  });

  it('applies correct button styling', () => {
    const handleClick = vi.fn(); // Use a mock function instead of empty arrow
    render(
      <EmptyState
        message="Test message"
        buttonText="Action"
        onButtonClick={handleClick}
        locale="en"
      />
    );
    const button = screen.getByRole('button', { name: 'Action' });
    expect(button).toHaveClass('bg-button-primary-fill');
    expect(button).toHaveClass('text-button-primary-text');
    expect(button).toHaveClass('mt-4');
  });
});

describe('CourseEmptyState', () => {
  it('renders with dictionary-translated text', () => {
    render(<CourseEmptyState locale="en" />);
    expect(screen.getByText('You haven’t enrolled in any courses yet')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Browse Courses' })).toBeInTheDocument();
  });

  it('logs to console when button is clicked', async () => {
    const consoleSpy = vi.spyOn(console, 'log');
    render(<CourseEmptyState locale="en" />);
    const button = screen.getByRole('button', { name: 'Browse Courses' });
    await button.click();
    expect(consoleSpy).toHaveBeenCalledWith('Browse courses');
    consoleSpy.mockRestore();
  });

  it('passes locale prop to EmptyState', () => {
    const { container } = render(<CourseEmptyState locale="en" />);
    expect(container.querySelector('.text-white')?.textContent).toBe(
      'You haven’t enrolled in any courses yet'
    );
  });
});