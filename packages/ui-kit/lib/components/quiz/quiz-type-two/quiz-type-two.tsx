import React, { FC } from "react";
import { Button } from "../../button";
import { InputField } from "../../input-field";
import { RadioButton } from "../../radio-button";
import { IconButton } from "../../icon-button";
import { IconTrashAlt } from "../../icons/icon-trash-alt";
import { getDictionary } from "@maany_shr/e-class-translations";
import { TextAreaInput } from "../../text-areaInput";
import { TextInput } from "../../text-input";
import { QuizTypeTwoElement } from "../../course-builder-lesson-component/types";
import Banner from "../../banner";
import { Uploader } from "../../drag-and-drop-uploader/uploader";

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
 * @param title The title or main question text.
 * @param description Additional details or instructions for the question.
 * @param imageId The ID of the uploaded image associated with the question.
 * @param imageThumbnailUrl The URL of the thumbnail for the associated image.
 * @param groups An array of group objects, where each group has a `groupTitle` and an array of `options`.
 * Each option in turn has `optionText` and a boolean `correct` indicating the matching answer within that group.
 * @param locale The current locale for internationalization, used to fetch dictionary translations.
 * @param onChange A callback function triggered whenever the quiz question data changes.
 * @param onFilesChange A callback function triggered when files are uploaded or changed.
 * @param onFileDelete A callback function triggered when a file is deleted. It receives the ID of the deleted file.
 * @param onFileDownload A callback function triggered when a file is downloaded. It receives the ID of the file to be downloaded.
 * @param onUploadComplete A callback function triggered when a file upload is completed.
 * 
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
  error,
  title,
  description,
  fileData,
  groups,
  locale,
  onChange,
  onFilesChange,
  onFileDelete,
  onFileDownload,
  onUploadComplete,
}) => {
  const dictionary = getDictionary(locale);

  // Call parent onChange with updated fields
  const handleChange = (updated: Partial<QuizTypeTwoElement>) => {
    onChange({
      quizType: "quizTypeTwo",
      id,
      order,
      title: updated.title ?? title,
      description: updated.description ?? description,
      fileData: updated.fileData ?? fileData,
      groups: updated.groups ?? groups,
    });
  };

  const handleTitleChange = (value: string) => handleChange({ title: value });
  const handleDescriptionChange = (value: string) => handleChange({ description: value });

  const handleGroupTitleChange = (groupIdx: number, value: string) => {
    const updatedGroups = groups.map((grp, i) =>
      i === groupIdx ? { ...grp, groupTitle: value } : grp
    );
    handleChange({ groups: updatedGroups });
  };

  const handleOptionTextChange = (groupIdx: number, optionIdx: number, value: string) => {
    const updatedGroups = groups.map((grp, i) => {
      if (i !== groupIdx) return grp;
      const updatedOptions = grp.options.map((opt, j) =>
        j === optionIdx ? { ...opt, optionText: value } : opt
      );
      return { ...grp, options: updatedOptions };
    });
    handleChange({ groups: updatedGroups });
  };

  const handleCorrectAnswerChange = (groupIdx: number, optionIdx: number) => {
    const updatedGroups = groups.map((grp, i) => {
      if (i !== groupIdx) return grp;
      const updatedOptions = grp.options.map((opt, j) => ({
        ...opt,
        correct: j === optionIdx,
      }));
      return { ...grp, options: updatedOptions };
    });
    handleChange({ groups: updatedGroups });
  };

  const handleAddChoice = (groupIdx: number) => {
    const updatedGroups = groups.map((grp, i) => {
      if (i !== groupIdx) return grp;
      return {
        ...grp,
        options: [...grp.options, { optionText: "", correct: false }],
      };
    });
    handleChange({ groups: updatedGroups });
  };

  const handleDeleteChoice = (groupIdx: number, optionIdx: number) => {
    const updatedGroups = groups.map((grp, i) => {
      if (i !== groupIdx) return grp;
      const remaining = grp.options.filter((_, j) => j !== optionIdx);
      // Reassign correct if needed
      if (grp.options[optionIdx].correct && remaining.length > 0) {
        remaining[0].correct = true;
      }
      return { ...grp, options: remaining };
    });
    handleChange({ groups: updatedGroups });
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
          variant="image"
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
        {/* Groups Section */}
        <div className="flex flex-col md:flex-row w-full">
          {groups.map((group, groupIdx) => (
            <React.Fragment key={groupIdx}>
              <div key={groupIdx} className="flex flex-col gap-[18px] w-full">
                <InputField
                  className="w-full"
                  inputPlaceholder={dictionary.components.quiz.quizTypeTwo.groupTitleText}
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
                        inputPlaceholder={dictionary.components.quiz.quizTypeTwo.radioButtonText}
                        value={option.optionText}
                        setValue={(val) => handleOptionTextChange(groupIdx, optionIdx, val)}
                      />
                      <IconButton
                        data-testid={`delete-choice-${groupIdx}-${optionIdx}`}
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
