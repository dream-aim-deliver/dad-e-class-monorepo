import React, { FC, useState, useEffect } from "react";
import { Button } from "../../button";
import { InputField } from "../../input-field";
import { RadioButton } from "../../radio-button";
import { IconButton } from "../../icon-button";
import { IconTrashAlt } from "../../icons/icon-trash-alt";
import { getDictionary } from "@maany_shr/e-class-translations";
import { TextAreaInput } from "../../text-areaInput";
import { TextInput } from "../../text-input";
import { QuizTypeTwoElement } from "../../lesson-components/types";
import { Uploader, UploadedFileType, UploadResponse, ImageUploadResponse } from "../../drag-and-drop/uploader";

type OptionType = { optionText: string; correct: boolean };
type GroupType = { groupTitle: string; options: OptionType[] };

/**
 * A component for creating and editing a matching-type quiz question.
 *
 * This component allows users to define a question title, description,
 * upload an optional image, and create multiple groups of options, where
 * each group has a title and a set of options with one correct answer within each group.
 * It utilizes various input components like `TextInput`, `TextAreaInput`, `RadioButton`,
 * `InputField`, `IconButton`, and `ImageUploader` for a comprehensive quiz creation experience
 * for matching questions.
 *
 * @param id The unique identifier for the quiz question.
 * @param order The order of the quiz question within a larger set.
 * @param required Indicates if the question must be answered.
 * @param title The title or main question text.
 * @param description Additional details or instructions for the question.
 * @param imageId The ID of the uploaded image associated with the question.
 * @param imageThumbnailUrl The URL of the thumbnail for the associated image.
 * @param groups An array of group objects, where each group has a `groupTitle` and an array of `options`.
 * Each option in turn has `optionText` and a boolean `correct` indicating the matching answer within that group.
 * @param locale The current locale for internationalization, used to fetch dictionary translations.
 * @param onChange A callback function triggered whenever the quiz question data changes.
 * It receives the updated `QuizTypeTwoElement` object.
 *
 * @example
 * <QuizType2
 * id="456"
 * order={2}
 * required={true}
 * title="Match the capitals with their countries."
 * description="Drag and drop the capitals to their corresponding countries."
 * groups={[
 * {
 * groupTitle: "Country",
 * options: [
 * { optionText: "France", correct: true },
 * { optionText: "Germany", correct: false },
 * ],
 * },
 * {
 * groupTitle: "Capital",
 * options: [
 * { optionText: "Paris", correct: true },
 * { optionText: "Berlin", correct: false },
 * ],
 * },
 * ]}
 * locale="en"
 * onChange={(updatedData) => console.log(updatedData)}
 * />
 */

const QuizTypeTwo: FC<QuizTypeTwoElement> = ({
  id,
  order,
  required,
  title,
  description,
  imageId,
  imageThumbnailUrl,
  groups,
  locale,
  onChange,
}) => {
  const dictionary = getDictionary(locale);

  // State
  const [quizTitle, setQuizTitle] = useState<string>("");
  const [quizDescription, setQuizDescription] = useState<string>("");
  const [groupStates, setGroupStates] = useState<GroupType[]>([]);
  const [files, setFiles] = useState<UploadedFileType[]>([]);

  // Sync state with props (edit/create mode)
  useEffect(() => {
    setQuizTitle(title || "");
    setQuizDescription(description || "");
    setGroupStates(
      groups && groups.length > 0
        ? groups.map((grp) => ({
            groupTitle: grp.groupTitle,
            options:
              grp.options && grp.options.length > 0
                ? grp.options.map((opt) => ({
                    optionText: opt.optionText,
                    correct: !!opt.correct,
                  }))
                : [{ optionText: "", correct: false }],
          }))
        : [
            { groupTitle: "", options: [{ optionText: "", correct: false }] },
            { groupTitle: "", options: [{ optionText: "", correct: false }] },
          ]
    );
    if (imageId && imageThumbnailUrl) {
      setFiles([
        {
          file: new File([], "image.jpg"),
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
  }, [title, description, groups, imageId, imageThumbnailUrl]);
  

  // Call onChange on any relevant state change
  useEffect(() => {
    onChange({
      quizType: "quizTypeTwo",
      id,
      order,
      title: quizTitle,
      description: quizDescription,
      imageId: (files[0]?.responseData as ImageUploadResponse | undefined)?.imageId,
      groups: groupStates.map((grp) => ({
        title: grp.groupTitle,
        options: grp.options,
      })),
    });
  }, [quizTitle, quizDescription, groupStates, files, id, order]);
  

// Delete file by index
const handleDelete = (fileIndex: number) => {
  setFiles((prev) => prev.filter((_, i) => i !== fileIndex));
};

// Download file by index
const handleDownload = (fileIndex: number) => {
  const fileObj = files[fileIndex];
  if (fileObj && fileObj.file) {
    const url = URL.createObjectURL(fileObj.file);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileObj.file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

// Handle file upload (simulate upload, replace with real API)
const handleFilesChange = async (newFiles: UploadedFileType[]): Promise<UploadResponse> => {
  // Simulate upload for the first file (since this is single uploader)
  const fileObj = newFiles[0];
  const response: ImageUploadResponse = {
    imageId: Math.random().toString(36).substr(2, 9),
    imageThumbnailUrl: "https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg",
  };
  fileObj.isUploading = false;
  fileObj.responseData = response;
  setFiles([fileObj]);
  return response;
};


  // Group and option handlers
  const handleGroupTitleChange = (groupIdx: number, value: string) => {
    setGroupStates((prev) =>
      prev.map((grp, i) =>
        i === groupIdx ? { ...grp, groupTitle: value } : grp
      )
    );
  };

  // Change option text in group
  const handleOptionInputChange = (
    groupIdx: number,
    optionIdx: number,
    value: string
  ) => {
    setGroupStates((prev) =>
      prev.map((grp, i) =>
        i === groupIdx
          ? {
              ...grp,
              options: grp.options.map((opt, j) =>
                j === optionIdx ? { ...opt, optionText: value } : opt
              ),
            }
          : grp
      )
    );
  };

  // Change correct answer in group
  const handleCorrectAnswerChange = (groupIdx: number, optionIdx: number) => {
    setGroupStates((prev) =>
      prev.map((grp, i) =>
        i === groupIdx
          ? {
              ...grp,
              options: grp.options.map((opt, j) => ({
                ...opt,
                correct: j === optionIdx,
              })),
            }
          : grp
      )
    );
  };

  // Add choice to group
  const handleAddChoice = (groupIdx: number) => {
    setGroupStates((prev) =>
      prev.map((grp, i) =>
        i === groupIdx
          ? {
              ...grp,
              options: [...grp.options, { optionText: "", correct: false }],
            }
          : grp
      )
    );
  };

  // Delete choice from group
  const handleDeleteChoice = (groupIdx: number, optionIdx: number) => {
    setGroupStates((prev) =>
      prev.map((grp, i) => {
        if (i !== groupIdx) return grp;
        const newOptions = grp.options.filter((_, j) => j !== optionIdx);
        // If deleted option was correct, make first one correct if any left
        if (grp.options[optionIdx].correct && newOptions.length > 0) {
          return {
            ...grp,
            options: newOptions.map((opt, idx) => ({
              ...opt,
              correct: idx === 0,
            })),
          };
        }
        return { ...grp, options: newOptions };
      })
    );
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <p className="text-md text-base-white leading-[150%]">
        {dictionary.components.quiz.quizTypeTwo.headingText}
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


        {/* Groups Section */}
        <div className="flex flex-col md:flex-row w-full">
          {groupStates.map((group, groupIdx) => (
            <React.Fragment key={groupIdx}>
              <div key={groupIdx} className="flex flex-col gap-[18px] w-full">
                <InputField
                  className="w-full"
                  inputText={dictionary.components.quiz.quizTypeTwo.groupTitleText}
                  value={group.groupTitle}
                  setValue={(value) => handleGroupTitleChange(groupIdx, value)}
                />
                <div className="flex flex-col gap-3">
                  {group.options.map((option, optionIdx) => (
                    <div key={optionIdx} className="flex gap-2 items-center">
                      <div className="w-fit">
                        <RadioButton
                          name={`group-${groupIdx}`}
                          value={`option-${optionIdx}`}
                          checked={option.correct}
                          onChange={() =>
                            handleCorrectAnswerChange(groupIdx, optionIdx)
                          }
                        />
                      </div>
                      <InputField
                        className="w-full"
                        inputText={dictionary.components.quiz.quizTypeTwo.radioButtonText}
                        value={option.optionText}
                        setValue={(value) =>
                          handleOptionInputChange(groupIdx, optionIdx, value)
                        }
                      />
                      <IconButton
                        styles="text"
                        icon={<IconTrashAlt />}
                        size="medium"
                        onClick={() =>
                          handleDeleteChoice(groupIdx, optionIdx)
                        }
                        disabled={group.options.length <= 1}
                      />
                    </div>
                  ))}
                </div>
                <Button
                  variant="secondary"
                  onClick={() => handleAddChoice(groupIdx)}
                  text={dictionary.components.quiz.addChoiceText}
                />
              </div>
              {/* Divider between groups - not after last group */}
              {groupIdx !== groups.length - 1 && (
                <>
                  <div className="hidden md:flex w-[1px] bg-divider mx-4" />
                  <div className="md:hidden flex h-[1px] bg-divider my-4" />
                </>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizTypeTwo;
