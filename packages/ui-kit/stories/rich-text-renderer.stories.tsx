import { Meta, StoryFn } from '@storybook/react-vite';
import RichTextRenderer from '../lib/components/rich-text-element/renderer';
import { Descendant } from 'slate';
import { slateifySerialize } from '../lib/components/rich-text-element/serializer';

export default {
  title: 'Components/RichTextRenderer',
  component: RichTextRenderer,
} as Meta;

const onDeserializationError = (message: string, error: Error) => {
  console.error(`${message}. Error: ${error}`);
}

const Template: StoryFn<{ content: string | Descendant[], onDeserializationError: (message: string, error: Error) => void }> = (args) => (
  <div className="bg-black text-white p-4 min-h-screen">
    <RichTextRenderer {...args} />
  </div>
);

export const BasicText = Template.bind({});
BasicText.args = {
  content: slateifySerialize("This is a basic text.")
};

export const BoldItalicUnderline = Template.bind({});
BoldItalicUnderline.args = {
  content: [
    {
      type: "paragraph",
      children: [
        { text: "Bold", bold: true },
        { text: "Italic", italic: true },
        { text: "Underline", underline: true },
      ],
    },
  ],
  onDeserializationError,
};

export const Strikethrough = Template.bind({});
Strikethrough.args = {
  content: [
    {
      type: 'paragraph',
      children: [{ text: 'This text has a strikethrough.', strikethrough: true }],
    },
  ],
  onDeserializationError,

};

export const Code = Template.bind({});
Code.args = {
  content: [
    {
      type: 'paragraph',
      children: [{ text: 'This is inline code.', code: true }],
    },
  ],
  onDeserializationError,
};

export const Highlight = Template.bind({});
Highlight.args = {
  content: [
    {
      type: 'paragraph',
      children: [{ text: 'This text is highlighted.', highlight: true }],
    },
  ],
  onDeserializationError,
};

export const Superscript = Template.bind({});
Superscript.args = {
  content: [
    {
      type: 'paragraph',
      children: [{ text: 'Superscript', superscript: true }],
    },
  ],
  onDeserializationError,
};

export const Subscript = Template.bind({});
Subscript.args = {
  content: [
    {
      type: 'paragraph',
      children: [{ text: 'Subscript', subscript: true }],
    },
  ],
  onDeserializationError,
};

export const OrderedList = Template.bind({});
OrderedList.args = {
  content: [
    {
      type: 'ordered-list',
      children: [
        { type: 'list-item', children: [{ text: 'First item' }] },
        { type: 'list-item', children: [{ text: 'Second item' }] },
        { type: 'list-item', children: [{ text: 'Third item' }] },
      ],
    },
  ],
  onDeserializationError,
};

export const UnorderedList = Template.bind({});
UnorderedList.args = {
  content: [
    {
      type: 'unordered-list',
      children: [
        { type: 'list-item', children: [{ text: 'Bullet one' }] },
        { type: 'list-item', children: [{ text: 'Bullet two' }] },
        { type: 'list-item', children: [{ text: 'Bullet three' }] },
      ],
    },
  ],
  onDeserializationError,
};

export const MixedContent = Template.bind({});
MixedContent.args = {
  content: [
    {
      type: 'paragraph',
      children: [
        { text: 'Bold ', bold: true },
        { text: 'Italic ', italic: true },
        { text: 'Underline ', underline: true },
        { text: 'Strikethrough ', strikethrough: true },
        { text: 'Code ', code: true },
        { text: 'Highlight ', highlight: true },
        { text: 'Superscript ', superscript: true },
        { text: 'Subscript', subscript: true },
      ],
    },
    {
      type: 'ordered-list',
      children: [
        { type: 'list-item', children: [{ text: 'Ordered Item 1' }] },
        { type: 'list-item', children: [{ text: 'Ordered Item 2' }] },
      ],
    },
    {
      type: 'unordered-list',
      children: [
        { type: 'list-item', children: [{ text: 'Unordered Item 1' }] },
        { type: 'list-item', children: [{ text: 'Unordered Item 2' }] },
      ],
    },
  ],
  onDeserializationError,
};