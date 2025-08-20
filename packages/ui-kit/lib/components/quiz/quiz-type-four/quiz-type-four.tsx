import { Button } from "../../button";
import { FC } from "react";
import { IconButton } from "../../icon-button";
import { IconTrashAlt } from "../../icons/icon-trash-alt";
import { getDictionary } from "@maany_shr/e-class-translations";
import { TextAreaInput } from "../../text-areaInput";
import { TextInput } from "../../text-input";
import { QuizTypeFourElement } from "../../course-builder-lesson-component/types";
import { Uploader } from "../../drag-and-drop-uploader/uploader";

/**
 * A component for creating and editing a "Label-Image Pair" quiz question (QuizTypeFour).
 *
 * This component enables users to enter a question title and description, then define multiple pairs,
 * each consisting of a label (letter + description) and an associated image upload.
 * Each label-image pair can be added or removed dynamically. The component ensures that label letters
 * (A, B, C, etc.) remain in sync with their corresponding images. All state changes are propagated
 * upwards via the `onChange` callback, which receives the updated quiz data.
 *
 * Utilizes input components like `TextInput`, `TextAreaInput`, `Uploader`, and `IconButton`
 * for a comprehensive quiz creation experience.
 *
 * @param type The type of the quiz element.
 * @param quizType The quiz type identifier for this component.
 * @param required Indicates if the question must be answered.
 * @param id The unique identifier for the quiz question.
 * @param order The order of the quiz question within a larger set.
 * @param title The main question text.
 * @param description Additional details or instructions for the question.
 * @param labels An array of label objects, each with a letter and description.
 * @param images An array of image objects, each with an imageId, imageThumbnailUrl, and correctLetter.
 * @param locale The current locale for internationalization, used to fetch dictionary translations.
 * @param onChange Callback triggered whenever the quiz question data changes.
 * @param onFilesChange Callback triggered when files are uploaded or changed.
 * @param onFileDelete Callback triggered when a file is deleted.
 * @param onFileDownload Callback triggered when a file is downloaded.
 * @param onUploadComplete Callback triggered when a file upload is completed.
 *
 * @example
 * <QuizTypeFour
 *   type="quiz"
 *   quizType="quizTypeFour"
 *   required={true}
 *   id="456"
 *   order={2}
 *   title="Match the label to the correct image"
 *   description="For each label, upload the corresponding image."
 *   labels={[
 *     { letter: "A", description: "Apple" },
 *     { letter: "B", description: "Banana" },
 *   ]}
 *   images={[
 *     { imageId: "img1", correctLetter: "A", imageThumbnailUrl: "..." },
 *     { imageId: "img2", correctLetter: "B", imageThumbnailUrl: "..." },
 *   ]}
 *   locale="en"
 *   onChange={(updatedData) => console.log(updatedData)}
 * />
 */


const QuizTypeFour: FC<QuizTypeFourElement> = ({
  type,
  quizType,
  required,
  id,
  order,
  title,
  description,
  labels,
  images,
  locale,
  onChange,
  onFilesChange,
  onFileDelete,
  onFileDownload,
  onUploadComplete,
}) => {
  const dictionary = getDictionary(locale);

  // Triggers parent update with partial updates
  const handleChange = (updated: Partial<QuizTypeFourElement>) => {
    onChange({
      quizType: "quizTypeFour",
      id,
      order,
      title: updated.title ?? title,
      description: updated.description ?? description,
      labels: updated.labels ?? labels,
      images: updated.images ?? images,
    });
  };

  const handleTitleChange = (value: string) => handleChange({ title: value });
  const handleDescriptionChange = (value: string) => handleChange({ description: value });

  // Label description change
  const handleLabelDescriptionChange = (index: number, value: string) => {
    const updatedLabels = labels.map((lbl, i) =>
      i === index ? { ...lbl, description: value } : lbl
    );
    handleChange({ labels: updatedLabels });
  };

  // Add new label-image pair
  const handleAddPair = () => {
    const nextLetter = String.fromCharCode(65 + labels.length);
    handleChange({
      labels: [...labels, { letter: nextLetter, description: "" }],
      // @ts-expect-error - Type mismatch with fileData undefined property
      images: [...images, { correctLetter: nextLetter, fileData: undefined }],
    });
  };

  // Delete a label-image pair (and reassign all letters)
  const handleDeletePair = (idx: number) => {
    // Remove pair and reassign letters (A, B, C, ...)
    const filteredLabels = labels.filter((_, i) => i !== idx);
    const filteredImages = images.filter((_, i) => i !== idx);

    const reassignedLabels = filteredLabels.map((lbl, i) => ({
      ...lbl,
      letter: String.fromCharCode(65 + i),
    }));
    const reassignedImages = filteredImages.map((img, i) => ({
      ...img,
      correctLetter: String.fromCharCode(65 + i),
    }));

    handleChange({
      labels: reassignedLabels,
      images: reassignedImages,
    });
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <p className="text-md text-base-white leading-[150%]">
        {dictionary.components.quiz.quizTypeFour.headingText}
      </p>
      <div className="flex flex-col gap-2">
        <TextInput
          inputField={{
            className: "w-full",
            value: title,
            setValue: handleTitleChange,
            inputText: dictionary.components.quiz.enterTitleText,
          }}
          label={dictionary.components.quiz.quizTitleText}
        />
        <TextAreaInput
          label={dictionary.components.quiz.descriptionText}
          placeholder={dictionary.components.quiz.enterDescriptionText}
          value={description}
          setValue={handleDescriptionChange}
        />
        {/* Label-Image Pair Section */}
        <div className="flex flex-col gap-3 w-full">
          {labels.map((lbl, idx) => (
            <div key={idx} className="flex gap-2 md:flex-row flex-col items-stretch w-full">
              {/* Label and TextArea */}
              <div className="text-text-primary text-md leading-[120%] font-bold mt-2 flex items-center">
                {lbl.letter})
              </div>
              <div className="w-full flex flex-col md:flex-row gap-2 justify-center items-center">
                <div className="flex md:w-1/2 h-full w-[100%]">
                  <TextAreaInput
                    placeholder={dictionary.components.quiz.quizTypeFour.choiceDescriptionText}
                    value={lbl.description}
                    setValue={(v) => handleLabelDescriptionChange(idx, v)}
                    className="h-full w-full"
                  />
                </div>
                {/* ImageUploader and delete button */}
                <div className="flex items-center md:w-1/2 w-full">
                  <Uploader
                    type="single"
                    variant="image"
                    file={images[idx]?.fileData}
                    onFilesChange={(file, abortSignal) => onFilesChange([file], abortSignal)}
                    onDelete={(id) => onFileDelete(id, idx)}
                    onDownload={(id) => onFileDownload(id)}
                    onUploadComplete={(file) => onUploadComplete(file, idx)}
                    locale={locale}
                    className="w-full"
                    maxSize={5}
                  />
                </div>
              </div>
              <div className="flex items-center">
                <IconButton
                  data-testid={`delete-choice-${idx}`}
                  styles="text"
                  icon={<IconTrashAlt />}
                  size="small"
                  onClick={() => handleDeletePair(idx)}
                  disabled={labels.length <= 1}
                />
              </div>
            </div>
          ))}
          <Button
            variant="secondary"
            onClick={handleAddPair}
            text={dictionary.components.quiz.addChoiceText}
          />
        </div>
      </div>
    </div>
  );
};

export default QuizTypeFour;
