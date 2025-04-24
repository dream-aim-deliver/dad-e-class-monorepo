import type { Meta, StoryObj } from '@storybook/react';
import { CoachingSessionTracker } from '../lib/components/coaching-session-tracker/coaching-session-tracker';
import { CoachingSessionCard } from '../lib/components/coaching-session-tracker/coaching-session-card';

const meta: Meta<typeof CoachingSessionTracker> = {
  title: 'Components/CoachingSessionTracker',
  component: CoachingSessionTracker,
  tags: ['autodocs'],
  argTypes: {
    locale: {
      control: 'select',
      options: ['en', 'de'],
      description: 'Locale for translation (e.g., "en" for English, "de" for German)',
      defaultValue: 'en',
    },
    children: {
      control: false,
      description: 'CoachingSessionCard components to display within the tracker.',
    },
  },
};

export default meta;

type Story = StoryObj<typeof CoachingSessionTracker>;

const coachingSessions = [
  {
    title: 'Quick sprint',
    duration: 20,
    used: 0,
    included: 3,
  },
  {
    title: 'Normal Sprint',
    duration: 30,
    used: 1,
    included: 2,
  },
  {
    title: 'Full Immersion',
    duration: 60,
    used: 0,
    included: 1,
  }
];

export const Default: Story = {
  render: (args) => (
    <CoachingSessionTracker {...args} onClickByMoreSessions={() => alert('Buy more coaching sessions')}>
      {coachingSessions.map((session, index) => (
        <CoachingSessionCard
          key={index}
          title={session.title}
          duration={session.duration}
          used={session.used}
          included={session.included}
          locale={args.locale}
        />
      ))}
    </CoachingSessionTracker>
  ),
  args: {
    locale: 'en',
  },
};

export const EmptyState: Story = {
  render: (args) => (
    <CoachingSessionTracker {...args} onClickByMoreSessions={() => alert('Buy more coaching sessions')}>
      {/* No CoachingSessionCard components */}
    </CoachingSessionTracker>
  ),
  args: {
    locale: 'en',
  },
};

export const GermanLocale: Story = {
  render: (args) => (
    <CoachingSessionTracker {...args} onClickByMoreSessions={() => alert('Buy more coaching sessions')}>
      {coachingSessions.map((session, index) => (
        <CoachingSessionCard
          key={index}
          title={session.title}
          duration={session.duration}
          used={session.used}
          included={session.included}
          locale={args.locale}
        />
      ))}
    </CoachingSessionTracker>
  ),
  args: {
    locale: 'de',
  },
};
