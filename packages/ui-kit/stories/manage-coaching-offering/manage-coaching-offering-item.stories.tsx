import type { Meta, StoryObj } from '@storybook/react-vite';
import { ManageCoachingOfferingItem } from '../../lib/components/manage-coaching-offering/manage-coaching-offering-item';

/**
 * Storybook configuration for the ManageCoachingOfferingItem component.
 */
const meta: Meta<typeof ManageCoachingOfferingItem> = {
  title: 'Components/ManageCoachingOffering/ManageCoachingOfferingItem',
  component: ManageCoachingOfferingItem,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'The title/name of the coaching offering',
    },
    description: {
      control: 'text',
      description: 'Short description of the coaching offering',
    },
    durationMinutes: {
      control: 'number',
      description: 'Duration of the coaching offering in minutes',
    },
    locale: {
      control: 'select',
      options: ['en', 'de'],
      description: 'Locale for translations',
    },
    onEdit: {
      action: 'edit clicked',
      description: 'Callback function triggered when the edit button is clicked',
    },
    onDelete: {
      action: 'delete clicked',
      description: 'Callback function triggered when the delete button is clicked',
    },
  },
};

export default meta;

type Story = StoryObj<typeof ManageCoachingOfferingItem>;

/**
 * Default story
 */
export const Default: Story = {
  args: {
    title: 'Quick Feedback',
    description: 'A short coaching session for quick feedback and guidance.',
    durationMinutes: 80,
    locale: 'en',
    onEdit: () => alert('Edit clicked'),
    onDelete: () => alert('Delete clicked'),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Displays a coaching offering with title, description, and duration, along with edit and delete buttons.',
      },
    },
  },
};

/**
 * German example story
 */
export const German: Story = {
  args: {
    title: 'Schnelles Feedback',
    description: 'Eine kurze Coaching-Sitzung für schnelles Feedback.',
    durationMinutes: 15,
    locale: 'de',
    onEdit: () => alert('Bearbeiten geklickt'),
    onDelete: () => alert('Löschen geklickt'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Zeigt dieselbe Komponente mit deutscher Übersetzung und anderem Zeitwert.',
      },
    },
  },
};

/**
 * Example with longer duration
 */
export const LongSession: Story = {
  args: {
    title: 'Deep Coaching Session',
    description: 'An in-depth session to explore challenges and goals.',
    durationMinutes: 60,
    locale: 'en',
    onEdit: () => alert('Edit clicked'),
    onDelete: () => alert('Delete clicked'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Displays a longer coaching session example.',
      },
    },
  },
};
