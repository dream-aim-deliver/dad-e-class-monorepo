import { Button } from "../../button";
import { FC, useState, useEffect } from "react";
import { IconButton } from "../../icon-button";
import { IconTrashAlt } from "../../icons/icon-trash-alt";
import { getDictionary } from "@maany_shr/e-class-translations";
import { TextAreaInput } from "../../text-areaInput";
import { TextInput } from "../../text-input";
import { QuizTypeFourElement } from "../../course-builder-lesson-component/types";
import { Uploader, UploadedFileType, ImageUploadResponse } from "../../drag-and-drop/uploader";

type LabelState = {
  letter: string;
  description: string;
};

type ImageState = {
  correctLetter: string;
  file?: UploadedFileType;
};

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
}) => {
  const dictionary = getDictionary(locale);

  // State
  const [quizTitle, setQuizTitle] = useState<string>("");
  const [quizDescription, setQuizDescription] = useState<string>("");
  const [labelStates, setLabelStates] = useState<LabelState[]>([]);
  const [correctLetter, setCorrectLetter] = useState<string[]>([]);
  const [files, setFiles] = useState<(UploadedFileType | undefined)[]>([]);

  // Sync state with props (edit/create mode)
  useEffect(() => {
    const hasProps =
      (title && title.trim() !== "") ||
      (description && description.trim() !== "") ||
      (labels && labels.length > 0) ||
      (images && images.length > 0);
  
    if (hasProps) {
      setQuizTitle(title || "");
      setQuizDescription(description || "");
      setLabelStates(
        labels && labels.length > 0
          ? labels.map((lbl) => ({
              letter: lbl.letter,
              description: lbl.description,
            }))
          : []
      );
      setCorrectLetter(
        images && images.length > 0
          ? images.map((img, idx) => labels?.[idx]?.letter || String.fromCharCode(65 + idx))
          : []  
      );
      setFiles(
        images && images.length > 0
          ? images.map((img) =>
              img.imageThumbnailUrl
                ? {
                    file: new File([], "image.jpg", { type: "image/jpeg" }),
                    isUploading: false,
                    error: undefined,
                    responseData: {
                      imageId: img.imageId,
                      imageThumbnailUrl: img.imageThumbnailUrl,
                    },
                  }
                : undefined
            )
          : []
      );

    } else {
      // Create mode
      setQuizTitle("");
      setQuizDescription("");
      setLabelStates([
        { letter: "A", description: "" },
        { letter: "B", description: "" },
        { letter: "C", description: "" },
      ]);
      setCorrectLetter(["A", "B", "C"]);
      setFiles([undefined, undefined, undefined]);
    }
    // eslint-disable-next-line
  }, [title, description, labels, images]);
  

  // Keep correctLetter in imageStates in sync with labelStates, but only update if needed
  useEffect(() => {
    setCorrectLetter((prev) => {
      let changed = false;
      const newState = prev.map((letter, idx) => {
        const newLetter = labelStates[idx]?.letter || letter;
        if (letter !== newLetter) {
          changed = true;
          return newLetter;
        }
        return letter;
      });
      return changed ? newState : prev;
    });
    // eslint-disable-next-line
  }, [labelStates]);

  // Propagate changes up
  useEffect(() => {
    if (onChange) {
      onChange({
        quizType,
        id,
        order,
        title: quizTitle,
        description: quizDescription,
        labels: labelStates,
        images: files.map((img , idx) => ({
          imageId: (img?.responseData as ImageUploadResponse | undefined)?.imageId || "",
          correctLetter: correctLetter[idx],
          imageThumbnailUrl: (img?.responseData as ImageUploadResponse | undefined)?.imageThumbnailUrl || "",
        })),
      });
    }
    // eslint-disable-next-line
  }, [quizTitle, quizDescription, labelStates, files , correctLetter]);
  

  // Handlers
  const handleLabelDescriptionChange = (index: number, value: string) => {
    setLabelStates((prev) =>
      prev.map((lbl, i) =>
        i === index ? { ...lbl, description: value } : lbl
      )
    );
  };

  // Add/delete a pair (label+image)
  const handleAddPair = () => {
    const nextLetter = String.fromCharCode(65 + labelStates.length);
    setLabelStates((prev) => [
      ...prev,
      { letter: nextLetter, description: "" },
    ]);
    setCorrectLetter((prev) => [...prev, nextLetter]);
    setFiles((prev) => [...prev, undefined]);
  };

  const handleDeletePair = (idx: number) => {
    // Remove the selected label and image
    const newLabels = labelStates.filter((_, i) => i !== idx);
    const newCorrectLetters = correctLetter.filter((_, i) => i !== idx);
    const newFiles = files.filter((_, i) => i !== idx);
  
    // Reassign letters to be sequential (A, B, C, ...)
    const reassignedLabels = newLabels.map((lbl, i) => ({
      ...lbl,
      letter: String.fromCharCode(65 + i),
    }));
  
    // Update the correct letters to match the reassigned labels
    const reassignedCorrectLetters = newCorrectLetters.map((_, i) => String.fromCharCode(65 + i));
  
    setLabelStates(reassignedLabels);
    setCorrectLetter(reassignedCorrectLetters);
    setFiles(newFiles);
  };
  
  return (
    <div className="flex flex-col gap-4">
      <p className="text-md text-base-white leading-[150%]">
        {dictionary.components.quiz.quizTypeFour.headingText}
      </p>
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
        {/* Label-Image Pair Section */}
        <div className="flex flex-col gap-3 w-full">
          {labelStates.map((lbl, idx) => (
            <div key={idx} className="flex gap-2 md:flex-row flex-col items-stretch w-full">
            {/* Label and TextArea */}
              <div className="text-text-primary text-md leading-[120%] font-bold mt-2 flex items-center">
                {lbl.letter})
              </div>
              <div className="w-full flex flex-col md:flex-row gap-2 justify-center items-center">
                <div className="flex md:w-1/2 h-full w-full">
                  <TextAreaInput
                    placeholder={dictionary.components.quiz.quizTypeFour.choiceDescriptionText}
                    value={lbl.description}
                    setValue={(v) => handleLabelDescriptionChange(idx, v)}
                    className="h-full"
                  />
                </div>
                {/* ImageUploader and delete button */}
                <div className="flex items-center md:w-1/2 w-full">
                  <Uploader
                    type="single"
                    variant="image"
                    locale={locale}
                    file={files[idx]}
                    onDelete={() => onFileDelete(idx , setFiles)}
                    onDownload={() => onFileDownload(idx)}
                    onFilesChange={(files) => onFilesChange(files , idx , setFiles)}
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
                  disabled={labelStates.length <= 1}
                />
              </div>
            </div>
          ))}
          <Button
            variant="secondary"
            onClick={handleAddPair}
            className="mb-4"
            text={dictionary.components.quiz.addChoiceText}
          />
        </div>
      </div>
    </div>
  );
};

export default QuizTypeFour;
