import { Meta, StoryObj } from '@storybook/react-vite';
import { GroupCoachingSessionBanner } from '../lib/components/group-coaching-session-banner';

const meta: Meta<typeof GroupCoachingSessionBanner> = {
  title: 'Components/GroupCoachingSessionBanner',
  component: GroupCoachingSessionBanner,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div style={{ minWidth: '800px' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    title: {
      description: 'The title of the coaching session',
      control: 'text',
    },
    date: {
      description: 'The date of the coaching session',
      control: 'date',
    },
    time: {
      description: 'The time of the coaching session',
      control: 'text',
    },
    durationMinutes: {
      description: 'The duration of the session in minutes',
      control: 'number',
    },
    locale: {
      description: 'The locale for translation and localization purposes',
      control: 'select',
      options: ['en', 'de'],
    },
  },
} satisfies Meta<typeof GroupCoachingSessionBanner>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Advanced Cricket Techniques Workshop',
    date: new Date('2024-12-15T10:00:00Z'),
    time: '10:00 AM',
    durationMinutes: 90,
    locale: 'en',
  },
};

export const ShortSession: Story = {
  args: {
    title: 'Quick Batting Tips',
    date: new Date('2024-12-20T14:30:00Z'),
    time: '2:30 PM',
    durationMinutes: 30,
    locale: 'en',
  },
};

export const LongSession: Story = {
  args: {
    title: 'Complete Cricket Training - Full Day Workshop',
    date: new Date('2024-12-25T09:00:00Z'),
    time: '9:00 AM',
    durationMinutes: 240,
    locale: 'en',
  },
};

export const German: Story = {
  args: {
    title: 'Fortgeschrittene Cricket-Techniken Workshop',
    date: new Date('2024-12-15T10:00:00Z'),
    time: '10:00 Uhr',
    durationMinutes: 90,
    locale: 'de',
  },
};
