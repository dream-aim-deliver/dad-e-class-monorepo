import React, { FC, useState, useEffect } from "react";
import { InputField } from "../../input-field";
import { RadioButton } from "../../radio-button";
import { getDictionary } from "@maany_shr/e-class-translations";
import { TextAreaInput } from "../../text-areaInput";
import { TextInput } from "../../text-input";
import { QuizTypeThreeElement } from "../../lesson-components/types";
import { Uploader, UploadedFileType, ImageUploadResponse, UploadResponse } from "../../drag-and-drop/uploader";

type ChoiceType = {
  imageId: string;
  imageThumbnailUrl: string;
  description: string;
  correct: boolean;
};

/**
 * A component for creating and editing a single-choice quiz question where each option
 * can have an associated image and a text description.
 *
 * This component allows users to input a question title, description, and define multiple
 * choice options. Each option can include an image (uploaded via `ImageUploader`),
 * a text description, and a boolean indicating if it's the correct answer.
 *
 * @param id The unique identifier for the quiz question.
 * @param order The order of the quiz question within a larger set.
 * @param title The title or main question text.
 * @param description Additional details or instructions for the question.
 * @param options An array of choice objects, each containing:
 * - `imageId`: The ID of the uploaded image associated with this choice.
 * - `imageThumbnailUrl`: The URL of the thumbnail for the associated image.
 * - `description`: The text description for this choice.
 * - `correct`: A boolean indicating if this is the correct answer.
 * @param locale The current locale for internationalization, used to fetch dictionary translations.
 * @param onChange A callback function triggered whenever the quiz question data changes.
 * It receives the updated `QuizTypeThreeElement` object.
 *
 * @example
 * <QuizType3
 * id="789"
 * order={3}
 * title="Which image shows a cat?"
 * description="Select the image that depicts a cat."
 * options={[
 * { imageId: "cat123", imageThumbnailUrl: "https://example.com/cat.jpg", description: "A fluffy cat", correct: true },
 * { imageId: "dog456", imageThumbnailUrl: "https://example.com/dog.jpg", description: "A happy dog", correct: false },
 * ]}
 * locale="en"
 * onChange={(updatedData) => console.log(updatedData)}
 * />
 */

const QuizTypeThree: FC<QuizTypeThreeElement> = ({
  id,
  order,
  title,
  description,
  options,
  locale,
  onChange,
}) => {
  const dictionary = getDictionary(locale);

  // States
  const [quizTitle, setQuizTitle] = useState<string>("");
  const [quizDescription, setQuizDescription] = useState<string>("");
  const [choices, setChoices] = useState<ChoiceType[]>([]);
  const [filesList, setFilesList] = useState<UploadedFileType[]>([]); // One file per choice, single uploader per choice


  // Initialize state from props (edit/create mode)
  useEffect(() => {
    setQuizTitle(title);
    setQuizDescription(description);
  
    if (options && options.length > 0) {
      setChoices(options);
      setFilesList(
        options.map((opt) =>
          opt.imageId && opt.imageThumbnailUrl
            ? {
                file: new File([], "image.jpg"),
                isUploading: false,
                error: undefined,
                responseData: {
                  imageId: opt.imageId,
                  imageThumbnailUrl: opt.imageThumbnailUrl,
                },
              }
            : undefined
        )
      );
    } else {
      setChoices([
        { imageId: "", imageThumbnailUrl: "", description: "", correct: false },
      ]);
      setFilesList([undefined]);
    }
  }, [title, description, options]);
  

  // Call onChange on any relevant state change
  useEffect(() => {
    onChange({
      quizType: "quizTypeThree",
      id,
      order,
      title: quizTitle,
      description: quizDescription,
      options: choices.map((choice, idx) => ({
        imageId: (filesList[idx]?.responseData as ImageUploadResponse | undefined)?.imageId || "",
        description: choice.description,
        correct: choice.correct,
      })),
    });
  }, [quizTitle, quizDescription, choices, filesList, id, order, onChange]);
  

  // Handle description change per choice
  const handleDescriptionChange = (index: number, value: string) => {
    setChoices((prev) =>
      prev.map((choice, i) =>
        i === index ? { ...choice, description: value } : choice
      )
    );
  };

  // Handle correct answer change
  const handleCorrectAnswerChange = (index: number) => {
    setChoices((prev) =>
      prev.map((choice, i) => ({
        ...choice,
        correct: i === index,
      }))
    );
  };

// Delete image from a choice
const handleDeleteImage = (choiceIndex: number) => {
  setFilesList((prev) =>
    prev.map((file, i) => (i === choiceIndex ? undefined : file))
  );
};

// Download image for a choice
const handleDownload = (choiceIndex: number) => {
  const fileObj = filesList[choiceIndex];
  if (fileObj && fileObj.file) {
    const url = URL.createObjectURL(fileObj.file);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileObj.file.name || "image";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

// Upload image for a choice
const handleFilesChange = async (
  choiceIndex: number,
  newFiles: UploadedFileType[]
): Promise<UploadResponse> => {
  // Only one file per choice
  const fileObj = newFiles[0];
  const response: ImageUploadResponse = {
    imageId: Math.random().toString(36).substr(2, 9),
    imageThumbnailUrl:
      "https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg",
  };
  fileObj.isUploading = false;
  fileObj.responseData = response;
  setFilesList((prev) =>
    prev.map((file, i) => (i === choiceIndex ? fileObj : file))
  );
  return response;
};


  return (
    <div className="flex flex-col gap-[13px] w-full">
      <p className="text-md text-base-white leading-[150%]">
        {dictionary.components.quiz.quizTypeThree.headingText}
      </p>
      {/* Title and Description Inputs */}
      <div className="flex flex-col gap-2">
        <TextInput
          inputField={{
            className: "w-full",
            value: quizTitle,
            setValue: setQuizTitle,
            inputText: dictionary.components.quiz.enterTitleText,
          }}
          label={dictionary.components.quiz.quizTitleText}
        />
        <TextAreaInput
          label={dictionary.components.quiz.descriptionText}
          placeholder={dictionary.components.quiz.enterDescriptionText}
          value={quizDescription}
          setValue={setQuizDescription}
        />
      </div>

      {/* Choices Section */}
      <div className="flex flex-col md:flex-row gap-4 w-full">
        {choices.map((choice, index) => (
          <div className="flex w-full md:flex-row flex-col gap-4">
            <div key={index} className="flex flex-col gap-4 items-start w-full">
              <RadioButton
                name="single-choice"
                value={`choice-${index}`}
                checked={choice.correct}
                onChange={() => handleCorrectAnswerChange(index)}
              />
              <InputField
                className="w-full"
                inputText={dictionary.components.quiz.quizTypeThree.choiceDescriptionText}
                value={choice.description}
                setValue={(value) => handleDescriptionChange(index, value)}
              />
              <div className="md:max-w-[220px] max-w-[300px] w-full">
                <Uploader
                  type="single"
                  variant="image"
                  locale={locale}
                  file={filesList[index]}
                  onDelete={() => handleDeleteImage(index)}
                  onDownload={() => handleDownload(index)}
                  onFilesChange={(newFiles) => handleFilesChange(index, newFiles)}
                  maxSize={5}
                />
              </div>
            </div>
            {/* Divider between groups - not after last group */}
            {index !== choices.length - 1 && (
                <>
                  <div className="hidden md:flex w-[1px] bg-divider" />
                  <div className="md:hidden flex h-[1px] bg-divider" />
                </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizTypeThree;
