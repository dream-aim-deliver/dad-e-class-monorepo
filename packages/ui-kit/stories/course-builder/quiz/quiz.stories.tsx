import { Meta, StoryObj } from "@storybook/react";
import quizElement from "../../../lib/components/course-builder-lesson-component/quiz";
import { NextIntlClientProvider } from "next-intl";
import {
  QuizType,
  QuizTypeFourStudentViewElement,
  QuizTypeOneStudentViewElement,
  QuizTypeThreeStudentViewElement,
  QuizTypeTwoStudentViewElement,
} from "../../../lib/components/course-builder-lesson-component/types";
import { fileMetadata } from "@maany_shr/e-class-models";
import { useState } from "react";
import { TLocale } from "@maany_shr/e-class-translations";

// --- MULTI-LANGUAGE MOCK DICTIONARIES ---
const dictionaries = {
  en: {
    components: {
      quiz: {
        quizText: "Quiz",
        typeOneText: "Type One",
        typeTwoText: "Type Two",
        typeThreeText: "Type Three",
        typeFourText: "Type Four",
      },
    },
  },
  fr: {
    components: {
      quiz: {
        quizText: "Quiz (FR)",
        typeOneText: "Type Un",
        typeTwoText: "Type Deux",
        typeThreeText: "Type Trois",
        typeFourText: "Type Quatre",
      },
    },
  },
  es: {
    components: {
      quiz: {
        quizText: "Cuestionario",
        typeOneText: "Tipo Uno",
        typeTwoText: "Tipo Dos",
        typeThreeText: "Tipo Tres",
        typeFourText: "Tipo Cuatro",
      },
    },
  },
  hi: {
    components: {
      quiz: {
        quizText: "प्रश्नोत्तरी",
        typeOneText: "प्रकार एक",
        typeTwoText: "प्रकार दो",
        typeThreeText: "प्रकार तीन",
        typeFourText: "प्रकार चार",
      },
    },
  },
};

// --- MOCK IMAGE RESPONSE ---
const mockImageResponse = (fileName: string): fileMetadata.TFileMetadata => ({
  id: String(Math.floor(Math.random() * 1000000)),
  name: fileName,
  mimeType: 'image/jpeg',
  size: Math.floor(Math.random() * 3000000) + 50000,
  checksum: `checksum-${Math.random().toString(36).substr(2, 16)}`,
  status: 'available',
  category: 'image',
  url: 'https://source.unsplash.com/random/300×200/?city',
  thumbnailUrl: 'https://picsum.photos/200/300',
} as fileMetadata.TFileMetadata);

// --- DESIGNER MOCK DATA ---
const designerQuizTypeOne = {
  type: "quiz",
  id: 101,
  order: 1,
  required: true,
  title: "Designer: Identify the Animal",
  description: "Select the correct animal shown in the image.",
  quizType: "quizTypeOne",
  fileData: undefined,
  options: [
    { optionText: "Dog", correct: true },
    { optionText: "Cat", correct: false },
    { optionText: "Rabbit", correct: false },
  ],
  locale: "en",
  onChange: (updatedData) => {
    console.log("Designer TypeOne changed:", updatedData);
  },
};

const designerQuizTypeTwo = {
  type: "quiz",
  id: 102,
  order: 2,
  required: false,
  title: "Designer: Group the Fruits",
  description: "Group the following items as Fruits or Vegetables.",
  quizType: "quizTypeTwo",
  fileData: undefined,
  groups: [
    {
      groupTitle: "Fruits",
      options: [
        { optionText: "Apple", correct: true },
        { optionText: "Carrot", correct: false },
      ],
    },
    {
      groupTitle: "Vegetables",
      options: [
        { optionText: "Potato", correct: true },
        { optionText: "Banana", correct: false },
      ],
    },
  ],
  locale: "en",
  onChange: (updatedData) => {
    console.log("Designer TypeTwo changed:", updatedData);
  },
};

const designerQuizTypeThree = {
  type: "quiz",
  id: 103,
  order: 3,
  required: true,
  title: "Designer: Choose the Correct Image",
  description: "Pick the image that shows the Eiffel Tower.",
  quizType: "quizTypeThree",
  options: [
    {
      fileData: undefined,
      description: "Eiffel Tower",
      correct: true,
    },
    {
      fileData: mockImageResponse("statue-of-liberty.jpg"),
      description: "Statue of Liberty",
      correct: false,
    },
  ],
  locale: "en",
  onChange: (updatedData) => {
    console.log("Designer TypeThree changed:", updatedData);
  },
};

const designerQuizTypeFour = {
  type: "quiz",
  id: 104,
  order: 4,
  required: false,
  title: "Designer: Match the Letters",
  description: "Match each image to the correct letter label.",
  quizType: "quizTypeFour",
  labels: [
    { letter: "A", description: "Apple" },
    { letter: "B", description: "Ball" },
  ],
  images: [
    {
      correctLetter: "A",
      fileData: mockImageResponse("statue-of-liberty.jpg"),
    },
    {
      correctLetter: "B",
      fileData: undefined,
    },
  ],
  locale: "en",
  onChange: (updatedData) => {
    console.log("Designer TypeFour changed:", updatedData);
  },
};

// --- PREVIEW (STUDENT VIEW) MOCK DATA ---
const previewQuizTypeOne = {
  type: "quiz",
  id: 201,
  order: 1,
  required: true,
  title: "Preview: Identify the Flag",
  description: "Select the country for this flag.",
  quizType: "quizTypeOne",
  imageId: "img-flag",
  imageThumbnailUrl: "https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg",
  options: [
    { optionText: "India", correct: false, selected: false },
    { optionText: "France", correct: true, selected: true },
    { optionText: "Brazil", correct: false, selected: false },
  ],
  locale: "en",
  onChange: (updatedData) => {
    console.log("Preview TypeOne changed:", updatedData);
  },
};

const previewQuizTypeTwo = {
  type: "quiz",
  id: 202,
  order: 2,
  required: false,
  title: "Preview: Sort the Animals",
  description: "Sort the animals into Mammals and Birds.",
  quizType: "quizTypeTwo",
  imageId: "img-flag",
  imageThumbnailUrl: "https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg",
  groups: [
    {
      groupTitle: "Mammals",
      options: [
        { optionText: "Cow", correct: true, selected: false },
        { optionText: "Eagle", correct: false, selected: false },
      ],
    },
    {
      groupTitle: "Birds",
      options: [
        { optionText: "Sparrow", correct: true, selected: true },
        { optionText: "Dog", correct: false, selected: false },
      ],
    },
  ],
  locale: "en",
  onChange: (updatedData) => {
    console.log("Preview TypeTwo changed:", updatedData);
  },
};

const previewQuizTypeThree = {
  type: "quiz",
  id: 203,
  order: 3,
  required: true,
  title: "Preview: Pick the Fruit Image",
  description: "Select the image that shows a fruit.",
  quizType: "quizTypeThree",
  imageId: "img-flag",
  imageThumbnailUrl: "https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg",
  options: [
    {
      imageId: "img-apple",
      imageThumbnailUrl: "https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg",
      description: "Apple",
      correct: true,
      selected: true,
    },
    {
      imageId: "img-car",
      imageThumbnailUrl: "https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg",
      description: "Car",
      correct: false,
      selected: false,
    },
  ],
  locale: "en",
  onChange: (updatedData) => {
    console.log("Preview TypeThree changed:", updatedData);
  },
};

const previewQuizTypeFour = {
  type: "quiz",
  id: 204,
  order: 4,
  required: false,
  title: "Preview: Match the Numbers",
  description: "Match each image to the correct number label.",
  quizType: "quizTypeFour",
  imageId: "img-flag",
  imageThumbnailUrl: "https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg",
  labels: [
    { letter: "A", description: "One" },
    { letter: "B", description: "Two" },
    { letter: "C", description: "Three" },
    { letter: "D", description: "Four" },
  ],
  images: [
    {
      imageId: "img-one",
      correctLetter: "B",
      imageThumbnailUrl: "https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg",
      userInput: "A",
    },
    {
      imageId: "img-two",
      correctLetter: "C",
      imageThumbnailUrl: "https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg",
      userInput: "C",
    },
    {
      imageId: "img-three",
      correctLetter: "D",
      imageThumbnailUrl: "https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg",
      userInput: "B",
    },
    {
      imageId: "img-four",
      correctLetter: "A",
      imageThumbnailUrl: "https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg",
      userInput: "D",
    },
  ],
  locale: "en",
  onChange: (updatedData) => {
    console.log("Preview TypeFour changed:", updatedData);
  },
};

// --- FILE HANDLER MOCKS ---
const simulateFileUpload = async (
  files: fileMetadata.TFileUploadRequest[],
  abortSignal?: AbortSignal,
): Promise<fileMetadata.TFileMetadata> => {
  if (!files || files.length === 0) return Promise.resolve({} as fileMetadata.TFileMetadata);
  const newFile = files[0];
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      const finalMetadata = mockImageResponse(newFile.name);
      resolve(finalMetadata);
    }, 2000);
    abortSignal?.addEventListener("abort", () => {
      clearTimeout(timeout);
      reject(new DOMException("Upload aborted", "AbortError"));
    });
  });
};

const handleFileDelete = (fileId: string, type: 'file') => {
  alert(`File deleted: ${fileId} (type: ${type})`);
};
const handleFileDownload = (id: string) => {
  alert(`Download file with id: ${id}`);
};

// --- STORYBOOK META ---
interface LocaleArgs {
  locale: TLocale;
}

const meta: Meta<LocaleArgs> = {
  title: "Components/CourseBuilder/QuizElement",
  tags: ["docs"],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    locale: {
      control: { type: 'select' },
      options: ['en', 'de'],
      defaultValue: 'en',
      description: "Select the locale/language",
    },
  },
  decorators: [
    (Story, context) => (
      <NextIntlClientProvider
        locale={context.args.locale}
        messages={dictionaries[context.args.locale] || dictionaries['en']}
      >
        <div className="max-w-xl w-full bg-base-dark p-4 rounded-lg">
          <Story />
        </div>
      </NextIntlClientProvider>
    ),
  ],
};
export default meta;

// --- DESIGNER (EDITING) STORY ---
export const InteractiveDesigner: StoryObj<LocaleArgs> = {
  name: "Designer – Interactive Quiz (All Types, File Handlers)",
  args: { locale: 'en' },
  render: (args) => {
    const [quizType, setQuizType] = useState<QuizType>("quizTypeOne");
    const [designerData, setDesignerData] = useState<any>(designerQuizTypeOne);

    const handleTypeChange = (type: QuizType) => {
      setQuizType(type);
      switch (type) {
        case "quizTypeOne": setDesignerData(designerQuizTypeOne); break;
        case "quizTypeTwo": setDesignerData(designerQuizTypeTwo); break;
        case "quizTypeThree": setDesignerData(designerQuizTypeThree); break;
        case "quizTypeFour": setDesignerData(designerQuizTypeFour); break;
        default: setDesignerData(designerQuizTypeOne);
      }
    };

    const elementInstance = {
      ...designerData,
      quizType,
      locale: args.locale,
      onTypeChange: handleTypeChange,
      onFilesChange: simulateFileUpload,
      onFileDelete: handleFileDelete,
      onFileDownload: handleFileDownload,
    };

    return (
      <quizElement.designerComponent
        elementInstance={elementInstance}
        locale={args.locale}
        onUpClick={() => alert("Move up")}
        onDownClick={() => alert("Move down")}
        onDeleteClick={() => alert("Delete")}
      />
    );
  },
};

// --- STUDENT VIEW / FORM COMPONENT STORIES ---
export const QuizTypeOneStudentView: StoryObj<LocaleArgs> = {
  name: "Student View – Interactive Quiz (Type One, File Handlers)",
  args: { locale: 'en' },
  render: (args) => (
    <quizElement.formComponent
      elementInstance={{ ...previewQuizTypeOne, locale: args.locale } as QuizTypeOneStudentViewElement}
      locale={args.locale}
    />
  ),
};

export const QuizTypeTwoStudentView: StoryObj<LocaleArgs> = {
  name: "Student View – Interactive Quiz (Type Two, File Handlers)",
  args: { locale: 'en' },
  render: (args) => (
    <quizElement.formComponent
      elementInstance={{ ...previewQuizTypeTwo, locale: args.locale } as QuizTypeTwoStudentViewElement}
      locale={args.locale}
    />
  ),
};

export const QuizTypeThreeStudentView: StoryObj<LocaleArgs> = {
  name: "Student View – Interactive Quiz (Type Three, File Handlers)",
  args: { locale: 'en' },
  render: (args) => (
    <quizElement.formComponent
      elementInstance={{ ...previewQuizTypeThree, locale: args.locale } as QuizTypeThreeStudentViewElement}
      locale={args.locale}
    />
  ),
};

export const QuizTypeFourStudentView: StoryObj<LocaleArgs> = {
  name: "Student View – Interactive Quiz (Type Four, File Handlers)",
  args: { locale: 'en' },
  render: (args) => (
    <quizElement.formComponent
      elementInstance={{ ...previewQuizTypeFour, locale: args.locale } as QuizTypeFourStudentViewElement}
      locale={args.locale}
    />
  ),
};
