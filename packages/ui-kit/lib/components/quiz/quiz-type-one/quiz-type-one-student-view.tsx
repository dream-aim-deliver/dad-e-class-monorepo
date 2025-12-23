'use client';

import { Badge } from "../../badge";
import Banner from "../../banner";
import { Button } from "../../button";
import { IconCheck } from "../../icons/icon-check";
import { IconClose } from "../../icons/icon-close";
import { RadioButton } from "../../radio-button";
import { FC, useEffect, useState } from "react";
import { QuizTypeOneElement } from "../../course-builder-lesson-component/types";
import { getDictionary, isLocalAware } from "@maany_shr/e-class-translations";
import { IconError, IconSuccess } from "../../icons";
import { useImageComponent } from "../../../contexts/image-component-context";

export interface QuizOption {
  id: string;
  optionText: string;
  correct: boolean;
  selected: boolean;
}

/**
 * A preview component for a single-choice quiz question, displaying the question,
 * its options, and providing feedback on the user's selection.
 *
 * This component takes quiz data as props and renders it for a user to interact with.
 * It manages the user's selection, checks if the answer is correct, and displays
 * appropriate feedback or the solution.
 *
 * @param quizType The type of the quiz question (e.g., "quizTypeOne").
 * @param type The specific type or variant of the quiz preview (can be undefined or a specific string).
 * @param id The unique identifier of the quiz question.
 * @param order The order of the quiz question in a sequence.
 * @param title The main text of the quiz question.
 * @param description Additional descriptive text for the question.
 * @param imageId The ID of an associated image.
 * @param imageThumbnailUrl The URL of the thumbnail for the associated image.
 * @param options An array of `QuizOption` objects, each containing the option text,
 * whether it's the correct answer, and whether it's currently selected by the user.
 * @param onChange A callback function triggered when the user selects an option.
 * It receives an updated `QuizTypeOnePreviewElement` object reflecting the user's choice.
 * @param locale The current locale for internationalization, used to fetch dictionary translations.
 *
 * @example
 * <QuizTypeOneStudentView
 * id="preview-1"
 * title="Which planet is known as the Red Planet?"
 * description="Select the correct option."
 * options={[
 * { optionText: "Mars", correct: true, selected: false },
 * { optionText: "Venus", correct: false, selected: false },
 * { optionText: "Jupiter", correct: false, selected: false },
 * ]}
 * onChange={(updatedData) => console.log("Option selected:", updatedData)}
 * locale="en"
 * />
 */

interface QuizTypeOneStudentViewProps extends isLocalAware {
  elementInstance: QuizTypeOneElement;
}

const QuizTypeOneStudentView: FC<QuizTypeOneStudentViewProps> = ({
  elementInstance,
  locale,
}) => {
  const dictionary = getDictionary(locale);
  const ImageComponent = useImageComponent();

  // State
  const [options, setOptions] = useState<QuizOption[]>([]);
  const [correctIndex, setCorrectIndex] = useState<number | null>(null);
  const [checked, setChecked] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [showingSolution, setShowingSolution] = useState<boolean>(false);
  const [userSelectedIndex, setUserSelectedIndex] = useState<number | null>(null);

  // Sync state with props on mount or prop change
  useEffect(() => {
    setOptions(elementInstance.options.map(opt => ({ 
      id: opt.id,
      correct: opt.correct ?? opt.id === elementInstance.correctOptionId,
      optionText: opt.name,
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
    // Do NOT update checked or isCorrect here!
  };

  // function to handle hide solution
  const handleHideSolution = () => {
    setShowingSolution(false);
    // Do NOT update checked or isCorrect here!
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

  const [isImageError, setIsImageError] = useState(false);

  const handleImageError = () => {
    setIsImageError(true);
  };

  const thumbnailUrl = elementInstance.imageFile?.thumbnailUrl;
  const hasImage = elementInstance.imageFile !== null && elementInstance.imageFile !== undefined;

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Title & Description */}
      <div className="flex flex-col gap-1">
        <h5 className="text-xl text-text-primary leading-[120%] font-bold">{elementInstance.title}</h5>
        <p className="text-lg text-text-secondary leading-[150%]">{elementInstance.description}</p>
      </div>

      {/* Image - only show if imageFile exists */}
      {hasImage && (
        <div className="relative">
          {!thumbnailUrl || isImageError ? (
            <div className="w-full h-[147px] bg-base-neutral-700 flex items-center justify-center rounded-medium">
              <span className="text-text-secondary text-md">
                {dictionary.components.coachBanner.placeHolderText}
              </span>
            </div>
          ) : (
            <ImageComponent
              loading="lazy"
              src={thumbnailUrl}
              alt={elementInstance.title}
              className="rounded w-full max-h-[30rem] object-cover"
              onError={handleImageError}
            />
          )}
        </div>
      )}

      {/* Choices */}
      <div className="flex flex-col gap-3 justify-start">
        {options.map((choice, index) => {
          // Show as selected if:
          // - Not showing solution: user's selection
          // - Showing solution: correct option
          const isSelected = showingSolution
            ? index === correctIndex
            : choice.selected;

          return (
            <div key={index} className="flex justify-between items-center">
              <RadioButton
                name={`single-choice-${elementInstance.id}`}
                value={`choice-${index}`}
                checked={isSelected}
                onChange={() => handleSelect(index)}
                disabled={checked || showingSolution}
                label={choice.optionText}
                withText={true}
                labelClass="text-md text-text-primary leading-[150%] cursor-pointer"
              />
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
                  className="px-[2px] rounded-medium gap-0"
                  hasIconLeft
                  iconLeft={<IconCheck />}
                />
              )}
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

export default QuizTypeOneStudentView;
