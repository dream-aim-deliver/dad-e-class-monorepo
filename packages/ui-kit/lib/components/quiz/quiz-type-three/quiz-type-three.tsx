import React, { FC, useState, useEffect } from "react";
import { InputField } from "../../input-field";
import { RadioButton } from "../../radio-button";
import { getDictionary } from "@maany_shr/e-class-translations";
import { TextAreaInput } from "../../text-areaInput";
import { TextInput } from "../../text-input";
import { QuizTypeThreeElement } from "../../course-builder-lesson-component/types";
import Banner from "../../banner";
import { Uploader } from "../../drag-and-drop-uploader/uploader";
import { fileMetadata } from "@maany_shr/e-class-models";

type ChoiceType = {
  fileData: fileMetadata.TFileMetadata;
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
  const [files, setFiles] = useState<fileMetadata.TFileMetadata[]>([]);


  // Initialize state from props (edit/create mode)
  useEffect(() => {
    setQuizTitle(title);
    setQuizDescription(description);

    if (options && options.length > 0) {
      setChoices(options);
      setFiles(
        options.map((opt) =>
          opt.fileData ? opt.fileData
            : undefined
        )
      );
    } else {
      setChoices([
        { fileData: undefined, description: "", correct: false },
        { fileData: undefined, description: "", correct: false },
      ]);
      setFiles([undefined, undefined]);
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
        fileData: files[idx],
        description: choice.description,
        correct: choice.correct,
      })),
    });
  }, [quizTitle, quizDescription, choices, files, id, order, onChange]);


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

  const handleFileUpload = async (files: fileMetadata.TFileUploadRequest[], index: number, abortSignal?: AbortSignal) => {
    if (!files || files.length === 0) {
      setFiles((prevFiles) =>
        prevFiles.map((file, i) =>
          i === index ? undefined : file
        )
      );
      return;
    };

    const file = files[0];
    const processingFile: fileMetadata.TFileMetadata = {
      id: (file as any).id || crypto.randomUUID(),
      name: file.name,
      mimeType: file.file.type || 'application/pdf',
      size: file.file.size,
      checksum: 'processing',
      status: 'processing',
      category: 'document',
      url: '',
    };

    setFiles((prevFiles) =>
      prevFiles.map((file, i) =>
        i === index ? processingFile : file
      )
    );

    const uploadedFile = await onFilesChange([file], abortSignal);

    setFiles((prevFiles) =>
      prevFiles.map((file, i) =>
        i === index ? uploadedFile : file
      )
    );

    return uploadedFile;
  };

  const handleFileDelete = (id: string) => {
    setFiles((prevFiles) =>
      prevFiles.map((file) => (file && file.id === id ? undefined : file))
    );
    onFileDelete(id, 'file');
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
            <div className="flex-1 min-w-0 flex flex-col gap-4 items-start">
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
                  file={files[index]}
                  onFilesChange={(file, abortSignal) => handleFileUpload(file, index, abortSignal)}
                  onDelete={(id) => handleFileDelete(id)}
                  onDownload={(id) => onFileDownload(id)}
                  locale={locale}
                  className="w-full"
                  maxSize={5}
                />
              </div>
            </div>
            {index !== choices.length - 1 && (
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
