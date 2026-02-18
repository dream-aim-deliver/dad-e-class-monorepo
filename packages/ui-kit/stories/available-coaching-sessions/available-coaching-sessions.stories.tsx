import { Meta, StoryObj } from '@storybook/react-vite';
import {
  AvailableCoachingSessions,
  AvailableCoachingSessionsProps,
} from '../../lib/components/available-coaching-sessions/available-coaching-sessions';

const mockAvailableCoachingSessionsData: AvailableCoachingSessionsProps['availableCoachingSessionsData'] =
  [
    {
      title: 'Quick sprint',
      time: 20,
      numberOfSessions: 1,
    },
    {
      title: 'Normal Sprint',
      time: 45,
      numberOfSessions: 2,
    },
    {
      title: 'Full Immersion',
      time: 60,
      numberOfSessions: 3,
    },
  ];

const meta: Meta<typeof AvailableCoachingSessions> = {
  title: 'Components/AvailableCoachingSessions',
  component: AvailableCoachingSessions,
  tags: ['autodocs'],
  argTypes: {
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
    isLoading: {
      control: 'boolean',
      description: 'A boolean value to check if the data is loading or not.',
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
    text: 'Drag and drop a session on the calendar',
    availableCoachingSessionsData: mockAvailableCoachingSessionsData,
    locale: 'en',
    onClickBuyMoreSessions: () => alert('Buy more sessions'),
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

export const Loading: StoryObj<typeof AvailableCoachingSessions> = {
  ...Template,
  args: {
    locale: 'en',
    isLoading: true,
    availableCoachingSessionsData: mockAvailableCoachingSessionsData,
    onClickBuyMoreSessions: () => alert('Buy more sessions'),
  },
  parameters: {
    docs: {
      description: {
        story:
          'An loading view of the AvailableCoachingSessions component with a loading message.',
      },
    },
  },
};

export const Empty: StoryObj<typeof AvailableCoachingSessions> = {
  ...Template,
  args: {
    locale: 'en',
    availableCoachingSessionsData: [],
    onClickBuyMoreSessions: () => alert('Buy more sessions'),
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
    text: 'Custom sessions',
    availableCoachingSessionsData: [
      {
        title: 'Custom Sprint',
        time: 45,
        numberOfSessions: 1,
      },
      {
        title: 'Special Session',
        time: 90,
        numberOfSessions: 2,
      },
    ],
    locale: 'en',
    onClickBuyMoreSessions: () => alert('Buy more sessions'),
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

export const HideButton: StoryObj<typeof AvailableCoachingSessions> = {
  ...Template,
  args: {
    text: 'Here are your available coaching sessions.',
    availableCoachingSessionsData: [
      {
        title: 'Custom Sprint',
        time: 45,
        numberOfSessions: 1,
      },
      {
        title: 'Special Session',
        time: 90,
        numberOfSessions: 2,
      },
    ],
    locale: 'en',
    hideButton: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Component without the button',
      },
    },
  },
};
