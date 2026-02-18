import { Meta, StoryObj } from "@storybook/react-vite";
import { FormElementRenderer } from "../lib/components/lesson/form-renderer";
import { FormElementType, FormElement } from "../lib/components/pre-assessment/types";
import { slateifySerialize } from "../lib/components/rich-text-element/serializer";
const meta: Meta<typeof FormElementRenderer> = {
    title: "Components/Pre-Assessment/FormElementRenderer",
    component: FormElementRenderer,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        locale: {
            control: { type: "select" },
            options: ["en", "de"],
            description: "Language locale for the form",
            defaultValue: "en",
        },
    }
};

export default meta;
type Story = StoryObj<typeof FormElementRenderer>;

// Sample form element instances
const Elements: FormElement[] = [
    {
        id: "rich-text-1",
        type: FormElementType.RichText,
        order: 1,
        content: slateifySerialize("Welcome to the pre-assessment form. Please read this information carefully before proceeding."),
    },
    {
        id: "text-input-1",
        type: FormElementType.TextInput,
        required: true,
        order: 2,
        helperText: slateifySerialize("What is your name?"),
    },
    {
        id: "single-choice-1",
        type: FormElementType.SingleChoice,
        order: 3,
        title: "What is your favorite color?",
        required: true,
        options: [
            { name: "Red", isSelected: false },
            { name: "Blue", isSelected: false },
            { name: "Green", isSelected: false }
        ]
    },
    {
        id: "Multi-choice-1",
        type: FormElementType.MultiCheck,
        order: 4,
        title: "What is your favorite color?",
        required: true,
        options: [
            { name: "Red", isSelected: false },
            { name: "Blue", isSelected: false },
            { name: "Green", isSelected: false }
        ]
    },
    {
        id: 'sample-multi-choice-1',
        type: FormElementType.OneOutOfThree,
        order: 5,
        required: true,
        data: {
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
                }
            ]
        }
    }
];

// Mock functions
const handleSubmit = (values: Record<string, FormElement>) => {
    console.log("Form submitted with values:", values);
};

export const Default: Story = {
    args: {
        isLoading: false,
        isError: false,
        onSubmit: handleSubmit,
        elements: Elements,
        locale: "en"
    }
};

export const Loading: Story = {
    args: {
        ...Default.args,
        isLoading: true,
    }
};

export const Error: Story = {
    args: {
        ...Default.args,
        isError: true,
        errorMessage: "Failed to submit form. Please try again."
    }
}; 