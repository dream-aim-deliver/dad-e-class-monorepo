import { Meta, StoryObj } from '@storybook/react';
import { Badge } from '../lib/components/badge';
import React from 'react';

/**
 * Storybook configuration for the Badge component.
 */
const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="flex justify-center items-center">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'primary',
        'info',
        'successprimary',
        'warningprimary',
        'errorprimary',
      ],
      description: 'The visual style of the badge.',
    },
    size: {
      control: 'select',
      options: ['small', 'big'],
      description: 'The size of the badge.',
    },
    text: {
      control: 'text',
      description: 'The text content of the badge.',
    },
    onClick: {
      action: 'clicked',
      description: 'Callback function triggered when the badge is clicked.',
    },
    className: {
      control: 'text',
      description: 'Additional CSS class names to customize the badge.',
    },
  },
};

export default meta;

/**
 * Template for rendering the Badge component with customizable props.
 */
const Template: StoryObj<typeof Badge> = {
  render: (args) => <Badge {...args} />,
};

/**
 * Default story showcasing an informational badge.
 */
export const Info = {
  ...Template,
  args: {
    variant: 'info',
    size: 'small',
    text: 'Info Badge',
  },
  parameters: {
    docs: {
      description: {
        story:
          'An informational badge with a neutral background and small size. It uses the `text` prop to display content.',
      },
    },
  },
};

/**
 * Primary badge story.
 */
export const Primary = {
  ...Template,
  args: {
    variant: 'primary',
    size: 'small',
    text: 'Primary Badge',
  },
};

/**
 * Success badge story.
 */
export const SuccessPrimary = {
  ...Template,
  args: {
    variant: 'successprimary',
    size: 'big',
    text: 'Success Badge',
  },
};

/**
 * Warning badge story.
 */
export const WarningPrimary = {
  ...Template,
  args: {
    variant: 'warningprimary',
    size: 'big',
    text: 'Warning Badge',
  },
};

/**
 * Error badge story.
 */
export const ErrorPrimary = {
  ...Template,
  args: {
    variant: 'errorprimary',
    size: 'small',
    text: 'Error Badge',
  },
};

/**
 * Interactive badge story with an onClick handler.
 */
export const ClickableBadge = {
  ...Template,
  args: {
    variant: 'info',
    size: 'big',
    text: 'Clickable Badge',
    onClick: () => alert('Badge clicked!'),
  },
};
