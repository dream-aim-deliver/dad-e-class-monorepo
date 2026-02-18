import type { Meta, StoryObj } from '@storybook/react-vite';
import TopicList from '../lib/components/topic-list';

// Sample topics from your list
const sampleTopics = [
  { name: 'Branding and Identity', url: '/topics/branding-identity' },
  { name: 'Graphic and Visual Design', url: '/topics/graphic-visual-design' },
  { name: 'Motion Design and Animation', url: '/topics/motion-design-animation' },
  { name: 'Sound Design and Editing', url: '/topics/sound-design' },
  { name: 'Digital Content and Social Media Strategy', url: '/topics/digital-content-strategy' },
  { name: 'Web Design and Development', url: '/topics/web-design-development' },
  { name: 'UI/UX Design', url: '/topics/ui-ux-design' },
  { name: 'Visual Storytelling', url: '/topics/visual-storytelling' },
  { name: 'Advertising Campaigns', url: '/topics/advertising-campaigns' },
  { name: 'Key Visual Creation', url: '/topics/key-visual-creation' },
];

const topicsWithRequiredProps = sampleTopics.map((topic) => ({ ...topic }));

const meta: Meta<typeof TopicList> = {
  title: 'Components/TopicList',
  component: TopicList,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'TopicList is a component that renders a list of creative design topics as links.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text', description: 'The title displayed above the topic list' },
    list: { control: 'object', description: 'Array of topics containing name and URL' },
  },
};

export default meta;
type Story = StoryObj<typeof TopicList>;

// Default story with all topics
export const Default: Story = {
  args: {
    title: 'Offers by topics',
    list: topicsWithRequiredProps,
  },
};
