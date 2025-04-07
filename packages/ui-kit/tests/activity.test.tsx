import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Activity, ActivityProps } from '../lib/components/notifications/activity';

describe('<Activity />', () => {
  const defaultProps: ActivityProps = {
    message: 'Coach John Doe accepted your request',
    action: { title: 'Session details', url: '/session' },
    timestamp: '2024-08-07T21:17:00Z',
    isRead: false,
    layout: 'horizontal',
    locale: 'en',
  };

  it('renders the activity component with default props', () => {
    render(<Activity {...defaultProps} />);

    expect(screen.getByText('Coach John Doe accepted your request')).toBeInTheDocument();
    expect(screen.getByText('Session details')).toBeInTheDocument();
    expect(screen.getByText(/2024-08-07/)).toBeInTheDocument(); // Check timestamp
  });

  it('renders vertical layout when specified', () => {
    render(<Activity {...defaultProps} layout="vertical" />);

    const container = screen.getByText('Coach John Doe accepted your request').parentElement?.parentElement;
    expect(container).toHaveClass('flex-col');
    expect(container).toHaveClass('items-start');
  });

  it('renders with isRead true and no unread indicator', () => {
    render(<Activity {...defaultProps} isRead={true} />);

    expect(screen.getByText('Coach John Doe accepted your request')).toBeInTheDocument();
    // Updated: Check for absence of the unread indicator (now a span, not a button)
    expect(screen.queryByTestId('activity').querySelector('.bg-button-primary-fill')).not.toBeInTheDocument();
  });

  it('renders children when provided', () => {
    const childContent = 'Child content';
    render(
      <Activity {...defaultProps}>
        <span>{childContent}</span>
      </Activity>
    );

    expect(screen.getByText(childContent)).toBeInTheDocument();
  });

  it('shows platform and recipients when enabled', () => {
    render(
      <Activity
        {...defaultProps}
        platformName="Zoom"
        recipients={5}
      />
    );

    expect(screen.getByText('Zoom')).toBeInTheDocument();
    expect(screen.getByText(/5/i)).toBeInTheDocument();
  });

  it('renders skeletons when message is empty', () => {
    render(<Activity {...defaultProps} message="" />);

    expect(screen.getByTestId('skeleton-title')).toBeInTheDocument();
    expect(screen.getByTestId('skeleton-subtitle')).toBeInTheDocument();
  });

  it('triggers onClickActivity when clicked', () => {
    const mockOnClickActivity = vi.fn((url) => () => console.log(`Clicked: ${url}`));
    render(<Activity {...defaultProps} onClickActivity={mockOnClickActivity} />);

    const activityContainer = screen.getByTestId('activity');
    fireEvent.click(activityContainer);

    expect(mockOnClickActivity).toHaveBeenCalledWith('/session');
    expect(mockOnClickActivity.mock.results[0].value).toBeInstanceOf(Function); // Returns a function
  });

  it('does not render action button when action.title is missing', () => {
    render(<Activity {...defaultProps} action={{ url: '/session' }} />);

    expect(screen.queryByText('Session details')).not.toBeInTheDocument();
  });
});