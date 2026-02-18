import { StoryObj, Meta } from '@storybook/react-vite';
import { FormElement, FormElementType } from '../lib/components/pre-assessment/types';
import headingTextElement from '../lib/components/lesson-components/heading-lesson';

// Mock elementInstance for the stories
const mockHeadingElement: FormElement = {
    id: 'heading-1',
    type: FormElementType.HeadingText,
    headingType: 'h2',
    heading: 'Sample Heading Text',
    required: false,
    order: 1,
};

// Fix the Meta type to use concrete component type
const meta = {
    title: 'Components/Pre-Assessment/Lessons/HeadingText',
    component: headingTextElement.designerComponent,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} as Meta<typeof headingTextElement.designerComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

const DesignerComponent = headingTextElement.designerComponent;
const FormComponent = headingTextElement.formComponent;
const SubmissionComponent = headingTextElement.submissionComponent;

/**
 * Designer view of the Heading Lesson component
 */
export const Designer: Story = {
    render: () => (
        <div className="w-[600px]">
            <DesignerComponent
                elementInstance={mockHeadingElement}
                locale="en"
                onUpClick={(id) => console.log('Move up', id)}
                onDownClick={(id) => console.log('Move down', id)}
                onDeleteClick={(id) => console.log('Delete', id)}
            />
        </div>
    ),
};

/**
 * Form view of the Heading Lesson component
 */
export const Form: Story = {
    render: () => (
        <div className="w-[600px]">
            <FormComponent
                locale='en'
                elementInstance={mockHeadingElement}
            />
        </div>
    ),
};

/**
 * Submission view of the Heading Lesson component
 */
export const Submission: Story = {
    render: () => (
        <div className="w-[600px]">
            <SubmissionComponent
                elementInstance={mockHeadingElement}
            />
        </div>
    ),
};