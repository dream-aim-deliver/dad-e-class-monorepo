import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import {FormBuilder} from "../lib/components/pre-assessment/form-builder"
import { preAssessmentInstance } from "../lib/components/pre-assessment";

const meta: Meta<typeof FormBuilder> = {
  title: "Components/FormBuilder",
  component: FormBuilder,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes:{
    locale: {
        control: { type: "select" },
        options: ["en", "de"],
        description: "Language locale for the form",
        defaultValue: "en",
    },
  }
};

export default meta;
type Story = StoryObj<typeof FormBuilder>;

// Sample rich text element instances
const richTextElements: preAssessmentInstance[] = [
  {
    id: "rich-text-1",
    type: "richText",
    extraAttributes: {
      title: "Introduction",
      content:{ 
        description:"Welcome to the pre-assessment form. Please read this information carefully before proceeding."
      }
    }
  },
  {
    id: "rich-text-2",
    type: "textInput",
    extraAttributes: {
    }
  },
  {
    id: "singleChoice-1",
    type: "singleChoice",
    extraAttributes: {
      title: "Instructions",
      content:{
       title:"What is your favorite color?",
       options:[
        { label: 'Option 1', isSelected: false },
        { label: 'Option 2', isSelected: false },
        { label: 'Option 3', isSelected: false},
      ]
      }
    }
  }
];

// Mock functions
const handleSubmit = (values: Record<string, string>) => {
  console.log("Values type:", typeof values); // should be 'object'
console.log("Is Array?", Array.isArray(values)); // should be false
console.log("Entries:", Object.entries(values));
  console.log("Form submitted with values:", values);
};

export const Default: Story = {
  args: {
    isLoading: false,
    isError: false,
    onSubmit: handleSubmit,
    elements: richTextElements,
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
  }
};


