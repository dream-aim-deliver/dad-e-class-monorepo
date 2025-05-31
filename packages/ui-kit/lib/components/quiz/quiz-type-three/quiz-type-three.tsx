import React, { FC, useState, useEffect } from "react";
import { InputField } from "../../input-field";
import { RadioButton } from "../../radio-button";
import { getDictionary } from "@maany_shr/e-class-translations";
import { TextAreaInput } from "../../text-areaInput";
import { TextInput } from "../../text-input";
import { QuizTypeThreeElement } from "../../course-builder-lesson-component/types";
import { Uploader, UploadedFileType, ImageUploadResponse } from "../../drag-and-drop/uploader";
import Banner from "../../banner";

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
 * @param onFilesChange A callback function triggered when files are uploaded.
 * @param onFileDelete A callback function triggered when a file is deleted.
 * @param onFileDownload A callback function triggered when a file is downloaded.
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
  error,
  title,
  description,
  options,
  locale,
  onChange,
  onFilesChange,
  onFileDelete,
  onFileDownload,
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
                file: new File([], "image.jpg", { type: "image/jpeg" }),
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
    { imageId: "", imageThumbnailUrl: "", description: "", correct: false },
  ]);
 setFilesList([undefined, undefined]);
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
        imageThumbnailUrl: (filesList[idx]?.responseData as ImageUploadResponse | undefined)?.imageThumbnailUrl || "",
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
      {/* error */}
      {error && (
        <Banner
          style="error"
          title={dictionary.components.quiz.errorText}
          className="w-full"
        />
      )}
      {/* Choices Section */}
      <div className="flex flex-col md:flex-row w-full gap-4 md:gap-0">
        {choices.map((choice, index) => (
          <React.Fragment key={index}>
            <div className="flex-1 min-w-0 flex flex-col gap-4 items-center">
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
              <div className="w-full flex items-center justify-center">
                <Uploader
                  type="single"
                  variant="image"
                  locale={locale}
                  file={filesList[index]}
                  onDelete={() => onFileDelete(index, setFilesList)}
                  onDownload={() => onFileDownload(index)}
                  onFilesChange={(files) => onFilesChange(files, index, setFilesList)}
                  maxSize={5}
                />
              </div>
            </div>
            {index !== choices.length - 1 && (
              <>
                <div className="hidden md:flex self-stretch w-[1px] bg-divider mx-4" />
                <div className="flex md:hidden self-stretch h-[1px] bg-divider my-4" />
              </>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default QuizTypeThree;
