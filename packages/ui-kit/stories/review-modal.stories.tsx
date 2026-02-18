import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  CoachingReviewProps,
  CourseCourseReviewProps,
  ReviewModal,
} from '../lib/components/review/review-modal';

// Mock provider for locale
const LocaleProvider: React.FC<{
  locale: string;
  children: React.ReactNode;
}> = ({ locale, children }) => {
  return <div data-locale={locale}>{children}</div>;
};

const meta: Meta<typeof ReviewModal> = {
  title: 'Components/Review/ReviewModal',
  component: ReviewModal,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story, context) => (
      <LocaleProvider locale={context.args.locale || 'en'}>
        <Story />
      </LocaleProvider>
    ),
  ],
  argTypes: {
    locale: {
      control: 'select',
      options: ['en', 'de'],
      description: 'The locale for the dialog (e.g., for translations).',
    },
    isLoading: {
      control: 'boolean',
      description:
        'Indicates if the form is in a loading state, showing a spinner.',
    },
    isError: {
      control: 'boolean',
      description: 'Indicates if an error occurred, showing the error message.',
    },
    submitted: {
      control: 'boolean',
      description:
        'Indicates if the form has been successfully submitted, showing the success view.',
    },
    variant: {
      control: 'select',
      options: ['card', 'dialog'],
      description:
        'The variant of the modal: card (default div-based) or dialog (with overlay).',
    },
    onClose: {
      action: 'dialog-closed',
      description: 'Callback triggered when the dialog is closed.',
    },
    onSubmit: {
      action: 'review-submitted',
      description:
        'Callback triggered when the review is submitted with rating, review, and neededMoreTime.',
    },
    onSkip: {
      action: 'review-skipped',
      description: 'Callback triggered when the user skips the review.',
    },
    modalType: {
      control: 'select',
      options: ['coaching', 'course'],
      description:
        'The type of modal, either "coaching" or "course", affecting the dialog content.',
    },
  },
};

export default meta;

type Story = StoryObj<typeof ReviewModal>;

export const DefaultForm: Story = {
  decorators: [
    (Story, context) => {
      const [isLoading, setIsLoading] = React.useState(false);
      const [isError, setIsError] = React.useState(false);
      const [submitted, setSubmitted] = React.useState(false);

      return (
        <Story
          args={{
            ...context.args,
            ...({} as CoachingReviewProps),
            variant: 'card',
            isLoading,
            isError,
            submitted,
            onSubmit: (rating, review, neededMoreTime) => {
              setIsLoading(true);
              setTimeout(() => {
                setIsLoading(false);
                setSubmitted(true); // Set submitted to true for success
                alert(
                  `Review Submitted Successfully: Rating=${rating}, Review="${review}", Needed More Time=${neededMoreTime}`,
                );
                console.log(
                  `Review Submitted: Rating=${rating}, Review="${review}", Needed More Time=${neededMoreTime}`,
                );
              }, 1000);
            },
          }}
        />
      );
    },
  ],
  args: {
    locale: 'en',
    modalType: 'coaching',
    variant: 'card',
    onClose: () => {
      alert('Close button clicked');
      console.log('Dialog Closed');
    },

    onSkip: () => {
      alert('Skip button clicked');
      console.log('Review Skipped');
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'The default ReviewDialog in its form state (English), allowing users to rate, write a review, check "Did you need more time?", submit, skip, or close. On successful submission, it shows the success view after a 1-second loading state. Alerts show the submitted data, skip action, and close action.',
      },
    },
  },
};

export const lessonModal: Story = {
  decorators: [
    (Story, context) => {
      const [isLoading, setIsLoading] = React.useState(false);
      const [isError, setIsError] = React.useState(false);
      const [submitted, setSubmitted] = React.useState(false);

      return (
        <Story
          args={{
            ...context.args,
            ...({} as CoachingReviewProps),
            variant: 'card',
            isLoading,
            isError,
            submitted,
            onSubmit: async (rating, review, neededMoreTime) => {
              setIsLoading(true);
              setTimeout(() => {
                setIsLoading(false);
                setSubmitted(true); // Set submitted to true for success
                alert(
                  `Review Submitted Successfully: Rating=${rating}, Review="${review}", Needed More Time=${neededMoreTime}`,
                );
                console.log(
                  `Review Submitted: Rating=${rating}, Review="${review}", Needed More Time=${neededMoreTime}`,
                );
              }, 1000);
            },
          }}
        />
      );
    },
  ],
  args: {
    locale: 'en',
    modalType: 'coaching',
    variant: 'card',
    onClose: () => {
      alert('Close button clicked');
      console.log('Dialog Closed');
    },
    onSkip: () => {
      alert('Skip button clicked');
      console.log('Review Skipped');
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'The ReviewDialog in its form state (English) for coaching modal type, allowing users to rate, write a review, check "Did you need more time?", submit, skip, or close. On successful submission, it shows the success view after a 1-second loading state. Alerts show the submitted data, skip action, and close action.',
      },
    },
  },
};

export const DefaultFormGerman: Story = {
  args: {
    ...DefaultForm.args,
    locale: 'de',
    modalType: 'course',
    onSubmit: (rating, review) => {
      alert(
        `Bewertung erfolgreich eingereicht: Bewertung=${rating}, Rezension="${review}"`,
      );
      console.log(
        `Bewertung eingereicht: Bewertung=${rating}, Rezension="${review}"`,
      );
    },
  },
  decorators: DefaultForm.decorators, // Reuse the same decorator
  parameters: {
    docs: {
      description: {
        story:
          'The ReviewDialog in its form state with German locale, showing translated text. On successful submission, it shows the success view after a 1-second loading state. Alerts show the submitted data, skip action, and close action.',
      },
    },
  },
};

export const SuccessView: Story = {
  args: {
    locale: 'en',
    isLoading: false,
    isError: false,
    submitted: true, // Force success view
    onClose: () => {
      alert('Close button clicked');
      console.log('Dialog Closed');
    },
    onSubmit: (rating, review, neededMoreTime) => {
      console.log(
        `Review Submitted: Rating=${rating}, Review="${review}", Needed More Time=${neededMoreTime}`,
      );
    },
    onSkip: () => {
      alert('Skip button clicked');
      console.log('Review Skipped');
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'The ReviewDialog in its success view, shown when submitted is true. Use the DefaultForm story to test submission flow. Alerts show the close action.',
      },
    },
  },
};

export const LoadingState: Story = {
  args: {
    locale: 'en',
    modalType: 'coaching',
    isLoading: true,
    isError: false,
    submitted: false,
    onClose: () => {
      alert('Close button clicked');
      console.log('Dialog Closed');
    },
    onSubmit: (rating, review, neededMoreTime) => {
      console.log(
        `Review Submitted: Rating=${rating}, Review="${review}", Needed More Time=${neededMoreTime}`,
      );
    },
    onSkip: () => {
      alert('Skip button clicked');
      console.log('Review Skipped');
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'The ReviewDialog in its loading state, shown when isLoading is true. The submit and skip buttons are disabled, and the IconLoaderSpinner is displayed. Alerts show the close action.',
      },
    },
  },
};

export const ErrorState: Story = {
  args: {
    locale: 'en',
    modalType: 'coaching',
    isLoading: false,
    isError: true,
    submitted: false,

    onClose: () => {
      alert('Close button clicked');
      console.log('Dialog Closed');
    },

    onSubmit: (rating, review, neededMoreTime) => {
      alert(
        `Review Submitted (Simulated Error): Rating=${rating}, Review="${review}", Needed More Time=${neededMoreTime}`,
      );
      console.log(
        `Review Submitted: Rating=${rating}, Review="${review}", Needed More Time=${neededMoreTime}`,
      );
    },

    onSkip: () => {
      alert('Skip button clicked');
      console.log('Review Skipped');
    },

    variant: 'card',
  },
  parameters: {
    docs: {
      description: {
        story:
          'The ReviewDialog in its error state, shown when isError is true. Displays the error message from dictionary.components.ReviewModal.errorState. User inputs are preserved. Alerts show the close action.',
      },
    },
  },
};

export const ErrorStateGerman: Story = {
  args: {
    ...ErrorState.args,
    locale: 'de',
    modalType: 'coaching',
  },
  parameters: {
    docs: {
      description: {
        story:
          'The ReviewDialog in its error state with German locale, showing the translated error message from dictionary.components.ReviewModal.errorState. User inputs are preserved. Alerts show the close action.',
      },
    },
  },
};

export const SkippedAction: Story = {
  args: {
    locale: 'en',
    modalType: 'coaching',
    isLoading: false,
    isError: false,
    submitted: false,
    onClose: () => {
      alert('Close button clicked');
      console.log('Dialog Closed');
    },
    onSubmit: (rating, review, neededMoreTime) => {
      console.log(
        `Review Submitted: Rating=${rating}, Review="${review}", Needed More Time=${neededMoreTime}`,
      );
    },
    onSkip: () => {
      alert('Skip button clicked');
      console.log('Review Skipped');
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'The ReviewDialog demonstrating the skip action. The skip button is always enabled, and clicking it triggers the onSkip callback, showing an alert. Alerts also show the close action.',
      },
    },
  },
};

export const ErrorStateWithPreservedData: Story = {
  decorators: [
    (Story, context) => {
      const [isError, setIsError] = React.useState(false);
      const [isLoading, setIsLoading] = React.useState(false);
      const [submitted, setSubmitted] = React.useState(false);

      return (
        <Story
          args={{
            ...context.args,
            ...({} as CoachingReviewProps),
            isError,
            isLoading,
            submitted,
            onSubmit: async (rating, review, neededMoreTime) => {
              setIsLoading(true);
              // Simulate an API call that fails
              await new Promise((resolve) => setTimeout(resolve, 1000));
              setIsLoading(false);
              setIsError(true); // Set error state
              // Do NOT set submitted to true
              alert(
                `Submission Failed (Simulated Error): Rating=${rating}, Review="${review}", Needed More Time=${neededMoreTime}`,
              );
              console.log(
                `Submission Failed: Rating=${rating}, Review="${review}", Needed More Time=${neededMoreTime}`,
              );
              throw new Error('Simulated submission error'); // Throw error to trigger component's error handling
            },
            onClose: () => {
              alert('Close button clicked');
              console.log('Dialog Closed');
            },
            onSkip: () => {
              alert('Skip button clicked');
              console.log('Review Skipped');
            },
          }}
        />
      );
    },
  ],
  args: {
    locale: 'en',
    modalType: 'coaching',
    variant: 'card',
  },
  parameters: {
    docs: {
      description: {
        story:
          'The ReviewDialog with a simulated error on submission. When the user submits the form, it enters a loading state for 1 second, then shows an error state in the form view. User inputs (rating, review, neededMoreTime) are preserved, and the success view is not shown. Alerts show the attempted submission data, skip action, and close action.',
      },
    },
  },
};

// Dialog variant stories
export const DialogForm: Story = {
  decorators: [
    (Story, context) => {
      const [isOpen, setIsOpen] = React.useState(true);
      const [isLoading, setIsLoading] = React.useState(false);
      const [isError, setIsError] = React.useState(false);
      const [submitted, setSubmitted] = React.useState(false);

      return (
        <Story
          args={{
            ...context.args,
            ...({} as CoachingReviewProps),
            variant: 'dialog',
            isOpen,
            onOpenChange: setIsOpen,
            isLoading,
            isError,
            submitted,
            onSubmit: (rating, review, neededMoreTime) => {
              setIsLoading(true);
              setTimeout(() => {
                setIsLoading(false);
                setSubmitted(true);
                alert(
                  `Review Submitted Successfully: Rating=${rating}, Review="${review}", Needed More Time=${neededMoreTime}`,
                );
                console.log(
                  `Review Submitted: Rating=${rating}, Review="${review}", Needed More Time=${neededMoreTime}`,
                );
              }, 1000);
            },
            onClose: () => {
              setIsOpen(false);
              alert('Close button clicked');
              console.log('Dialog Closed');
            },
            onSkip: () => {
              setIsOpen(false);
              alert('Skip button clicked');
              console.log('Review Skipped');
            },
          }}
        />
      );
    },
  ],
  args: {
    locale: 'en',
    modalType: 'coaching',
  },
  parameters: {
    docs: {
      description: {
        story:
          'The ReviewModal in dialog variant with form state. Uses Dialog component with overlay, escape key, and overlay click to close. On successful submission, shows success view after loading.',
      },
    },
  },
};

export const DialogSuccess: Story = {
  decorators: [
    (Story, context) => {
      const [isOpen, setIsOpen] = React.useState(true);

      return (
        <Story
          args={{
            ...context.args,
            ...({} as CourseCourseReviewProps),
            variant: 'dialog',
            isOpen,
            onOpenChange: setIsOpen,
            submitted: true,
            onClose: () => {
              setIsOpen(false);
              alert('Close button clicked');
              console.log('Dialog Closed');
            },
            onSubmit: (rating, review) => {
              console.log(
                `Review Submitted: Rating=${rating}, Review="${review}"`,
              );
            },
            onSkip: () => {
              setIsOpen(false);
              alert('Skip button clicked');
              console.log('Review Skipped');
            },
          }}
        />
      );
    },
  ],
  args: {
    locale: 'en',
    modalType: 'course',
  },
  parameters: {
    docs: {
      description: {
        story:
          'The ReviewModal in dialog variant with success state. Shows the thank you message with review and stars. Can be closed via overlay click, escape, or close button.',
      },
    },
  },
};
