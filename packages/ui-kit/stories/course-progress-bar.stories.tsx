import type { Meta, StoryObj } from '@storybook/react-vite';
import { CourseProgressBar } from '../lib/components/course-progress-bar';

const meta: Meta<typeof CourseProgressBar> = {
  title: 'Components/CourseProgressBar',
  component: CourseProgressBar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    locale: {
      control: 'select',
      options: ['en', 'de'],
    },
    percentage: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
    },
  },
};

export default meta;
type Story = StoryObj<typeof CourseProgressBar>;

//Test Case 1: Not Started (0%)
export const NotStarted: Story = {
  args: {
    percentage: 0,
    locale: 'en',
    onClickResume: () => alert('Resume Clicked (0%)'),
  },
};

//Test Case 2: In Progress (50%)
export const Halfway: Story = {
  args: {
    percentage: 50,
    locale: 'en',
    onClickResume: () => alert('Resume Clicked (50%)'),
  },
};

//Test Case 3: Completed (100%)
export const Completed: Story = {
  args: {
    percentage: 100,
    locale: 'en',
    onClickResume: () => alert('Resume Clicked (100%)'),
  },
};

//Test Case 4: In Progress (Custom Value)
export const CustomProgress: Story = {
  args: {
    percentage: 73,
    locale: 'en',
    onClickResume: () => alert('Resume Clicked (73%)'),
  },
};

//Test Case 5: German Locale
export const GermanLocale: Story = {
  args: {
    percentage: 42,
    locale: 'de',
    onClickResume: () => alert('Resume Clicked (42%)'),
  },
};
