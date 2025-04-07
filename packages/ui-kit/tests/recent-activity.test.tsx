import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RecentActivity } from '../lib/components/notifications/recent-activity';
import { Activity } from '../lib/components/notifications/activity';

vi.mock('../lib/components/button', () => ({
  Button: ({ text, onClick }) => <button onClick={onClick}>{text}</button>,
}));
vi.mock('../lib/components/icons/icon-check-double', () => ({
  IconCheckDouble: () => <span>IconCheckDouble</span>,
}));
vi.mock('@maany_shr/e-class-translations', () => ({
  getDictionary: vi.fn(() => ({
    components: {
      recentActivity: {
        recentActivity: 'Recent Activity',
        markAllAsRead: 'Mark all as read',
        viewAll: 'View all',
      },
      activity: {
        atText: 'at',
        recipientsText: '',
      },
    },
  })),
}));

describe('<RecentActivity />', () => {
  const mockChildren = (
    <>
      <Activity
        message="Activity 1 message"
        action={{ title: 'View', url: '/view1' }}
        timestamp="2025-03-05T11:00:00Z"
        isRead={false}
        platformName="Platform 1"
        recipients={5}
        layout="vertical"
        locale="en"
      />
      <Activity
        message="Activity 2 message"
        action={{ title: 'Details', url: '/details2' }}
        timestamp="2025-03-05T10:30:00Z"
        isRead={true}
        platformName="Platform 2"
        recipients={3}
        layout="horizontal"
        locale="en"
      />
    </>
  );

  it('renders activities up to the specified maxActivities count', () => {
    render(
      <RecentActivity locale="en" maxActivities={1} totalActivitiesCount={2}>
        {mockChildren}
      </RecentActivity>
    );
    const activities = screen.getAllByTestId('activity'); 
    expect(activities).toHaveLength(2);
    expect(screen.getByText('Activity 1 message')).toBeInTheDocument();
    expect(screen.getByText('View all')).toBeInTheDocument();
  });

  it('does not render "View all" button when there are fewer activities than maxActivities', () => {
    render(
      <RecentActivity locale="en" maxActivities={3} totalActivitiesCount={2}>
        {mockChildren}
      </RecentActivity>
    );
    expect(screen.queryByText('View all')).not.toBeInTheDocument();
  });

  it('calls onMarkAllAsRead when "Mark all as read" button is clicked', () => {
    const onClickMarkAllAsRead = vi.fn();
    render(
      <RecentActivity
        locale="en"
        onClickMarkAllAsRead={onClickMarkAllAsRead}
        variation="Feed"
        maxActivities={2}
        totalActivitiesCount={2}
      >
        {mockChildren}
      </RecentActivity>
    );
    fireEvent.click(screen.getByText('Mark all as read'));
    expect(onClickMarkAllAsRead).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    const { container } = render(
      <RecentActivity
        locale="en"
        className="custom-class"
        maxActivities={2}
        totalActivitiesCount={2}
      >
        {mockChildren}
      </RecentActivity>
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders variation as "Feed" with appropriate layout and buttons', () => {
    const onClickMarkAllAsRead = vi.fn();
    render(
      <RecentActivity
        locale="en"
        variation="Feed"
        maxActivities={2}
        totalActivitiesCount={2}
        onClickMarkAllAsRead={onClickMarkAllAsRead}
      >
        {mockChildren}
      </RecentActivity>
    );
    expect(screen.getByText('Recent Activity')).toBeInTheDocument();
    expect(screen.getByText('Mark all as read')).toBeInTheDocument();
  });

  it('renders no activities when no children are provided', () => {
    render(<RecentActivity locale="en" maxActivities={2} totalActivitiesCount={0} />);
    expect(screen.queryByTestId('activity')).not.toBeInTheDocument();
  });

  it('calls onViewAll when "View all" button is clicked', () => {
    const onViewAll = vi.fn();
    render(
      <RecentActivity
        locale="en"
        maxActivities={1}
        totalActivitiesCount={2}
        onViewAll={onViewAll}
      >
        {mockChildren}
      </RecentActivity>
    );
    expect(screen.getAllByTestId('activity')).toHaveLength(2); // Initially 1 activity
    fireEvent.click(screen.getByText('View all'));
    expect(onViewAll).toHaveBeenCalledTimes(1);
    expect(screen.getAllByTestId('activity')).toHaveLength(2); // Now 2 activities
  });
});