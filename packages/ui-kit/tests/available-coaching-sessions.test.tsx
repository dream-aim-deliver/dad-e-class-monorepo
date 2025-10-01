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
    <button
      className={`justify-center font-bold transition-colors focus:outline-none ${className}`}
    >
      {text}
    </button>
  ),
}));

vi.mock('../lib/components/available-coaching-sessions/available-coaching-session-card', () => ({
  AvailableCoachingSessionCard: ({
    title,
    time,
    durationMinutes,
    numberOfSessions,
  }: {
    title?: string;
    time?: number;
    durationMinutes?: string;
    numberOfSessions?: number;
  }) => (
    <div className="flex gap-2 p-2 items-center justify-between bg-card-stroke border border-divider rounded-medium w-full">
      <div className="flex flex-col gap-1 items-start">
        <p className="text-sm text-text-primary font-bold leading-[100%]">
          {title}
        </p>
        <p className="text-sm text-text-secondary leading-[100%]">
          {time} {durationMinutes}
        </p>
      </div>
      {numberOfSessions && numberOfSessions > 1 && (
        <span className="gap-1 inline-flex font-bold transition-colors bg-base-neutral-400 text-text-primary-inverted rounded-small h-[1.5rem] min-w-[2.0625rem] px-0 py-1 items-center justify-center text-sm leading-[100%]" role="badge">
          <span className="truncate">x{numberOfSessions}</span>
        </span>
      )}
    </div>
  ),
}));

describe('AvailableCoachingSessions', () => {
  it('renders the title from dictionary', () => {
    render(<AvailableCoachingSessions locale="en" availableCoachingSessionsData={[]} onClickBuyMoreSessions={function (): void {
      throw new Error('Function not implemented.');
    } } />);
    expect(screen.getByText('Available Coaching Sessions')).toBeInTheDocument();
  });

  it('renders default coaching session data when none provided', () => {
    render(<AvailableCoachingSessions locale="en" availableCoachingSessionsData={[]} onClickBuyMoreSessions={function (): void {
      throw new Error('Function not implemented.');
    } } />);
  });

  it('renders provided coaching session data', () => {
    const customData = [
      {
        title: 'Custom Session',
        time: 45,
        numberOfSessions: 2,
      },
    ];
    render(
      <AvailableCoachingSessions
        locale="en"
        availableCoachingSessionsData={customData} onClickBuyMoreSessions={function (): void {
          throw new Error('Function not implemented.');
        } }      />,
    );
    expect(screen.getByText('Custom Session')).toBeInTheDocument();
    expect(screen.getByText('x2')).toBeInTheDocument();
    // Ensure default data is not present
    expect(screen.queryByText('Quick sprint')).not.toBeInTheDocument();
  });

  it('renders Buy More Sessions button with correct text and class', () => {
    render(<AvailableCoachingSessions locale="en" availableCoachingSessionsData={[]} onClickBuyMoreSessions={function (): void {
      throw new Error('Function not implemented.');
    } } />);
    const button = screen.getByRole('button', { name: 'Buy More Sessions' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('w-full');
  });

  it('applies correct container classes', () => {
    const { container } = render(
      <AvailableCoachingSessions
        locale="en"
        availableCoachingSessionsData={[]}
        onClickBuyMoreSessions={vi.fn()}
      />
    );
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass(
      'flex',
      'flex-col',
      'items-start',
      'p-4',
      'gap-[0.875rem]',
      'bg-card-fill',
      'rounded-medium',
      'h-fit',
    );
  });
});
