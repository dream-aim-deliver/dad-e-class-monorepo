import { AdminCourseFilterModalExpanded } from '../lib/components/admin-course-filter-modal';
import type { Meta } from '@storybook/react-vite';

// Mock Data
const mockCreators = ['John Doe', 'Jane Smith', 'Alice Johnson', 'Bob Brown'];
const mockCoaches = ['Jane Smith', 'Bob Brown', 'Carol White', 'David Green'];
const mockTags = ['Leadership', 'Communication', 'Teamwork', 'Strategy', 'Innovation'];

const mockFilters = {
  minRating: 2,
  maxRating: 4,
  minSales: '10',
  maxSales: '100',
  createdBy: 'John Doe',
  taughtBy: 'Jane Smith',
  minCoaches: '5',
  maxCoaches: '50',
  categories: ['Category Name 1', 'Category Name 3'],
  tags: ['Leadership', 'Teamwork'],
  languages: ['English', 'German'],
  publishBefore: '2025-12-31',
  publishAfter: '2023-01-01',
};

const mockCategories = [
  'Category Name 1',
  'Category Name 2',
  'Category Name 3',
  'Category Name 4',
];

const mockLanguageOptions = [
  { name: 'Deutsch', code: 'DEU' },
  { name: 'Français', code: 'FRA' },
  { name: 'Italiano', code: 'ITA' },
  { name: 'English', code: 'ENG' },
  { name: 'Español', code: 'SPA' },
];

// Default Export for Storybook
const meta = {
  title: 'Components/AdminCourseFiltersExpanded',
  component: AdminCourseFilterModalExpanded,
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
    categories: { control: 'object' },
    languageOptions: { control: 'object' },
    initialFilters: { control: 'object' },
    creators: { control: 'object' },
    coaches: { control: 'object' },
    tags: { control: 'object' },
  },
} as Meta;

export default meta;

// Template for the Story
const Template = (args) => <AdminCourseFilterModalExpanded {...args} />;

// Stories
export const DefaultFilters = Template.bind({});
DefaultFilters.args = {
  locale: 'en',
  onApplyFilters: (filters: any) => console.log('Filters Applied:', filters),
  categories: mockCategories,
  languageOptions: mockLanguageOptions,
  creators: mockCreators,
  coaches: mockCoaches,
  tags: mockTags,
};

export const WithPreAppliedFilters = Template.bind({});
WithPreAppliedFilters.args = {
  locale: 'en',
  onApplyFilters: (filters: any) => console.log('Filters Applied:', filters),
  initialFilters: mockFilters,
  categories: mockCategories,
  languageOptions: mockLanguageOptions,
  creators: mockCreators,
  coaches: mockCoaches,
  tags: mockTags,
};