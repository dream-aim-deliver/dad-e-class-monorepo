import type { Meta, StoryObj } from '@storybook/react-vite';
import { Milestone } from '../../lib/components/course-outline/milestone';

const meta: Meta<typeof Milestone> = {
  title: 'Components/CourseOutline/Milestone',
  component: Milestone,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    locale: {
      control: 'select',
      options: ['en', 'de'],
    },
    completed: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Milestone>;

// 🔹 Test Case 1: Milestone Not Completed
export const NotCompleted: Story = {
  args: {
    completed: false,
    locale: 'en',
  },
};

// 🔹 Test Case 2: Milestone Completed 
export const Completed: Story = {
  args: {
    completed: true,
    locale: 'en',
  },
};

// 🔹 Test Case 3: Milestone for German language
export const German: Story = {
  args: {
    completed: false,
    locale: 'de',
  },
};

