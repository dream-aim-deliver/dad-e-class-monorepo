import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import MultipleChoicePreview from '../lib/components/multiple-choice-preview';

const meta: Meta<typeof MultipleChoicePreview> = {
    title: 'Components/MultipleChoicePreview',
    component: MultipleChoicePreview,
    parameters: {
      layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
      title: { control: 'text' },
      options: { control: 'object' },
      filled: { control: 'boolean' },
    },
  };
  
  export default meta;
  type Story = StoryObj<typeof MultipleChoicePreview>;
  
  // Use a properly-defined React component for interactive stories
  const InteractiveMultipleChoicePreview = (props) => {
    const [options, setOptions] = useState(props.options);
    
    const handleChange = (selectedLabel) => {
      setOptions(options.map(option => 
        option.label === selectedLabel 
          ? { ...option, isSelected: !option.isSelected } 
          : option
      ));
    };
    
    return (
      <MultipleChoicePreview 
        {...props} 
        options={options} 
        onChange={handleChange} 
      />
    );
  };
  
  // Default story without state management
  export const Default: Story = {
    args: {
      title: 'Select your favorite fruits',
      options: [
        { label: 'Apple', isSelected: false },
        { label: 'Banana', isSelected: false },
        { label: 'Orange', isSelected: false },
        { label: 'Strawberry', isSelected: false },
      ],
      filled: false,
      // For the actual component, provide a no-op function
      onChange: (label) => console.log(`Option changed: ${label}`),
    },
  };
  
  // Interactive story using a render function and the interactive component
  export const Interactive: Story = {
    render: (args) => <InteractiveMultipleChoicePreview {...args} />,
    args: {
      title: 'Interactive Selection (Try clicking)',
      options: [
        { label: 'Apple', isSelected: false },
        { label: 'Banana', isSelected: false },
        { label: 'Orange', isSelected: false },
        { label: 'Strawberry', isSelected: false },
      ],
      filled: false,
    },
  };
  
  export const WithSelectedOptions: Story = {
    args: {
      title: 'Select your favorite fruits',
      options: [
        { label: 'Apple', isSelected: true },
        { label: 'Banana', isSelected: false },
        { label: 'Orange', isSelected: true },
        { label: 'Strawberry', isSelected: false },
      ],
      filled: false,
      onChange: (label) => console.log(`Option changed: ${label}`),
    },
  };
  
  export const FilledMode: Story = {
    args: {
      title: 'Your selected fruits (read-only)',
      options: [
        { label: 'Apple', isSelected: true },
        { label: 'Banana', isSelected: false },
        { label: 'Orange', isSelected: true },
        { label: 'Strawberry', isSelected: false },
      ],
      filled: true,
    },
  };
  
  export const LongOptionLabels: Story = {
    render: (args) => <InteractiveMultipleChoicePreview {...args} />,
    args: {
      title: 'Terms and conditions',
      options: [
        { label: 'I agree to the terms of service and privacy policy of this application', isSelected: false },
        { label: 'I would like to receive marketing emails and promotions from your company', isSelected: false },
        { label: 'I understand that my data will be processed in accordance with GDPR regulations', isSelected: false },
      ],
      filled: false,
    },
  };
  
  export const SingleOption: Story = {
    render: (args) => <InteractiveMultipleChoicePreview {...args} />,
    args: {
      title: 'Confirm your choice',
      options: [
        { label: 'I confirm this selection', isSelected: false }
      ],
      filled: false,
    },
  };