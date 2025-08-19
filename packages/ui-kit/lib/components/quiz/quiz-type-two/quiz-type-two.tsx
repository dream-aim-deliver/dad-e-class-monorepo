import React, { FC } from "react";
import { Button } from "../../button";
import { InputField } from "../../input-field";
import { RadioButton } from "../../radio-button";
import { IconButton } from "../../icon-button";
import { IconTrashAlt } from "../../icons/icon-trash-alt";
import { getDictionary, TLocale } from "@maany_shr/e-class-translations";
import { TextAreaInput } from "../../text-areaInput";
import { TextInput } from "../../text-input";
import { TempQuizTypeTwoElement } from "../../course-builder-lesson-component/types";
import Banner from "../../banner";
import { Uploader } from "../../drag-and-drop-uploader/uploader";
import { fileMetadata } from "@maany_shr/e-class-models";
import { CourseElementType } from "../../course-builder/types";

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

interface QuizTypeTwoProps {
    element: TempQuizTypeTwoElement;
    locale: TLocale;
    onChange: (updated: Partial<TempQuizTypeTwoElement>) => void;
    onFileChange: (
        file: fileMetadata.TFileUploadRequest,
        abortSignal?: AbortSignal,
    ) => Promise<fileMetadata.TFileMetadata>;
    onFileDelete: (fileId: string, index: number) => void;
    onFileDownload: (id: string) => void;
    onUploadComplete: (file: fileMetadata.TFileMetadata, index: number) => void;
    uploadError: string | null;
}

const QuizTypeTwo: FC<QuizTypeTwoProps> = ({
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

  // Call parent onChange with updated fields
  const handleChange = (updated: Partial<TempQuizTypeTwoElement>) => {
    onChange({
      type: CourseElementType.QuizTypeTwo,
      id: element.id,
      title: updated.title ?? element.title,
      description: updated.description ?? element.description,
      imageFile: updated.imageFile ?? element.imageFile,
      groups: updated.groups ?? element.groups,
    });
  };

  const handleTitleChange = (value: string) => handleChange({ title: value });
  const handleDescriptionChange = (value: string) => handleChange({ description: value });

  const handleGroupTitleChange = (groupIdx: number, value: string) => {
    const updatedGroups = element.groups.map((grp, i) =>
      i === groupIdx ? { ...grp, title: value } : grp
    );
    handleChange({ groups: updatedGroups });
  };

  const handleOptionTextChange = (groupIdx: number, optionIdx: number, value: string) => {
    const updatedGroups = element.groups.map((grp, i) => {
      if (i !== groupIdx) return grp;
      const updatedOptions = grp.options.map((opt, j) =>
        j === optionIdx ? { ...opt, name: value } : opt
      );
      return { ...grp, options: updatedOptions };
    });
    handleChange({ groups: updatedGroups });
  };

  const handleCorrectAnswerChange = (groupIdx: number, optionIdx: number) => {
    const updatedGroups = element.groups.map((grp, i) => {
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
    const updatedGroups = element.groups.map((grp, i) => {
      if (i !== groupIdx) return grp;
      return {
        ...grp,
        options: [...grp.options, { id: 0, name: '', correct: false }],
      };
    });
    handleChange({ groups: updatedGroups });
  };

  const handleDeleteChoice = (groupIdx: number, optionIdx: number) => {
    const updatedGroups = element.groups.map((grp, i) => {
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
      <div className="flex flex-col gap-[18px]">
        {/* Image Uploader */}
        <Uploader
          type="single"
          variant="image"
          file={element.imageFile}
          onFilesChange={(file, abortSignal) => onFileChange(file, abortSignal)}
          onDelete={(id) => onFileDelete(id, 0)}
          onDownload={(id) => onFileDownload(id)}
          onUploadComplete={(file) => onUploadComplete(file, 0)}
          locale={locale}
          className="w-full"
          maxSize={5}
        />
        {/* error */}
        {uploadError && (
          <Banner
            style="error"
            title={uploadError}
            className="w-full"
          />
        )}
        {/* Groups Section */}
        <div className="flex flex-col md:flex-row w-full">
          {element.groups.map((group, groupIdx) => (
            <React.Fragment key={groupIdx}>
              <div key={groupIdx} className="flex flex-col gap-[18px] w-full">
                <InputField
                  className="w-full"
                  inputText={dictionary.components.quiz.quizTypeTwo.groupTitleText}
                  value={group.title}
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
                        value={option.name}
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
              {groupIdx !== element.groups.length - 1 && (
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
