import type { Meta, StoryObj } from '@storybook/react';
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
    variant: {
      control: 'select',
      options: ['empty', 'already-has-coach'],
    },
    isValidating: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof JoinGroup>;

export const Empty: Story = {
  args: {
    variant: 'empty',
    locale: 'en',
    couponCode: '',
    onCouponCodeChange: (value: string) => console.log('Coupon code changed:', value),
    onValidateCode: () => {
      alert('Validation successful: Code validated!');
      console.log('Validate code clicked');
    },
    isValidating: false,
  },
};

export const WithCouponCode: Story = {
  args: {
    variant: 'empty',
    locale: 'en',
    couponCode: 'ACME_MKTG_2025',
    onCouponCodeChange: (value: string) => console.log('Coupon code changed:', value),
    onValidateCode: () => {
      alert('Validation successful: Code validated!');
      console.log('Validate code clicked');
    },
    isValidating: false,
  },
};

export const Validating: Story = {
  args: {
    variant: 'empty',
    locale: 'en',
    couponCode: 'ACME_MKTG_2025',
    onCouponCodeChange: (value: string) => console.log('Coupon code changed:', value),
    onValidateCode: () => {
      alert('Validation in progress...');
      console.log('Validate code clicked');
    },
    isValidating: true,
  },
};

export const WithValidationError: Story = {
  args: {
    variant: 'empty',
    locale: 'en',
    couponCode: 'INVALID_CODE',
    onCouponCodeChange: (value: string) => console.log('Coupon code changed:', value),
    onValidateCode: () => {
      alert('Validation failed: Invalid coupon code. Please check and try again.');
      console.log('Validate code clicked - showing validation error');
    },
    isValidating: false,
    validationError: 'Invalid coupon code. Please check and try again.',
  },
};

export const NetworkError: Story = {
  args: {
    variant: 'empty',
    locale: 'en',
    couponCode: 'ACME_MKTG_2025',
    onCouponCodeChange: (value: string) => console.log('Coupon code changed:', value),
    onValidateCode: () => {
      alert('Network error: Please try again later.');
      console.log('Validate code clicked - network error');
    },
    isValidating: false,
    validationError: 'Network error. Please try again later.',
  },
};

export const AlreadyHasCoach: Story = {
  args: {
    variant: 'already-has-coach',
    locale: 'en',
    couponCode: 'P&G_Frankfurt_ADT',
    onCouponCodeChange: (value: string) => console.log('Coupon code changed:', value),
    onValidateCode: () => {
      alert('Validation failed: There is already a coach for this group');
      console.log('Validate code clicked - already has coach');
    },
    isValidating: false,
    validationError: 'There is already a coach for this group',
  },
};

export const German: Story = {
  args: {
    variant: 'empty',
    locale: 'de',
    couponCode: '',
    onCouponCodeChange: (value: string) => console.log('Coupon code changed:', value),
    onValidateCode: () => {
      alert('Validierung erfolgreich: Code validiert!');
      console.log('Validate code clicked');
    },
    isValidating: false,
  },
};