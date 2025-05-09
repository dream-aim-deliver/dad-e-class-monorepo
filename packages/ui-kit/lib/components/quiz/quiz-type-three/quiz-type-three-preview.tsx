import { Badge } from "../../badge";
import Banner from "../../banner";
import { Button } from "../../button";
import { IconCheck } from "../../icons/icon-check";
import { IconClose } from "../../icons/icon-close";
import { RadioButton } from "../../radio-button";
import React, { FC, useEffect, useState } from "react";
import { QuizTypeThreePreviewElement } from "../../lesson-components/types";
import { getDictionary } from "@maany_shr/e-class-translations";

export interface QuizTypeThreePreviewOption {
  imageId: string;
  imageThumbnailUrl: string;
  description: string;
  correct: boolean;
  selected: boolean;
}

const QuizTypeThreePreview: FC<QuizTypeThreePreviewElement> = ({
  quizType,
  type,
  id,
  order,
  required,
  title,
  description,
  options: propOptions,
  onChange,
  locale,
}) => {
  const dictionary = getDictionary(locale);

  // State
  const [options, setOptions] = useState<QuizTypeThreePreviewOption[]>([]);
  const [correctIndex, setCorrectIndex] = useState<number | null>(null);
  const [checked, setChecked] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [showingSolution, setShowingSolution] = useState<boolean>(false);
  const [userSelectedIndex, setUserSelectedIndex] = useState<number | null>(null);

  // Sync state with props on mount or prop change
  useEffect(() => {
    setOptions(propOptions.map(opt => ({ ...opt })));
    const preSelectedIndex = propOptions.findIndex(opt => opt.selected);
    setCorrectIndex(propOptions.findIndex(opt => opt.correct));
    if (preSelectedIndex !== -1) {
      setChecked(true);
      setIsCorrect(propOptions[preSelectedIndex].correct);
      setUserSelectedIndex(preSelectedIndex);
    } else {
      setChecked(false);
      setIsCorrect(false);
      setUserSelectedIndex(null);
    }
    setShowingSolution(false);
  }, [propOptions, title, description, id]);

  // Helper: Send change to parent
  const sendChange = (opts: QuizTypeThreePreviewOption[]) => {
    if (onChange) {
      onChange({
        quizType,
        id,
        order,
        title,
        description,
        options: opts,
      });
    }
  };

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
    sendChange(newOptions);
  };

  // function to handle check answer
  const handleCheckAnswer = () => {
    if (userSelectedIndex === null) return;
    const correct = options[userSelectedIndex]?.correct;
    setChecked(true);
    setIsCorrect(!!correct);
    setShowingSolution(false);
    sendChange(options);
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
    sendChange(newOptions);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Title & Description */}
      <div className="flex flex-col gap-1">
        <p className="text-2xl text-text-primary leading-[120%] font-bold">{title}</p>
        <p className="text-xl text-text-secondary leading-[150%]">{description}</p>
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

          return (
            <div key={index} className="flex flex-col gap-3">
              {choice.imageThumbnailUrl && (
                <img
                  src={choice.imageThumbnailUrl}
                  alt={`Quiz Option ${index + 1}`}
                  className="rounded-medium w-full h-[147px] object-cover"
                />
              )}
              <div className="flex justify-between items-center">
                <div className="w-fit">
                  <RadioButton
                    name={`single-choice-${id}`}
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
                      className="h-[24px]"
                      hasIconLeft
                      iconLeft={<IconCheck />}
                    />
                  ) : (
                    <Badge
                      className="h-[24px]"
                      variant='errorprimary'
                      hasIconLeft
                      iconLeft={<IconClose />}
                    />
                  )
                )}
                {showingSolution && choice.correct && (
                  <Badge
                    variant='successprimary'
                    className="h-[24px] ml-2"
                    hasIconLeft
                    iconLeft={<IconCheck />}
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
              title={dictionary.components.quiz.successBannerText}
            />
          ) : (
            <Banner
              style='error'
              icon={true}
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

export default QuizTypeThreePreview;
