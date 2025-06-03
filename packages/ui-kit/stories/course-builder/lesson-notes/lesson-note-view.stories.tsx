import { Meta, StoryObj } from '@storybook/react';
import { LessonNoteView } from '../../../lib/components/lesson-note/lesson-note-view';

/**
 * Storybook configuration for the LessonNoteView component.
 */
const meta: Meta<typeof LessonNoteView> = {
    title: 'Components/LessonNotes/LessonNoteView',
    component: LessonNoteView,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    }
};

export default meta;

type Story = StoryObj<typeof LessonNoteView>;

/**
 * Default state of the LessonNoteView component.
 */
export const Default: Story = {
    args: {
        lessonNumber: 1,
        lessonTitle: 'Introduction to Programming',
        lessonDescription: '<p>Learn the basics of programming, including variables, loops, and functions.</p>',
        locale: 'en',
    },
    render: (args) => (
        <LessonNoteView
            {...args}
            onClickViewLesson={() => console.log('View Lesson clicked')}
            onDeserializationError={(message, error) => console.error(message, error)}
        />
    ),
};

/**
 * LessonNoteView with rich text formatting in description.
 */
export const WithRichTextFormatting: Story = {
    args: {
        lessonNumber: 2,
        lessonTitle: 'Advanced JavaScript Concepts',
        lessonDescription: '<h3>Key Topics</h3><ul><li><strong>Closures</strong>: Understanding lexical scoping</li><li><em>Promises</em>: Asynchronous programming patterns</li><li><u>Prototypal Inheritance</u>: Object-oriented JavaScript</li></ul><blockquote>JavaScript is a powerful language with many advanced concepts.</blockquote>',
        locale: 'en',
    },
    render: (args) => (
        <LessonNoteView
            {...args}
            onClickViewLesson={() => console.log('View Advanced Lesson clicked')}
            onDeserializationError={(message, error) => console.error(message, error)}
        />
    ),
};

/**
 * LessonNoteView with long lesson title and description.
 */
export const WithLongContent: Story = {
    args: {
        lessonNumber: 3,
        lessonTitle: 'Comprehensive Overview of Machine Learning Algorithms and Their Applications in Real-World Scenarios',
        lessonDescription: '<p>This in-depth lesson explores the fundamentals and advanced concepts of various machine learning algorithms, including supervised learning techniques such as regression and classification, unsupervised learning methods like clustering and dimensionality reduction, and deep learning approaches with neural networks. We\'ll cover practical implementations, optimization strategies, and how to evaluate model performance effectively. By the end of this lesson, you\'ll understand how to select appropriate algorithms for different problem domains and datasets.</p>',
        locale: 'en',
    },
    render: (args) => (
        <LessonNoteView
            {...args}
            onClickViewLesson={() => console.log('View Long Content Lesson clicked')}
            onDeserializationError={(message, error) => console.error(message, error)}
        />
    ),
};
