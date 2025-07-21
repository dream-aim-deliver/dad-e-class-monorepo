import React, { FC } from "react";
import { InputField } from "../../input-field";
import { RadioButton } from "../../radio-button";
import { getDictionary } from "@maany_shr/e-class-translations";
import { TextAreaInput } from "../../text-areaInput";
import { TextInput } from "../../text-input";
import { QuizTypeThreeElement } from "../../course-builder-lesson-component/types";
import Banner from "../../banner";
import { Uploader } from "../../drag-and-drop-uploader/uploader";
import { fileMetadata } from "@maany_shr/e-class-models";

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
 * @param onUploadComplete A callback function triggered when a file upload is completed.
 * 
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
  onUploadComplete,
}) => {
  const dictionary = getDictionary(locale);

  // Triggers parent update with partial updates
  const handleChange = (updated: Partial<QuizTypeThreeElement>) => {
    onChange({
      quizType: "quizTypeThree",
      id,
      order,
      title: updated.title ?? title,
      description: updated.description ?? description,
      options: updated.options ?? options,
    });
  };

  const handleTitleChange = (value: string) => handleChange({ title: value });

  const handleDescriptionChange = (value: string) =>
    handleChange({ description: value });

  const handleChoiceDescriptionChange = (index: number, value: string) => {
    const updatedOptions = options.map((opt, i) =>
      i === index ? { ...opt, description: value } : opt
    );
    handleChange({ options: updatedOptions });
  };

  const handleCorrectAnswerChange = (index: number) => {
    const updatedOptions = options.map((opt, i) => ({
      ...opt,
      correct: i === index,
    }));
    handleChange({ options: updatedOptions });
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
            value: title,
            setValue: handleTitleChange,
            inputPlaceholder: dictionary.components.quiz.enterTitleText,
          }}
          label={dictionary.components.quiz.quizTitleText}
        />
        <TextAreaInput
          label={dictionary.components.quiz.descriptionText}
          placeholder={dictionary.components.quiz.enterDescriptionText}
          value={description}
          setValue={handleDescriptionChange}
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
        {options.map((option, index) => (
          <React.Fragment key={index}>
            <div className="flex-1 min-w-0 flex flex-col gap-4 items-start">
              <RadioButton
                name="single-choice"
                value={`choice-${index}`}
                checked={option.correct}
                onChange={() => handleCorrectAnswerChange(index)}
              />
              <InputField
                className="w-full"
                inputPlaceholder={dictionary.components.quiz.quizTypeThree.choiceDescriptionText}
                value={option.description}
                setValue={(value) =>
                  handleChoiceDescriptionChange(index, value)
                }
              />
              <div className="w-full flex items-center justify-center">
                <Uploader
                  type="single"
                  variant="image"
                  file={option.fileData}
                  onFilesChange={(file, abortSignal) => onFilesChange([file], abortSignal)}
                  onDelete={(id) => onFileDelete(id, index)}
                  onDownload={(id) => onFileDownload(id)}
                  onUploadComplete={(file) => onUploadComplete(file, index)}
                  locale={locale}
                  className="w-full"
                  maxSize={5}
                />
              </div>
            </div>
            {index !== options.length - 1 && (
              <>
                <div className="hidden md:flex self-stretch w-[1px] bg-divider mx-4" />
                <div className="flex md:hidden self-stretch h-[1px] bg-divider" />
              </>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default QuizTypeThree;
