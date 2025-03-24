import type { Meta, StoryObj } from '@storybook/react';
import { RichTextEditor} from "../lib/components/rich-text-editor/editor"
import { CustomElement } from '../lib/components/rich-text-editor/types';
// Default initial value for the editor
const defaultInitialValue = [
  {
    type: 'paragraph',
    children: [{ text: 'This is a rich text editor. Try formatting this text!' }],
  },
];

// Meta information for the component
const meta = {
  title: 'Components/RichTextEditor',
  component: RichTextEditor,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'text',
      description: 'Name attribute for the editor',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text when editor is empty',
    },
    initialValue: {
      control: 'object',
      description: 'Initial content for the editor',
    },
    onChange: {
      action: 'changed',
      description: 'Callback when editor content changes',
    },
  },
} satisfies Meta<typeof RichTextEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

// Base story with default props
export const Default: Story = {
  args: {
    name: 'editor',
    placeholder: 'Start typing...',
    initialValue: defaultInitialValue,
    onChange: (value) => console.log('Content changed:', value),
  },
};

// Story with pre-formatted content
export const WithFormattedContent: Story = {
  args: {
    name: 'editor',
    placeholder: 'Start typing...',
    initialValue: [
      {
        type: 'h1',
        children: [{ text: 'Rich Text Editor Example' }],
      },
      {
        type: 'paragraph',
        children: [
          { text: 'This editor supports ' },
          { text: 'bold', bold: true },
          { text: ', ' },
          { text: 'italic', italic: true },
          { text: ', and ' },
          { text: 'underlined', underline: true },
          { text: ' text.' },
        ],
      } ,
      {
        type: 'block-quote',
        children: [{ text: 'You can also add blockquotes like this one.' }],
      },
      {
        type: 'bulleted-list',
        children: [
          {
            type: 'list-item',
            children: [{ text: 'And create lists' }],
          },
          {
            type: 'list-item',
            children: [{ text: 'With multiple items' }],
          } ,
        ],
      },
    ],
    onChange: (value) => console.log('Content changed:', value),
  },
};

// Story with empty editor
export const EmptyEditor: Story = {
  args: {
    name: 'editor',
    placeholder: 'Type something to begin...',
    initialValue: [
      {
        type: 'paragraph',
        children: [{ text: '' }],
      },
    ],
    onChange: (value) => console.log('Content changed:', value),
  },
};

// Story with custom height
export const CustomHeight: Story = {
  args: {
    ...Default.args,
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '800px' }}>
        <Story />
      </div>
    ),
  ],
};