import { Meta, StoryObj } from '@storybook/react-vite';
import { OneOutOfThreePreview } from '../lib/components/out-of-three/one-out-of-three';


// Define the meta for the component
const meta: Meta<typeof OneOutOfThreePreview> = {
    title: 'Components/OneOutofThree/OneOutOfThreePreview',
    component: OneOutOfThreePreview,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        displayOnly: {
            control: 'boolean',
            description: 'Whether the component is in display-only mode',
        },
        data: {
            control: 'object',
            description: 'The data to display in the component',
        },
    },
};

export default meta;
type Story = StoryObj<typeof OneOutOfThreePreview>;

// Sample data for the stories
const sampleData = {
    tableTitle: 'Employee Satisfaction Survey',

    rows: [
        {
            rowTitle: 'Work-life balance',
            columns: [
                { columnTitle: 'Dissatisfied', selected: false },
                { columnTitle: 'Neutral', selected: true },
                { columnTitle: 'Satisfied', selected: false },
            ],
        },
        {
            rowTitle: 'Career growth',
            columns: [
                { columnTitle: 'Dissatisfied', selected: false },
                { columnTitle: 'Neutral', selected: false },
                { columnTitle: 'Satisfied', selected: true },
            ],
        },
        {
            rowTitle: 'Team collaboration',
            columns: [
                { columnTitle: 'Dissatisfied', selected: true },
                { columnTitle: 'Neutral', selected: false },
                { columnTitle: 'Satisfied', selected: false },
            ],
        },
    ],
};

const productFeedbackData = {
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
};

const emptyData = {
    tableTitle: 'New Survey',

    rows: [
        {
            rowTitle: 'Question 1',
            columns: [
                { columnTitle: 'Option A', selected: false },
                { columnTitle: 'Option B', selected: false },
                { columnTitle: 'Option C', selected: false },
            ],
        },
        {
            rowTitle: 'Question 2',
            columns: [
                { columnTitle: 'Option A', selected: false },
                { columnTitle: 'Option B', selected: false },
                { columnTitle: 'Option C', selected: false },
            ],
        },
        {
            rowTitle: 'Question 3',
            columns: [
                { columnTitle: 'Option A', selected: false },
                { columnTitle: 'Option B', selected: false },
                { columnTitle: 'Option C', selected: false },
            ],
        },
    ],
};

// Define the stories
export const Interactive: Story = {
    args: {
        data: sampleData,
        displayOnly: false,
    },
};

export const DisplayOnly: Story = {
    args: {
        data: sampleData,
        displayOnly: true,
    },
};

export const ProductFeedback: Story = {
    args: {
        data: productFeedbackData,
        displayOnly: false,
    },
};

export const EmptySurvey: Story = {
    args: {
        data: emptyData,
        displayOnly: false,
    },
};

export const CustomizableExample: Story = {
    args: {
        data: {

            tableTitle: 'Custom Survey',
            rows: [
                {
                    rowTitle: 'Custom Question 1',
                    columns: [
                        { columnTitle: 'Low', selected: false },
                        { columnTitle: 'Medium', selected: true },
                        { columnTitle: 'High', selected: false },
                    ],
                },
                {
                    rowTitle: 'Custom Question 2',
                    columns: [
                        { columnTitle: 'Low', selected: true },
                        { columnTitle: 'Medium', selected: false },
                        { columnTitle: 'High', selected: false },
                    ],
                },
            ],
        },
        displayOnly: false,
    },
};