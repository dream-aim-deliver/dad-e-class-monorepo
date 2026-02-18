import React from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';
import { FormElementType } from '../lib/components/pre-assessment/types';
import oneOutOfThreeElement from '../lib/components/lesson-components/one-out-of-three';

// Single Choice Designer Component
const OneOutOfThreeDesignerComponent = (props) => {
    const sampleInstance = {
        id: 'sample-multi-choice-1',
        type: FormElementType.OneOutOfThree,
        order: 1,
        required: true,
        data:{
        tableTitle: 'Product Feature Feedback',
        rows: [
        {
            rowTitle: 'User Interface',
            columns: [
                { columnTitle: 'Not Important', selected: false },
                { columnTitle: 'Somewhat Important', selected: false },
                { columnTitle: 'Very Important', selected: false },
            ],
        },
        {
            rowTitle: 'Performance',
            columns: [
                { columnTitle: 'Not Important', selected: false },
                { columnTitle: 'Somewhat Important', selected: false },
                { columnTitle: 'Very Important', selected: false },
            ],
        },
        {
            rowTitle: 'New Features',
            columns: [
                { columnTitle: 'Not Important', selected: false},
                { columnTitle: 'Somewhat Important', selected: false },
                { columnTitle: 'Very Important', selected: false },
            ],
        },
    ],
    }
    };

    return <oneOutOfThreeElement.designerComponent
        elementInstance={sampleInstance}
        {...props}
    />;
};

// Meta for the Single Choice component
const meta: Meta<typeof OneOutOfThreeDesignerComponent> = {
    title: 'Components/Pre-Assessment/Lessons/one-of-three',
    component: OneOutOfThreeDesignerComponent,
    argTypes: {
        locale: {
            control: 'select',
            options: ['en', 'de'],
            description: 'Language selection',
        },
    },
};

export const Designer: StoryObj<typeof OneOutOfThreeDesignerComponent> = {
    args: {
        locale: 'en',
        onUpClick: (id: string) => alert(`Moving one-out-of-three element ${id} up`),
        onDownClick: (id: string) => alert(`Moving one-out-of-three element ${id} down`),
        onDeleteClick: (id: string) => alert(`Deleting one-out-of-three element ${id}`),
    },
};

// Form view of the component
export const FormView: StoryObj<typeof OneOutOfThreeDesignerComponent> = {
    render: (args) => {
        const sampleInstance = {
            id: 'sample-one-out-of-3-1',
            type: FormElementType.OneOutOfThree,
            order: 1,
            required: true,
            data:{
            tableTitle: 'Product Feature Feedback',
    rows: [
        {
            rowTitle: 'User Interface',
            columns: [
                { columnTitle: 'Not Important', selected: false },
                { columnTitle: 'Somewhat Important', selected: false },
                { columnTitle: 'Very Important', selected: false },
            ],
        },
        {
            rowTitle: 'Performance',
            columns: [
                { columnTitle: 'Not Important', selected: false },
                { columnTitle: 'Somewhat Important', selected: false },
                { columnTitle: 'Very Important', selected: false },
            ],
        },
        {
            rowTitle: 'New Features',
            columns: [
                { columnTitle: 'Not Important', selected: false },
                { columnTitle: 'Somewhat Important', selected: false },
                { columnTitle: 'Very Important', selected: false },
            ],
        },
    ],
}
        };

        return <oneOutOfThreeElement.formComponent
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

// Submission view of the component (selected options)
export const SubmissionView: StoryObj<typeof OneOutOfThreeDesignerComponent> = {
    render: (args) => {
        const sampleInstance = {
            id: 'sample-out-of-1',
            type: FormElementType.OneOutOfThree,
            order: 1,
            required: true,
            data:{
            tableTitle: 'Product Feature Feedback',
            rows: [
                {
                    rowTitle: 'User Interface',
                    columns: [
                        { columnTitle: 'Not Important', selected: false },
                        { columnTitle: 'Somewhat Important', selected: false },
                        { columnTitle: 'Very Important', selected: true },
                    ],
                },
                {
                    rowTitle: 'Performance',
                    columns: [
                        { columnTitle: 'Not Important', selected: false },
                        { columnTitle: 'Somewhat Important', selected: true },
                        { columnTitle: 'Very Important', selected: false },
                    ],
                },
                {
                    rowTitle: 'New Features',
                    columns: [
                        { columnTitle: 'Not Important', selected: true },
                        { columnTitle: 'Somewhat Important', selected: false },
                        { columnTitle: 'Very Important', selected: false },
                    ],
                },
            ],
        }
        };

        return <oneOutOfThreeElement.submissionComponent
            elementInstance={sampleInstance}
            displayOnly={true}
            required={sampleInstance.required}
            {...args}
        
        />;
    },
    args: {
        locale: 'en',
    },
};

export default meta;