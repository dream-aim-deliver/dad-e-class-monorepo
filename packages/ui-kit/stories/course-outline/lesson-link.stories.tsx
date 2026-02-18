import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { LessonLink } from '../../lib/components/course-outline/lesson-link';
import { LessonLinkItem } from '../../lib/components/course-outline/lesson-link-item';
import { Milestone } from '../../lib/components/course-outline/milestone';
import { TLocale } from '@maany_shr/e-class-translations';

const meta: Meta<typeof LessonLink> = {
  title: 'Components/CourseOutline/LessonLink',
  component: LessonLink,
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: false,
      description: 'LessonLinkItem components to display within the container',
    },
  },
};

export default meta;

type Story = StoryObj<typeof LessonLink>;

const initialLessonItems = [
  {
    lessonTitle: 'Introduction to Course Concepts',
    lessonNumber: 1,
    isActive: false,
    isCompleted: true,
    isOptional: false,
    isUpdated: false,
    locale: 'en' as TLocale,
  },
  {
    lessonTitle: 'Core Principles and Methodology',
    lessonNumber: 2,
    isActive: false,
    isCompleted: true,
    isOptional: false,
    isUpdated: true,
    locale: 'en' as TLocale,
  },
  {
    lessonTitle: 'Advanced Techniques Workshop',
    lessonNumber: 3,
    isActive: true,
    isCompleted: true,
    isOptional: true,
    isUpdated: true,
    locale: 'en' as TLocale,
  },
  {
    lessonTitle: 'Optional Deep Dive Session',
    lessonNumber: 4,
    isCompleted: false,
    isActive: false,
    isOptional: true,
    locale: 'en' as TLocale,
  },
  {
    lessonTitle: 'Final Project Guidelines',
    lessonNumber: 5,
    isCompleted: false,
    isActive: false,
    isUpdated: true,
    locale: 'en' as TLocale,
  },
];

// Generic wrapper for LessonLink with state and click handling
interface LessonLinkStatefulProps {
  args: any;
  locale: TLocale;
  showMilestones?: boolean;
}

// Wrapper component to manage state and sync with args.locale
const LessonLinkStateful = ({ args, locale, showMilestones = true }: LessonLinkStatefulProps) => {
  const [lessons, setLessons] = useState(
    initialLessonItems.map(item => ({ ...item, locale }))
  );

  // Handle lesson item click
  const handleLessonClick = (lessonNumber: number) => {
    alert('Lesson ' + lessonNumber + ' clicked!');
    setLessons(prevLessons =>
      prevLessons.map(lesson => ({
        ...lesson,
        isActive: lesson.lessonNumber === lessonNumber
      }))
    );
  };

  return (
    <div className='w-[400px]'>
      <LessonLink {...args}>
        {showMilestones && (
          <div className="py-2">
            <Milestone completed={false} locale={locale} />
          </div>
        )}
        {lessons.map((lesson, index) => (
          <LessonLinkItem
            key={index}
            lessonTitle={lesson.lessonTitle}
            lessonNumber={lesson.lessonNumber}
            isCompleted={lesson.isCompleted}
            isActive={lesson.isActive}
            isOptional={lesson.isOptional}
            isUpdated={lesson.isUpdated}
            locale={lesson.locale}
            onClick={() => handleLessonClick(lesson.lessonNumber)}
          />
        ))}
        {showMilestones && (
          <div className="py-2">
            <Milestone completed={true} locale={locale} />
          </div>
        )}
      </LessonLink>
    </div>
  );
};

// Default story
export const Default: Story = {
  render: (args) => <LessonLinkStateful args={args} locale="en" />,
};

// Story with German locale
export const GermanLocale: Story = {
  render: (args) => <LessonLinkStateful args={args} locale="de" />,
};
