import React, { FC } from "react";
import { InputField } from "../../input-field";
import { RadioButton } from "../../radio-button";
import { getDictionary, TLocale } from "@maany_shr/e-class-translations";
import { TextAreaInput } from "../../text-areaInput";
import { TextInput } from "../../text-input";
import { QuizTypeThreeElement } from "../../course-builder-lesson-component/types";
import Banner from "../../banner";
import { Uploader } from "../../drag-and-drop-uploader/uploader";
import { fileMetadata } from "@maany_shr/e-class-models";
import { CourseElementType } from "../../course-builder/types";
import { ElementValidator } from "../../lesson/types";

// Quiz Type Three Validation
export const getValidationError: ElementValidator = (props) => {
  const { elementInstance, dictionary } = props;

  if (elementInstance.type !== CourseElementType.QuizTypeThree)
    return 'Wrong element type';

  const quiz = elementInstance as QuizTypeThreeElement;

  // Title non empty
  if (!quiz.title || quiz.title.trim() === '') {
    return 'Title should not be empty';
  }

  // Description non empty
  if (!quiz.description || quiz.description.trim() === '') {
    return 'Description should not be empty';
  }

  // At least one option present
  if (!quiz.options || quiz.options.length === 0) {
    return 'At least one option should be present';
  }

  for (const option of quiz.options) {
    // File image attached to each option
    if (!option.imageFile) {
      return 'Image file should be attached to each option';
    }

    // Each option has a non empty description
    if (!option.description || option.description.trim() === '') {
      return 'Each option should have a non-empty description';
    }
  }

  // At least one option chosen as correct
  const hasCorrectOption = quiz.options.some(option => option.correct);
  if (!hasCorrectOption) {
    return 'At least one option should be chosen as correct';
  }

  return undefined;
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

interface QuizTypeThreeProps {
  element: QuizTypeThreeElement;
  locale: TLocale;
  onChange: (updated: Partial<QuizTypeThreeElement>) => void;
  onFileChange: (
    file: fileMetadata.TFileUploadRequest,
    abortSignal?: AbortSignal,
  ) => Promise<fileMetadata.TFileMetadata>;
  onFileDelete: (fileId: string, index: number) => void;
  onFileDownload: (id: string) => void;
  onUploadComplete: (file: fileMetadata.TFileMetadata, index: number) => void;
  uploadError: string | null;
}

const QuizTypeThree: FC<QuizTypeThreeProps> = ({
  element,
  locale,
  onChange,
  onFileChange,
  onFileDelete,
  onFileDownload,
  onUploadComplete,
  uploadError,
}) => {
  const dictionary = getDictionary(locale);

  // Triggers parent update with partial updates
  const handleChange = (updated: Partial<QuizTypeThreeElement>) => {
    onChange({
      type: CourseElementType.QuizTypeThree,
      id: element.id,
      title: updated.title ?? element.title,
      description: updated.description ?? element.description,
      options: updated.options ?? element.options,
    });
  };

  const handleTitleChange = (value: string) => handleChange({ title: value });

  const handleDescriptionChange = (value: string) =>
    handleChange({ description: value });

  const handleChoiceDescriptionChange = (index: number, value: string) => {
    const updatedOptions = element.options.map((opt, i) =>
      i === index ? { ...opt, description: value } : opt
    );
    handleChange({ options: updatedOptions });
  };

  const handleCorrectAnswerChange = (index: number) => {
    const updatedOptions = element.options.map((opt, i) => ({
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
            value: element.title,
            setValue: handleTitleChange,
            inputText: dictionary.components.quiz.enterTitleText,
          }}
          label={dictionary.components.quiz.quizTitleText}
        />
        <TextAreaInput
          label={dictionary.components.quiz.descriptionText}
          placeholder={dictionary.components.quiz.enterDescriptionText}
          value={element.description}
          setValue={handleDescriptionChange}
        />
      </div>
      {/* error */}
      {uploadError && (
        <Banner
          style="error"
          title={uploadError}
          className="w-full"
        />
      )}
      {/* Choices Section */}
      <div className="flex flex-col md:flex-row w-full gap-4 md:gap-0">
        {element.options.map((option, index) => (
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
                inputText={dictionary.components.quiz.quizTypeThree.choiceDescriptionText}
                value={option.description}
                setValue={(value) =>
                  handleChoiceDescriptionChange(index, value)
                }
              />
              <div className="w-full flex items-center justify-center">
                <Uploader
                  type="single"
                  variant="image"
                  file={option.imageFile}
                  onFilesChange={(file, abortSignal) => onFileChange(file, abortSignal)}
                  onDelete={(id) => onFileDelete(id, index)}
                  onDownload={(id) => onFileDownload(id)}
                  onUploadComplete={(file) => onUploadComplete(file, index)}
                  locale={locale}
                  className="w-full"
                  maxSize={5}
                  isDeletionAllowed
                />
              </div>
            </div>
            {index !== element.options.length - 1 && (
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
