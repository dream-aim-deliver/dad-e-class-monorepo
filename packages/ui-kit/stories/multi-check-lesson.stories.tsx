import React from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';
import { FormElementType } from '../lib/components/pre-assessment/types';
import multiCheckElement from '../lib/components/lesson-components/multi-check';

// Single Choice Designer Component
const MultiChoiceDesignerComponent = (props) => {
    const sampleInstance = {
        id: 'sample-multi-choice-1',
        type: FormElementType.MultiCheck,
        order: 1,
        required: true,
        title: 'Select all programming languages you know',
        options: [
            { name: 'JavaScript'},
            { name: 'TypeScript' },
            { name: 'Python' },
            { name: 'Java' }
        ],
    };

    return <multiCheckElement.designerComponent
        elementInstance={sampleInstance}
        {...props}
    />;
};

// Meta for the Single Choice component
const meta: Meta<typeof MultiChoiceDesignerComponent> = {
    title: 'Components/Pre-Assessment/Lessons/MultipleChoice',
    component: MultiChoiceDesignerComponent,
    argTypes: {
        locale: {
            control: 'select',
            options: ['en', 'de'],
            description: 'Language selection',
        },
    },
};

export const Designer: StoryObj<typeof MultiChoiceDesignerComponent> = {
    args: {
        locale: 'en',
        onUpClick: (id: string) => alert(`Moving Single Choice element ${id} up`),
        onDownClick: (id: string) => alert(`Moving Single Choice element ${id} down`),
        onDeleteClick: (id: string) => alert(`Deleting Single Choice element ${id}`),
    },
};

// Form view of the component
export const FormView: StoryObj<typeof MultiChoiceDesignerComponent> = {
    render: (args) => {
        const sampleInstance = {
            id: 'sample-multi-check-1',
            type: FormElementType.MultiCheck,
            order: 1,
            required: true,
            title: 'Select all programming languages you know',
            options: [
                { name: 'JavaScript', isSelected: false },
                { name: 'TypeScript', isSelected: false },
                { name: 'Python', isSelected: false },
                { name: 'Java', isSelected: false }
            ],
        };

        return <multiCheckElement.formComponent
            elementInstance={sampleInstance}
            submitValue={(id, value) => console.log('Submitted:', id, value)}
            {...args}
        />;
    },
    args: {
        locale: 'en',
    },
};

// Submission view of the component (selected options)
export const SubmissionView: StoryObj<typeof MultiChoiceDesignerComponent> = {
    render: (args) => {
        const sampleInstance = {
            id: 'sample-multi-check-1',
            type: FormElementType.MultiCheck,
            order: 1,
            required: true,
            title: 'Select all programming languages you know',
            options: [
                { name: 'JavaScript', isSelected: true },
                { name: 'TypeScript', isSelected: true },
                { name: 'Python', isSelected: false },
                { name: 'Java', isSelected: false }
            ],
        };

        return <multiCheckElement.submissionComponent
            elementInstance={sampleInstance}
            {...args}
        />;
    },
    args: {
        locale: 'en',
    },
};

export default meta;