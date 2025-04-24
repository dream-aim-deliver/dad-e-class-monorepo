// SingleChoicePreview.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import SingleChoicePreview from '../lib/components/single-choice-preview';

const meta: Meta<typeof SingleChoicePreview> = {
  title: 'Components/SingleChoicePreview',
  component: SingleChoicePreview,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    filled: { control: 'boolean' }
  }
};

export default meta;
type Story = StoryObj<typeof SingleChoicePreview>;

// Base story with multiple options - all initially unselected
export const Default: Story = {
  render: (args) => {
    // Need to use a wrapper with state since we're handling selection state
    const SingleChoicePreviewWithState = () => {
      const [selectedOption, setSelectedOption] = useState<string | null>(null);

      // All options initially have isSelected = false
      const options = [
        { label: 'Option 1', isSelected: selectedOption === 'Option 1' },
        { label: 'Option 2', isSelected: selectedOption === 'Option 2' },
        { label: 'Option 3', isSelected: selectedOption === 'Option 3' },
      ];

      const handleChange = (option: string) => {
        setSelectedOption(option);
      };

      return (
        <SingleChoicePreview
          title="What is your favorite color?"
          options={options}
          onChange={handleChange}
        />
      );
    };

    return <SingleChoicePreviewWithState />;
  }
};

// Story with many options to demonstrate scrolling behavior
export const ManyOptions: Story = {
  render: (args) => {
    const SingleChoicePreviewWithState = () => {
      const [selectedOption, setSelectedOption] = useState<string | null>(null);

      const options = [
        { label: 'Red', isSelected: selectedOption === 'Red' },
        { label: 'Blue', isSelected: selectedOption === 'Blue' },
        { label: 'Green', isSelected: selectedOption === 'Green' },
        { label: 'Yellow', isSelected: selectedOption === 'Yellow' },
        { label: 'Purple', isSelected: selectedOption === 'Purple' },
        { label: 'Orange', isSelected: selectedOption === 'Orange' },
        { label: 'Pink', isSelected: selectedOption === 'Pink' },
        { label: 'Black', isSelected: selectedOption === 'Black' },
        { label: 'White', isSelected: selectedOption === 'White' },
      ];

      const handleChange = (option: string) => {
        setSelectedOption(option);
      };

      return (
        <SingleChoicePreview
          title="Select your favorite color:"
          options={options}
          onChange={handleChange}
        />
      );
    };

    return <SingleChoicePreviewWithState />;
  }
};

// Story with a long title
export const LongTitle: Story = {
  render: (args) => {
    const SingleChoicePreviewWithState = () => {
      const [selectedOption, setSelectedOption] = useState<string | null>(null);

      const options = [
        { label: 'Yes', isSelected: selectedOption === 'Yes' },
        { label: 'No', isSelected: selectedOption === 'No' },
        { label: 'Maybe', isSelected: selectedOption === 'Maybe' },
      ];

      const handleChange = (option: string) => {
        setSelectedOption(option);
      };

      return (
        <SingleChoicePreview
          title="This is a very long title that might wrap to multiple lines and we want to see how the component handles this kind of situation in the UI"
          options={options}
          onChange={handleChange}
        />
      );
    };

    return <SingleChoicePreviewWithState />;
  }
};

// Story with long option labels
export const LongOptionLabels: Story = {
  render: (args) => {
    const SingleChoicePreviewWithState = () => {
      const [selectedOption, setSelectedOption] = useState<string | null>(null);

      const options = [
        {
          label: 'This is a very long option label that might wrap to multiple lines',
          isSelected: selectedOption === 'This is a very long option label that might wrap to multiple lines'
        },
        {
          label: 'This is another long option with lots of text to demonstrate wrapping behavior',
          isSelected: selectedOption === 'This is another long option with lots of text to demonstrate wrapping behavior'
        },
        {
          label: 'A third lengthy option to see how the component handles long text',
          isSelected: selectedOption === 'A third lengthy option to see how the component handles long text'
        },
      ];

      const handleChange = (option: string) => {
        setSelectedOption(option);
      };

      return (
        <SingleChoicePreview
          title="Select an option:"
          options={options}
          onChange={handleChange}
        />
      );
    };

    return <SingleChoicePreviewWithState />;
  }
};

//Story with filled options
export const Filled: Story = {
  render: (args) => {
    const SingleChoicePreviewWithState = () => {
      const [selectedOption, setSelectedOption] = useState<string | null>(null);

      const options = [
        { label: 'Option 1', isSelected: true },
        { label: 'Option 2', isSelected: selectedOption === 'Option 2' },
        { label: 'Option 3', isSelected: selectedOption === 'Option 3' },
      ];


      return (
        <SingleChoicePreview
          title="What is your favorite color?"
          options={options}
          filled={true}
        />
      );
    }
    return <SingleChoicePreviewWithState />;
  }
};


