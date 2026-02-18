import type { Meta, StoryObj } from '@storybook/react-vite';
import DefaultNotFound from '../lib/components/default-not-found';

const meta: Meta<typeof DefaultNotFound> = {
  title: 'Components/DefaultNotFound',
  component: DefaultNotFound,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A modern not found component with centered layout, icon, and optional retry functionality.'
      }
    }
  },
  argTypes: {
    locale: {
      control: { type: 'select' },
      options: ['en', 'de'],
      description: 'Language locale for text content'
    },
    title: {
      control: 'text',
      description: 'Custom title (overrides default translation)'
    },
    description: {
      control: 'text',
      description: 'Custom description (overrides default translation)'
    },
    buttonLabel: {
      control: 'text',
      description: 'Custom button label (overrides default translation)'
    }
  },
  args: {
    locale: 'en'
  }
};

export default meta;
type Story = StoryObj<typeof DefaultNotFound>;

// Default not found
export const Default: Story = {
  args: {
    locale: 'en'
  }
};

// With retry functionality
export const WithRetry: Story = {
  args: {
    locale: 'en',
    onRetry: () => console.log('Retry clicked')
  }
};

export const German: Story = {
  args: {
    locale: 'de'
  }
};

export const GermanWithRetry: Story = {
  args: {
    locale: 'de',
    onRetry: () => console.log('Retry clicked')
  }
};