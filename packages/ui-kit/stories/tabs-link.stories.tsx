import { Tabs } from '../lib/components/tabs/tab';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Tabs.Root> = {
  title: 'Components/Tabs/Link',
  component: Tabs.Root,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Tabs.Root>;

const Template = (args: any) => (
  <div className="overflow-auto">
    <Tabs.Root defaultTab="account">
      <Tabs.List
        variant={args.variant}
        className="flex overflow-auto bg-base-neutral-800 rounded-medium gap-2"
      >
        <Tabs.Trigger
          value="upcoming"
        >
          Upcoming
        </Tabs.Trigger>
        <Tabs.Trigger value="ended">
          Ended
        </Tabs.Trigger>
        <Tabs.Trigger  value="available">
          Available
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="upcoming">
        <div className="prose">
          <h4 className="text-lg font-medium mb-2">Upcoming Coching Sessions</h4>
          <p className="text-gray-600">
            View and manage your upcoming coaching sessions.
          </p>
        </div>
      </Tabs.Content>
      <Tabs.Content value="ended">
        <div className="prose">
          <h4 className="text-lg font-medium mb-2">Ended Coaching Sessions</h4>
          <p className="text-gray-600">
            View and manage your ended coaching sessions.
          </p>
        </div>
      </Tabs.Content>
      <Tabs.Content value="available">
        <div className="prose">
          <h4 className="text-lg font-medium mb-2">Available Coaching Sessions</h4>
          <p className="text-gray-600">
            View and manage your available coaching sessions.
          </p>
        </div>
      </Tabs.Content>
    </Tabs.Root>
  </div>
);

export const Default: Story = {
  render: Template,
  args: {
    variant: 'default',
  },
};

export const Small: Story = {
  render: Template,
  args: {
    variant: 'small',
  },
};
