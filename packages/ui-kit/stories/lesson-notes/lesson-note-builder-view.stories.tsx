import { Meta, StoryObj } from '@storybook/react-vite';
import { LessonNoteBuilderView } from '../../lib/components/lesson-note/lesson-note-builder-view';
import Banner from '../../lib/components/banner';
import React from 'react';
import { slateifySerialize } from "../../lib/components/rich-text-element/serializer";

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
 * Default story with async save logic and feedback banner.
 */
const DefaultStoryComponent = (args: any) => {
    const [saving, setSaving] = React.useState(false);

    const handleChange = (value: string) => {
        console.log('Designer LessonNote changed:', value);
        setSaving(true);

        setTimeout(() => {
            setSaving(false);
        }, 2000); // Simulate a 2-second async save

        return Math.random() < 0.5; // Simulate 50% save success chance
    };

    return (
        <LessonNoteBuilderView
            {...args}
            onChange={handleChange}
            onDeserializationError={(message, error) => console.error(message, error)}
        >
            {saving && (
                <Banner
                    title={
                        args.locale === 'de'
                            ? 'Notizen werden gespeichert...'
                            : 'Saving notes...'
                    }
                    style="warning"
                />
            )}
        </LessonNoteBuilderView>
    );
};

export const Default: Story = {
    args: {
        id: 1,
        initialValue: slateifySerialize('This is a sample lesson note that instructors can edit.'),
        placeholder: 'Write your lesson notes here...',
        locale: 'en',
    },
    render: (args) => <DefaultStoryComponent {...args} />,
};

/**
 * Another variant with different content and custom banner.
 */
const CustomChildrenStoryComponent = (args: any) => {
    const [saving, setSaving] = React.useState(false);

    const handleChange = (value: string) => {
        console.log('Designer LessonNote changed:', value);
        setSaving(true);

        setTimeout(() => {
            setSaving(false);
        }, 2000); // Simulate a 2-second async save

        return Math.random() < 0.5;
    };

    return (
        <LessonNoteBuilderView
            {...args}
            onChange={handleChange}
            onDeserializationError={(message, error) => console.error(message, error)}
        >
            {saving && (
                <Banner title="This is a custom banner that can be added as a child component" />
            )}
        </LessonNoteBuilderView>
    );
};

export const WithCustomChildren: Story = {
    args: {
        id: 2,
        initialValue: slateifySerialize('This is a sample lesson note with custom children.'),
        placeholder: 'Write your lesson notes here...',
        locale: 'en',
    },
    render: (args) => <CustomChildrenStoryComponent {...args} />,
};
