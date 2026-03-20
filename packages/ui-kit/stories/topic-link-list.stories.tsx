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

const overflowTopics = [
  ...sampleTopics,
  { name: 'Content Strategy', url: '/topics/content-strategy' },
  { name: 'Creative Writing', url: '/topics/creative-writing' },
  { name: 'Art Direction', url: '/topics/art-direction' },
  { name: 'Typography Systems', url: '/topics/typography-systems' },
  { name: 'User Research', url: '/topics/user-research' },
  { name: 'Design Operations', url: '/topics/design-operations' },
  { name: 'Concept Development', url: '/topics/concept-development' },
  { name: 'Campaign Planning', url: '/topics/campaign-planning' },
];

const topicsWithRequiredProps = sampleTopics.map((topic) => ({ ...topic }));
const overflowTopicsWithRequiredProps = overflowTopics.map((topic) => ({ ...topic }));
const fewTopics = sampleTopics.slice(0, 4).map((topic) => ({ ...topic }));

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
  render: (args) => (
    <div className="w-[960px] max-w-full">
      <TopicList {...args} />
    </div>
  ),
  args: {
    locale: 'en',
    title: 'Offers by topics',
    list: topicsWithRequiredProps,
  },
};

export const OverflowExpanded: Story = {
  render: (args) => (
    <div className="w-[960px] max-w-full">
      <TopicList {...args} />
    </div>
  ),
  args: {
    locale: 'en',
    title: 'Offers by topics',
    list: overflowTopicsWithRequiredProps,
  },
};

export const FewItems: Story = {
  render: (args) => (
    <div className="w-[960px] max-w-full">
      <TopicList {...args} />
    </div>
  ),
  args: {
    locale: 'en',
    title: 'Offers by topics',
    list: fewTopics,
  },
};
