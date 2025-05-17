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
import { UploadedFileType, UploadResponse } from "../../../lib/components/drag-and-drop/uploader";
import { useState } from "react";

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
  quizType: "quizTypeOne",
  imageId: "img-animal",
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

// --- MOCK DATA FOR PREVIEW (form/student view) ---
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
  tags: ["docs"],
  parameters: {
    layout: 'fullscreen',
  },
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

// --- FILE HANDLER MOCK ---
const mockFileResponse = (file: File): UploadResponse => ({
  fileId: `file-${Math.random().toString(36).substr(2, 9)}`,
  fileName: file.name,
  imageId: `img-${Math.random().toString(36).substr(2, 9)}`,
  imageThumbnailUrl: URL.createObjectURL(file),
});

// --- DESIGNER (EDITING) STORY ---
export const InteractiveDesigner: Story = {
  name: "Designer – Interactive Quiz (All Types, File Handlers)",
  render: () => {
    // State for quiz type and quiz data
    const [quizType, setQuizType] = useState<QuizType>("quizTypeOne");
    const [designerData, setDesignerData] = useState<any>(designerQuizTypeOne);

    // Handle quiz type change
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
    
    // Handle file upload and update image fields accordingly
    const handleFilesChange = (
      files: UploadedFileType[],
      index: number,
      setFilesList: React.Dispatch<React.SetStateAction<UploadedFileType[]>>
    ) => {
      if (files.length > 0) {
        // Simulate upload for the first file
        const uploadingFile = {
          ...files[0],
          isUploading: true,
        };
    
        // Immediately update the file at the given index with uploading state
        setFilesList(prevList => {
          const newList = [...prevList];
          newList[index] = uploadingFile;
          return newList;
        });
    
        // Simulate upload completion after 5 seconds
        setTimeout(() => {
          const uploadedFile = {
            ...files[0],
            isUploading: false,
            responseData: mockFileResponse(files[0].file),
          };
          setFilesList(prevList => {
            const newList = [...prevList];
            newList[index] = uploadedFile;
            return newList;
          });
        }, 5000);
      } else {
        // If files array is empty, remove the file at the given index
        setFilesList(prevList => {
          const newList = [...prevList];
          newList[index] = null; // Or undefined, or you can splice it out if you want to remove it
          return newList;
        });
      }
    };
    
    // File delete: clear image field(s)
    const handleFileDelete = (
      index?: number,
      setFile?: React.Dispatch<React.SetStateAction<UploadedFileType[]>>
    ) => {
      if (typeof index !== "number" || !setFile) return;

      setFile((prevFiles: UploadedFileType[]) => {
        // Create a shallow copy of the array
        const newFiles = [...prevFiles];
        // Set the file at the given index to undefined
        newFiles[index] = undefined as any;
        return newFiles;
      });
    };
    
    // Download: demo, just alert (implement as needed)
    const handleFileDownload = (index?: number) => {
      alert(`Download triggered for index ${index} (implement as needed)`);
    };

    // Compose element instance with handlers
    const elementInstance = {
      ...designerData,
      quizType,
      onTypeChange: handleTypeChange,
      onFilesChange: handleFilesChange,
      onFileDelete: handleFileDelete,
      onFileDownload: handleFileDownload,
    };

    return (
      <quizElement.designerComponent
        elementInstance={elementInstance}
        locale="en"
        onUpClick={() => alert("Move up")}
        onDownClick={() => alert("Move down")}
        onDeleteClick={() => alert("Delete")}
      />
    );
  },
};

// --- STUDENT VIEW / FORM COMPONENT STORY ---
export const QuizTypeOneStudentView: Story = {
  name: "Student View – Interactive Quiz (Type One, File Handlers)",
  render: () => {
    return (
      <quizElement.formComponent
        elementInstance={previewQuizTypeOne as QuizTypeOneStudentViewElement}
        locale="en"
      />
    );
  },
};

export const QuizTypeTwoStudentView: Story = {
  name: "Student View – Interactive Quiz (Type Two, File Handlers)",
  render: () => {
    return (
      <quizElement.formComponent
        elementInstance={previewQuizTypeTwo as QuizTypeTwoStudentViewElement}
        locale="en"
      />
    );
  },
};

export const QuizTypeThreeStudentView: Story = {
  name: "Student View – Interactive Quiz (Type Three, File Handlers)",
  render: () => {
    return (
      <quizElement.formComponent
        elementInstance={previewQuizTypeThree as QuizTypeThreeStudentViewElement}
        locale="en"
      />
    );
  },
};

export const QuizTypeFourStudentView: Story = {
  name: "Student View – Interactive Quiz (Type Four, File Handlers)",
  render: () => {
    return (
      <quizElement.formComponent
        elementInstance={previewQuizTypeFour as QuizTypeFourStudentViewElement}
        locale="en"
      />
    );
  }
};
