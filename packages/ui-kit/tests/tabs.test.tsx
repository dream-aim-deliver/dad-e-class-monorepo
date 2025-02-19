import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Tabs } from '../lib/components/tabs/tab';

describe('<Tabs />', () => {
  const mockOnValueChange = vi.fn();

  const defaultProps = {
    defaultTab: 'tab1',
    onValueChange: mockOnValueChange,
  };

  beforeEach(() => {
    mockOnValueChange.mockClear();
  });

  it('renders the tabs with default active tab', () => {
    render(
      <Tabs.Root {...defaultProps}>
        <Tabs.List>
          <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
          <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="tab1">Content for Tab 1</Tabs.Content>
        <Tabs.Content value="tab2">Content for Tab 2</Tabs.Content>
      </Tabs.Root>,
    );

    expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Content for Tab 1');
  });

  it('renders custom class names for tabs and content', () => {
    render(
      <Tabs.Root {...defaultProps} className="custom-tabs">
        <Tabs.List className="custom-tab-list">
          <Tabs.Trigger value="tab1" className="custom-tab-trigger">
            Tab 1
          </Tabs.Trigger>
          <Tabs.Trigger value="tab2" className="custom-tab-trigger">
            Tab 2
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="tab1" className="custom-tab-content">
          Content for Tab 1
        </Tabs.Content>
      </Tabs.Root>,
    );

    expect(screen.getByRole('tablist')).toHaveClass('custom-tab-list');
    expect(screen.getByRole('tabpanel')).toHaveClass('custom-tab-content');
    expect(screen.getAllByRole('tab')[0]).toHaveClass('custom-tab-trigger');
  });

  it('handles icons in tab triggers correctly', () => {
    render(
      <Tabs.Root {...defaultProps}>
        <Tabs.List>
          <Tabs.Trigger
            value="tab1"
            icon={<span data-testid="icon-1">Icon</span>}
          >
            Tab with Icon
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="tab1">Content with Icon</Tabs.Content>
      </Tabs.Root>,
    );

    const icon = screen.getByTestId('icon-1');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveTextContent('Icon');
    expect(screen.getByText('Tab with Icon')).toBeInTheDocument();
  });
});
