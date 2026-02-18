import { Meta, StoryObj } from '@storybook/react-vite';
import { FormElementType } from '../lib/components/pre-assessment/types';
import textInputElement from '../lib/components/lesson-components/text-input';
import { slateify } from '../lib/components/rich-text-element/serializer';

// Text Input Designer Component
const TextInputDesignerComponent = (props) => {
    const sampleInstance = {
        id: 'sample-text-input-1',
        type: FormElementType.TextInput,
        order: 1,
        required: true,
        content: '',
        helperText: slateify('Please enter your answer'),
        title: 'Text Input Title',
    };

    return <textInputElement.designerComponent
        elementInstance={sampleInstance}
        {...props}
    />;
};

// Meta for the Text Input component
const meta: Meta<typeof TextInputDesignerComponent> = {
    title: 'Components/Pre-Assessment/Lessons/TextInput',
    component: TextInputDesignerComponent,
    parameters: {

    },
    argTypes: {
        locale: {
            control: 'select',
            options: ['en', 'de'],
            description: 'Language selection',
        },
    },
};

// Designer view story
export const Designer: StoryObj<typeof TextInputDesignerComponent> = {
    args: {
        locale: 'en',
        onUpClick: (id: string) => alert(`Moving Text Input element ${id} up`),
        onDownClick: (id: string) => alert(`Moving Text Input element ${id} down`),
        onDeleteClick: (id: string) => alert(`Deleting Text Input element ${id}`),
    },
};

// Form view of the component
export const FormView: StoryObj<typeof TextInputDesignerComponent> = {
    render: (args) => {
        const sampleInstance = {
            id: 'sample-text-input-1',
            type: FormElementType.TextInput as FormElementType.TextInput,
            order: 1,
            required: true,
            content: '',
            helperText: JSON.stringify([
                {
                    type: 'paragraph',
                    children: [{ text: 'This is a basic paragraph.' }],
                },
            ])
        };

        return <textInputElement.formComponent
            elementInstance={sampleInstance}
            submitValue={(id, value) => console.log('Submitted:', id, value)}
            locale={args.locale}
        />;
    },
    args: {
        locale: 'en',
    },
};

// Filled view - showing the component with user-entered data
export const SubmissionView: StoryObj<typeof TextInputDesignerComponent> = {
    render: (args) => {
        const sampleInstance = {
            id: 'sample-text-input-1',
            type: FormElementType.TextInput as FormElementType.TextInput,
            order: 1,
            required: true,
            content: JSON.stringify([
                {
                    type: 'paragraph',
                    children: [{ text: 'This is the user\'s response to the text input question.' }],
                },
                {
                    type: 'paragraph',
                    children: [{ text: 'It contains multiple paragraphs of text that they have entered.' }],
                }
            ]),
            helperText: JSON.stringify([
                {
                    type: 'paragraph',
                    children: [{ text: 'Admin question' }],
                }])
        };

        return (

            <textInputElement.submissionComponent
                elementInstance={sampleInstance}
            />

        );
    },
    args: {
        locale: 'en',
    },
};






export default meta;