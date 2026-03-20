import { Meta, StoryObj } from '@storybook/react-vite';
import { ComponentProps, useState } from 'react';
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
  { name: 'Branding and Identity', slug: 'branding-and-identity' },
  { name: 'Graphic and Visual Design', slug: 'graphic-and-visual-design' },
  { name: 'Motion Design and Animation', slug: 'motion-design-and-animation' },
  { name: 'Sound Design and Editing', slug: 'sound-design-and-editing' },
  { name: 'Digital Content and Social Media Strategy', slug: 'digital-content-and-social-media-strategy' },
  { name: 'Web Design and Development', slug: 'web-design-and-development' },
  { name: 'UI/UX Design', slug: 'ui-ux-design' },
  { name: 'Visual Storytelling', slug: 'visual-storytelling' },
  { name: 'Advertising Campaigns', slug: 'advertising-campaigns' },
  { name: 'Key Visual Creation', slug: 'key-visual-creation' },
];


const longTopicList = [
  ...sampleTopics,
  { name: 'Node.js', slug: 'node-js' },
  { name: 'Express', slug: 'express' },
  { name: 'MongoDB', slug: 'mongodb' },
  { name: 'GraphQL', slug: 'graphql' },
  { name: 'Redux', slug: 'redux' },
  { name: 'Jest', slug: 'jest' },
];

const fewTopics = sampleTopics.slice(0, 4);

const StatefulFilterSwitch = (args: ComponentProps<typeof FilterSwitch>) => {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  return (
    <div className="w-[960px] max-w-full">
      <FilterSwitch
        {...args}
        selectedTopics={selectedTopics}
        setSelectedTopics={setSelectedTopics}
      />
    </div>
  );
};

/**
 * Default story showing a basic topic list with a few topics
 */
export const Default: Story = {
  render: (args) => <StatefulFilterSwitch {...args} />,
  args: {
    locale: 'en',
    title: 'Topics',
    list: sampleTopics,
  },
};

/**
 * Story showing a topic list with many topics to demonstrate wrapping behavior
 */
export const OverflowExpanded: Story = {
  render: (args) => <StatefulFilterSwitch {...args} />,
  args: {
    locale: 'en',
    title: 'Programming Topics',
    list: longTopicList,
  },
};

/**
 * Story showing a topic list with a different title
 */
export const CustomTitle: Story = {
  render: (args) => <StatefulFilterSwitch {...args} />,
  args: {
    locale: 'en',
    title: 'Filter Categories',
    list: sampleTopics,
  },
};

export const FewItems: Story = {
  render: (args) => <StatefulFilterSwitch {...args} />,
  args: {
    locale: 'en',
    title: 'Topics',
    list: fewTopics,
  },
};

/**
 * Story showing an empty topic list
 */
export const Empty: Story = {
  render: (args) => <StatefulFilterSwitch {...args} />,
  args: {
    locale: 'en',
    title: 'No Topics Available',
    list: [],
  },
};
