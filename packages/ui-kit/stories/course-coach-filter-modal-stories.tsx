import { CourseCoachFilterModal } from '../lib/components/coach/course-coach-filter-modal';
import type { Meta } from '@storybook/react';

// Mock Data
const mockLanguages = ['English', 'German', 'French', 'Spanish'];
const mockSkills = [
  'Leadership',
  'Communication',
  'Teamwork',
  'Strategy',
  'Innovation',
  'Project Management'
];

const mockFilters = {
  name: 'John Doe',
  minRating: 3,
  maxRating: 5,
  languages: ['English', 'German'],
  skills: ['Leadership', 'Communication'],
  minSessionCount: 10,
  maxSessionCount: 100,
};

// Default Export for Storybook
const meta = {
  title: 'Components/CourseCoachCard/CourseCoachFilterModal',
  component: CourseCoachFilterModal,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    locale: {
      control: 'select',
      options: ['en', 'de'],
    },
    onApplyFilters: { action: 'filters applied' },
    onClose: { action: 'modal closed' },
    languages: { control: 'object' },
    skills: { control: 'object' },
    initialFilters: { control: 'object' },
  },
} as Meta;

export default meta;

// Template for the Story
const Template = (args) => (
  <div style={{ position: 'relative', width: '100vw', height: '100vh', minHeight: 600, background: '#222' }}>
    <CourseCoachFilterModal {...args} />
  </div>
);

// Stories
export const DefaultFilters = Template.bind({});
DefaultFilters.args = {
  locale: 'en',
  onApplyFilters: (filters: any) => {
    console.log('Filters Applied:', filters);
    alert('Filters Applied! Check console for details.');
  },
  onClose: () => {
    console.log('Modal Closed');
    alert('Modal Closed!');
  },
  languages: mockLanguages,
  skills: mockSkills,
};

export const WithPreAppliedFilters = Template.bind({});
WithPreAppliedFilters.args = {
  locale: 'en',
  onApplyFilters: (filters: any) => {
    console.log('Filters Applied:', filters);
    alert('Filters Applied! Check console for details.');
  },
  onClose: () => {
    console.log('Modal Closed');
    alert('Modal Closed!');
  },
  initialFilters: mockFilters,
  languages: mockLanguages,
  skills: mockSkills,
};

export const GermanLocale = Template.bind({});
GermanLocale.args = {
  locale: 'de',
  onApplyFilters: (filters: any) => {
    console.log('Filters Applied:', filters);
    alert('Filter angewendet! Siehe Konsole für Details.');
  },
  onClose: () => {
    console.log('Modal Closed');
    alert('Modal geschlossen!');
  },
  languages: mockLanguages,
  skills: mockSkills,
};

export const GermanLocaleWithFilters = Template.bind({});
GermanLocaleWithFilters.args = {
  locale: 'de',
  onApplyFilters: (filters: any) => {
    console.log('Filters Applied:', filters);
    alert('Filter angewendet! Siehe Konsole für Details.');
  },
  onClose: () => {
    console.log('Modal Closed');
    alert('Modal geschlossen!');
  },
  initialFilters: mockFilters,
  languages: mockLanguages,
  skills: mockSkills,
};