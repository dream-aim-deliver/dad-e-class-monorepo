'use client';

import { Badge } from "../../badge";
import Banner from "../../banner";
import { Button } from "../../button";
import { IconCheck } from "../../icons/icon-check";
import { IconClose } from "../../icons/icon-close";
import { RadioButton } from "../../radio-button";
import { FC, useEffect, useState } from "react";
import { QuizTypeThreeElement } from "../../course-builder-lesson-component/types";
import { getDictionary, isLocalAware } from "@maany_shr/e-class-translations";
import { IconError, IconSuccess } from "../../icons";
import { useImageComponent } from "../../../contexts/image-component-context";

export interface QuizTypeThreeStudentViewOption {
  imageId: string;
  imageThumbnailUrl: string;
  description: string;
  correct: boolean;
  selected: boolean;
}

/**
 * A student view component for a single-choice quiz question, allowing users to select one option from a list of choices.
 *
 * This component displays a set of options, each with an optional image and description. Users can select one option,
 * check if their selection is correct, view the correct solution, and retry the quiz if needed.
 *
 * @param quizType The type of the quiz question (e.g., "quizTypeThree").
 * @param type The specific type or variant of the quiz (can be undefined or a specific string).
 * @param id The unique identifier of the quiz question.
 * @param order The order of the quiz question in a sequence.
 * @param required Indicates if the question must be answered.
 * @param title The main text of the quiz question.
 * @param description Additional descriptive text for the question.
 * @param options An array of `QuizTypeThreeStudentViewOption` objects, each containing the option's image, description,
 * whether it's the correct answer, and whether it's currently selected by the user.
 * @param onChange A callback function triggered when the user's selection changes. It receives an updated `QuizTypeThreeStudentViewElement` object reflecting the user's choice.
 * @param locale The current locale for internationalization, used to fetch dictionary translations.
 *
 * @example
 * <QuizTypeThreeStudentView
 * quizType="quizTypeThree"
 * id="quiz-1"
 * order={1}
 * required={true}
 * title="Select the correct image"
 * description="Choose the image that matches the description."
 * options={[
 *   { imageId: "1", imageThumbnailUrl: "image1.jpg", description: "Option 1", correct: false, selected: false },
 *   { imageId: "2", imageThumbnailUrl: "image2.jpg", description: "Option 2", correct: true, selected: false },
 * ]}
 * onChange={(updatedData) => console.log("Updated quiz data:", updatedData)}
 * locale="en"
 * />
 */

interface QuizTypeThreeStudentViewProps extends isLocalAware {
  elementInstance: QuizTypeThreeElement;
}

const QuizTypeThreeStudentView: FC<QuizTypeThreeStudentViewProps> = ({
  elementInstance,
  locale,
}) => {
  const dictionary = getDictionary(locale);
  const ImageComponent = useImageComponent();

  // State
  const [options, setOptions] = useState<QuizTypeThreeStudentViewOption[]>([]);
  const [correctIndex, setCorrectIndex] = useState<number | null>(null);
  const [checked, setChecked] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [showingSolution, setShowingSolution] = useState<boolean>(false);
  const [userSelectedIndex, setUserSelectedIndex] = useState<number | null>(null);

  // Sync state with props on mount or prop change
  useEffect(() => {
    setOptions(elementInstance.options.map(opt => ({ 
      imageId: opt.imageFile?.id ?? '',
      imageThumbnailUrl: opt.imageFile?.thumbnailUrl ?? '',
      description: opt.description,
      correct: opt.correct ?? opt.id === elementInstance.correctOptionId,
      selected: false,
    })));
    setCorrectIndex(elementInstance.options.findIndex(opt => opt.id === elementInstance.correctOptionId));
  }, [elementInstance]);

  // function to handle select
  const handleSelect = (idx: number) => {
    const newOptions = options.map((opt, i) => ({
      ...opt,
      selected: i === idx,
    }));
    setOptions(newOptions);
    setUserSelectedIndex(idx);
    setChecked(false);
    setIsCorrect(false);
    setShowingSolution(false);
  };

  // function to handle check answer
  const handleCheckAnswer = () => {
    if (userSelectedIndex === null) return;
    const correct = options[userSelectedIndex]?.correct;
    setChecked(true);
    setIsCorrect(!!correct);
    setShowingSolution(false);
  };

  // function to handle show solution
  const handleShowSolution = () => {
    setShowingSolution(true);
  };

  // function to handle hide solution
  const handleHideSolution = () => {
    setShowingSolution(false);
  };

  // function to handle try again
  const handleTryAgain = () => {
    const newOptions = options.map(opt => ({ ...opt, selected: false }));
    setOptions(newOptions);
    setChecked(false);
    setIsCorrect(false);
    setShowingSolution(false);
    setUserSelectedIndex(null);
  };

  const [imageErrors, setImageErrors] = useState<Map<number, boolean>>(() => new Map());

  // Handler for image error per option
  const handleImageError = (index: number) => {
    setImageErrors((prev) => new Map(prev).set(index, true));
  };
  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Title & Description */}
      <div className="flex flex-col gap-1">
        <h5 className="text-xl text-text-primary leading-[120%] font-bold">{elementInstance.title}</h5>
        <p className="text-lg text-text-secondary leading-[150%]">{elementInstance.description}</p>
      </div>

      {/* Choices (with images) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {options.map((choice, index) => {
          // Show as selected if:
          // - Not showing solution: user's selection
          // - Showing solution: correct option
          const isSelected = showingSolution
            ? index === correctIndex
            : choice.selected;

          // Determine if placeholder should be shown
          const shouldShowPlaceholder =
            !choice.imageThumbnailUrl || imageErrors.get(index);

          return (
            <div key={index} className="flex flex-col gap-3">
              <div className="relative">
                {shouldShowPlaceholder ? (
                  <div className="w-full h-[153px] bg-base-neutral-700 flex items-center justify-center rounded-medium">
                    <span className="text-text-secondary text-md">
                      {dictionary.components.coachBanner.placeHolderText}
                    </span>
                  </div>
                ) : (
                  <ImageComponent
                    loading="lazy"
                    src={choice.imageThumbnailUrl}
                    alt={`Quiz Option ${index + 1}`}
                    className="rounded-medium w-full max-h-[25rem] object-cover"
                    onError={() => handleImageError(index)}
                  />
                )}
              </div>
              <div className="flex justify-between items-center">
                <div className="w-fit">
                  <RadioButton
                    name={`single-choice-${elementInstance.id}`}
                    value={`choice-${index}`}
                    checked={isSelected}
                    onChange={() => handleSelect(index)}
                    disabled={checked || showingSolution}
                    withText={true}
                    label={choice.description}
                    labelClass="text-md text-text-primary leading-[150%] cursor-pointer"
                  />
                </div>
                {/* Show badge only in these cases: */}
                {!showingSolution && checked && choice.selected && (
                  choice.correct ? (
                    <Badge
                      variant='successprimary'
                      hasIconLeft
                      iconLeft={<IconCheck />}
                      className="px-[2px] rounded-medium gap-0"
                    />
                  ) : (
                    <Badge
                      variant='errorprimary'
                      hasIconLeft
                      iconLeft={<IconClose />}
                      className="px-[2px] rounded-medium gap-0"
                    />
                  )
                )}
                {showingSolution && choice.correct && (
                  <Badge
                    variant='successprimary'
                    hasIconLeft
                    iconLeft={<IconCheck />}
                    className="px-[2px] rounded-medium gap-0"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Feedback Section */}
      {checked && !showingSolution && (
        <div>
          {isCorrect ? (
            <Banner
              style='success'
              icon={true}
              customIcon={<IconSuccess />}
              title={dictionary.components.quiz.successBannerText}
            />
          ) : (
            <Banner
              style='error'
              icon={true}
              customIcon={<IconError />}
              title={dictionary.components.quiz.errorBannerText}
            />
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 flex-wrap">
        {/* Show Solution & Try Again (only if checked and incorrect) */}
        {!isCorrect && checked && !showingSolution && (
          <div className="flex gap-2 w-full">
            <Button
              onClick={handleShowSolution}
              className="w-full"
              variant='secondary'
              text={dictionary.components.quiz.showSolutionText}
            />
            <Button
              onClick={handleTryAgain}
              className="w-full"
              text={dictionary.components.quiz.tryAgainText}
            />
          </div>
        )}
        {/* Hide Solution & Try Again (only if showing solution) */}
        {showingSolution && (
          <div className="flex gap-2 w-full">
            <Button
              onClick={handleHideSolution}
              className="w-full"
              variant='secondary'
              text={dictionary.components.quiz.hideSolutionText}
            />
            <Button
              onClick={handleTryAgain}
              className="w-full"
              text={dictionary.components.quiz.tryAgainText}
            />
          </div>
        )}
        {/* Check Answer (only if not checked and not showing solution) */}
        {!checked && !showingSolution && (
          <Button
            onClick={handleCheckAnswer}
            disabled={userSelectedIndex === null}
            text={dictionary.components.quiz.checkAnswerText}
          />
        )}
        {/* Clear (only if checked and correct and not showing solution) */}
        {isCorrect && checked && !showingSolution && (
          <Button
            onClick={handleTryAgain}
            variant='secondary'
            className="w-[50%]"
            text={dictionary.components.quiz.clearText}
          />
        )}
      </div>
    </div>
  );
};

export default QuizTypeThreeStudentView;
