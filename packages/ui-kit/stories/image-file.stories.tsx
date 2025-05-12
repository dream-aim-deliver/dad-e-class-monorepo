import type { Meta, StoryObj } from '@storybook/react';
import { DesignerComponent, FormComponent } from '../lib/components/course-builder-lesson-component/image-files';
import { CourseElementType } from '../lib/components/course-builder/types';
import { ImageFile } from '../lib/components/course-builder-lesson-component/types';
const meta: Meta<typeof DesignerComponent> = {
    title: 'Components/CourseBuilder/ImageFile',
    component: DesignerComponent,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;

type DesignerStory = StoryObj<typeof DesignerComponent>;
type FormStory = StoryObj<typeof FormComponent>;

// Designer Component Stories
const mockElementInstance: ImageFile = {
    id: '1',
    order: 0,
    type: CourseElementType.ImageFile,
    imageThumbnailUrl: 'https://picsum.photos/400/300',// Using imageUrl instead of VideoId
    ImageId: 'image-1',
}
export const Designer: DesignerStory = {
    args: {
        elementInstance: mockElementInstance, // <-- FIXED
        locale: 'en',
        onUpClick: () => console.log('Move Up clicked'),
        onDownClick: () => console.log('Move Down clicked'),
        onDeleteClick: () => console.log('Delete clicked'),
    },
};

export const DesignerWithImage: DesignerStory = {
    args: {
        ...Designer.args,
        elementInstance: mockElementInstance, // <-- FIXED
        locale: 'en',
    },
};
// Form Component Stories
export const Form: FormStory = {
    render: (args) => (
        <FormComponent
            elementInstance={mockElementInstance}
            locale="en"
        />
    ),
};

export const FormWithoutImage: FormStory = {
    render: (args) => (
        <FormComponent
            elementInstance={{
                id: 'image-2',
                type: CourseElementType.ImageFile,
                order: 1,
                imageUrl: 'https://picsum.photos/400/300', // Using imageUrl instead of VideoId
            }}
            locale="en"
        />
    ),
};