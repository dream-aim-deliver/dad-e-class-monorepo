import type { Meta, StoryObj } from '@storybook/react';
import { ProfileInfo } from '@/components/profile/profile-info';
import { expect, fn } from '@storybook/test';

const meta: Meta<typeof ProfileInfo> = {
  title: 'Components/ProfileInfo',
  component: ProfileInfo,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    onSave: { action: 'profile saved' },
  },
};

export default meta;
type Story = StoryObj<typeof ProfileInfo>;

export const Default: Story = {
  args: {
    initialData: {
      name: 'John',
      surname: 'Doe',
      email: 'john.doe@example.com',
      phoneNumber: '+1234567890',
      dateOfBirth: '1990-01-01',
      languages: [],
      interfaceLanguage: { code: 'ENG', name: 'English' },
      receiveNewsletter: false,
      isRepresentingCompany: false,
    },
  },
};

export const WithCompanyDetails: Story = {
  args: {
    initialData: {
      name: 'Jane',
      surname: 'Smith',
      email: 'jane.smith@company.com',
      phoneNumber: '+0987654321',
      dateOfBirth: '1985-05-15',
      languages: [{ code: 'ENG', name: 'English' }],
      interfaceLanguage: { code: 'DEU', name: 'German' },
      receiveNewsletter: true,
      isRepresentingCompany: true,
      representingCompanyName: 'Tech Solutions Inc.',
      representedCompanyUID: 'VAT123456',
      representedCompanyAddress: '123 Tech Street, Silicon Valley',
    },
  },
};
