import { Meta, StoryObj } from '@storybook/react-vite';
import FilterSwitch from '../lib/components/filter-switch';

const meta: Meta<typeof FilterSwitch> = {
  title: 'Components/FilterSwitch',
  component: FilterSwitch,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'The title displayed above the topic list.'
    },
    list: {
      control: 'object',
      description: 'An array of topics, each containing a `name`.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof FilterSwitch>;

// Sample topic data
const sampleTopics = [
  { name: 'Branding and Identity' },
  { name: 'Graphic and Visual Design' },
  { name: 'Motion Design and Animation' },
  { name: 'Sound Design and Editing' },
  { name: 'Digital Content and Social Media Strategy' },
  { name: 'Web Design and Development' },
  { name: 'UI/UX Design' },
  { name: 'Visual Storytelling' },
  { name: 'Advertising Campaigns' },
  { name: 'Key Visual Creation' },
];


const longTopicList = [
  ...sampleTopics,
  { name: 'Node.js' },
  { name: 'Express' },
  { name: 'MongoDB' },
  { name: 'GraphQL' },
  { name: 'Redux' },
  { name: 'Jest' },
];

/**
 * Default story showing a basic topic list with a few topics
 */
export const Default: Story = {
  args: {
    title: 'Topics',
    list: sampleTopics,
    onFilterChange: (selectedTopicName) => {
      console.log('Selected topic:', selectedTopicName);
    },
  },
};

/**
 * Story showing a topic list with many topics to demonstrate wrapping behavior
 */
export const ManyTopics: Story = {
  args: {
    title: 'Programming Topics',
    list: longTopicList,
    onFilterChange: (selectedTopicName) => {
      console.log('Selected topic:', selectedTopicName);
    },
  }
};

/**
 * Story showing a topic list with a different title
 */
export const CustomTitle: Story = {
  args: {
    title: 'Filter Categories',
    list: sampleTopics,
    onFilterChange: (selectedTopicName) => {
      console.log('Selected topic:', selectedTopicName);

    }
  }
};


/**
 * Story showing an empty topic list
 */
export const Empty: Story = {
  args: {
    title: 'No Topics Available',
    list: [],
    onFilterChange: (selectedTopicName) => {
      console.log('Selected topic:', selectedTopicName);
    },
  },
};