import { FC } from "react";
import { Button } from "../../button";
import { InputField } from "../../input-field";
import { RadioButton } from "../../radio-button";
import { IconButton } from "../../icon-button";
import { IconTrashAlt } from "../../icons/icon-trash-alt";
import { getDictionary } from "@maany_shr/e-class-translations";
import { TextAreaInput } from "../../text-areaInput";
import { TextInput } from "../../text-input";
import { QuizTypeOneElement } from "../../course-builder-lesson-component/types";
import Banner from "../../banner";
import { Uploader } from "../../drag-and-drop-uploader/uploader";

/**
 * A component for creating and editing a single-choice quiz question.
 *
 * This component allows users to input a question title, description,
 * upload an optional image, and define multiple choice options,
 * specifying one correct answer. It utilizes various input components
 * like `TextInput`, `TextAreaInput`, `RadioButton`, `InputField`,
 * `IconButton`, and `ImageUploader` for a comprehensive quiz creation experience.
 *
 * @param id The unique identifier for the quiz question.
 * @param order The order of the quiz question within a larger set.
 * @param title The title or main question text.
 * @param description Additional details or instructions for the question.
 * @param imageId The ID of the uploaded image associated with the question.
 * @param imageThumbnailUrl The URL of the thumbnail for the associated image.
 * @param options An array of choice objects, each containing the option text and a boolean indicating if it's the correct answer.
 * @param locale The current locale for internationalization, used to fetch dictionary translations.
 * @param onChange A callback function triggered whenever the quiz question data changes. It receives the updated `QuizTypeOneElement` object.
 * @param onFilesChange A callback function triggered when files are uploaded or changed. It receives the updated list of files.
 * @param onFileDelete A callback function triggered when a file is deleted. It receives the ID of the deleted file.
 * @param onFileDownload A callback function triggered when a file is downloaded. It receives the ID of the file to be downloaded.
 * @param onUploadComplete A callback function triggered when a file upload is completed.
 *
 * @example
 * <QuizTypeOne
 * id="123"
 * order={1}
 * title="What is the capital of France?"
 * description="Select the correct answer from the options below."
 * options={[
 * { optionText: "Berlin", correct: false },
 * { optionText: "Paris", correct: true },
 * { optionText: "Madrid", correct: false },
 * ]}
 * locale="en"
 * onChange={(updatedData) => console.log(updatedData)}
 * onFilesChange={(files) => console.log(files)}
 * onFileDelete={(fileId) => console.log(fileId)}
 * onFileDownload={(fileId) => console.log(fileId)}
 * />
 */

const QuizTypeOne: FC<QuizTypeOneElement> = ({
  id,
  error,
  order,
  title,
  description,
  fileData,
  options,
  locale,
  onChange,
  onFileDownload,
  onFileDelete,
  onFilesChange,
  onUploadComplete,
}) => {
  const dictionary = getDictionary(locale);

  // Triggers parent update with partial updates
  const handleChange = (updated: Partial<QuizTypeOneElement>) => {
    onChange({
      quizType: "quizTypeOne",
      id,
      order,
      title: updated.title ?? title,
      description: updated.description ?? description,
      fileData: updated.fileData ?? fileData,
      options: updated.options ?? options,
    });
  };

  const handleTitleChange = (value: string) => handleChange({ title: value });
  const handleDescriptionChange = (value: string) =>
    handleChange({ description: value });


  const handleChoiceTextChange = (index: number, text: string) => {
    const updatedOptions = options.map((opt, i) =>
      i === index ? { ...opt, optionText: text } : opt
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

  const handleAddChoice = () => {
    const newOption = { optionText: "", correct: false };
    handleChange({ options: [...options, newOption] });
  };

  const handleDeleteChoice = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index);
    // Reassign correct answer if needed
    if (options[index].correct && newOptions.length > 0) {
      newOptions[0].correct = true;
    }
    handleChange({ options: newOptions });
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <p className="text-md text-base-white leading-[150%]">
        {dictionary.components.quiz.quizTypeOne.headingText}
      </p>
      {/* Title and Description Inputs */}
      <div className="flex flex-col gap-2">
        <TextInput
          inputField={{
            className: 'w-full',
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
      <div className="flex flex-col gap-[18px]">
        {/* Image Uploader */}
        <Uploader
          type="single"
          variant="generic"
          file={fileData}
          onFilesChange={(file, abortSignal) => onFilesChange([file], abortSignal)}
          onDelete={(id) => onFileDelete(id, 0)}
          onDownload={(id) => onFileDownload(id)}
          onUploadComplete={(file) => onUploadComplete(file, 0)}
          locale={locale}
          className="w-full"
          maxSize={5}
        />
        {/* error */}
        {error && (
          <Banner
            style="error"
            title={dictionary.components.quiz.errorText}
            className="w-full"
          />
        )}
        {/* Choices Section */}
        <div className="flex flex-col gap-3">
          {options.map((choice, index) => (
            <div key={index} className="flex gap-2 items-center">
              <div className="w-fit">
                <RadioButton
                  name="single-choice"
                  value={`choice-${index}`}
                  checked={choice.correct}
                  onChange={() => handleCorrectAnswerChange(index)}
                />
              </div>
              <InputField
                className="w-full"
                inputPlaceholder={dictionary.components.quiz.quizTypeOne.radioButtonText}
                value={choice.optionText}
                setValue={(val) => handleChoiceTextChange(index, val)}
              />
              <IconButton
                data-testid={`delete-choice-${index}`}
                styles="text"
                icon={<IconTrashAlt />}
                size="medium"
                onClick={() => handleDeleteChoice(index)}
                disabled={options.length <= 1}
              />
            </div>
          ))}
        </div>
        {/* Add Choice Button */}
        <Button
          variant="secondary"
          onClick={handleAddChoice}
          text={dictionary.components.quiz.addChoiceText}
        />
      </div>
    </div>
  );
};

export default QuizTypeOne;
