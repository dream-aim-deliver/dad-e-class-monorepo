import { Meta, StoryObj } from '@storybook/react-vite';
import { LessonNoteStudentView } from '../../lib/components/lesson-note/lesson-note-student-view';
import { LessonNoteView } from '../../lib/components/lesson-note/lesson-note-view';

/**
 * Storybook configuration for the LessonNoteStudentView component.
 */
const meta: Meta<typeof LessonNoteStudentView> = {
    title: 'Components/LessonNotes/LessonNoteStudentView',
    component: LessonNoteStudentView,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    }
};

export default meta;

type Story = StoryObj<typeof LessonNoteStudentView>;

/**
 * Default state of the LessonNoteStudentView component with a single lesson.
 */
export const Default: Story = {
    args: {
        id: 1,
        ModuleNumber: 1,
        ModuleTitle: 'Introduction to Programming',
        locale: 'en',
    },
    render: (args) => (
        <LessonNoteStudentView {...args}>
            <LessonNoteView
                lessonNumber={1}
                lessonTitle="Getting Started"
                lessonDescription={`[{"type":"paragraph","children":[{"text":"Learn the basics of programming and get familiar with the development environment."}]}]`}
                onClickViewLesson={() => console.log('View Lesson clicked')}
                locale="en"
                onDeserializationError={(message, error) => console.error(message, error)}
            />
        </LessonNoteStudentView>
    ),
};

/**
 * LessonNoteStudentView with multiple lessons.
 */
export const MultipleChildLessons: Story = {
    args: {
        id: 2,
        ModuleNumber: 2,
        ModuleTitle: 'Advanced Programming Concepts',
        locale: 'en',
    },
    render: (args) => (
        <LessonNoteStudentView {...args}>
            <LessonNoteView
                lessonNumber={1}
                lessonTitle="Object-Oriented Programming"
                lessonDescription={`[{"type":"paragraph","children":[{"text":"This is the first note for the module."}]}]`}
                onClickViewLesson={() => console.log('View OOP Lesson clicked')}
                locale="en"
                onDeserializationError={(message, error) => console.error(message, error)}
            />
            <LessonNoteView
                lessonNumber={2}
                lessonTitle="Functional Programming"
                lessonDescription={`[{"type":"paragraph","children":[{"text":"This is the second note for the module."}]}]`}
                onClickViewLesson={() => console.log('View FP Lesson clicked')}
                locale="en"
                onDeserializationError={(message, error) => console.error(message, error)}
            />
            <LessonNoteView
                lessonNumber={3}
                lessonTitle="Design Patterns"
                lessonDescription={`[{"type":"paragraph","children":[{"text":"Study common design patterns and their implementations."}]}]`}
                onClickViewLesson={() => console.log('View Design Patterns Lesson clicked')}
                locale="en"
                onDeserializationError={(message, error) => console.error(message, error)}
            />
        </LessonNoteStudentView>
    ),
};
