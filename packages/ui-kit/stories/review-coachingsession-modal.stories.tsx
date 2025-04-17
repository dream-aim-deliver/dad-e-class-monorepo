import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ReviewDialog } from '../lib/components/review-coachingsession-modal'; // Adjust the import path as needed

/**
 * Storybook configuration for the ReviewDialog component.
 */
const meta: Meta<typeof ReviewDialog> = {
  title: 'Components/ReviewDialog',
  component: ReviewDialog,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered', // Center the component in the Storybook canvas
  },
  argTypes: {
    locale: {
      control: 'select',
      options: ['en', 'de'],
      description: 'The locale for the dialog (e.g., for translations).',
    } as const, // Ensure TypeScript recognizes this as valid
    onClose: {
      action: 'dialog-closed',
      description: 'Callback triggered when the dialog is closed.',
    },
    onSubmit: {
      action: 'review-submitted',
      description: 'Callback triggered when the review is submitted with rating, review, and neededMoreTime.',
    },
    onSkip: {
      action: 'review-skipped',
      description: 'Callback triggered when the user skips the review.',
    },
  },
};

export default meta;

type Story = StoryObj<typeof ReviewDialog>;

// 🔹 Test Case 1: Default Form
export const DefaultForm: Story = {
  args: {
    locale: 'en',
    onClose: () => alert('Dialog Closed'),
    onSubmit: (rating, review, neededMoreTime) =>
      alert(`Review Submitted: Rating=${rating}, Review="${review}", Needed More Time=${neededMoreTime}`),
    onSkip: () => alert('Review Skipped'),
  },
  parameters: {
    docs: {
      description: {
        story: 'The default ReviewDialog in its form state, allowing users to rate, write a review, check "Did you need more time?", submit, skip, or close. Alerts are shown for close, submit, and skip actions.',
      },
    },
  },
};

