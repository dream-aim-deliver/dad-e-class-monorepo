import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RecentActivity } from '../lib/components/notifications/recent-activity';
import { ActivityProps } from '../lib/components/notifications/activity';

vi.mock('../button', () => ({
  Button: ({ text, onClick }) => <button onClick={onClick}>{text}</button>,
}));
vi.mock('../icons/icon-check-double', () => ({
  IconCheckDouble: () => <span>IconCheckDouble</span>,
}));
vi.mock('./activity', () => ({
  Activity: ({ layout, ...props }) => (
    <div data-testid="activity">{JSON.stringify(props)}</div>
  ),
}));
vi.mock('@maany_shr/e-class-translations', () => ({
  getDictionary: vi.fn(() => ({
    components: {
      recentActivity: {
        recentActivity: 'Recent Activity',
        markAllAsRead: 'Mark all as read',
        viewAll: 'View all',
      },
    },
  })),
}));

describe('RecentActivity', () => {
  const mockActivities: ActivityProps[] = [
    {
      message: 'Activity 1 message',
      actionButton: 'View',
      dateTime: '2025-03-05 11:00',
      isRead: false,
      isEmpty: false,
      showPlatform: true,
      platformName: 'Platform 1',
      showRecipients: true,
      recipients: '5 Recipients',
      layout: 'vertical',
    },
    {
      message: 'Activity 2 message',
      actionButton: 'Details',
      dateTime: '2025-03-05 10:30',
      isRead: true,
      isEmpty: false,
      showPlatform: true,
      platformName: 'Platform 2',
      showRecipients: true,
      recipients: '3 Recipients',
      layout: 'vertical',
    },
  ];

  it('renders the component with correct title', () => {
    render(<RecentActivity locale="en" activities={mockActivities} />);
    expect(screen.getByText('Recent Activity')).toBeInTheDocument();
  });

  it('does not render "View all" button when there are fewer activities than maxActivities', () => {
    render(
      <RecentActivity
        locale="en"
        activities={mockActivities.slice(0, 2)}
        maxActivities={3}
      />,
    );
    expect(screen.queryByText('View all')).not.toBeInTheDocument();
  });

  it('calls onMarkAllAsRead when "Mark all as read" button is clicked', () => {
    const onMarkAllAsRead = vi.fn();
    render(
      <RecentActivity
        locale="en"
        activities={mockActivities}
        onMarkAllAsRead={onMarkAllAsRead}
      />,
    );
    fireEvent.click(screen.getByText('Mark all as read'));
    expect(onMarkAllAsRead).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    const { container } = render(
      <RecentActivity
        locale="en"
        activities={mockActivities}
        className="custom-class"
      />,
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
