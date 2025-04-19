import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ReviewDialog } from '../lib/components/review-coachingsession-modal'; 


const meta: Meta<typeof ReviewDialog> = {
  title: 'Components/ReviewDialog',
  component: ReviewDialog,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    locale: {
      control: 'select',
      options: ['en', 'de'],
      description: 'The locale for the dialog (e.g., for translations).',
    },
    onClose: {
      action: 'dialog-closed',
      description: 'Callback triggered when the dialog is closed.',
    },
    onSubmit: {
      action: 'review-submitted',
      description: 'Callback triggered when the review is submitted with rating, review, neededMoreTime, and skipped status.',
    },
    onSkip: {
      action: 'review-skipped',
      description: 'Callback triggered when the user skips the review with skipped status.',
    },
  },
};

export default meta;

type Story = StoryObj<typeof ReviewDialog>;

export const DefaultForm: Story = {
  args: {
    locale: 'en',
    onClose: () => console.log('Dialog Closed'),
    onSubmit: async (rating, review, neededMoreTime, skipped) => {
      console.log(
        `Review Submitted: Rating=${rating}, Review="${review}", Needed More Time=${neededMoreTime}, Skipped=${skipped}`
      );
      return Promise.resolve();
    },
    onSkip: (skipped) => console.log(`Review Skipped: Skipped=${skipped}`),
  },
  parameters: {
    docs: {
      description: {
        story: 'The default ReviewDialog in its form state (English), allowing users to rate, write a review, check "Did you need more time?", submit, skip, or close. Logs actions to the console.',
      },
    },
  },
};


export const DefaultFormGerman: Story = {
  args: {
    locale: 'de',
    onClose: () => console.log('Dialog Closed'),
    onSubmit: async (rating, review, neededMoreTime, skipped) => {
      console.log(
        `Review Submitted: Rating=${rating}, Review="${review}", Needed More Time=${neededMoreTime}, Skipped=${skipped}`
      );
      return Promise.resolve();
    },
    onSkip: (skipped) => console.log(`Review Skipped: Skipped=${skipped}`),
  },
  parameters: {
    docs: {
      description: {
        story: 'The ReviewDialog in its form state with German locale, showing translated text for all elements.',
      },
    },
  },
};


export const SuccessView: Story = {
  args: {
    locale: 'en',
    onClose: () => console.log('Dialog Closed'),
    onSubmit: async (rating, review, neededMoreTime, skipped) => {
      console.log(
        `Review Submitted: Rating=${rating}, Review="${review}", Needed More Time=${neededMoreTime}, Skipped=${skipped}`
      );
      return Promise.resolve();
    },
    onSkip: (skipped) => console.log(`Review Skipped: Skipped=${skipped}`),
  },
  parameters: {
    docs: {
      description: {
        story: 'The ReviewDialog in its success view, shown after a successful submission. To see this state, submit a valid form (rating > 0 and non-empty review) in the Storybook canvas.',
      },
    },
  },
};


export const LoadingState: Story = {
  args: {
    locale: 'en',
    onClose: () => console.log('Dialog Closed'),
    onSubmit: async (rating, review, neededMoreTime, skipped) => {
      console.log(
        `Review Submitted: Rating=${rating}, Review="${review}", Needed More Time=${neededMoreTime}, Skipped=${skipped}`
      );
      // Simulate a slow backend response
      return new Promise((resolve) => setTimeout(resolve, 2000));
    },
    onSkip: (skipped) => console.log(`Review Skipped: Skipped=${skipped}`),
  },
  parameters: {
    docs: {
      description: {
        story: 'The ReviewDialog in its loading state, shown when the form is being submitted. Submit a valid form to see the loading spinner for 2 seconds.',
      },
    },
  },
};

export const ErrorState: Story = {
  args: {
    locale: 'en',
    onClose: () => console.log('Dialog Closed'),
    onSubmit: async (rating, review, neededMoreTime, skipped) => {
      console.log(
        `Review Submitted: Rating=${rating}, Review="${review}", Needed More Time=${neededMoreTime}, Skipped=${skipped}`
      );
      // Simulate a backend error
      return Promise.reject(new Error('Backend failure'));
    },
    onSkip: (skipped) => console.log(`Review Skipped: Skipped=${skipped}`),
  },
  parameters: {
    docs: {
      description: {
        story: 'The ReviewDialog in its error state, shown when the backend submission fails. Submit a valid form to see the error message.',
      },
    },
  },
};


export const SkippedAction: Story = {
  args: {
    locale: 'en',
    onClose: () => console.log('Dialog Closed'),
    onSubmit: async (rating, review, neededMoreTime, skipped) => {
      console.log(
        `Review Submitted: Rating=${rating}, Review="${review}", Needed More Time=${neededMoreTime}, Skipped=${skipped}`
      );
      return Promise.resolve();
    },
    onSkip: (skipped) => console.log(`Review Skipped: Skipped=${skipped}`),
  },
  parameters: {
    docs: {
      description: {
        story: 'The ReviewDialog demonstrating the skip action. Click the "Skip" button to trigger the onSkip callback with skipped=true.',
      },
    },
  },
};