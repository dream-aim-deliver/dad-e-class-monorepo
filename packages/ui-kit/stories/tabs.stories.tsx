
import { Tabs } from '@/components/Tabs/Tab';
import type { Meta, StoryObj } from '@storybook/react';
import { User, Bell, Settings } from "lucide-react"


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
    <div className="theme-orange overflow-auto">
      <Tabs.Root className=' ' defaultTab="account">
        <Tabs.List variant='small'
          className='flex overflow-auto bg-[#292524]  rounded-smallrad  gap-2'>
          <Tabs.Trigger icon={<User className="w-4 h-4 mr-2" />} className='' value="account">

            Account
          </Tabs.Trigger>
          <Tabs.Trigger icon={<Bell className="w-4 h-4 mr-2 " />} value="notifications">

            Notifications
          </Tabs.Trigger>
          <Tabs.Trigger icon={<Settings className="w-4 h-4 mr-2" />} value="settings">

            Settings
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="account">
          <div className="prose">
            <h4 className="text-lg font-medium mb-2">Account Settings</h4>
            <p className="text-gray-600">Manage your account preferences and personal information.</p>
          </div>
        </Tabs.Content>
        <Tabs.Content value="notifications">
          <div className="prose">
            <h4 className="text-lg font-medium mb-2">Notification Preferences</h4>
            <p className="text-gray-600">Control how and when you receive notifications.</p>
          </div>
        </Tabs.Content>
        <Tabs.Content value="settings">
          <div className="prose">
            <h4 className="text-lg font-medium mb-2">General Settings</h4>
            <p className="text-gray-600">Configure your application settings and preferences.</p>
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  ),
};


