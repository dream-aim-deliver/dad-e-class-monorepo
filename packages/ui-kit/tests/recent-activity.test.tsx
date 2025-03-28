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
  Activity: ({ message }) => <div data-testid="activity">{message}</div>,
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

describe('<RecentActivity />', () => {
  const mockActivities: ActivityProps[] = [
    {
      message: 'Activity 1 message',
      action: { title: 'View' },
      timestamp: '2025-03-05T11:00:00Z',
      isRead: false,
      platformName: 'Platform 1',
      recipients: 5,
      layout: 'vertical',
      locale: 'en'
    },
    {
      message: 'Activity 2 message',
      action: { title: 'Details' },
      timestamp: '2025-03-05T10:30:00Z',
      isRead: true,
      platformName: 'Platform 2',
      recipients: 3,
      layout: 'horizontal',
      locale: 'en'
    },
  ];

  it('renders activities up to the specified maxActivities count', () => {
    render(
      <RecentActivity
        locale="en"
        activities={mockActivities}
        maxActivities={1}
      />
    );
    expect(screen.getAllByTestId('activity')).toHaveLength(1);
    expect(screen.getByText('Activity 1 message')).toBeInTheDocument();
    expect(screen.queryByText('Activity 2 message')).not.toBeInTheDocument();
  });

  it('does not render "View all" button when there are fewer activities than maxActivities', () => {
    render(
      <RecentActivity
        locale="en"
        activities={mockActivities}
        maxActivities={3}
      />
    );
    expect(screen.queryByText('View all')).not.toBeInTheDocument();
  });

  it('calls onMarkAllAsRead when "Mark all as read" button is clicked', () => {
    const onMarkAllAsRead = vi.fn();
    render(
      <RecentActivity
        locale="en"
        activities={mockActivities}
        onClickMarkAllAsRead={onMarkAllAsRead}
        variation="Feed"
      />
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
      />
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders variation as "Feed" with appropriate layout and buttons', () => {
    render(
      <RecentActivity
        locale="en"
        activities={mockActivities}
        variation="Feed"
      />
    );
    expect(screen.getByText('Recent Activity')).toBeInTheDocument();
    expect(screen.getByText('Mark all as read')).toBeInTheDocument();
  });

  it('renders skeletons when no activities are provided', () => {
    render(<RecentActivity locale="en" />);
    expect(screen.queryByTestId('activity')).not.toBeInTheDocument();
  });
});
