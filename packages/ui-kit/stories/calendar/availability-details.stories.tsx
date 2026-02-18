import type { Meta, StoryObj } from '@storybook/react-vite';
import { AvailabilityDetails } from '../../lib/components/calendar/add-availability/availability-details';
import { TSingleAvailability, TRecurringAvailability } from '../../lib/components/calendar/add-availability/availability-manager';

const meta: Meta<typeof AvailabilityDetails> = {
  title: 'Components/AvailabilityManager/AvailabilityDetails',
  component: AvailabilityDetails,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    availability: {
      control: 'object',
      description: 'The availability object (single or recurring).',
    },
    isError: {
      control: 'boolean',
      defaultValue: false,
      description: 'Whether the component is in an error state.',
    },
    locale: {
      control: 'select',
      options: ['en', 'de'],
      defaultValue: 'en',
      description: 'The locale for internationalization.',
    },
    onClickCancel: { action: 'cancelled', description: 'Cancel button clicked.' },
    onClickEdit: { action: 'editClicked', description: 'Edit recurring button clicked (recurring only).' },
  },
};

export default meta;

type Story = StoryObj<typeof AvailabilityDetails>;

const sampleSingleAvailability: TSingleAvailability = {
  id: 1,
  type: 'single',
  date: '2025/12/31',
  startTime: '12:00',
  endTime: '14:00',
};

const sampleRecurringAvailability: TRecurringAvailability = {
  id: 2,
  type: 'recurring',
  days: ['Monday', 'Wednesday'],
  startTime: '12:00',
  endTime: '14:00',
  startDate: '2025/01/01',
  expirationDate: '2025/12/31',
};

export const SingleAvailability: Story = {
  render: (args) => (
    <AvailabilityDetails
      availability={sampleSingleAvailability}
      {...args}
    />
  ),
  args: {
    locale: 'en',
    isError: false,
    onClickCancel: () => alert('Cancelled'),
    onClickClose: () => alert('Closed'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Displays details for a single availability slot.',
      },
    },
  },
};

export const RecurringAvailability: Story = {
  render: (args) => (
    <AvailabilityDetails
      availability={sampleRecurringAvailability}
      {...args}
    />
  ),
  args: {
    locale: 'en',
    isError: false,
    onClickCancel: () => alert('Cancelled'),
    onClickEdit: () => alert('Edit recurring'),
    onClickClose: () => alert('Closed'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Displays details for a recurring availability slot.',
      },
    },
  },
};

export const SingleAvailabilityError: Story = {
  render: (args) => (
    <AvailabilityDetails
      availability={sampleSingleAvailability}
      {...args}
    />
  ),
  args: {
    locale: 'en',
    isError: true,
    onClickCancel: () => alert('Cancelled'),
    onClickClose: () => alert('Closed'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Displays single availability details in an error state.',
      },
    },
  },
};

export const RecurringAvailabilityError: Story = {
  render: (args) => (
    <AvailabilityDetails
      availability={sampleRecurringAvailability}
      {...args}
    />
  ),
  args: {
    locale: 'en',
    isError: true,
    onClickCancel: () => alert('Cancelled'),
    onClickEdit: () => alert('Edit recurring'),
    onClickClose: () => alert('Closed'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Displays recurring availability details in an error state.',
      },
    },
  },
};

export const SingleAvailabilityLoading: Story = {
  render: (args) => (
    <AvailabilityDetails
      availability={sampleSingleAvailability}
      {...args}
    />
  ),
  args: {
    locale: 'en',
    isError: false,
    isLoading: true,
    onClickCancel: () => alert('Cancelled'),
    onClickClose: () => alert('Closed'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Displays single availability details in a loading state.',
      },
    },
  },
};

export const RecurringAvailabilityLoading: Story = {
  render: (args) => (
    <AvailabilityDetails
      availability={sampleRecurringAvailability}
      {...args}
    />
  ),
  args: {
    locale: 'en',
    isError: false,
    isLoading: true,
    onClickCancel: () => alert('Cancelled'),
    onClickEdit: () => alert('Edit recurring'),
    onClickClose: () => alert('Closed'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Displays recurring availability details in a loading state.',
      },
    },
  },
};