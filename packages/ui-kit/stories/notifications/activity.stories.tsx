import { Meta, StoryObj } from '@storybook/react-vite';
import { Activity } from '../../lib/components/notifications/activity';
import { NextIntlClientProvider } from 'next-intl';

const mockMessages = {};

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
    action: { control: 'object' },
    timestamp: { control: 'text' },
    isRead: { control: 'boolean' },
    children: { control: 'text' },
    platformName: { control: 'text' },
    recipients: { control: 'number' },
    layout: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
    },
    className: { control: 'text' },
    locale: {
      control: 'select',
      options: ['en', 'de'],
    },
    onClickActivity: { action: 'clicked' },
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
    action: { title: 'Session details', url: 'https://google.com' },
    timestamp: '2028-08-07T21:17:00.000Z',
    isRead: false,
    platformName: 'E-Class',
    recipients: 5,
    layout: 'horizontal',
    locale: 'en',

    onClickActivity: (url) => () =>
      alert(`Notification clicked for URL: ${url}`),
  },
};

export const ReadNotification: Story = {
  ...Template,
  args: {
    ...Default.args,
    isRead: true,
  },
};

export const VerticalLayout: Story = {
  ...Template,
  args: {
    ...Default.args,
    layout: 'vertical',
    platformName: 'Zoom',
    timestamp: '',
    recipients: 0,
  },
};

export const MultipleRecipients: Story = {
  ...Template,
  args: {
    ...Default.args,
    recipients: 20,
  },
};

export const WithChildren: Story = {
  ...Template,
  args: {
    ...Default.args,
    children: <span className="text-red-500">Additional Info</span>,
    timestamp: '2028-08-07T21:17:00.000Z',
  },
};
