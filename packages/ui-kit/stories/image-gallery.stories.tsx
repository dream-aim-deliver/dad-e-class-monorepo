import type { Meta, StoryObj } from '@storybook/react';
import { DesignerComponent, FormComponent } from '../lib/components/course-builder-lesson-component/images-gallery';
import { CourseElementType, courseElement } from '../lib/components/course-builder/types';

const meta: Meta<typeof DesignerComponent> = {
    title: 'Components/CourseBuilder/Images Gallery',
    component: DesignerComponent,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DesignerComponent>;

// Mock element instance for stories
const mockElementInstance: courseElement = {
    id: 'gallery-1',
    type: CourseElementType.ImageGallery,
    order: 1,
    imageUrls: [
        'https://picsum.photos/400/300?random=1',
        'https://picsum.photos/400/300?random=2',
        'https://picsum.photos/400/300?random=3'
    ]
};

export const Designer: Story = {
    args: {
        elementInstance: mockElementInstance,
        locale: 'en',
        onUpClick: (id) => console.log('Move up:', id),
        onDownClick: (id) => console.log('Move down:', id),
        onDeleteClick: (id) => console.log('Delete:', id),
    },
};

export const FormView: StoryObj<typeof FormComponent> = {
    render: (args) => (
        <div className="max-w-4xl mx-auto">
            <FormComponent
                elementInstance={mockElementInstance}
                locale="en"
            />
        </div>
    ),
};

// Story with multiple images pre-loaded
export const DesignerWithImages: Story = {
    args: {
        ...Designer.args,
        elementInstance: {
            ...mockElementInstance,
            imageUrls: [
                'https://picsum.photos/400/300?random=1',
                'https://picsum.photos/400/300?random=2',
                'https://picsum.photos/400/300?random=3',
                'https://picsum.photos/400/300?random=4',
                'https://picsum.photos/400/300?random=5'
            ]
        }
    },
};

// Mobile view story
export const FormViewMobile: StoryObj<typeof FormComponent> = {
    parameters: {
        viewport: {
            defaultViewport: 'mobile1'
        },
    },
    render: FormView.render,
};

// Tablet view story
export const FormViewTablet: StoryObj<typeof FormComponent> = {
    parameters: {
        viewport: {
            defaultViewport: 'tablet'
        },
    },
    render: FormView.render,
};