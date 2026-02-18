import type { Meta, StoryObj } from '@storybook/react-vite';
import DefaultLoading from '../lib/components/default-loading';

const meta: Meta<typeof DefaultLoading> = {
  title: 'Components/DefaultLoading',
  component: DefaultLoading,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A loading component with minimal and card variants for different use cases.'
      }
    }
  },
  argTypes: {
    locale: {
      control: { type: 'select' },
      options: ['en', 'de'],
      description: 'Language locale for loading text'
    },
    variant: {
      control: { type: 'select' },
      options: ['minimal', 'card', 'overlay'],
      description: 'Visual style variant'
    }
  },
  args: {
    locale: 'en',
    variant: 'minimal'
  }
};

export default meta;
type Story = StoryObj<typeof DefaultLoading>;

// Minimal variant
export const Minimal: Story = {
  args: {
    variant: 'minimal'
  }
};



// Card variant
export const Card: Story = {
  args: {
    variant: 'card'
  },
  parameters: {
    layout: 'centered'
  }
};


export const CardGerman: Story = {
  args: {
    variant: 'card',
    locale: 'de'
  },
  parameters: {
    layout: 'centered'
  }
};

// Overlay variant
export const Overlay: Story = {
  args: {
    variant: 'overlay'
  },
  parameters: {
    layout: 'fullscreen'
  }
};

export const OverlayGerman: Story = {
  args: {
    variant: 'overlay',
    locale: 'de'
  },
  parameters: {
    layout: 'fullscreen'
  }
};

