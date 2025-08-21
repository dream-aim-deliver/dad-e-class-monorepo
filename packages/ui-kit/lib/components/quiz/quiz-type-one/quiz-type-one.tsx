import { FC } from 'react';
import { Button } from '../../button';
import { InputField } from '../../input-field';
import { RadioButton } from '../../radio-button';
import { IconButton } from '../../icon-button';
import { IconTrashAlt } from '../../icons/icon-trash-alt';
import { getDictionary, TLocale } from '@maany_shr/e-class-translations';
import { TextAreaInput } from '../../text-areaInput';
import { TextInput } from '../../text-input';
import {
    QuizTypeOneElement,
} from '../../course-builder-lesson-component/types';
import Banner from '../../banner';
import { Uploader } from '../../drag-and-drop-uploader/uploader';
import { fileMetadata } from '@maany_shr/e-class-models';
import { CourseElementType } from '../../course-builder/types';
import { ElementValidator } from '../../lesson/types';

// Quiz Type One Validation
export const getValidationError: ElementValidator = (props) => {
    const { elementInstance, dictionary } = props;

    if (elementInstance.type !== CourseElementType.QuizTypeOne)
        return dictionary.components.quiz.quizTypeOne.validationErrors.wrongElementType;

    const quiz = elementInstance as QuizTypeOneElement;

    // Title non empty
    if (!quiz.title || quiz.title.trim() === '') {
        return dictionary.components.quiz.quizTypeOne.validationErrors.titleRequired;
    }

    // Description non empty
    if (!quiz.description || quiz.description.trim() === '') {
        return dictionary.components.quiz.quizTypeOne.validationErrors.descriptionRequired;
    }

    // File image attached
    if (!quiz.imageFile) {
        return dictionary.components.quiz.quizTypeOne.validationErrors.imageRequired;
    }

    // At least one option present
    if (!quiz.options || quiz.options.length === 0) {
        return dictionary.components.quiz.quizTypeOne.validationErrors.atLeastOneOption;
    }

    // All options have non empty titles
    for (const option of quiz.options) {
        if (!option.name || option.name.trim() === '') {
            return dictionary.components.quiz.quizTypeOne.validationErrors.optionNamesRequired;
        }
    }

    // One option chosen as correct
    if (!quiz.options.some(option => option.correct)) {
        return dictionary.components.quiz.quizTypeOne.validationErrors.correctOptionRequired;
    }

    return undefined;
};

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

interface QuizTypeOneProps {
    element: QuizTypeOneElement;
    locale: TLocale;
    onChange: (updated: Partial<QuizTypeOneElement>) => void;
    onFileChange: (
        file: fileMetadata.TFileUploadRequest,
        abortSignal?: AbortSignal,
    ) => Promise<fileMetadata.TFileMetadata>;
    onFileDelete: (fileId: string, index: number) => void;
    onFileDownload: (id: string) => void;
    onUploadComplete: (file: fileMetadata.TFileMetadata, index: number) => void;
    uploadError: string | null;
}

const QuizTypeOne: FC<QuizTypeOneProps> = ({
    element,
    locale,
    onChange,
    onFileDownload,
    onFileDelete,
    onFileChange,
    onUploadComplete,
    uploadError,
}) => {
    const dictionary = getDictionary(locale);

    // Triggers parent update with partial updates
    const handleChange = (updated: Partial<QuizTypeOneElement>) => {
        onChange({
            type: CourseElementType.QuizTypeOne,
            id: element.id,
            title: updated.title ?? element.title,
            description: updated.description ?? element.description,
            imageFile: updated.imageFile ?? element.imageFile,
            options: updated.options ?? element.options,
        });
    };

    const handleTitleChange = (value: string) => handleChange({ title: value });
    const handleDescriptionChange = (value: string) =>
        handleChange({ description: value });

    const handleChoiceTextChange = (index: number, text: string) => {
        const updatedOptions = element.options.map((opt, i) =>
            i === index ? { ...opt, name: text } : opt,
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

    const handleAddChoice = () => {
        const newOption = { id: 0, name: '' };
        handleChange({ options: [...element.options, newOption] });
    };

    const handleDeleteChoice = (index: number) => {
        const newOptions = element.options.filter((_, i) => i !== index);
        // Reassign correct answer if needed
        if (element.options[index].correct && newOptions.length > 0) {
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
                        value: element.title,
                        setValue: handleTitleChange,
                        inputText: dictionary.components.quiz.enterTitleText,
                    }}
                    label={dictionary.components.quiz.quizTitleText}
                />
                <TextAreaInput
                    label={dictionary.components.quiz.descriptionText}
                    placeholder={
                        dictionary.components.quiz.enterDescriptionText
                    }
                    value={element.description}
                    setValue={handleDescriptionChange}
                />
            </div>
            <div className="flex flex-col gap-[18px]">
                {/* Image Uploader */}
                <Uploader
                    type="single"
                    variant="generic"
                    file={element.imageFile}
                    onFilesChange={(file, abortSignal) =>
                        onFileChange(file, abortSignal)
                    }
                    onDelete={(id) => onFileDelete(id, 0)}
                    onDownload={(id) => onFileDownload(id)}
                    onUploadComplete={(file) => onUploadComplete(file, 0)}
                    locale={locale}
                    className="w-full"
                    maxSize={5}
                    isDeletionAllowed={true}
                />
                {/* error */}
                {uploadError && (
                    <Banner
                        style="error"
                        title={uploadError}
                        className="w-full"
                    />
                )}
                {/* Choices Section */}
                <div className="flex flex-col gap-3">
                    {element.options.map((choice, index) => (
                        <div key={index} className="flex gap-2 items-center">
                            <div className="w-fit">
                                <RadioButton
                                    name="single-choice"
                                    value={`choice-${index}`}
                                    checked={choice.correct}
                                    onChange={() =>
                                        handleCorrectAnswerChange(index)
                                    }
                                />
                            </div>
                            <InputField
                                className="w-full"
                                inputText={
                                    dictionary.components.quiz.quizTypeOne
                                        .radioButtonText
                                }
                                value={choice.name}
                                setValue={(val) =>
                                    handleChoiceTextChange(index, val)
                                }
                            />
                            <IconButton
                                data-testid={`delete-choice-${index}`}
                                styles="text"
                                icon={<IconTrashAlt />}
                                size="medium"
                                onClick={() => handleDeleteChoice(index)}
                                disabled={element.options.length <= 1}
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
