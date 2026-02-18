import { ReviewFilterModal, ReviewFilterModel } from '../lib/components/grids/review-filter-modal';
import type { Meta } from '@storybook/react-vite';

// Mock Data
const mockFilters: Partial<ReviewFilterModel> = {
  minRating: 2,
  maxRating: 5,
  studentName: 'Alice',
  courseName: 'React Basics',
  dateAfter: '2024-01-01',
  dateBefore: '2025-01-01',
};

// Default Export for Storybook
const meta: Meta = {
  title: 'Components/ReviewFilterModal',
  component: ReviewFilterModal,
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
const Template = (args) => <ReviewFilterModal {...args} />;

// Stories
export const DefaultFilters = Template.bind({});
DefaultFilters.args = {
  locale: 'en',
  onApplyFilters: (filters: ReviewFilterModel) => alert('Filters Applied: ' + JSON.stringify(filters)),
  onClose: () => alert('Modal Closed'),
};

export const WithPreAppliedFilters = Template.bind({});
WithPreAppliedFilters.args = {
  locale: 'en',
  onApplyFilters: (filters: ReviewFilterModel) => alert('Filters Applied: ' + JSON.stringify(filters)),
  onClose: () => alert('Modal Closed'),
  initialFilters: {
    ...mockFilters,
    minRating: 3,
    maxRating: 4,
  },
};
