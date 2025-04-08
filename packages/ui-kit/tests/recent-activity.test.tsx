import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RecentActivity } from '../lib/components/notifications/recent-activity';
import { Activity } from '../lib/components/notifications/activity';

vi.mock('../lib/components/button', () => ({
  Button: ({ text, onClick, className, iconLeft }) => (
    <button onClick={onClick} className={className}>
      {iconLeft}
      {text}
    </button>
  ),
}));

vi.mock('../lib/components/input-field', () => ({
  InputField: ({ setValue, value, inputText, leftContent }) => (
    <div>
      {leftContent}
      <input
        placeholder={inputText}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  ),
}));

vi.mock('../lib/components/icons/icon-check-double', () => ({
  IconCheckDouble: () => <span>IconCheckDouble</span>,
}));

vi.mock('../lib/components/icons/icon-search', () => ({
  IconSearch: () => <span>IconSearch</span>,
}));

vi.mock('@maany_shr/e-class-translations', () => ({
  getDictionary: vi.fn(() => ({
    components: {
      recentActivity: {
        recentActivity: 'Recent Activity',
        markAllAsRead: 'Mark all as read',
        viewAll: 'View all',
        activityHistory: 'Activity History',
        searchText: 'Search activities...',
      },
      activity: {
        atText: 'at',
        recipientsText: '',
      },
    },
  })),
}));

describe('<RecentActivity />', () => {
  const mockChildren = [
    <Activity
      key="1"
      message="Activity 1 message"
      action={{ title: 'View', url: '/view1' }}
      timestamp="2025-03-05T11:00:00Z"
      isRead={false}
      platformName="Platform 1"
      recipients={5}
      layout="vertical"
      locale="en"
    />,
    <Activity
      key="2"
      message="Activity 2 message"
      action={{ title: 'Details', url: '/details2' }}
      timestamp="2025-03-05T10:30:00Z"
      isRead={true}
      platformName="Platform 2"
      recipients={3}
      layout="horizontal"
      locale="en"
    />,
  ];

  it('renders activities up to the specified maxActivities count', () => {
    render(
      <RecentActivity locale="en" maxActivities={1}>
        {mockChildren}
      </RecentActivity>
    );
    const activities = screen.getAllByTestId('activity');
    expect(activities).toHaveLength(1);
    expect(screen.getByText('Activity 1 message')).toBeInTheDocument();
    expect(screen.getByText('View all')).toBeInTheDocument();
  });

  it('does not render "View all" button when there are fewer activities than maxActivities', () => {
    render(
      <RecentActivity locale="en" maxActivities={3}>
        {mockChildren}
      </RecentActivity>
    );
    expect(screen.queryByText('View all')).not.toBeInTheDocument();
  });

  it('calls onClickMarkAllAsRead when "Mark all as read" button is clicked in Feed variation', () => {
    const onClickMarkAllAsRead = vi.fn();
    render(
      <RecentActivity
        locale="en"
        onClickMarkAllAsRead={onClickMarkAllAsRead}
        variation="Feed"
      >
        {mockChildren}
      </RecentActivity>
    );
    fireEvent.click(screen.getByText('Mark all as read'));
    expect(onClickMarkAllAsRead).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    const { container } = render(
      <RecentActivity locale="en" className="custom-class">
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
        onClickMarkAllAsRead={onClickMarkAllAsRead}
      >
        {mockChildren}
      </RecentActivity>
    );
    expect(screen.getByText('Recent Activity')).toBeInTheDocument();
    expect(screen.getByText('Mark all as read')).toBeInTheDocument();
  });

  it('renders variation as "Search" with search input and appropriate layout', () => {
    const onSearchQuery = vi.fn();
    render(
      <RecentActivity
        locale="en"
        variation="Search"
        onSearchQuery={onSearchQuery}
      >
        {mockChildren}
      </RecentActivity>
    );
    expect(screen.getByText('Activity History')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search activities...')).toBeInTheDocument();
  });

  it('calls onSearchQuery when search input changes', () => {
    const onSearchQuery = vi.fn();
    render(
      <RecentActivity
        locale="en"
        variation="Search"
        onSearchQuery={onSearchQuery}
      >
        {mockChildren}
      </RecentActivity>
    );
    const searchInput = screen.getByPlaceholderText('Search activities...');
    fireEvent.change(searchInput, { target: { value: 'test query' } });
    expect(onSearchQuery).toHaveBeenCalledWith('test query');
  });

  it('renders no activities when no children are provided', () => {
    render(<RecentActivity locale="en" />);
    expect(screen.queryByTestId('activity')).not.toBeInTheDocument();
  });

  it('calls onViewAll and shows all activities when "View all" button is clicked', () => {
    const onViewAll = vi.fn();
    render(
      <RecentActivity
        locale="en"
        maxActivities={1}
        onViewAll={onViewAll}
      >
        {mockChildren}
      </RecentActivity>
    );
    const activitiesBefore = screen.getAllByTestId('activity');
    expect(activitiesBefore).toHaveLength(1);
    fireEvent.click(screen.getByText('View all'));
    expect(onViewAll).toHaveBeenCalledTimes(1);
    const activitiesAfter = screen.getAllByTestId('activity');
    expect(activitiesAfter).toHaveLength(2);
  });
});