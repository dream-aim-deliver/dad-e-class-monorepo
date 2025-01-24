import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { LanguageSelector } from '@/components/languageSelector';
import { LanguageSelectorProps } from '@/components/profile/types';

const StatefulLanguageSelector = (args: LanguageSelectorProps) => {
  const [selectedLanguages, setSelectedLanguages] = useState(
    args.selectedLanguages || [],
  );

  const handleChange = (newLanguages: typeof selectedLanguages) => {
    setSelectedLanguages(newLanguages);
    args.onChange?.(newLanguages); // Trigger the action for logging in Storybook
  };

  return (
    <LanguageSelector
      {...args}
      selectedLanguages={selectedLanguages}
      onChange={handleChange}
    />
  );
};

const meta: Meta<typeof LanguageSelector> = {
  title: 'Components/LanguageSelector',
  component: LanguageSelector,
  tags: ['autodocs'],
  argTypes: {
    selectedLanguages: {
      control: { type: 'object' },
      description: 'Array of selected languages with their names and codes.',
    },
    onChange: {
      action: 'onChange',
      description:
        'Callback function triggered when languages are added or removed.',
    },
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof LanguageSelector>;

export const Default: Story = {
  render: (args) => <StatefulLanguageSelector {...args} />,
  args: {
    selectedLanguages: [],
  },
};

export const SelectedLanguages: Story = {
  render: (args) => <StatefulLanguageSelector {...args} />,
  args: {
    selectedLanguages: [
      { name: 'English', code: 'en' },
      { name: 'Spanish', code: 'es' },
    ],
  },
};
