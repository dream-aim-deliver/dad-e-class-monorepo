import type { Meta, StoryObj } from '@storybook/react-vite';
import { ManageCoachingOfferingList } from '../../lib/components/manage-coaching-offering/manage-coaching-offering-list';
import { ManageCoachingOfferingItem } from '../../lib/components/manage-coaching-offering/manage-coaching-offering-item';

/**
 * Storybook configuration for the ManageCoachingOfferingList component.
 */
const meta: Meta<typeof ManageCoachingOfferingList> = {
  title: 'Components/ManageCoachingOffering/ManageCoachingOfferingList',
  component: ManageCoachingOfferingList,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    locale: {
      control: 'select',
      options: ['en', 'de'],
      description: 'Locale for translations',
    },
    children: {
      description: 'One or more ManageCoachingOfferingItem components',
      control: false,
    },
  },
};

export default meta;

type Story = StoryObj<typeof ManageCoachingOfferingList>;

// Mock callbacks
const mockCallbacks = {
  onEdit: () => alert('Edit clicked'),
  onDelete: () => alert('Delete clicked'),
};

// Example data
const offerings = [
  {
    title: 'Quick Feedback',
    description: 'A short coaching session for quick feedback and guidance.',
    durationMinutes: 10,
    price: 40,
  },
  {
    title: 'Career Coaching',
    description: 'Plan your next career steps with professional guidance.',
    durationMinutes: 45,
    price: 10,
  },
  {
    title: 'Leadership Insights',
    description: 'Develop leadership skills and self-awareness through guided sessions.',
    durationMinutes: 50,
    price: 50,
  },
];

/**
 * Default (English) story
 */
export const Default: Story = {
  render: ({ locale }) => (
    <ManageCoachingOfferingList locale={locale as 'en' | 'de'}>
      {offerings.map((offering, index) => (
        <ManageCoachingOfferingItem
          key={`offering-${index}`}
          title={offering.title}
          description={offering.description}
          durationMinutes={offering.durationMinutes}
          locale={locale as 'en' | 'de'}
          onEdit={mockCallbacks.onEdit}
          onDelete={mockCallbacks.onDelete}
          price='10'
        />
      ))}
    </ManageCoachingOfferingList>
  ),
  args: {
    locale: 'en',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Displays a list of coaching offerings in English, each with title, description, and duration.',
      },
    },
  },
};

/**
 * German story
 */
export const German: Story = {
  render: () => (
    <ManageCoachingOfferingList locale="de">
      {offerings.map((offering, index) => (
        <ManageCoachingOfferingItem
          key={`offering-de-${index}`}
          title={offering.title}
          description={offering.description}
          durationMinutes={offering.durationMinutes}
          locale="de"
          onEdit={mockCallbacks.onEdit}
          onDelete={mockCallbacks.onDelete}
          price='50'
        />
      ))}
    </ManageCoachingOfferingList>
  ),
  args: {
    locale: 'de',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Zeigt dieselbe Liste mit deutschen Übersetzungen der Schaltflächen und Labels.',
      },
    },
  },
};

/**
 * Empty state story
 */
export const EmptyState: Story = {
  render: ({ locale }) => (
    <ManageCoachingOfferingList locale={locale as 'en' | 'de'} />
  ),
  args: {
    locale: 'en',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Displays the empty state message when there are no coaching offerings.',
      },
    },
  },
};
