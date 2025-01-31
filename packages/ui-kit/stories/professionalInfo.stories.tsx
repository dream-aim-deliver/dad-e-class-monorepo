import type { Meta, StoryObj } from '@storybook/react';
import { ProfessionalInfo } from '@/components/profile/professional-info';
import { fn } from '@storybook/test';

const meta: Meta<typeof ProfessionalInfo> = {
  title: 'Components/ProfessionalInfo',
  component: ProfessionalInfo,
  tags: ['autodocs'],
  argTypes: {
    onSave: { action: 'profile saved' }
  },
  args: {
    onSave: fn()
  }
};

export default meta;

type Story = StoryObj<typeof ProfessionalInfo>;

export const Default: Story = {
  args: {
    initialData: {
      bio: 'Experienced software engineer passionate about building scalable solutions.',
      linkedinUrl: 'https://linkedin.com/in/example',
      portfolioWebsite: 'https://myportfolio.com',
      associatedCompanyName: 'Tech Innovations Inc',
      associatedCompanyRole: 'Senior Developer',
      skills: ['React', 'TypeScript', 'Node.js'],
      isPrivateProfile: false
    }
  }
};

export const EmptyProfile: Story = {
  args: {}
};
