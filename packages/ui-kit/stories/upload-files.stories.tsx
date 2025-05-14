import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { DesignerComponent, FormComponent } from "../lib/components/course-builder-lesson-component/upload-files";
import { CourseElementType } from "../lib/components/course-builder/types";

// Mock elementInstance for DesignerComponent
const designerElementInstance = {
  id: "designer-1",
  type: CourseElementType.uploadFile,
  description: "Designer component description.",
  studentComment: "Designer initial comment.",
  studentUploadedFiles: [], // Add an empty array or appropriate file data
  order: 1, // Add a default order value
};

// Mock elementInstance for FormComponent
const formElementInstance = {
  id: "form-1",
  type: CourseElementType.uploadFile,
  description: "Please upload your assignment files.",
  studentComment: "Initial comment.",
  studentUploadedFiles: [], // Add an empty array or appropriate file data
  order: 1, // Add a default order value
};

const locale = "en";

const meta: Meta = {
  title: "Components/Course Builder/UploadFiles",
  component: DesignerComponent,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj;

export const Designer: Story = {
  render: () => (
    <DesignerComponent
      elementInstance={designerElementInstance}
      locale={locale}
      onUpClick={()=>alert("onUpClick")}
      onDownClick={()=>alert("onDownClick")}
      onDeleteClick={()=>alert("onDeleteClick")}
    />
  ),
};

export const Form: Story = {
  render: () => (
    <FormComponent
      elementInstance={formElementInstance}
      locale={locale}
    />
  ),
};