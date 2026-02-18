import React from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';
import { FormElementType } from '../lib/components/pre-assessment/types';
import richTextElement from '../lib/components/lesson-components/rich-text';
import { RichTextElement } from '../lib/components/lesson-components/types';

// Rich Text Designer Component
const RichTextDesignerComponent = (props) => {
    const sampleInstance: RichTextElement = {
        id: 'sample-rich-text-1',
        type: FormElementType.RichText,
        order: 1,
        content: '[{"type":"paragraph","children":[{"text":"This is a sample rich text content. You can edit this in the designer view."}]}]'
    };

    return <richTextElement.designerComponent
        elementInstance={sampleInstance}
        {...props}
    />;
};

// Meta for the Rich Text component
const meta: Meta<typeof RichTextDesignerComponent> = {
    title: 'Components/Pre-Assessment/Lessons/RichText',
    component: RichTextDesignerComponent,
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        locale: {
            control: 'select',
            options: ['en', 'de'],
            description: 'Language selection',
        },
    },
};

export default meta;
type Story = StoryObj<typeof RichTextDesignerComponent>;

// Designer view story
export const Designer: Story = {
    args: {
        locale: 'en',
        onUpClick: (id: string) => alert(`Moving Rich Text element ${id} up`),
        onDownClick: (id: string) => alert(`Moving Rich Text element ${id} down`),
        onDeleteClick: (id: string) => alert(`Deleting Rich Text element ${id}`),
    },
};

// Form view of the component
export const FormView: Story = {
    render: (args) => {
        const sampleInstance: RichTextElement = {
            id: 'sample-rich-text-1',
            type: FormElementType.RichText,
            order: 1,
            content: '[{"type":"paragraph","children":[{"text":"This is the rich text content that appears in the form view. It can include "},{"text":"formatted text","bold":true},{"text":" and other styling."}]}]'
        };

        return <richTextElement.formComponent
            elementInstance={sampleInstance}
            locale={args.locale}
        />;
    },
    args: {
        locale: 'en',
    },
};

// Submission view of the component
export const SubmissionView: Story = {
    render: (args) => {
        const sampleInstance: RichTextElement = {
            id: 'sample-rich-text-1',
            type: FormElementType.RichText,
            order: 1,
            content: '[{"type":"paragraph","children":[{"text":"This is the rich text content in read-only submission view. It can include "},{"text":"formatted text","bold":true},{"text":" and styling, but cannot be edited."}]}]'
        };

        return <richTextElement.submissionComponent
            elementInstance={sampleInstance}
        />;
    },
    args: {
        locale: 'en',
    },
};