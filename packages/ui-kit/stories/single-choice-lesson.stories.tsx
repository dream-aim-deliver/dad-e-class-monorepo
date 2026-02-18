import React from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';
import { FormElementType } from '../lib/components/pre-assessment/types';
import singleChoiceElement from '../lib/components/lesson-components/single-choice';

// Single Choice Designer Component
const SingleChoiceDesignerComponent = (props) => {
    const sampleInstance = {
        id: 'sample-singlechoice-1',
        type: FormElementType.SingleChoice,
        order: 1,
        required: true,
        title: 'What is your favorite programming language?',
        options: [
            { name: 'JavaScript', isSelected: false },
            { name: 'TypeScript', isSelected: true },
            { name: 'Python', isSelected: false },
            { name: 'TypeScript', isSelected: false },
            { name: 'Java', isSelected: false }
        ],
    };

    return <singleChoiceElement.designerComponent
        elementInstance={sampleInstance}
        {...props}
    />;
};

// Meta for the Single Choice component
const meta: Meta<typeof SingleChoiceDesignerComponent> = {
    title: 'Components/Pre-Assessment/Lessons/SingleChoice',
    component: SingleChoiceDesignerComponent,
    argTypes: {
        locale: {
            control: 'select',
            options: ['en', 'de'],
            description: 'Language selection',
        },
    },
};

export const Designer: StoryObj<typeof SingleChoiceDesignerComponent> = {
    args: {
        locale: 'en',
        onUpClick: (id: string) => alert(`Moving Single Choice element ${id} up`),
        onDownClick: (id: string) => alert(`Moving Single Choice element ${id} down`),
        onDeleteClick: (id: string) => alert(`Deleting Single Choice element ${id}`),
    },
};

// Form view of the component
export const FormView: StoryObj<typeof SingleChoiceDesignerComponent> = {
    render: (args) => {
        const sampleInstance = {
            id: 'sample-single-choice-1',
            type: FormElementType.SingleChoice,
            order: 1,
            required: true,
            title: 'What is your favorite programming language?',
            options: [
                { name: 'JavaScript', isSelected: false },
                { name: 'TypeScript', isSelected: false },
                { name: 'Python', isSelected: false },
                { name: 'Java', isSelected: false }
            ],
        };

        return <singleChoiceElement.formComponent
            elementInstance={sampleInstance}
            submitValue={(id, value) => console.log('Submitted:', id, value)}
            locale={args.locale}
            {...args}
        />;
    },
    args: {
        locale: 'en',
    },
};

// Submission view of the component (selected option)
export const SubmissionView: StoryObj<typeof SingleChoiceDesignerComponent> = {
    render: (args) => {
        const sampleInstance = {
            id: 'sample-single-choice-1',
            type: FormElementType.SingleChoice,
            order: 1,
            required: true,
            title: 'What is your favorite programming language?',
            options: [
                { name: 'JavaScript', isSelected: false },
                { name: 'TypeScript', isSelected: true },
                { name: 'Python', isSelected: false },
                { name: 'Java', isSelected: false }
            ],
        };

        return <singleChoiceElement.submissionComponent
            elementInstance={sampleInstance}
            {...args}
        />;
    },
    args: {
        locale: 'en',
    },
};

export default meta;