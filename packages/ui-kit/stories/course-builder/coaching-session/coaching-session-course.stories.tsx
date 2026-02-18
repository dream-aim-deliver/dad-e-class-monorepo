import { Meta, StoryObj } from "@storybook/react-vite";
import coachingSessionElement from "../../../lib/components/course-builder-lesson-component/coaching-session";
import { NextIntlClientProvider } from "next-intl";
import { CoachingSessionTypes, CoachingSessionStudentViewTypes } from "../../../lib/components/course-builder-lesson-component/types";
import { LessonCoachComponent, LessonCoachComponentProps } from "../../../lib/components/coaching-session-course-builder/lesson-coach-component";
import { CourseElementType } from "../../../lib/components/course-builder/types";
import { CoachingSessionHeader } from "../../../lib/components/coaching-session-course-builder/coaching-session-header";
import { Button } from "../../../lib/components/button";

// --- MOCK DICTIONARIES ---
const mockDictionaryEn = {
  components: {
    profileInfo: {
      buttontext1: "Show more",
      buttontext2: "Other Coaches",
    },
  },
};

const mockDictionaryDe = {
  components: {
    profileInfo: {
      buttontext1: "Mehr anzeigen",
      buttontext2: "Andere Coaches",
    },
  },
};

// --- MOCK DATA FOR DESIGNER (editing) ---
const designerCoachingSession: CoachingSessionTypes = {
  type: "coachingSession" as CourseElementType.CoachingSession,
  id: 301,
  order: 1,
  coachingSessionTypes: [
    { id: 1, name: "1-on-1 Session", duration: 30 },
    { id: 2, name: "Group Session", duration: 45 },
    { id: 3, name: "Q&A Session", duration: 20 },
  ],
  onChange: (updatedData) => {
    console.log("Designer CoachingSession changed:", updatedData);
  },
  locale: "en",
};

// --- COACH CARDS ---
const coachCardsDefault: LessonCoachComponentProps[] = [
  {
    name: "Jane Smith",
    rating: 4.8,
    imageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    numberOfRatings: 120,
    description: "Expert in communication skills and personal development.",
    defaultCoach: true,
    onClickProfile: () => alert("Profile clicked for Jane Smith"),
    onClickBook: () => alert("Book clicked for Jane Smith"),
    locale: "en",
  },
  {
    name: "John Doe",
    rating: 4.5,
    imageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464950/2151206390_1_c38sdb.jpg',
    numberOfRatings: 85,
    description: "Specialist in leadership and team building.",
    defaultCoach: true,
    onClickProfile: () => alert("Profile clicked for John Doe"),
    onClickBook: () => alert("Book clicked for John Doe"),
    locale: "en",
  },
];

const coachCardsMore: LessonCoachComponentProps[] = [
  {
    name: "Jane Smith",
    rating: 4.8,
    imageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    numberOfRatings: 120,
    description: "Expert in communication skills and personal development.",
    defaultCoach: false,
    onClickProfile: () => alert("Profile clicked for Jane Smith"),
    onClickBook: () => alert("Book clicked for Jane Smith"),
    locale: "en",
  },
  {
    name: "John Doe",
    rating: 4.5,
    imageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464950/2151206390_1_c38sdb.jpg',
    numberOfRatings: 85,
    description: "Specialist in leadership and team building.",
    defaultCoach: false,
    onClickProfile: () => alert("Profile clicked for John Doe"),
    onClickBook: () => alert("Book clicked for John Doe"),
    locale: "en",
  },
  {
    name: "Alice Johnson",
    rating: 4.7,
    imageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464952/2151206391_1_c38sdc.jpg',
    numberOfRatings: 100,
    description: "Career coach with 10 years of experience.",
    defaultCoach: false,
    onClickProfile: () => alert("Profile clicked for Alice Johnson"),
    onClickBook: () => alert("Book clicked for Alice Johnson"),
    locale: "en",
  },
  {
    name: "Bob Brown",
    rating: 4.6,
    imageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464954/2151206392_1_c38sdd.jpg',
    numberOfRatings: 90,
    description: "Helps with productivity and time management.",
    defaultCoach: false,
    onClickProfile: () => alert("Profile clicked for Bob Brown"),
    onClickBook: () => alert("Book clicked for Bob Brown"),
    locale: "en",
  },
];

// --- PREVIEW DATA GENERATOR ---
const getPreviewCoachingSession = (
  hadSession: boolean,
  locale: "en" | "de",
  dictionary: typeof mockDictionaryEn | typeof mockDictionaryDe
): CoachingSessionStudentViewTypes => ({
  type: "coachingSession" as CourseElementType.CoachingSession,
  id: hadSession ? 401 : 402,
  order: 1,
  studentHadSessionBeforeInCourse: hadSession,
  locale,
  children: (
    <div className="flex flex-col gap-4">
      {hadSession ?
        <CoachingSessionHeader
          name={locale === "de" ? "Schneller Sprint" : "Quick Sprint"}
          duration={30}
          locale={locale}
        />
        : <CoachingSessionHeader
          name={locale === "de" ? "Vollimmersion" : "Full Immersion"}
          duration={60}
          locale={locale}
        />
      }
      {(hadSession ? coachCardsDefault : coachCardsMore).map((coach, idx) => (
        <LessonCoachComponent
          key={coach.name + idx}
          {...coach}
          defaultCoach={hadSession ? true : coach.defaultCoach}
          locale={locale}
        />
      ))}
      <Button
        variant="text"
        size="medium"
        onClick={() => alert(hadSession
          ? (locale === "de" ? "Andere Coaches" : "Other Coaches")
          : (locale === "de" ? "Mehr anzeigen" : "Show more"))}
        className="flex-1 min-h-[40px] min-w-[240px] max-md:max-w-full"
        text={
          hadSession
            ? dictionary.components.profileInfo.buttontext2
            : dictionary.components.profileInfo.buttontext1
        }
      />
    </div>
  ),
});

// --- STORYBOOK META ---
type PreviewStoryArgs = {
  locale: "en" | "de";
  hadSession: boolean;
};

const meta: Meta<PreviewStoryArgs> = {
  title: "Components/CourseBuilder/CoachingSessionElement",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    locale: "en",        // Default to English
    hadSession: false,   // Default to "not had session"
  },
  argTypes: {
    locale: {
      control: "select",
      options: ["en", "de"],
    },
    hadSession: {
      control: "boolean",
      name: "Student had session before?",
    },
  },
  decorators: [
    (Story, context) => {
      const locale = context?.args?.locale || "en";
      const messages = locale === "de" ? mockDictionaryDe : mockDictionaryEn;
      return (
        <NextIntlClientProvider locale={locale} messages={messages}>
          <div className="max-w-xl w-full bg-base-dark p-4 rounded-lg">
            <Story />
          </div>
        </NextIntlClientProvider>
      );
    },
  ],
};

export default meta;

// --- DESIGNER STORY (UPDATED) ---
export const Designer: StoryObj<PreviewStoryArgs> = {
  name: "Designer – Coaching Session",
  render: (args) => (
    <coachingSessionElement.designerComponent
      elementInstance={{ ...designerCoachingSession, locale: args.locale }}
      locale={args.locale}
      onUpClick={() => alert("Move up")}
      onDownClick={() => alert("Move down")}
      onDeleteClick={() => alert("Delete")}
    />
  ),
};

// --- PREVIEW STORY ---
export const Preview: StoryObj<PreviewStoryArgs> = {
  name: "Preview – Coaching Session",
  render: (args) =>
    coachingSessionElement.formComponent({
      elementInstance: getPreviewCoachingSession(
        args.hadSession,
        args.locale,
        args.locale === "de" ? mockDictionaryDe : mockDictionaryEn
      ),
      locale: args.locale,
    }),
};
