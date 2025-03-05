import { Meta, StoryObj } from '@storybook/react';
import { ProgressBar } from '../lib/components/progress-bar';
import React from 'react';

/**
 * Storybook configuration for the ProgressBar component.
 */
const meta: Meta<typeof ProgressBar> = {
  title: 'Components/ProgressBar',
  component: ProgressBar,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['slider', 'progress'],
      description:
        "Determines the behavior of the component. 'slider' allows user interaction, while 'progress' is read-only.",
    },
    progress: {
      control: { type: 'number', min: 0 },
      description: 'The current progress value.',
    },
    totalProgress: {
      control: { type: 'number', min: 1 },
      description: 'The maximum progress value.',
    },
    onChange: {
      action: 'changed',
      description:
        'Callback function triggered when the slider value changes (only applicable if type is "slider").',
    },
  },
};

export default meta;

const Template: StoryObj<typeof ProgressBar> = {
  render: (args) => <ProgressBar {...args} />,
};

export const DefaultProgress = {
  ...Template,
  args: {
    type: 'progress',
    progress: 50,
    totalProgress: 100,
  },
  parameters: {
    docs: {
      description: {
        story:
          'A read-only progress bar displaying the current progress as a percentage of the total progress.',
      },
    },
  },
};

export const Slider = {
  ...Template,
  args: {
    type: 'slider',
    progress: 30,
    totalProgress: 100,
    onChange: (value) => console.log(`Slider value changed to ${value}`),
  },
  parameters: {
    docs: {
      description: {
        story:
          "An interactive slider that allows users to adjust the progress value. The `onChange` callback is triggered when the slider's value changes.",
      },
    },
  },
};

export const CustomTotalProgress = {
  ...Template,
  args: {
    type: 'progress',
    progress: 25,
    totalProgress: 200,
  },
  parameters: {
    docs: {
      description: {
        story:
          'A read-only progress bar with a custom `totalProgress` value of 200, demonstrating flexibility in setting maximum limits.',
      },
    },
  },
};

export const SliderStartZero = {
  ...Template,
  args: {
    type: 'slider',
    progress: 0,
    totalProgress: 100,
    onChange: (value) => console.log(`Slider value changed to ${value}`),
  },
  parameters: {
    docs: {
      description: {
        story:
          'An interactive slider starting at zero, allowing users to incrementally adjust the progress. Useful for scenarios where progress starts from scratch.',
      },
    },
  },
};
