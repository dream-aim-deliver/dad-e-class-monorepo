// tests/activity.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Activity, ActivityProps } from '../lib/components/notifications/activity';

describe('<Activity />', () => {
  const defaultProps: ActivityProps = {
    message: 'Coach John Doe accepted your request',
    actionButton: 'Session details',
    dateTime: '2024-08-07 at 21:17',
    isRead: false,
    isEmpty: false,
    hasChildren: false,
    showPlatform: false,
    showRecipients: false,
    layout: 'horizontal',
  };

  it('renders the activity component with default props', () => {
    render(<Activity {...defaultProps} />);

    expect(screen.getByText('Coach John Doe accepted your request')).toBeInTheDocument();
    expect(screen.getByText('Session details')).toBeInTheDocument();
    expect(screen.getByText('2024-08-07 at 21:17')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /session details/i })).toBeInTheDocument();
  });

  it('renders vertical layout when specified', () => {
    render(<Activity {...defaultProps} layout="vertical" />);
    
    const container = screen.getByText('Coach John Doe accepted your request').parentElement?.parentElement;
    expect(container).toHaveClass('flex-col');
    expect(container).toHaveClass('items-start');
  });

  it('calls onClick when action button is clicked', () => {
    const mockOnClick = vi.fn();
    render(<Activity {...defaultProps} onClick={mockOnClick} />);
    
    const actionButton = screen.getByRole('button', { name: 'Session details' });
    fireEvent.click(actionButton);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('renders with isRead true and no check icon', () => {
    render(<Activity {...defaultProps} isRead={true} />);
    
    expect(screen.getByText('Coach John Doe accepted your request')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /check/i })).not.toBeInTheDocument();
  });

  it('renders children when hasChildren is true', () => {
    const childContent = 'Child content';
    render(
      <Activity {...defaultProps} hasChildren={true}>
        <span>{childContent}</span>
      </Activity>
    );
    
    expect(screen.getByText(childContent)).toBeInTheDocument();
  });

  it('shows platform and recipients when enabled', () => {
    render(
      <Activity 
        {...defaultProps} 
        showPlatform={true} 
        platformName="Zoom" 
        showRecipients={true} 
        recipients="5 recipients" 
      />
    );
    
    expect(screen.getByText('Zoom')).toBeInTheDocument();
    expect(screen.getByText('5 recipients')).toBeInTheDocument();
  });
});