// tests/activity.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Activity, ActivityProps } from '../lib/components/notifications/activity';

describe('<Activity />', () => {
  const defaultProps: ActivityProps = {
    message: 'Coach John Doe accepted your request',
    action: { title: 'Session details' },
    timestamp: '2024-08-07T21:17:00Z',
    isRead: false,
    layout: 'horizontal',
    locale: 'en',
  };

  it('renders the activity component with default props', () => {
    render(<Activity {...defaultProps} />);

    expect(screen.getByText('Coach John Doe accepted your request')).toBeInTheDocument();
    expect(screen.getByText('Session details')).toBeInTheDocument();
  });

  it('renders vertical layout when specified', () => {
    render(<Activity {...defaultProps} layout="vertical" />);

    const container = screen.getByText('Coach John Doe accepted your request').parentElement?.parentElement;
    expect(container).toHaveClass('flex-col');
    expect(container).toHaveClass('items-start');
  });

  it('renders with isRead true and no check icon', () => {
    render(<Activity {...defaultProps} isRead={true} />);

    expect(screen.getByText('Coach John Doe accepted your request')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /check/i })).not.toBeInTheDocument();
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
});
