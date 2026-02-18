import type { Meta, StoryObj } from '@storybook/react-vite';
import RichTextEditor from '../lib/components/rich-text-element/editor';

const meta: Meta<typeof RichTextEditor> = {
  title: 'Components/RichTextEditor',
  component: RichTextEditor,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onChange: { action: 'changed' },
    placeholder: { control: 'text' },
    name: { control: 'text' },
    initialValue: { control: 'object' },
    onLoseFocus: { action: 'changed' },
    locale: {
      control: 'select',
      options: ['en', 'de'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof RichTextEditor>;

// Default initial value for the editor
const defaultInitialValue = [
  {
    type: 'paragraph',
    children: [
      { text: 'This is a ' },
      { text: 'rich', bold: true },
      { text: ' text ' },
      { text: 'editor', italic: true },
      { text: '.' },
    ],
  },
];

// Basic usage with minimal props
export const Basic: Story = {
  args: {
    name: 'content',
    placeholder: 'Start typing...',
    initialValue: defaultInitialValue,
    onChange: (value) => null,
    onLoseFocus: (value) => console.log('Content changed:', value),
    locale: 'de',
  },
};

// Example with string input that gets converted
export const WithStringInput: Story = {
  args: {
    name: 'content',
    placeholder: 'Start typing...',

    initialValue:
      '[{"type":"paragraph","children":[{"text":"This text is highlighted.","highlight":true}]}]',

    onChange: (value) => null,
    onLoseFocus: (value) => console.log('Content changed:', value),
    locale: 'de',
  },
};

// Example with different formatting elements
export const WithFormattedContent: Story = {
  args: {
    name: 'content',
    placeholder: 'Start typing...',

    initialValue: [
      {
        type: 'h1',
        children: [{ text: 'Rich Text Editor Demo' }],
      },
      {
        type: 'paragraph',
        children: [{ text: 'This is a paragraph with plain text.' }],
      },
      {
        type: 'paragraph',
        children: [
          { text: 'You can have ' },
          { text: 'bold', bold: true },
          { text: ', ' },
          { text: 'italic', italic: true },
          { text: ', and ' },
          { text: 'underlined', underline: true },
          { text: ' text.' },
        ],
      },
      {
        type: 'bulleted-list',
        children: [
          {
            type: 'list-item',
            children: [{ text: 'Bullet point 1' }],
          },
          {
            type: 'list-item',
            children: [{ text: 'Bullet point 2' }],
          },
        ],
      },
      {
        type: 'block-quote',
        children: [{ text: 'This is a blockquote' }],
      },
      {
        type: 'paragraph',
        children: [
          { text: 'This is a ' },
          {
            text: 'link',
            type: 'link',
            url: 'https://example.com',
          },
          { text: ' example.' },
        ],
      },
    ],

    onChange: (value) => null,
    onLoseFocus: (value) => console.log('Content changed:', value),
    locale: 'en',
  },
};

// Example demonstrating the toolbar usage
export const WithToolbarUsage: Story = {
  args: {
    ...Basic.args,
    locale: 'de',
  },
  parameters: {
    docs: {
      description: {
        story:
          'This example demonstrates how to use the toolbar. Try selecting text and using the formatting buttons.',
      },
    },
  },
};
