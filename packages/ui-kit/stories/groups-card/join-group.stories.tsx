import type { Meta, StoryObj } from '@storybook/react-vite';
import { JoinGroup } from '../../lib/components/groups-card/join-group';

const meta: Meta<typeof JoinGroup> = {
  title: 'Components/Groups/JoinGroup',
  component: JoinGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    locale: {
      control: 'select',
      options: ['en', 'de'],
    },
    isValidating: {
      control: 'boolean',
    },
    hasValidationMessage: {
      control: 'boolean',
    },
    validationMessage: {
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof JoinGroup>;

export const Empty: Story = {
  args: {
    locale: 'en',
    couponCode: '',
    onCouponCodeChange: (value: string) => console.log('Coupon code changed:', value),
    onValidateCode: () => {
      alert('Validation successful: Code validated!');
      console.log('Validate code clicked');
    },
    isValidating: false,
    hasValidationMessage: false,
  },
};

export const WithCouponCode: Story = {
  args: {
    locale: 'en',
    couponCode: 'ACME_MKTG_2025',
    onCouponCodeChange: (value: string) => console.log('Coupon code changed:', value),
    onValidateCode: () => {
      alert('Validation successful: Code validated!');
      console.log('Validate code clicked');
    },
    isValidating: false,
    hasValidationMessage: false,
  },
};

export const Validating: Story = {
  args: {
    locale: 'en',
    couponCode: 'ACME_MKTG_2025',
    onCouponCodeChange: (value: string) => console.log('Coupon code changed:', value),
    onValidateCode: () => {
      alert('Validation in progress...');
      console.log('Validate code clicked');
    },
    isValidating: true,
    hasValidationMessage: false,
  },
};

export const WithValidationError: Story = {
  args: {
    locale: 'en',
    couponCode: 'INVALID_CODE',
    onCouponCodeChange: (value: string) => console.log('Coupon code changed:', value),
    onValidateCode: () => {
      alert('Validation failed: Invalid coupon code. Please check and try again.');
      console.log('Validate code clicked - showing validation error');
    },
    isValidating: false,
    hasValidationMessage: true,
    validationMessage: 'Invalid coupon code. Please check and try again.',
  },
};

export const NetworkError: Story = {
  args: {
    locale: 'en',
    couponCode: 'ACME_MKTG_2025',
    onCouponCodeChange: (value: string) => console.log('Coupon code changed:', value),
    onValidateCode: () => {
      alert('Network error: Please try again later.');
      console.log('Validate code clicked - network error');
    },
    isValidating: false,
    hasValidationMessage: true,
    validationMessage: 'Network error. Please try again later.',
  },
};

export const CoachAlreadyExists: Story = {
  args: {
    locale: 'en',
    couponCode: 'P&G_Frankfurt_ADT',
    onCouponCodeChange: (value: string) => console.log('Coupon code changed:', value),
    onValidateCode: () => {
      alert('Validation failed: There is already a coach for this group');
      console.log('Validate code clicked - coach already exists');
    },
    isValidating: false,
    hasValidationMessage: true,
    validationMessage: 'There is already a coach for this group',
  },
};

export const ValidationSuccess: Story = {
  args: {
    locale: 'en',
    couponCode: 'VALID_CODE_2025',
    onCouponCodeChange: (value: string) => console.log('Coupon code changed:', value),
    onValidateCode: () => {
      alert('Code validated successfully!');
      console.log('Validate code clicked - success');
    },
    isValidating: false,
    hasValidationMessage: false,
  },
};

export const German: Story = {
  args: {
    locale: 'de',
    couponCode: '',
    onCouponCodeChange: (value: string) => console.log('Coupon code changed:', value),
    onValidateCode: () => {
      alert('Validierung erfolgreich: Code validiert!');
      console.log('Validate code clicked');
    },
    isValidating: false,
    hasValidationMessage: false,
  },
};