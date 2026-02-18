import { Meta, StoryObj } from '@storybook/react-vite';
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
type Story = StoryObj<typeof ProgressBar>;

/**
 * Default read-only progress bar story
 */
export const DefaultProgress: Story = {
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

/**
 * Interactive slider story with change handling
 */
export const Slider: Story = {
  args: {
    type: 'slider',
    progress: 30,
    totalProgress: 100,
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

/**
 * Progress bar with custom maximum value
 */
export const CustomTotalProgress: Story = {
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

/**
 * Slider starting from zero value
 */
export const SliderStartZero: Story = {
  args: {
    type: 'slider',
    progress: 0,
    totalProgress: 100,
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

/**
 * Progress bar at maximum value
 */
export const FullProgress: Story = {
  args: {
    type: 'progress',
    progress: 100,
    totalProgress: 100,
  },
  parameters: {
    docs: {
      description: {
        story:
          'A progress bar showing 100% completion. Demonstrates the visual appearance when progress reaches its maximum value.',
      },
    },
  },
};

/**
 * Interactive slider with custom range
 */
export const SliderCustomRange: Story = {
  args: {
    type: 'slider',
    progress: 150,
    totalProgress: 300,
  },
  parameters: {
    docs: {
      description: {
        story:
          'An interactive slider with a custom range from 0 to 300. Shows how the component adapts to different scale requirements.',
      },
    },
  },
};

/**
 * Small progress demonstration
 */
export const LowProgress: Story = {
  args: {
    type: 'progress',
    progress: 5,
    totalProgress: 100,
  },
  parameters: {
    docs: {
      description: {
        story:
          'A progress bar showing minimal progress (5%). Useful for testing the visual appearance of low progress values.',
      },
    },
  },
};

/**
 * Interactive demonstration with state management
 */
export const InteractiveDemo: Story = {
  render: () => {
    const [progressValue, setProgressValue] = React.useState(40);
    
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Interactive Slider</h3>
          <ProgressBar
            type="slider"
            progress={progressValue}
            totalProgress={100}
            onChange={(value) => setProgressValue(value)}
          />
          <p className="text-sm text-gray-600 mt-2">
            Current value: {progressValue}/100
          </p>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2">Synchronized Progress Bar</h3>
          <ProgressBar
            type="progress"
            progress={progressValue}
            totalProgress={100}
          />
          <p className="text-sm text-gray-600 mt-2">
            This progress bar updates automatically as you move the slider above.
          </p>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Interactive demonstration showing both slider and progress bar components working together. The progress bar updates in real-time as you adjust the slider.',
      },
    },
  },
};

/**
 * Multiple progress bars comparison
 */
export const ProgressComparison: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h4 className="text-md font-medium mb-2">Project A - 85% Complete</h4>
        <ProgressBar type="progress" progress={85} totalProgress={100} />
      </div>
      
      <div>
        <h4 className="text-md font-medium mb-2">Project B - 45% Complete</h4>
        <ProgressBar type="progress" progress={45} totalProgress={100} />
      </div>
      
      <div>
        <h4 className="text-md font-medium mb-2">Project C - 20% Complete</h4>
        <ProgressBar type="progress" progress={20} totalProgress={100} />
      </div>
      
      <div>
        <h4 className="text-md font-medium mb-2">Custom Scale - 150/300</h4>
        <ProgressBar type="progress" progress={150} totalProgress={300} />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Multiple progress bars showing different completion states. Demonstrates how the component can be used to compare progress across different projects or tasks.',
      },
    },
  },
};
