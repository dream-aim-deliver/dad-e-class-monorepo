import { FC, useState, useEffect } from "react";
import { Button } from "../../button";
import { InputField } from "../../input-field";
import { RadioButton } from "../../radio-button";
import { IconButton } from "../../icon-button";
import { IconTrashAlt } from "../../icons/icon-trash-alt";
import { getDictionary } from "@maany_shr/e-class-translations";
import { TextAreaInput } from "../../text-areaInput";
import { TextInput } from "../../text-input";
import { QuizTypeOneElement } from "../../lesson-components/types";
import { Uploader, UploadedFileType, UploadResponse, ImageUploadResponse } from "../../drag-and-drop/uploader";

type ChoiceType = { optionText: string; correct: boolean };

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
 * @param required Indicates if the question must be answered.
 * @param title The title or main question text.
 * @param description Additional details or instructions for the question.
 * @param imageId The ID of the uploaded image associated with the question.
 * @param imageThumbnailUrl The URL of the thumbnail for the associated image.
 * @param options An array of choice objects, each containing the option text and a boolean indicating if it's the correct answer.
 * @param locale The current locale for internationalization, used to fetch dictionary translations.
 * @param onChange A callback function triggered whenever the quiz question data changes. It receives the updated `QuizTypeOneElement` object.
 *
 * @example
 * <QuizTypeOne
 * id="123"
 * order={1}
 * required={true}
 * title="What is the capital of France?"
 * description="Select the correct answer from the options below."
 * options={[
 * { optionText: "Berlin", correct: false },
 * { optionText: "Paris", correct: true },
 * { optionText: "Madrid", correct: false },
 * ]}
 * locale="en"
 * onChange={(updatedData) => console.log(updatedData)}
 * />
 */

const QuizTypeOne: FC<QuizTypeOneElement> = ({
  id,
  order,
  required,
  title,
  description,
  imageId,
  imageThumbnailUrl,
  options,
  locale,
  onChange,
}) => {
  const dictionary = getDictionary(locale);

  // States
  const [quizTitle, setQuizTitle] = useState<string>("");
  const [quizDescription, setQuizDescription] = useState<string>("");
  const [choices, setChoices] = useState<ChoiceType[]>([]);
  const [files, setFiles] = useState<UploadedFileType[]>([]);

  useEffect(() => {
    setQuizTitle(title);
    setQuizDescription(description);
    setChoices(
      options && options.length > 0
        ? options
        : [{ optionText: "", correct: false }]
    );
    if (imageId && imageThumbnailUrl) {
      setFiles([
        {
          file: new File([], "image.jpg"), // dummy file
          isUploading: false,
          error: undefined,
          responseData: {
            imageId: imageId,
            imageThumbnailUrl: imageThumbnailUrl,
          },
        },
      ]);
    } else {
      setFiles([]);
    }
    // eslint-disable-next-line
  }, [title, description, options, imageId, imageThumbnailUrl]);
  
  useEffect(() => {
    onChange({
      quizType: "quizTypeOne",
      id,
      order,
      title: quizTitle,
      description: quizDescription,
      imageId: (files[0]?.responseData as ImageUploadResponse | undefined)?.imageId,
      options: choices,
    });
  }, [quizTitle, quizDescription, choices, files, id, order]);
  

  // function to add choice
  const handleAddChoice = () => {
    setChoices((prev) => [...prev, { optionText: "", correct: false }]);
  };

  // function to delete choice
  const handleDeleteChoice = (index: number) => {
    setChoices((prevChoices) => {
      const newChoices = prevChoices.filter((_, i) => i !== index);
      // If deleted choice was correct, make the first one correct (if any left)
      if (prevChoices[index].correct && newChoices.length > 0) {
        return newChoices.map((choice, i) => ({
          ...choice,
          correct: i === 0,
        }));
      }
      return newChoices;
    });
  };

// function to change choice
  const handleInputChange = (index: number, value: string) => {
    setChoices((prevChoices) =>
      prevChoices.map((choice, i) =>
        i === index ? { ...choice, optionText: value } : choice
      )
    );
  };

  // function to Change correct answer
  const handleCorrectAnswerChange = (index: number) => {
    setChoices((prevChoices) =>
      prevChoices.map((choice, i) => ({
        ...choice,
        correct: i === index,
      }))
    );
  };

// Called when files are added/changed (upload)
const handleFilesChange = async (newFiles: UploadedFileType[]): Promise<UploadResponse> => {
  // Simulate upload for each file
  const uploadedResponses: UploadResponse[] = [];
  for (const fileObj of newFiles) {
    // Simulate upload logic (replace with your actual upload API)
    const response: ImageUploadResponse = {
      imageId: Math.random().toString(36).substr(2, 9),
      imageThumbnailUrl: "https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg"
    };
    fileObj.isUploading = false;
    fileObj.responseData = response;
    uploadedResponses.push(response);
  }
  setFiles([...newFiles]);
  return uploadedResponses[0]; // For single uploader, just return the first
};

// Delete file by index
const handleDelete = (fileIndex: number) => {
  setFiles(prev => prev.filter((_, i) => i !== fileIndex));
};

// Download file by index
const handleDownload = (fileIndex: number) => {
  const fileObj = files[fileIndex];
  if (fileObj && fileObj.file) {
    const url = URL.createObjectURL(fileObj.file);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileObj.file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
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
      <div className="flex flex-col gap-[18px]">

        {/* Image Uploader */}
        <Uploader
          type="single"
          variant="image"
          locale={locale}
          file={files[0]}
          onDelete={handleDelete}
          onDownload={handleDownload}
          onFilesChange={handleFilesChange}
          maxSize={5}
        />
        
        {/* Choices Section */}
        <div className="flex flex-col gap-3">
          {choices.map((choice, index) => (
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
                inputText={dictionary.components.quiz.quizTypeOne.radioButtonText}
                value={choice.optionText}
                setValue={(value) => handleInputChange(index, value)}
              />
              <IconButton
                styles="text"
                icon={<IconTrashAlt />}
                size="medium"
                onClick={() => handleDeleteChoice(index)}
                disabled={choices.length <= 1}
              />
            </div>
          ))}
        </div>

        {/* Add Choice Button */}
        <Button
          variant="secondary"
          onClick={handleAddChoice}
          className="mb-4"
          text={dictionary.components.quiz.addChoiceText}
        />
      </div>
    </div>
  );
};

export default QuizTypeOne;
