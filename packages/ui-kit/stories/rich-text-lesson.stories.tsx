import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { FormElementType } from '../lib/components/pre-assessment/types';
import textInputElement from '../lib/components/lesson-components/text-input';
import richTextElement from '../lib/components/lesson-components/rich-text';
import singleChoiceElement from '../lib/components/lesson-components/single-choice';

// Rich Text Designer Component
const RichTextDesignerComponent = (props) => {
    const sampleInstance = {
        id: 'sample-richtext-1',
        type: FormElementType.RichText,
        order: 1,
        required: true,
        content: JSON.stringify([
            {
                type: 'paragraph',
                children: [{ text: 'This is a rich text element' }],
            }
        ]),
        title: 'Rich Text Title',
    };

    return <richTextElement.designerComponent
        elementInstance={sampleInstance}
        {...props}
    />;
};



// Meta for the Rich Text component
const richTextMeta = {
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

export const Designer: StoryObj<typeof RichTextDesignerComponent> = {
    args: {
        locale: 'en',
        onUpClick: (id: string) => alert(`Moving Rich Text element ${id} up`),
        onDownClick: (id: string) => alert(`Moving Rich Text element ${id} down`),
        onDeleteClick: (id: string) => alert(`Deleting Rich Text element ${id}`),
    },
};

export const FormView: StoryObj<typeof RichTextDesignerComponent> = {
    render: (args) => {
        const sampleInstance = {
            id: 'sample-richtext-1',
            type: FormElementType.RichText,
            order: 1,
            required: true,
            content: JSON.stringify([
                {
                    type: 'paragraph',
                    children: [{ text: 'This is a rich text element' }],
                }
            ]),

        };

        return <richTextElement.formComponent
            elementInstance={sampleInstance}
            {...args}
        />;
    }
};
export const SubmissionView: StoryObj<typeof RichTextDesignerComponent> = {
    render: (args) => {
        const sampleInstance = {
            id: 'sample-richtext-1',
            type: FormElementType.RichText,
            order: 1,
            required: true,
            content: JSON.stringify([
                {
                    type: 'paragraph',
                    children: [{ text: 'This is a rich text element' }],
                }
            ]),

        };

        return <richTextElement.submissionComponent
            elementInstance={sampleInstance}
            {...args}
        />;
    }
};

// Export Rich Text meta
export default richTextMeta;