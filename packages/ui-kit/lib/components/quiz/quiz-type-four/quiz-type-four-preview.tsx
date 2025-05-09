import { Badge } from "../../badge";
import Banner from "../../banner";
import { Button } from "../../button";
import { IconCheck } from "../../icons/icon-check";
import { IconClose } from "../../icons/icon-close";
import { InputField } from "../../input-field";
import React, { FC, useEffect, useState } from "react";
import { QuizTypeFourPreviewElement } from "../../lesson-components/types";
import { getDictionary } from "@maany_shr/e-class-translations";

const QuizTypeFourPreview: FC<QuizTypeFourPreviewElement> = ({
  quizType,
  id,
  order,
  required,
  title,
  description,
  labels,
  images,
  onChange,
  locale,
}) => {
  const dictionary = getDictionary(locale);

  // State
  const [userInputs, setUserInputs] = useState<string[]>(images.map(img => img.userInput || ""));
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showingSolution, setShowingSolution] = useState(false);

  // Sync state with props on mount or prop change
  useEffect(() => {
    const initialInputs = images.map(img => img.userInput || "");
    setUserInputs(initialInputs);

    // Check if any input is filled
    const hasAnswers = initialInputs.some(input => input && input.trim() !== "");
    if (hasAnswers) {
      // Check if all answers are correct
      const allCorrect =
        initialInputs.length === images.length &&
        initialInputs.every(
          (answer, idx) =>
            answer &&
            answer.toUpperCase() === images[idx].correctLetter.toUpperCase()
        );
      setChecked(true);
      setIsCorrect(allCorrect);
    } else {
      setChecked(false);
      setIsCorrect(false);
    }
    setShowingSolution(false);
  }, [images, title, description, id]);

  // Propagate change to parent
  const sendChange = (updatedInputs: string[]) => {
    if (onChange) {
      onChange({
        quizType,
        id,
        order,
        title,
        description,
        labels,
        images: images.map((img, i) => ({
          ...img,
          userInput: updatedInputs[i],
        })),
      });
    }
  };

  // Handle user input
  const handleInputChange = (idx: number, value: string) => {
    if (checked || showingSolution) return; // Prevent editing when checked or showing solution
    const v = value.replace(/[^a-zA-Z]/g, "").toUpperCase().slice(0, 1); // Only 1 uppercase letter
    const updatedInputs = [...userInputs];
    updatedInputs[idx] = v;
    setUserInputs(updatedInputs);
    sendChange(updatedInputs);
  };

  // Check answer
  const handleCheckAnswer = () => {
    const allCorrect =
      userInputs.length === images.length &&
      userInputs.every(
        (answer, idx) =>
          answer &&
          answer.toUpperCase() === images[idx].correctLetter.toUpperCase()
      );
    setChecked(true);
    setIsCorrect(allCorrect);
    setShowingSolution(false);
  };

  // Show solution
  const handleShowSolution = () => {
    setShowingSolution(true);
  };

  // Hide solution
  const handleHideSolution = () => {
    setShowingSolution(false);
  };

  // Try again
  const handleTryAgain = () => {
    const resetInputs = Array(images.length).fill("");
    setUserInputs(resetInputs);
    setChecked(false);
    setIsCorrect(false);
    setShowingSolution(false);
    sendChange(resetInputs);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Title & Description */}
      <div className="flex flex-col gap-1">
        <p className="text-2xl text-text-primary leading-[120%] font-bold">{title}</p>
        <p className="text-xl text-text-secondary leading-[150%]">{description}</p>
      </div>

      <div className="h-[1px] bg-divider" />

      <p className="text-[16px] text-text-secondary leading-[150%]">
        {dictionary.components.quiz.quizTypeFourView.descriptionText}
      </p>

      <div className="h-[1px] bg-divider" />

      <div className="flex gap-4 w-full justify-around md:flex-row flex-col">
        {/* Labels/Descriptions */}
        <div className="flex items-center justify-start basis-2/5">
          <div className="flex flex-col gap-6 justify-start">
            {labels?.map((label, index) => (
              <div key={index} className="flex gap-4 items-center">
                <div className="flex items-center justify-center min-w-[40px] min-h-[40px] bg-divider border-[1px] border-checkbox-stroke rounded-[8px]">
                  <p className="text-[20px] text-text-primary leading-[120%] font-bold">
                    {label.letter}
                  </p>
                </div>
                <p className="text-[20px] text-text-secondary leading-[150%]">
                  {label.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="w-[1px] bg-divider md:flex hidden" />

        {/* Images and answer inputs */}
        <div className="grid grid-cols-2 gap-4 basis-3/5">
          {images.map((image, index) => {
            const userValue = userInputs[index];
            const correctValue = image.correctLetter;
            const showCorrect = showingSolution;
            const inputValue = showCorrect ? correctValue : userValue;

            return (
              <div key={index} className="flex flex-col gap-2 items-center">
                <img
                  src={image.imageThumbnailUrl}
                  alt={`Quiz Illustration ${index + 1}`}
                  className="rounded w-full h-[153px] object-cover"
                />
                <div className="flex gap-2 items-center justify-center">
                  <div className="w-[80px]">
                    <InputField
                      inputText="e.g. A"
                      className="w-[80px] border-[1px] border-card-stroke text-text-primary"
                      value={inputValue}
                      setValue={(value) => handleInputChange(index, value)}
                      state={checked || showingSolution ? "disabled" : "placeholder"}
                    />
                  </div>
                  {/* Show badge only in these cases: */}
                  {!showingSolution && checked && (
                    correctValue.toUpperCase() === userValue.toUpperCase() ? (
                      <Badge
                        variant="successprimary"
                        className="h-[24px]"
                        hasIconLeft
                        iconLeft={<IconCheck />}
                      />
                    ) : (
                      <Badge
                        variant="errorprimary"
                        className="h-[24px]"
                        hasIconLeft
                        iconLeft={<IconClose />}
                      />
                    )
                  )}
                  {showingSolution && (
                    <Badge
                      variant="successprimary"
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
      </div>

      {/* Feedback Section */}
      {checked && !showingSolution && (
        <div>
          {isCorrect ? (
            <Banner
              style="success"
              icon={true}
              title={dictionary.components.quiz.successBannerText}
            />
          ) : (
            <Banner
              style="error"
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
            disabled={userInputs.some(input => !input)}
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

export default QuizTypeFourPreview;
