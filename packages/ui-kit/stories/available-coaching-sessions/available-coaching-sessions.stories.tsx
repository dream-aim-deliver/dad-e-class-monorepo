import { Meta, StoryObj } from '@storybook/react';
import {
  AvailableCoachingSessions,
  AvailableCoachingSessionsProps,
} from '../../lib/components/available-coaching-sessions/available-coaching-sessions';

const mockAvailableCoachingSessionsData: AvailableCoachingSessionsProps['availableCoachingSessionsData'] =
  [
    {
      title: 'Quick sprint',
      duration: '20 minutes',
      numberofSessions: 1,
    },
    {
      title: 'Normal Sprint',
      duration: '30 minutes',
      numberofSessions: 2,
    },
    {
      title: 'Full Immersion',
      duration: '60 minutes',
      numberofSessions: 3,
    },
  ];

const meta: Meta<typeof AvailableCoachingSessions> = {
  title: 'Components/AvailableCoachingSessions',
  component: AvailableCoachingSessions,
  tags: ['autodocs'],
  argTypes: {
    isEmpty: {
      control: 'select',
      options: ['default', 'empty'],
      description:
        'Property to determine the layout and content of the component.',
    },
    text: {
      control: 'text',
      description: 'Optional text to display below the title.',
    },
    availableCoachingSessionsData: {
      control: 'object',
      description: 'Array of objects containing session data.',
      // Remove the table: { disable: true } to make it editable
    },
    locale: {
      control: 'select',
      options: ['en', 'de'],
    },
  },
};

export default meta;

const Template: StoryObj<typeof AvailableCoachingSessions> = {
  render: (args) => <AvailableCoachingSessions {...args} />,
};

export const Default: StoryObj<typeof AvailableCoachingSessions> = {
  ...Template,
  args: {
    isEmpty: 'default',
    text: 'Drag and drop a session on the calendar',
    availableCoachingSessionsData: mockAvailableCoachingSessionsData,
    locale: 'en',
  },
  parameters: {
    docs: {
      description: {
        story:
          'A default view of the AvailableCoachingSessions component with a list of sessions and a button to buy more sessions.',
      },
    },
  },
};

export const Empty: StoryObj<typeof AvailableCoachingSessions> = {
  ...Template,
  args: {
    isEmpty: 'empty',
    text: 'No sessions available',
    availableCoachingSessionsData: mockAvailableCoachingSessionsData,
    locale: 'en',
  },
  parameters: {
    docs: {
      description: {
        story:
          'An empty view of the AvailableCoachingSessions component with a message and a button to buy sessions.',
      },
    },
  },
};

export const CustomData: StoryObj<typeof AvailableCoachingSessions> = {
  ...Template,
  args: {
    isEmpty: 'default',
    text: 'Custom sessions',
    availableCoachingSessionsData: [
      {
        title: 'Custom Sprint',
        duration: '45 minutes',
        numberofSessions: 1,
      },
      {
        title: 'Special Session',
        duration: '90 minutes',
        numberofSessions: 2,
      },
    ],
    locale: 'en',
  },
  parameters: {
    docs: {
      description: {
        story:
          'A custom view of the AvailableCoachingSessions component with different session data.',
      },
    },
  },
};