import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Activity } from '../lib/components/notifications/activity';
import { useTranslations } from 'next-intl';

vi.mock('next-intl', () => ({
  useTranslations: vi.fn(),
}));

describe('<Activity />', () => {
  const mockT = vi.fn((key: string) => key);

  beforeEach(() => {
    (useTranslations as ReturnType<typeof vi.fn>).mockReturnValue(mockT);
  });

  it('renders the activity component with default props', () => {
    render(<Activity />);
    expect(
      screen.getByText(
        /Coach {coach-name} {coach-surname} accepted your request/,
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('Session details')).toBeInTheDocument();
    expect(screen.getByText('2024-08-07 at 21:17')).toBeInTheDocument();
  });

  it('renders an empty state when isEmpty is true', () => {
    render(<Activity isEmpty />);
    expect(screen.getByTestId('skeleton-title')).toBeInTheDocument();
    expect(screen.getByTestId('skeleton-subtitle')).toBeInTheDocument();
    expect(screen.getByTestId('skeleton-button')).toBeInTheDocument();
    expect(screen.getByTestId('skeleton-icon')).toBeInTheDocument();
  });

  it('renders children when hasChildren is true', () => {
    render(
      <Activity hasChildren>
        <div data-testid="child-component">Child Content</div>
      </Activity>,
    );
    expect(screen.getByTestId('child-component')).toBeInTheDocument();
  });

  it('renders platform name when showPlatform is true', () => {
    render(<Activity showPlatform platformName="Test Platform" />);
    expect(screen.getByText('Test Platform')).toBeInTheDocument();
  });

  it('renders recipients when showRecipients is true', () => {
    render(<Activity showRecipients recipients="100 Recipients" />);
    expect(screen.getByText('100 Recipients')).toBeInTheDocument();
  });

  it('renders vertical layout when specified', () => {
    render(<Activity layout="vertical" />);
    const container = screen
      .getByText(/Coach {coach-name} {coach-surname} accepted your request/)
      .closest('div');
    expect(container);
  });

  it('calls onClick when action button is clicked', () => {
    const mockOnClick = vi.fn();
    render(<Activity onClick={mockOnClick} />);
    screen.getByText('Session details').click();
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});
