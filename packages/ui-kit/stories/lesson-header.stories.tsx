import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { LessonHeader } from '../lib/components/lesson-header';

// --- Storybook Meta ---
const meta: Meta<typeof LessonHeader> = {
  title: 'Components/LessonHeader',
  component: LessonHeader,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '100%', padding: '1rem', boxSizing: 'border-box' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    locale: {
      control: 'select',
      options: ['en', 'de'],
    },
    showNotes: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof LessonHeader>;

// --- Stateful Wrapper ---
interface LessonHeaderStatefulProps {
  args: any;
}

const LessonHeaderStateful = ({ args }: LessonHeaderStatefulProps) => {
  const [showNotes, setShowNotes] = useState(args.showNotes ?? false);

  // Toggle showNotes and alert
  const handleNotesClick = () => {
    setShowNotes((prev: boolean) => !prev);
  };


  return (
    <LessonHeader
      {...args}
      showNotes={showNotes}
      onClickPrevious={args.onClickPrevious ?? (() => alert('Previous lesson clicked'))}
      onClickNext={args.onClickNext ?? (() => alert('Next lesson clicked'))}
      onClick={handleNotesClick}
    />
  );
};

// --- Stories ---
export const Default: Story = {
  render: (args) => <LessonHeaderStateful args={args} />,
  args: {
    currentModule: 1,
    totalModules: 5,
    moduleTitle: 'Introduction to Leadership',
    currentLesson: 1,
    totalLessons: 10,
    lessonTitle: 'What is Leadership?',
    showNotes: false,
    className: 'w-full',
    locale: 'en',
  },
};

export const NotesVisible: Story = {
  render: (args) => <LessonHeaderStateful args={args} />,
  args: {
    ...Default.args,
    showNotes: true,
    lessonTitle: 'Leadership Styles',
    currentLesson: 2,
  },
};

export const LastLesson: Story = {
  render: (args) => <LessonHeaderStateful args={args} />,
  args: {
    ...Default.args,
    currentLesson: 10,
    lessonTitle: 'Course Wrap-up',
    showNotes: false,
  },
};

export const FirstModule: Story = {
  render: (args) => <LessonHeaderStateful args={args} />,
  args: {
    ...Default.args,
    currentModule: 1,
    totalModules: 3,
    moduleTitle: 'Getting Started',
    currentLesson: 1,
    totalLessons: 4,
    lessonTitle: 'Welcome!',
    showNotes: false,
  },
};

export const LastModule: Story = {
  render: (args) => <LessonHeaderStateful args={args} />,
  args: {
    ...Default.args,
    currentModule: 3,
    totalModules: 3,
    moduleTitle: 'Advanced Topics',
    currentLesson: 4,
    totalLessons: 4,
    lessonTitle: 'Final Thoughts',
    showNotes: true,
  },
};

export const GermanLocale: Story = {
  render: (args) => <LessonHeaderStateful args={args} />,
  args: {
    ...Default.args,
    locale: 'de',
    moduleTitle: 'Einführung in Führung',
    lessonTitle: 'Was ist Führung?',
  },
};

export const NoNotes: Story = {
  render: (args) => <LessonHeaderStateful args={args} />,
  args: {
    currentModule: 1,
    totalModules: 5,
    moduleTitle: 'Introduction to Leadership',
    currentLesson: 1,
    totalLessons: 10,
    lessonTitle: 'What is Leadership?',
    areNotesAvailable: false,
    className: 'w-full',
    locale: 'en',
  },
};
