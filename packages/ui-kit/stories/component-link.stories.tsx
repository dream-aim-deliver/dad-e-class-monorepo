import React from "react";
import { DesignerComponent } from "../lib/components/course-builder-lesson-component//link-lesson";
import { CourseElementType } from "../lib/components/course-builder/types";

// Mock props for DesignerComponent
const mockElementInstance = {
    id: "element-1",
    type: CourseElementType.Links,
    order: 1,
    links: [],
    include_in_materials: false,
    customIcon: ""
};

export default {
    title: "Components/Course-builder/UploadFiles/LinkLesson",
    component: DesignerComponent,
    argTypes: {
        locale: { control: "text" },
        onUpClick: { action: "upClick" },
        onDownClick: { action: "downClick" },
        onDeleteClick: { action: "deleteClick" },
    },
};

const Template = (args) => <DesignerComponent {...args} />;

export const Default = Template.bind({});
Default.args = {
    elementInstance: mockElementInstance,
    locale: "en",
    onUpClick: () => { },
    onDownClick: () => { },
    onDeleteClick: () => { },
};