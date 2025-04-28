import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { FormElementRenderer } from "../lib/components/pre-assessment/form-renderer";
import { FormElementType,FormElement  } from "../lib/components/pre-assessment/types";
const meta: Meta<typeof FormElementRenderer> = {
    title: "Components/FormElementBuilder",
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
        helperText: "Welcome to the pre-assessment form. Please read this information carefully before proceeding."
    },
    {
        id: "text-input-1",
        type: FormElementType.TextInput,
        order: 2,
    },
    {
        id: "single-choice-1",
        type: FormElementType.SingleChoice,
        order: 3,
        title: "What is your favorite color?",
        options: [
            { name: "Red" },
            { name: "Blue" },
            { name: "Green" }
        ]
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