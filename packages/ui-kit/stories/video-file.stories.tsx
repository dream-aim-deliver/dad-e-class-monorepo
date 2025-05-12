import type { Meta, StoryObj } from '@storybook/react';
import videoFileElement, { DesignerComponent, FormComponent } from '../lib/components/course-builder-lesson-component/video-file';
import { CourseElementType } from '../lib/components/course-builder/types';

const meta: Meta<typeof DesignerComponent | typeof FormComponent> = {
    title: 'Components/CourseBuilder/VideoFile',
    tags: ['autodocs'],

};

export default meta;

type DesignerStory = StoryObj<typeof DesignerComponent>;
type FormStory = StoryObj<typeof FormComponent>;

// Mock element instance
const mockElementInstance = {
    id: '1',
    order: 1,
    type: CourseElementType.VideoFile,
    VideoId: 'vrJKveKVWWV3lAxGIWxlzaAsx9ArmD9KdGlgxmb1Rso'
};

export const Designer: DesignerStory = {
    render: () => (
        <DesignerComponent
            elementInstance={mockElementInstance}
            locale="en"
            onUpClick={(id) => console.log('Move up:', id)}
            onDownClick={(id) => console.log('Move down:', id)}
            onDeleteClick={(id) => console.log('Delete:', id)}
        />
    )
};

export const Form: FormStory = {
    render: () => (
        <FormComponent
            elementInstance={mockElementInstance}
            locale="en"
        />
    )
};

// German locale examples
export const DesignerGerman: DesignerStory = {
    render: () => (
        <DesignerComponent
            elementInstance={mockElementInstance}
            locale="de"
            onUpClick={(id) => console.log('Move up:', id)}
            onDownClick={(id) => console.log('Move down:', id)}
            onDeleteClick={(id) => console.log('Delete:', id)}
        />
    )
};

export const FormGerman: FormStory = {
    render: () => (
        <FormComponent
            elementInstance={mockElementInstance}
            locale="de"
        />
    )
};