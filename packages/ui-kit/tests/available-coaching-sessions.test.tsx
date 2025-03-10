import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AvailableCoachingSessions } from '../lib/components/available-coaching-sessions/available-coaching-sessions';

// Mock the dependencies
vi.mock('@maany_shr/e-class-translations', () => ({
  getDictionary: (locale: string) => ({
    components: {
      availableCoachingSessions: {
        title: 'Available Coaching Sessions',
        buyMoreSessions: 'Buy More Sessions',
      },
    },
  }),
  isLocalAware: vi.fn(),
}));

vi.mock('../lib/components/button', () => ({
  Button: ({ text, className }: { text: string; className: string }) => (
    <button className={`justify-center font-bold transition-colors focus:outline-none ${className}`}>
      {text}
    </button>
  ),
}));

vi.mock('../lib/components/available-coaching-sessions/drag-drop-session', () => ({
  DragDropSession: ({ title, duration, isMoreThan1Available, isEmpty }: {
    title?: string;
    duration?: string;
    isMoreThan1Available?: boolean;
    isEmpty?: 'default' | 'empty';
  }) => (
    <div>
      <span>{title}</span>
      <span>{duration}</span>
      <span>{isMoreThan1Available ? 'Multiple Available' : 'Single Available'}</span>
      <span>{isEmpty}</span>
    </div>
  ),
}));

describe('AvailableCoachingSessions', () => {
  it('renders the title from dictionary', () => {
    render(<AvailableCoachingSessions locale="en" />);
    expect(screen.getByText('Available Coaching Sessions')).toBeInTheDocument();
  });

  it('renders custom text when provided', () => {
    render(<AvailableCoachingSessions locale="en" text="Custom description" />);
    expect(screen.getByText('Custom description')).toBeInTheDocument();
  });

  it('renders default coaching session data when none provided', () => {
    render(<AvailableCoachingSessions locale="en" />);
  });

  it('renders provided coaching session data', () => {
    const customData = [
      { title: 'Custom Session', duration: '45 minutes', isMoreThan1Available: true },
    ];
    render(<AvailableCoachingSessions locale="en" availableCoachingSessionsData={customData} />);
    expect(screen.getByText('Custom Session')).toBeInTheDocument();
    expect(screen.getByText('45 minutes')).toBeInTheDocument();
    expect(screen.getByText('Multiple Available')).toBeInTheDocument();
    // Ensure default data is not present
    expect(screen.queryByText('Quick sprint')).not.toBeInTheDocument();
  });

  it('applies isEmpty prop to DragDropSession components', () => {
    render(<AvailableCoachingSessions locale="en" isEmpty="empty" />);
  });

  it('renders Buy More Sessions button with correct text and class', () => {
    render(<AvailableCoachingSessions locale="en" />);
    const button = screen.getByRole('button', { name: 'Buy More Sessions' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('w-full');
  });

  it('applies correct container classes', () => {
    const { container } = render(<AvailableCoachingSessions locale="en" />);
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass(
      'flex',
      'flex-col',
      'items-start',
      'p-4',
      'gap-[0.875rem]',
      'bg-card-fill',
      'rounded-medium',
      'h-fit'
    );
  });
});