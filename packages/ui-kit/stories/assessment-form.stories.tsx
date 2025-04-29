// AssessmentForm.stories.tsx
import React from "react";
import { StoryObj, Meta } from "@storybook/react";
import { FormElementType } from "../lib/components/pre-assessment/types";
import { formElements } from "../lib/components/pre-assessment/form-element-core";
import { Descendant } from "slate";

// Create a component that will handle all element types
const DynamicElementComponent = ({ elementType, ...args }: { elementType: FormElementType } & any) => {
  // Create a sample instance based on the selected type
  const sampleInstance = {
    id: `sample-${elementType}-1`,
    type: elementType,
    order: 1,
    title: elementType === FormElementType.RichText
      ? "Welcome to the Course"
      : elementType === FormElementType.TextInput
        ? "Enter your name"
        : "What is your favorite programming language?",
    required: true,
    content: elementType === FormElementType.RichText
      ? [
        {
          type: 'paragraph',
          children: [{ text: 'Welcome to our comprehensive programming course! This course will cover various programming concepts and best practices.' }],
        }
      ] as Descendant[]
      : elementType === FormElementType.TextInput
        ? [
          {
            type: 'paragraph',
            children: [{ text: 'John Doe' }],
          }
        ] as Descendant[]
        : "",
    helperText: elementType === FormElementType.TextInput
      ? [
        {
          type: 'paragraph',
          children: [{ text: 'Please enter your full name as it appears on your official documents. This will be used for your course certificate.' }],
        }
      ] as Descendant[]
      : undefined,
    options: elementType === FormElementType.SingleChoice ? [
      { name: "JavaScript", isSelected: true },
      { name: "Python", isSelected: false },
      { name: "Java", isSelected: false },
      { name: "C++", isSelected: false }
    ] : undefined
  };

  const ElementComponent = formElements[elementType].submissionComponent;
  return <ElementComponent elementInstance={sampleInstance} {...args} />;
};

export default {
  title: "Components/PreAssessment/View",
  component: DynamicElementComponent,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    elementType: {
      control: 'select',
      options: Object.values(FormElementType),
      description: 'Type of pre-assessment element',
      defaultValue: FormElementType.SingleChoice
    }
  }
} as Meta<typeof DynamicElementComponent>;

// Single Choice View
export const SingleChoiceView: StoryObj<typeof DynamicElementComponent> = {
  args: {
    elementType: FormElementType.SingleChoice
  }
};

// Rich Text View
export const RichTextView: StoryObj<typeof DynamicElementComponent> = {
  args: {
    elementType: FormElementType.RichText
  }
};

// Text Input View
export const TextInputView: StoryObj<typeof DynamicElementComponent> = {
  args: {
    elementType: FormElementType.TextInput
  }
};