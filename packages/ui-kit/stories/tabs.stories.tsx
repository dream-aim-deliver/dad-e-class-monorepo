import { Tabs } from '../lib/components/tabs/tab';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { IconAccountInformation } from '../lib/components/icons/icon-account-information';
import { IconAssignment } from '../lib/components/icons/icon-assignment';
import { IconCertification } from '../lib/components/icons/icon-certification';

const meta: Meta<typeof Tabs.Root> = {
  title: 'Components/Tabs',
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
          icon={<IconAccountInformation size="5" />}
          value="account"
        >
          Account
        </Tabs.Trigger>
        <Tabs.Trigger icon={<IconAssignment size="5" />} value="assignments">
          Assignments
        </Tabs.Trigger>
        <Tabs.Trigger icon={<IconCertification size="5" />} value="settings">
          Settings
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="account">
        <div className="prose">
          <h4 className="text-lg font-medium mb-2">Account Settings</h4>
          <p className="text-gray-600">
            Manage your account preferences and personal information.
          </p>
        </div>
      </Tabs.Content>
      <Tabs.Content value="assignments">
        <div className="prose">
          <h4 className="text-lg font-medium mb-2">Assignments Preferences</h4>
          <p className="text-gray-600">
            Control how and when you receive assignments.
          </p>
        </div>
      </Tabs.Content>
      <Tabs.Content value="settings">
        <div className="prose">
          <h4 className="text-lg font-medium mb-2">General Settings</h4>
          <p className="text-gray-600">
            Configure your application settings and preferences.
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
