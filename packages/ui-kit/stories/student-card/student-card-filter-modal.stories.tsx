import { StudentCardFilterModal, StudentCardFilterModel } from '../../lib/components/student-card/student-card-filter-modal';
import type { Meta } from '@storybook/react-vite';

// Mock Data
const mockFilters: Partial<StudentCardFilterModel> = {
  studentName: 'Alice Johnson',
  courseName: 'React Basics',
  assignmentStatus: ['long-wait', 'waiting-feedback'],
};

// Default Export for Storybook
const meta: Meta = {
  title: 'Components/StudentCard/StudentCardFilterModal',
  component: StudentCardFilterModal,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    locale: {
      control: 'select',
      options: ['en', 'de'],
    },
    onApplyFilters: { action: 'filters applied' },
    onClose: { action: 'modal closed' },
    initialFilters: { control: 'object' },
  },
};

export default meta;

// Template for the Story
const Template = (args) => <StudentCardFilterModal {...args} />;

// Stories
export const DefaultFilters = Template.bind({});
DefaultFilters.args = {
  locale: 'en',
  onApplyFilters: (filters: StudentCardFilterModel) => alert('Filters Applied: ' + JSON.stringify(filters, null, 2)),
  onClose: () => alert('Modal Closed'),
};

export const WithPreAppliedFilters = Template.bind({});
WithPreAppliedFilters.args = {
  locale: 'en',
  onApplyFilters: (filters: StudentCardFilterModel) => alert('Filters Applied: ' + JSON.stringify(filters, null, 2)),
  onClose: () => alert('Modal Closed'),
  initialFilters: {
    ...mockFilters,
    assignmentStatus: ['waiting-feedback', 'course-completed'],
  },
};

export const GermanLocale = Template.bind({});
GermanLocale.args = {
  locale: 'de',
  onApplyFilters: (filters: StudentCardFilterModel) => alert('Filter angewendet: ' + JSON.stringify(filters, null, 2)),
  onClose: () => alert('Modal geschlossen'),
  initialFilters: {
    studentName: 'Max Mustermann',
    courseName: 'JavaScript Grundlagen',
    assignmentStatus: ['long-wait'],
  },
};

export const FilterByLongWaitStatus = Template.bind({});
FilterByLongWaitStatus.args = {
  locale: 'en',
  onApplyFilters: (filters: StudentCardFilterModel) => alert('Filters Applied: ' + JSON.stringify(filters, null, 2)),
  onClose: () => alert('Modal Closed'),
  initialFilters: {
    assignmentStatus: ['long-wait'],
  },
};

export const MultipleStatusFilters = Template.bind({});
MultipleStatusFilters.args = {
  locale: 'en',
  onApplyFilters: (filters: StudentCardFilterModel) => alert('Filters Applied: ' + JSON.stringify(filters, null, 2)),
  onClose: () => alert('Modal Closed'),
  initialFilters: {
    assignmentStatus: ['long-wait', 'waiting-feedback', 'no-assignment'],
  },
};
