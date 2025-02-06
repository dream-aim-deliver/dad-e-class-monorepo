import { Meta, StoryObj } from "@storybook/react";
import { Button } from "@/components/button";
import { NextIntlClientProvider } from "next-intl";

/**
 * Mock messages for translations.
 */
const mockMessages = {
  hello: "Hello",
  world: "World",
  disabled: "Disabled Button",
  icons: "Button with Icons",
};

/**
 * Storybook configuration for the Button component.
 */
const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <NextIntlClientProvider locale="en" messages={mockMessages}>
        <Story />
      </NextIntlClientProvider>
    ),
  ],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "text"],
      description: "The visual style of the button.",
    },
    size: {
      control: "select", // Dropdown for selecting button sizes
      options: ["small", "medium", "big", "huge"], // Available sizes
      description: "The size of the button.",
    },
    disabled: {
      control: "boolean", // Checkbox for enabling/disabling the button
      description: "Whether the button is disabled.",
    },
    hasIconLeft: {
      control: "boolean", // Checkbox for adding an icon on the left
      description: "Whether to display an icon on the left side of the button.",
    },
    hasIconRight: {
      control: "boolean", // Checkbox for adding an icon on the right
      description: "Whether to display an icon on the right side of the button.",
    },
    textKey: {
      control: "text", // Text input for the translation key
      description: "The translation key for the button's text content.",
    },
    onClick: {
      action: "clicked", // Logs a message when the button is clicked
      description: "Callback function triggered when the button is clicked.",
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
    variant: "primary",
    size: "medium",
    textKey: "hello", // Example translation key
    disabled: false,
    hasIconLeft: false,
    hasIconRight: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "A primary button with medium size and no icons. It uses the `textKey` prop for displaying translated text.",
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
    variant: "secondary",
    size: "medium",
    textKey: "world", 
  },
  parameters: {
    docs: {
      description: {
        story:
          "A secondary button with medium size and an icon on the left. It uses the `textKey` prop for displaying translated text.",
      },
    },
  },
};

/**
 * Disabled button story.
 */
export const Disabled = {
  ...Template,
  args: {
    variant: "primary",
    size: "medium",
    textKey: "disabled", // Example translation key
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "A disabled primary button with medium size. The button is non-interactive and visually dimmed.",
      },
    },
  },
};

/**
 * Button with both left and right icons.
 */
export const WithIcons = {
  ...Template,
  args: {
    variant: "primary",
    size: "medium",
    textKey: "icons", // Example translation key
    disabled: false,
    hasIconLeft: true,
    iconLeft: "←", // Example left icon
    hasIconRight: true,
    iconRight: "→", // Example right icon
  },
  parameters: {
    docs: {
      description: {
        story:
          "A primary button with medium size and icons on both sides. It demonstrates how icons can be added to enhance the button's appearance.",
      },
    },
  },
};