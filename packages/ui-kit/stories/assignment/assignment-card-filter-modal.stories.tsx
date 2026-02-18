import type { Meta } from '@storybook/react-vite';
import { AssignmentCardFilterModal } from '../../lib/components/assignment/assignment-card-filter-modal';

// Default Export for Storybook
const meta = {
  title: 'Components/Assignment/AssignmentCardFilterModal',
  component: AssignmentCardFilterModal,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    locale: {
      control: 'select',
      options: ['en', 'de'],
    },
    onClose: { action: 'modal closed' },
    onApplyFilters: { action: 'filters applied' },
    availableStatuses: { control: 'object' },
    availableCourses: { control: 'object' },
    availableModules: { control: 'object' },
    availableLessons: { control: 'object' },
    initialFilters: { control: 'object' },
  },
} as Meta;

export default meta;

// Template for the Story
const Template = (args) => (
  <div style={{ height: '100vh', position: 'relative' }}>
    <AssignmentCardFilterModal {...args} />
  </div>
);

// Stories
export const Default = Template.bind({});
Default.args = {
  locale: 'en',
  onClose: () => {
    console.log('Filter modal closed');
    alert('Filter modal closed');
  },
  onApplyFilters: (filters: any) => {
    console.log('Filters Applied:', filters);
    alert('Filters applied successfully!');
  },
  availableStatuses: ['AwaitingReview', 'AwaitingForLongTime', 'Passed'],
  availableCourses: ['Course Title', 'Photography Masterclass', 'Portrait Photography Course'],
  availableModules: ['Module 1', 'Module 2', 'Module 3'],
  availableLessons: ['Lesson 1', 'Lesson 2', 'Lesson 3', 'Lesson 4'],
  initialFilters: {},
};

export const WithInitialFilters = Template.bind({});
WithInitialFilters.args = {
  locale: 'en',
  onClose: () => {
    console.log('Filter modal closed');
    alert('Filter modal closed');
  },
  onApplyFilters: (filters: any) => {
    console.log('Filters Applied:', filters);
    alert('Filters applied successfully!');
  },
  availableStatuses: ['AwaitingReview', 'AwaitingForLongTime', 'Passed'],
  availableCourses: ['Course Title', 'Photography Masterclass', 'Portrait Photography Course'],
  availableModules: ['Module 1', 'Module 2', 'Module 3'],
  availableLessons: ['Lesson 1', 'Lesson 2', 'Lesson 3', 'Lesson 4'],
  initialFilters: {
    title: 'Photography',
    status: ['AwaitingReview'],
    course: 'Photography',
  },
};
