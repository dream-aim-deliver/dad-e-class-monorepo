import { Meta, StoryObj } from '@storybook/react';
import {
  Activity,
  ActivityProps,
} from '../../lib/components/notifications/activity';
import { NextIntlClientProvider } from 'next-intl';

const mockMessages = {
  // Add any necessary mock messages for translations
};

const meta: Meta<typeof Activity> = {
  title: 'Components/Notifications/Activity',
  component: Activity,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <NextIntlClientProvider locale="en" messages={mockMessages}>
        <div className="w-full max-w-3xl">
          <Story />
        </div>
      </NextIntlClientProvider>
    ),
  ],
  argTypes: {
    message: { control: 'text' },
    actionButton: { control: 'text' },
    dateTime: { control: 'text' },
    isRead: { control: 'boolean' },
    isEmpty: { control: 'boolean' },
    hasChildren: { control: 'boolean' },
    showPlatform: { control: 'boolean' },
    platformName: { control: 'text' },
    showRecipients: { control: 'boolean' },
    recipients: { control: 'text' },
    layout: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
    },
    onClick: { action: 'clicked' },
  },
};

export default meta;

type Story = StoryObj<typeof Activity>;

const Template: Story = {
  render: (args) => <Activity {...args} />,
};

export const Default: Story = {
  ...Template,
  args: {
    message:
      'Coach John Doe accepted your request to reschedule the coaching session.',
    actionButton: 'Session details',
    dateTime: '2024-08-07 at 21:17',
    isRead: false,
    isEmpty: false,
    hasChildren: false,
    showPlatform: true,
    platformName: 'Platform Name',
    showRecipients: true,
    recipients: '88 Recipients',
    layout: 'horizontal',
  },
};

export const Vertical: Story = {
  ...Template,
  args: {
    ...Default.args,
    layout: 'vertical',
  },
};

export const Read: Story = {
  ...Template,
  args: {
    ...Default.args,
    isRead: true,
  },
};

export const Empty: Story = {
  ...Template,
  args: {
    ...Default.args,
    isEmpty: true,
  },
};

export const WithChildren: Story = {
  ...Template,
  args: {
    ...Default.args,
    hasChildren: true,
    children: (
      <div className="bg-base-neutral-700 p-2 rounded-small mt-2">
        Child content
      </div>
    ),
  },
};

export const NoPlatform: Story = {
  ...Template,
  args: {
    ...Default.args,
    showPlatform: false,
  },
};

export const NoRecipients: Story = {
  ...Template,
  args: {
    ...Default.args,
    showRecipients: false,
  },
};
