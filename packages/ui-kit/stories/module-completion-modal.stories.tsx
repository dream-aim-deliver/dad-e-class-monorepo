import type { Meta, StoryObj } from '@storybook/react-vite';
import { ModuleCompletionModal } from '../lib/components/module-completion-modal';

const meta: Meta<typeof ModuleCompletionModal> = {
  title: 'Components/ModuleCompletionModal',
  component: ModuleCompletionModal,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    locale: {
      control: 'select',
      options: ['en', 'de'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof ModuleCompletionModal>;

// Test Case 1: Standard Usage (Middle Module)
export const Standard: Story = {
  args: {
    currentModule: 3,
    totalModules: 10,
    moduleTitle: 'Introduction to AI',
    onClose: () => alert('Modal closed'),
    onClickNextModule: () => alert('Go to next module'),
    locale: 'en',
  },
};

// Test Case 2: First Module Completed
export const FirstModule: Story = {
  args: {
    currentModule: 1,
    totalModules: 5,
    moduleTitle: 'Getting Started',
    onClose: () => alert('Modal closed'),
    onClickNextModule: () => alert('Go to next module'),
    locale: 'en',
  },
};

// Test Case 3: Last Module Completed (Edge Case)
export const LastModule: Story = {
  args: {
    currentModule: 8,
    totalModules: 8,
    moduleTitle: 'Capstone Project',
    onClose: () => alert('Modal closed'),
    onClickNextModule: () => alert('Go to next module'),
    locale: 'en',
  },
};

// Test Case 4: German Locale
export const GermanLocale: Story = {
  args: {
    currentModule: 2,
    totalModules: 4,
    moduleTitle: 'Einführung in KI',
    onClose: () => alert('Modal geschlossen'),
    onClickNextModule: () => alert('Zum nächsten Modul'),
    locale: 'de',
  },
};

// Test Case 5: Long Module Title
export const LongModuleTitle: Story = {
  args: {
    currentModule: 5,
    totalModules: 12,
    moduleTitle: 'Advanced Machine Learning Techniques for Real-World Applications and Industry Use Cases',
    onClose: () => alert('Modal closed'),
    onClickNextModule: () => alert('Go to next module'),
    locale: 'en',
  },
};

