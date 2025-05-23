import type { Meta, StoryObj } from '@storybook/react';
import LessonNoteElement from '../../../lib/components/course-builder-lesson-component/lesson-note';
import { CourseElementType } from '../../../lib/components/course-builder/types';
import { LessonNoteBuilderViewType, LessonNoteStudentViewType } from '../../../lib/components/course-builder-lesson-component/types';
import { LessonNoteView } from '../../../lib/components/lesson-note/lesson-note-view';
import Banner from '../../../lib/components/banner';
import { useState } from 'react';
import { slateifySerialize } from '../../../lib/components/rich-text-element/serializer';


const onDeserializationError = (message: string, error: Error) => {
  console.error(`${message}. Error: ${error}`);
}

// --- DESIGNER MOCK DATA ---
const designerLessonNote: LessonNoteBuilderViewType = {
  type: CourseElementType.LessonNote,
  id: 101,
  order: 1,
  initialValue: slateifySerialize("This is a sample note."),
  onChange: (value) => {
    console.log("Designer LessonNote changed:", value);
    return Math.random() < 0.5; // Simulate a 50% chance of saving successfully
  },
  placeholder: "Write your lesson notes here...",
  locale: "en",
  onDeserializationError: onDeserializationError,
};


// --- STUDENT PREVIEW MOCK DATA (ARRAY OF LESSON NOTE CARDS) ---
const getPreviewLessonNote = (locale: "en" | "de"): LessonNoteStudentViewType => ({
  type: CourseElementType.LessonNote,
  id: 201,
  order: 1,
  locale,
  ModuleNumber: 2,
  ModuleTitle: locale === "de" ? "Fortgeschrittene Themen" : "Advanced Topics",
  children: [
    <LessonNoteView
      key="note1"
      lessonNumber={1}
      lessonTitle={locale === "de" ? "Einführung" : "Introduction"}
      lessonDescription={
        locale === "de"
          ? `[{"type":"paragraph","children":[{"text":"Dies ist die erste Notiz für das Modul."}]}]`
          : `[{"type":"paragraph","children":[{"text":"This is the first note for the module."}]}]`
      }
      onClickViewLesson={() => alert("View Lesson clicked")}
      locale={locale}
      onDeserializationError={onDeserializationError}
    />,
    <LessonNoteView
      key="note2"
      lessonNumber={2}
      lessonTitle={locale === "de" ? "Vertiefung" : "Deep Dive"}
      lessonDescription={
        locale === "de"
          ? `[{"type":"paragraph","children":[{"text":"Dies ist die zweite Notiz für das Modul."}]}]`
          : `[{"type":"paragraph","children":[{"text":"This is the second note for the module."}]}]`
      }
      onClickViewLesson={() => alert("View Lesson clicked")}
      locale={locale}
      onDeserializationError={onDeserializationError}
    />,
    <LessonNoteView
      key="note3"
      lessonNumber={3}
      lessonTitle={locale === "de" ? "Zusammenfassung" : "Summary"}
      lessonDescription={
        locale === "de"
          ? `[{"type":"paragraph","children":[{"text":"Dies ist die dritte Notiz für das Modul."}]}]`
          : `[{"type":"paragraph","children":[{"text":"This is the third note for the module."}]}]`
      }
      onClickViewLesson={() => alert("View Lesson clicked")}
      locale={locale}
      onDeserializationError={onDeserializationError}
    />,
  ],
});

type StoryArgs = {
  locale: "en" | "de";
};

const meta: Meta<StoryArgs> = {
  title: "Components/CourseBuilder/LessonNoteElement",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    locale: "en",
  },
  argTypes: {
    locale: {
      control: "select",
      options: ["en", "de"],
    },
  },
};

export default meta;

// --- DESIGNER STORY ---
export const Designer: StoryObj<StoryArgs> = {
  name: "Designer – Lesson Note (With Saving State)",
  render: (args) => {
    // Define a component so hooks are allowed
    function DesignerStoryComponent() {
      const [saving, setSaving] = useState(false);

      // Simulate async save
      const handleChange = (value: string) => {
        console.log("Designer LessonNote changed:", value);
        setSaving(true);
        setTimeout(() => {
          setSaving(false);
        }, 2000); // simulate 2 seconds saving
        return Math.random() < 0.5; // Simulate a 50% chance of saving successfully
      };

      return (
        <LessonNoteElement.designerComponent
          elementInstance={{
            ...designerLessonNote,
            locale: args.locale,
            onChange: handleChange,
            // Pass children only while saving
            children: saving ? (
              <Banner
                title={
                  args.locale === "de"
                    ? "Notizen werden gespeichert..."
                    : "Saving notes..."
                }
                style="warning"
              />
            ) : null,
          }}
          locale={args.locale}
        />
      );
    }

    // Return the component
    return <DesignerStoryComponent />;
  },
};



// --- PREVIEW STORY (ARRAY OF LESSON NOTE CARDS AS CHILDREN) ---
export const Preview: StoryObj<StoryArgs> = {
  name: "Preview – Lesson Note (Multiple Cards)",
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-[90%]">
          <Story />
        </div>
      </div>
    ),
  ],

  render: (args) =>
    LessonNoteElement.formComponent({
      elementInstance: getPreviewLessonNote(args.locale),
      locale: args.locale,
    }),
};

