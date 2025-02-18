import { Meta, StoryObj } from '@storybook/react';
import { Button } from '../lib/components/button';
import { NextIntlClientProvider } from 'next-intl';
import React from 'react';
import { IconCloudDownload } from '../lib/components/icons/icon-cloud-download';
import { IconTrashAlt } from '../lib/components/icons/icon-trash-alt';

/**
 * Mock messages for translations.
 */

const mockMessages = {
  hello: 'Hello',
  world: 'World',
  disabled: 'Disabled Button',
  icons: 'Button with Icons',
};

/**
 * Storybook configuration for the Button component.
 */
const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <NextIntlClientProvider locale="en" messages={mockMessages}>
        <Story />
      </NextIntlClientProvider>
    ),
  ],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'text'],
      description: 'The visual style of the button.',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'big', 'huge'],
      description: 'The size of the button.',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled.',
    },
    hasIconLeft: {
      control: 'boolean',
      description: 'Whether to display an icon on the left side of the button.',
    },
    hasIconRight: {
      control: 'boolean',
      description: 'Whether to display an icon on the right side of the button.',
    },
    text: {
      control: 'text',
      description: 'The text content of the button.',
    },
    onClick: {
      action: 'clicked',
      description: 'Callback function triggered when the button is clicked.',
    },
  },
};

export default meta;

/**
 * Template for rendering the Button component with customizable props.
 */
const Template: StoryObj<typeof Button> = {
  render: (args) => <Button {...args} />,
};

/**
 * Default story showcasing the primary button.
 */
export const Primary = {
  ...Template,
  args: {
    variant: 'primary',
    size: 'medium',
    text: 'Primary Button',
    disabled: false,
    hasIconLeft: false,
    hasIconRight: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'A primary button with medium size and no icons. It uses the `text` prop for displaying text.',
      },
    },
  },
};

/**
 * Secondary button story.
 */
export const Secondary = {
  ...Template,
  args: {
    variant: 'secondary',
    size: 'medium',
    text: 'Secondary Button',
  },
};

/**
 * text button story.
 */
export const text = {
  ...Template,
  args: {
    variant: 'text',
    size: 'medium',
    text: 'Text Button',
    
  },
};

/**
 * Disabled button story.
 */
export const Disabled = {
  ...Template,
  args: {
    variant: 'primary',
    size: 'medium',
    text: 'Disabled Button',
    disabled: true,
  },
};

/**
 * Button with both left and right icons.
 */
export const WithIcons = {
  ...Template,
  args: {
    variant: 'secondary',
    size: 'medium',
    text: 'Button with Icons',
    className: 'gap-2',
    hasIconLeft: true,
    iconLeft: <IconCloudDownload/>,
    hasIconRight: true,
    iconRight: <IconTrashAlt />,
  },
};