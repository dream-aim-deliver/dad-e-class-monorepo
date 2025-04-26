// RichTextElement.stories.tsx
import React from "react";
import { StoryObj, Meta } from "@storybook/react";
import { FormComponent } from "../lib/components/pre-assessment/rich-text";
import { preAssessmentElements, preAssessmentInstance, elementType } from "../lib/components/pre-assessment/form-element-core";

// Create a component that will handle all element types
const DynamicElementComponent = ({ elementType, ...args }: { elementType: elementType } & any) => {
  // Create a sample instance based on the selected type
  const sampleInstance: preAssessmentInstance = {
    id: `sample-${elementType}-1`,
    type: elementType,
    extraAttributes: getSampleExtraAttributes(elementType),
  };

  const ElementComponent = preAssessmentElements[elementType].formComponent;
  return <ElementComponent elementInstance={sampleInstance} {...args} />;
};
function getSampleExtraAttributes(elementType: elementType) {
  switch (elementType) {
    case 'richText':
      return { content: "This is a sample rich text content" };
    case 'header':
      return { content: "This is a sample header" };
    case 'singleChoice':
      return {
        question: "Sample single choice question?",
        options: ["Option 1", "Option 2", "Option 3"]
      };
    case 'multipleChoice':
      return {
        question: "Sample multiple choice question?",
        options: ["Option A", "Option B", "Option C"]
      };
    default:
      return { content: "Default content" };
  }
}

export default {
  title: "Components/PreAssessment",
  component: DynamicElementComponent,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    elementType: {
      control: 'select',
      options: ['richText', 'singleChoice', 'multipleChoice', 'header'],
      description: 'Type of pre-assessment element',
      defaultValue: 'richText'
    }
  }
} as Meta<typeof DynamicElementComponent>;

export const Dynamic: StoryObj<typeof DynamicElementComponent> = {
  args: {
    elementType: 'richText',
    // No need to pass elementInstance as it's created inside the component
  }
};