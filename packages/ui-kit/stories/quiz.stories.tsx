import { Meta, StoryObj } from "@storybook/react";
import quizElement from "../lib/components/lesson-components/quiz";
import { NextIntlClientProvider } from "next-intl";
import {
  QuizType,
  QuizTypeFourElement,
  QuizTypeFourPreviewElement,
  QuizTypeOneElement,
  QuizTypeOnePreviewElement,
  QuizTypeThreeElement,
  QuizTypeThreePreviewElement,
  QuizTypeTwoElement,
  QuizTypeTwoPreviewElement,
} from "../lib/components/lesson-components/types";

// Mock dictionary for translations
const mockDictionary = {
  components: {
    quiz: {
      quizText: "Quiz",
    },
  },
};

// --- MOCK DATA FOR DESIGNER (editing) ---
const designerQuizTypeOne = {
  type: "quiz",
  id: 101,
  order: 1,
  required: true,
  title: "Designer: Identify the Animal",
  description: "Select the correct animal shown in the image.",
  quizType: "quizTypeOne" as QuizType,
  imageId: "img-dog",
  imageThumbnailUrl: "https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg",
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
  imageId: "img-fruits",
  imageThumbnailUrl: "https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg",
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
      imageId: "img-eiffel",
      imageThumbnailUrl: "https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg",
      description: "Eiffel Tower",
      correct: true,
    },
    {
      imageId: "img-statue",
      imageThumbnailUrl: "https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg",
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
      imageId: "img-apple",
      correctLetter: "A",
      imageThumbnailUrl: "https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg",
    },
    {
      imageId: "img-ball",
      correctLetter: "B",
      imageThumbnailUrl: "https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg",
    },
  ],
  locale: "en",
  onChange: (updatedData) => {
    console.log("Designer TypeFour changed:", updatedData);
  },
};

// --- MOCK DATA FOR PREVIEW (form) ---
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
  imageId: "img-animals",
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
      userInput: "",
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
      userInput: "",
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

const meta: Meta = {
  title: "Components/CourseBuilder/QuizElement",
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <NextIntlClientProvider locale="en" messages={mockDictionary}>
        <div className="max-w-xl w-full bg-base-dark p-4 rounded-lg">
          <Story />
        </div>
      </NextIntlClientProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<any>;

// --- DESIGNER STORIES ---
export const TypeOneDesigner: Story = {
  name: "Designer – Quiz Type One",
  render: () => (
    <quizElement.designerComponent
      elementInstance={designerQuizTypeOne as QuizTypeOneElement}
      locale="en"
      onUpClick={() => alert("Move up")}
      onDownClick={() => alert("Move down")}
      onDeleteClick={() => alert("Delete")}
    />
  ),
};

export const TypeTwoDesigner: Story = {
  name: "Designer – Quiz Type Two",
  render: () => (
    <quizElement.designerComponent
      elementInstance={designerQuizTypeTwo as QuizTypeTwoElement}
      locale="en"
    />
  ),
};

export const TypeThreeDesigner: Story = {
  name: "Designer – Quiz Type Three",
  render: () => (
    <quizElement.designerComponent
      elementInstance={designerQuizTypeThree as QuizTypeThreeElement}
      locale="en"
    />
  ),
};

export const TypeFourDesigner: Story = {
  name: "Designer – Quiz Type Four",
  render: () => (
    <quizElement.designerComponent
      elementInstance={designerQuizTypeFour as QuizTypeFourElement}
      locale="en"
    />
  ),
};

// --- PREVIEW (FORM) STORIES ---
export const TypeOnePreview: Story = {
  name: "Preview – Quiz Type One",
  render: () => (
    <quizElement.formComponent
      elementInstance={previewQuizTypeOne as QuizTypeOnePreviewElement}
      locale="en"
    />
  ),
};

export const TypeTwoPreview: Story = {
  name: "Preview – Quiz Type Two",
  render: () => (
    <quizElement.formComponent
      elementInstance={previewQuizTypeTwo as QuizTypeTwoPreviewElement}
      locale="en"
    />
  ),
};

export const TypeThreePreview: Story = {
  name: "Preview – Quiz Type Three",
  render: () => (
    <quizElement.formComponent
      elementInstance={previewQuizTypeThree as QuizTypeThreePreviewElement}
      locale="en"
    />
  ),
};

export const TypeFourPreview: Story = {
  name: "Preview – Quiz Type Four",
  render: () => (
    <quizElement.formComponent
      elementInstance={previewQuizTypeFour as QuizTypeFourPreviewElement}
      locale="en"
    />
  ),
};
