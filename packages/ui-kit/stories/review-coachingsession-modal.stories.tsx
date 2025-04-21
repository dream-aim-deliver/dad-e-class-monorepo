import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ReviewDialog } from '../lib/components/review-coachingsession-modal';
import { getDictionary } from '@maany_shr/e-class-translations';

const meta: Meta<typeof ReviewDialog> = {
  title: 'Components/ReviewCoachingSessionModal',
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
    isLoading: {
      control: 'boolean',
      description: 'Indicates if the form is in a loading state, showing a spinner.',
    },
    isError: {
      control: 'boolean',
      description: 'Indicates if an error occurred, showing the error message.',
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
    isLoading: false,
    isError: false,
    onClose: () => console.log('Dialog Closed'),
    onSubmit: (rating, review, neededMoreTime, skipped) => {
      console.log(`Review Submitted: Rating=${rating}, Review="${review}", Needed More Time=${neededMoreTime}, Skipped=${skipped}`);
    },
    onSkip: (skipped) => console.log(`Review Skipped: Skipped=${skipped}`),
  },
  parameters: {
    docs: {
      description: {
        story: 'The default ReviewDialog in its form state (English), allowing users to rate, write a review, check "Did you need more time?", submit, skip, or close. The skip button is always enabled, and the submit button is enabled when a rating is provided.',
      },
    },
  },
};

export const DefaultFormGerman: Story = {
  args: {
    ...DefaultForm.args,
    locale: 'de',
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
    isLoading: false,
    isError: false,
    onClose: () => console.log('Dialog Closed'),
    onSubmit: (rating, review, neededMoreTime, skipped) => {
      console.log(`Review Submitted: Rating=${rating}, Review="${review}", Needed More Time=${neededMoreTime}, Skipped=${skipped}`);
    },
    onSkip: (skipped) => console.log(`Review Skipped: Skipped=${skipped}`),
  },
  parameters: {
    docs: {
      description: {
        story: 'The ReviewDialog in its success view, shown after a successful submission. To see this state, submit a valid form (rating > 0) in the Storybook canvas.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    console.log('Note: Success view requires manual form submission in Storybook canvas.');
  },
};

export const LoadingState: Story = {
  args: {
    locale: 'en',
    isLoading: true,
    isError: false,
    onClose: () => console.log('Dialog Closed'),
    onSubmit: (rating, review, neededMoreTime, skipped) => {
      console.log(`Review Submitted: Rating=${rating}, Review="${review}", Needed More Time=${neededMoreTime}, Skipped=${skipped}`);
    },
    onSkip: (skipped) => console.log(`Review Skipped: Skipped=${skipped}`),
  },
  parameters: {
    docs: {
      description: {
        story: 'The ReviewDialog in its loading state, shown when isLoading is true. The submit and skip buttons are disabled, and the IconLoaderSpinner is displayed.',
      },
    },
  },
};

export const ErrorState: Story = {
  args: {
    locale: 'en',
    isLoading: false,
    isError: true,
    onClose: () => console.log('Dialog Closed'),
    onSubmit: (rating, review, neededMoreTime, skipped) => {
      console.log(`Review Submitted: Rating=${rating}, Review="${review}", Needed More Time=${neededMoreTime}, Skipped=${skipped}`);
    },
    onSkip: (skipped) => console.log(`Review Skipped: Skipped=${skipped}`),
  },
  parameters: {
    docs: {
      description: {
        story: 'The ReviewDialog in its error state, shown when isError is true. Displays the error message from dictionary.components.reviewCoachingSessionModal.errorState.',
      },
    },
  },
};

export const ErrorStateGerman: Story = {
  args: {
    ...ErrorState.args,
    locale: 'de',
  },
  parameters: {
    docs: {
      description: {
        story: 'The ReviewDialog in its error state with German locale, showing the translated error message from dictionary.components.reviewCoachingSessionModal.errorState.',
      },
    },
  },
};

export const SkippedAction: Story = {
  args: {
    locale: 'en',
    isLoading: false,
    isError: false,
    onClose: () => console.log('Dialog Closed'),
    onSubmit: (rating, review, neededMoreTime, skipped) => {
      console.log(`Review Submitted: Rating=${rating}, Review="${review}", Needed More Time=${neededMoreTime}, Skipped=${skipped}`);
    },
    onSkip: (skipped) => console.log(`Review Skipped: Skipped=${skipped}`),
  },
  parameters: {
    docs: {
      description: {
        story: 'The ReviewDialog demonstrating the skip action. The skip button is always enabled, and clicking it triggers the onSkip callback with skipped=true.',
      },
    },
  },
};