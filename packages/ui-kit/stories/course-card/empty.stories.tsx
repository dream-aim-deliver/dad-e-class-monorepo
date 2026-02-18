import { Meta, StoryObj } from '@storybook/react-vite';
import { EmptyState } from '../../lib/components/course-card/empty-state';

/**
 * Mock translation dictionary for different locales.
 */
const mockDictionary = {
  en: {
    components: {
      emptyState: {
        message: 'You haven’t created any courses yet.',
        buttonText: 'Browse Courses',
      },
    },
  },
  de: {
    components: {
      emptyState: {
        message: 'Sie haben noch keine Kurse erstellt.',
        buttonText: 'Kurse durchsuchen',
      },
    },
  },
};

/**
 * Mock getDictionary function to simulate translation lookup.
 */
const mockGetDictionary = (locale: string) => mockDictionary[locale as keyof typeof mockDictionary];

const meta: Meta<typeof EmptyState> = {
  title: 'Components/CourseCardComponents/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="flex justify-center items-center min-h-[200px]">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    message: {
      control: 'text',
      description: 'The message to display in the empty state.',
    },
    buttonText: {
      control: 'text',
      description: 'The text to display on the call-to-action button.',
    },
    onButtonClick: {
      action: 'clicked',
      description: 'Callback function triggered when the button is clicked.',
    },
    locale: {
      control: 'select',
      options: ['en', 'de'],
      description: 'The locale for translations (e.g., "en", "de").',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'A reusable EmptyState component that displays a message and a mandatory call-to-action button, used in course-related layouts such as CourseCardList.',
      },
    },
  },
};

export default meta;

type EmptyStateStory = StoryObj<typeof EmptyState>;

/**
 * Template for rendering the EmptyState component with customizable props.
 */
const EmptyStateTemplate: EmptyStateStory = {
  render: (args) => <EmptyState {...args} />,
};

/**
 * EmptyState story with a message and a button in English.
 */
export const EmptyStateEn: EmptyStateStory = {
  ...EmptyStateTemplate,
  args: {
    message: mockDictionary.en.components.emptyState.message,
    buttonText: mockDictionary.en.components.emptyState.buttonText,
    onButtonClick: () => alert('Browse Courses!'),
    locale: 'en',
  },
  parameters: {
    docs: {
      description: {
        story: 'An EmptyState component with a message and a call-to-action button in English.',
      },
    },
    mock: {
      getDictionary: mockGetDictionary,
    },
  },
};

/**
 * EmptyState story with a message and a button in German.
 */
export const EmptyStateDe: EmptyStateStory = {
  ...EmptyStateTemplate,
  args: {
    message: mockDictionary.de.components.emptyState.message,
    buttonText: mockDictionary.de.components.emptyState.buttonText,
    onButtonClick: () => alert('Kurse durchsuchen!'),
    locale: 'de',
  },
  parameters: {
    docs: {
      description: {
        story: 'An EmptyState component with a message and a call-to-action button in German.',
      },
    },
    mock: {
      getDictionary: mockGetDictionary,
    },
  },
};
