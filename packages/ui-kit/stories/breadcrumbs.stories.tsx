import { Meta, StoryObj } from '@storybook/react-vite';
import { Breadcrumbs } from '../lib/components/breadcrumbs';

export default {
  title: 'Components/Breadcrumbs',
  component: Breadcrumbs,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    items: {
      description: 'List of breadcrumb items with labels and click handlers',
    },
  },
} satisfies Meta<typeof Breadcrumbs>;

type Story = StoryObj<typeof Breadcrumbs>;

const onClick = () => {
  alert(`Breadcrumb clicked`)
}

export const Default: Story = {
  args: {
    items: [
      {
        label: 'Home',
        onClick: onClick,
      },
      {
        label: 'Dashboard',
        onClick: onClick,
      },
      {
        label: 'Settings',
        onClick: onClick,
      },
    ],
  },
};
