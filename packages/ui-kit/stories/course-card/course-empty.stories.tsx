import { Meta, StoryObj } from '@storybook/react';
import { EmptyState, CourseEmptyState } from '../../lib/components/coursecard/course-empty-state';

/**
 * Mock translation dictionary for different locales.
 */
const mockDictionary = {
  en: {
    components: {
      courseCard: {
        courseEmptyState: {
          message: 'No courses available.',
          message2: 'You haven’t created any courses yet.',
          buttonText: 'Browse Courses',
        },
      },
    },
  },
  de: {
    components: {
      courseCard: {
        courseEmptyState: {
          message: 'Keine Kurse verfügbar.',
          message2: 'Sie haben noch keine Kurse erstellt.',
          buttonText: 'Kurse durchsuchen',
        },
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
      description: 'The text to display on the button (optional).',
    },
    onButtonClick: {
      action: 'clicked',
      description: 'Callback function triggered when the button is clicked (optional).',
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
        component: 'A reusable EmptyState component that displays a message and an optional call-to-action button, used as a base for CourseEmptyState.',
      },
    },
  },
};

export default meta;

type EmptyStateStory = StoryObj<typeof EmptyState>;
type CourseEmptyStateStory = StoryObj<typeof CourseEmptyState>;

/**
 * Template for rendering the EmptyState component with customizable props.
 */
const EmptyStateTemplate: EmptyStateStory = {
  render: (args) => <EmptyState {...args} />,
};

/**
 * Template for rendering the CourseEmptyState component with customizable props.
 */
const CourseEmptyStateTemplate: CourseEmptyStateStory = {
  render: (args) => <CourseEmptyState {...args} />,
};

/**
 * EmptyState story with a simple message and no button.
 */
export const EmptyStateNoButton: EmptyStateStory = {
  ...EmptyStateTemplate,
  args: {
    message: 'No data available.',
    locale: 'en',
  },
  parameters: {
    docs: {
      description: {
        story: 'An EmptyState component with a message only, without a button.',
      },
    },
  },
};

/**
 * EmptyState story with a message and a button.
 */
export const EmptyStateWithButton: EmptyStateStory = {
  ...EmptyStateTemplate,
  args: {
    message: 'No data available.',
    buttonText: 'Take Action',
    onButtonClick: () => alert('Button clicked!'),
    locale: 'en',
  },
  parameters: {
    docs: {
      description: {
        story: 'An EmptyState component with a message and a call-to-action button.',
      },
    },
  },
};

/**
 * CourseEmptyState story for a student context in English with a button.
 */
export const CourseEmptyStateStudentEn: CourseEmptyStateStory = {
  ...CourseEmptyStateTemplate,
  args: {
    locale: 'en',
    context: 'student',
    onButtonClick: () => alert('Browse Courses clicked!'),
  },
  parameters: {
    docs: {
      description: {
        story: 'A CourseEmptyState component for a student in English, displaying a message and a button.',
      },
    },
    mock: {
      getDictionary: mockGetDictionary,
    },
  },
};

/**
 * CourseEmptyState story for a creator context in English without a button.
 */
export const CourseEmptyStateCreatorEn: CourseEmptyStateStory = {
  ...CourseEmptyStateTemplate,
  args: {
    locale: 'en',
    context: 'creator',
  },
  parameters: {
    docs: {
      description: {
        story: 'A CourseEmptyState component for a creator in English, displaying a message without a button.',
      },
    },
    mock: {
      getDictionary: mockGetDictionary,
    },
  },
};

/**
 * CourseEmptyState story for a student context in German with a button.
 */
export const CourseEmptyStateStudentDe: CourseEmptyStateStory = {
  ...CourseEmptyStateTemplate,
  args: {
    locale: 'de',
    context: 'student',
    onButtonClick: () => alert('Kurse durchsuchen clicked!'),
  },
  parameters: {
    docs: {
      description: {
        story: 'A CourseEmptyState component for a student in German, displaying a message and a button.',
      },
    },
    mock: {
      getDictionary: mockGetDictionary,
    },
  },
};

/**
 * CourseEmptyState story for a coach context in German without a button.
 */
export const CourseEmptyStateCoachDe: CourseEmptyStateStory = {
  ...CourseEmptyStateTemplate,
  args: {
    locale: 'de',
    context: 'coach',
  },
  parameters: {
    docs: {
      description: {
        story: 'A CourseEmptyState component for a coach in German, displaying a message without a button.',
      },
    },
    mock: {
      getDictionary: mockGetDictionary,
    },
  },
};