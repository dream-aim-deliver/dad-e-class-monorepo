import { Tabs } from '../lib/components/tabs/tab';
import type { Meta, StoryObj } from '@storybook/react';
import { User, Bell, Settings } from 'lucide-react';
import React from 'react';
import { IconAccountInformation } from '../lib/components/icons/icon-account-information';
import { IconAssignmnet } from '../lib/components/icons/icon-assignment';
import { IconCertification } from '../lib/components/icons/icon-certification';

const meta = {
  title: 'Components/Tabs',
  component: Tabs.Root,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Tabs.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Story = {
  render: () => (
    <div className="overflow-auto">
      <Tabs.Root className=" " defaultTab="account">
        <Tabs.List
          variant="small"
          className="flex overflow-auto bg-base-neutral-800  rounded-medium  gap-2"
        >
          <Tabs.Trigger
            icon={<IconAccountInformation size="5" />}
            className=""
            value="account"
          >
            Account
          </Tabs.Trigger>
          <Tabs.Trigger icon={<IconAssignmnet size="5" />} value="assignments">
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
            <h4 className="text-lg font-medium mb-2">
              Assignments Preferences
            </h4>
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
  ),
};
