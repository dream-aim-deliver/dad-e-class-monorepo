import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CoachingSessionTracker } from '../lib/components/coaching-session-tracker/coaching-session-tracker';
import { CoachingSessionItem } from '../lib/components/coaching-session-tracker/coaching-session-item';

// Mock the dependencies
vi.mock('@maany_shr/e-class-translations', () => ({
  getDictionary: (locale: string) => ({
    components: {
      coachingSessionTracker: {
        noSessionsText: 'No sessions available',
      },
    },
  }),
  isLocalAware: vi.fn(),
}));

describe('CoachingSessionTracker', () => {
  const defaultProps = {
    locale: 'en' as 'en' | 'de',
    children: [<CoachingSessionItem key="1" title="Test Session" duration={30} used={1} included={5} locale="en" />],
    onClickBuyMoreSessions: vi.fn(),
  };

  it('renders children components', () => {
    render(<CoachingSessionTracker {...defaultProps} />);

    expect(screen.getByText('Test Session')).toBeInTheDocument();
  });

  it('applies correct container classes', () => {
    const { container } = render(<CoachingSessionTracker {...defaultProps} />);

    const trackerDiv = container.firstChild;
    expect(trackerDiv).toHaveClass('flex', 'flex-col', 'gap-4');
  });

  it('renders children wrapper with correct classes', () => {
    const { container } = render(<CoachingSessionTracker {...defaultProps} />);

    const childrenWrapper = container.querySelector('.flex-wrap');
    expect(childrenWrapper).toHaveClass('flex', 'gap-2', 'flex-wrap');
  });
});
