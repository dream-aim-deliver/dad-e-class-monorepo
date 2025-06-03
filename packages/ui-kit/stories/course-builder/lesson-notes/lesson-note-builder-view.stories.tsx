import { Meta, StoryObj } from '@storybook/react';
import { LessonNoteBuilderView } from '../../../lib/components/lesson-note/lesson-note-builder-view';
import Banner from '../../../lib/components/banner';


/**
 * Storybook configuration for the LessonNoteBuilderView component.
 */
const meta: Meta<typeof LessonNoteBuilderView> = {
    title: 'Components/LessonNotes/LessonNoteBuilderView',
    component: LessonNoteBuilderView,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
   
};

export default meta;

type Story = StoryObj<typeof LessonNoteBuilderView>;

/**
 * Default state of the LessonNoteBuilderView component.
 */
export const Default: Story = {
    args: {
        id: 1,
        initialValue: '<p>This is a sample lesson note that instructors can edit.</p>',
        placeholder: 'Write your lesson notes here...',
        locale: 'en',
    },
    render: (args) => {
        return (
            <LessonNoteBuilderView
                {...args}
                onChange={(value) => {
                    console.log('Notes updated:', value);
                    return true; // Simulate successful save
                }}
                onDeserializationError={(message, error) => console.error(message, error)}
            />
        );
    },
};

/**
 * LessonNoteBuilderView with save error.
 */
export const SaveError: Story = {
    args: {
        id: 2,
        initialValue: '<p>This is a sample lesson note with save error.</p>',
        placeholder: 'Write your lesson notes here...',
        locale: 'en',
    },
    render: (args) => {
        return (
            <LessonNoteBuilderView
                {...args}
                onChange={(value) => {
                    console.log('Notes updated with error:', value);
                    return false; // Simulate failed save
                }}
                onDeserializationError={(message, error) => console.error(message, error)}
            />
        );
    },
};

/**
 * LessonNoteBuilderView with custom child component.
 */
export const WithCustomChildren: Story = {
    args: {
        id: 3,
        initialValue: '<p>This is a sample lesson note with custom children.</p>',
        placeholder: 'Write your lesson notes here...',
        locale: 'en',
    },
    render: (args) => {
        return (
            <LessonNoteBuilderView
                {...args}
                onChange={(value) => {
                    console.log('Notes updated:', value);
                    return true; // Simulate successful save
                }}
                onDeserializationError={(message, error) => console.error(message, error)}
            >
                <Banner
                    title="This is a custom banner that can be added as a child component"
                />
            </LessonNoteBuilderView>
        );
    },
};
