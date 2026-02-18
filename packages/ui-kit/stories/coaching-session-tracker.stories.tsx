import type { Meta, StoryObj } from '@storybook/react-vite';
import { CoachingSessionTracker } from '../lib/components/coaching-session-tracker/coaching-session-tracker';
import { CoachingSessionItem } from '../lib/components/coaching-session-tracker/coaching-session-item';

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
    <CoachingSessionTracker {...args} onClickBuySessions={() => alert('Buy more coaching sessions')}>
      {coachingSessions.map((session, index) => (
        <CoachingSessionItem
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
    <CoachingSessionTracker {...args} onClickBuySessions={() => alert('Buy coaching sessions')}>
      {/* No CoachingSessionCard components */}
    </CoachingSessionTracker>
  ),
  args: {
    locale: 'en',
  },
};

export const GermanLocale: Story = {
  render: (args) => (
    <CoachingSessionTracker {...args} onClickBuySessions={() => alert('Buy more coaching sessions')}>
      {coachingSessions.map((session, index) => (
        <CoachingSessionItem
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

export const ManySessions: Story = {
  render: (args) => {
    const manySessions = [
      { title: 'Quick Sprint', duration: 20, used: 0, included: 3 },
      { title: 'Normal Sprint', duration: 30, used: 1, included: 2 },
      { title: 'Full Immersion', duration: 60, used: 0, included: 1 },
      { title: 'Power Hour for Advanced Productivity Techniques', duration: 60, used: 2, included: 4 },
      { title: 'Deep Dive into Strategic Planning and Execution', duration: 90, used: 1, included: 2 },
      { title: 'Mini Session on Time Management Essentials', duration: 15, used: 0, included: 5 },
      { title: 'Comprehensive Strategy Call for Long-Term Goals', duration: 45, used: 3, included: 3 },
      { title: 'Thorough Review Session Covering Key Deliverables', duration: 30, used: 2, included: 2 },
      { title: 'Detailed Follow-Up on Previous Action Items', duration: 20, used: 1, included: 1 },
    ];
    return (
      <CoachingSessionTracker {...args} onClickBuySessions={() => alert('Buy more coaching sessions')}>
        {manySessions.map((session, index) => (
          <CoachingSessionItem
            key={index}
            title={session.title}
            duration={session.duration}
            used={session.used}
            included={session.included}
            locale={args.locale}
          />
        ))}
      </CoachingSessionTracker>
    );
  },
  args: {
    locale: 'en',
  },
};
