import { Meta, StoryObj } from '@storybook/react-vite';
import  Banner  from '../lib/components/banner';

const meta: Meta<typeof Banner> = {
  title: 'Components/Banner',
  component: Banner,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="theme-orange">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    style: { 
      control: 'radio', 
      options: ['success', 'warning', 'error'] 
    },
    titleSize: { control: 'number' },
    descriptionSize: { control: 'number' },
    closeable: { control: 'boolean' },
    onClose: { action: 'closed' },
    icon: { control: 'boolean' },
    customIcon: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<typeof Banner>;

export const Default: Story = {
  args: {
    title: 'Banner Title',
    description: 'This is a description for the banner',
    style: 'success',
    titleSize: 20,
    descriptionSize: 16,
    closeable: false,
    icon: false,
  },
};

export const Closeable: Story = {
  args: {
    ...Default.args,
    closeable: true,
  },
};

export const CustomStyle: Story = {
  args: {
    ...Default.args,
    style: 'error',
  },
};

export const NoDescription: Story = {
  args: {
    ...Default.args,
    description: undefined,
  },
};

export const NoTitle: Story = {
  args: {
    ...Default.args,
    title: undefined,
  },
};

export const CustomSizes: Story = {
  args: {
    ...Default.args,
    titleSize: 18,
    descriptionSize: 14,
  },
};

export const WithIcon: Story = {
  args: {
    ...Default.args,
    icon: true,
  },
};

export const WithCustomIcon: Story = {
  args: {
    ...Default.args,
    icon: true,
    customIcon: <span>🌟</span>, 
  },
};
