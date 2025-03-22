import { Meta, StoryObj } from '@storybook/react';
import { EmptyState, CourseEmptyState } from '../../lib/components/coursecard/course-empty-state';

/**
 * Mock messages for translations.
 */
const mockMessagesEn = {
  components: {
    courseCard: {
      courseEmptyState: {
        message: 'No courses available.',
        buttonText: 'Browse Courses',
      },
    },
  },
};

const mockMessagesDe = {
  components: {
    courseCard: {
      courseEmptyState: {
        message: 'Keine Kurse verfügbar.',
        buttonText: 'Kurse durchsuchen',
      },
    },
  },
};

const meta: Meta = {
  title: 'Components/CourseCardComponents/CourseEmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  decorators: [
    (Story, { args }) => (
      <div className="flex justify-center items-center">
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
      description: 'The text to display on the button.',
    },
    onButtonClick: {
      action: 'clicked',
      description: 'Callback function triggered when the button is clicked.',
    },
    locale: {
      control: 'select',
      options: ['en', 'de'],
      description: 'The locale for the component.',
    },
  },
};

export default meta;

/**
 * Template for rendering the EmptyState component with customizable props.
 */
const Template: StoryObj<typeof EmptyState> = {
  render: (args) => <EmptyState {...args} />,
};

/**
 * Template for rendering the CourseEmptyState component with customizable props.
 */
const CourseTemplate: StoryObj<typeof CourseEmptyState> = {
  render: (args) => <CourseEmptyState {...args} />,
};

/**
 * Default story showcasing the CourseEmptyState component in English.
 */
export const CourseEmptyStateEn: StoryObj<typeof CourseEmptyState> = {
  ...CourseTemplate,
  args: {
    locale: 'en',
  },
  parameters: {
    docs: {
      description: {
        story: 'A course empty state component in English.',
      },
    },
  },
};

/**
 * Default story showcasing the CourseEmptyState component in German.
 */
export const CourseEmptyStateDe: StoryObj<typeof CourseEmptyState> = {
  ...CourseTemplate,
  args: {
    locale: 'de',
  },
  parameters: {
    docs: {
      description: {
        story: 'A course empty state component in German.',
      },
    },
  },
};
