import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@/components/button';
import { SkillItem } from '@/components/profile/skillItem';

const meta: Meta<typeof SkillItem> = {
  title: 'Components/SkillItem',
  component: SkillItem,
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: { type: 'text' },
      description: 'Name of the skill',
    },
    onRemove: {
      action: 'removed',
      description: 'Function triggered when the remove button is clicked',
    },
  },
  parameters: {
    layout: 'centered',
  },
};
export default meta;
type Story = StoryObj<typeof SkillItem>;

export const Default: Story = {
  args: {
    name: 'JavaScript',
  },
};
