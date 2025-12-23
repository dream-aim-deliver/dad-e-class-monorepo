'use client';

import { Badge } from "../../badge";
import Banner from "../../banner";
import { Button } from "../../button";
import { IconCheck } from "../../icons/icon-check";
import { IconClose } from "../../icons/icon-close";
import { InputField } from "../../input-field";
import { FC, useEffect, useState, useMemo } from "react";
import { QuizTypeFourElement } from "../../course-builder-lesson-component/types";
import { getDictionary, isLocalAware } from "@maany_shr/e-class-translations";
import { IconError, IconSuccess } from "../../icons";
import { useImageComponent } from "../../../contexts/image-component-context";

/**
 * A student view component for a matching quiz question, allowing users to match images with corresponding labels.
 *
 * This component displays a set of images and labels, where users can input their answers by selecting the correct label
 * for each image. It provides feedback on the correctness of the answers, allows users to view the correct solution,
 * and retry the quiz if needed.
 *
 * @param quizType The type of the quiz question (e.g., "quizTypeFour").
 * @param id The unique identifier of the quiz question.
 * @param order The order of the quiz question in a sequence.
 * @param required Indicates if the question must be answered.
 * @param title The main text of the quiz question.
 * @param description Additional descriptive text for the question.
 * @param labels An array of label objects, each containing a letter and a description.
 * @param images An array of image objects, each containing the image URL, the correct label, and the user's input.
 * @param onChange A callback function triggered when the user's input changes. It receives an updated `QuizTypeFourStudentViewElement` object.
 * @param locale The current locale for internationalization, used to fetch dictionary translations.
 *
 * @example
 * <QuizTypeFourStudentView
 * quizType="quizTypeFour"
 * id="quiz-1"
 * order={1}
 * required={true}
 * title="Match the images with the correct labels"
 * description="Drag and drop the correct labels to match the images."
 * labels={[
 *   { letter: "A", description: "Apple" },
 *   { letter: "B", description: "Banana" },
 * ]}
 * images={[
 *   { imageThumbnailUrl: "apple.jpg", correctLetter: "A", userInput: "" },
 *   { imageThumbnailUrl: "banana.jpg", correctLetter: "B", userInput: "" },
 * ]}
 * onChange={(updatedData) => console.log("Updated quiz data:", updatedData)}
 * locale="en"
 * />
 */

interface QuizTypeFourStudentViewProps extends isLocalAware {
  elementInstance: QuizTypeFourElement;
}

const QuizTypeFourStudentView: FC<QuizTypeFourStudentViewProps> = ({
  elementInstance,
  locale,
}) => {
  const dictionary = getDictionary(locale);
  const ImageComponent = useImageComponent();

  // Deterministic shuffle function based on quiz ID for consistent randomization
  const shuffleArray = (array: number[], seed: string): number[] => {
    const result = [...array];
    let seedNum = 0;
    for (let i = 0; i < seed.length; i++) {
      seedNum += seed.charCodeAt(i);
    }

    for (let i = result.length - 1; i > 0; i--) {
      seedNum = (seedNum * 9301 + 49297) % 233280;
      const j = Math.floor((seedNum / 233280) * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  };

  // Create randomized indices for images only (deterministic based on quiz ID)
  const shuffledImageIndices = useMemo(() => {
    const imageIndices = Array.from({ length: elementInstance.images.length }, (_, i) => i);
    return shuffleArray(imageIndices, elementInstance.id + "_images");
  }, [elementInstance.id, elementInstance.images.length]);

  // State
  const [userInputs, setUserInputs] = useState<string[]>(Array(elementInstance.images.length).fill(""));
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showingSolution, setShowingSolution] = useState(false);

  // Sync state with props on mount or prop change
  useEffect(() => {
    const initialInputs = Array(elementInstance.images.length).fill("");
    setUserInputs(initialInputs);
  }, [elementInstance]);

  // Handle user input
  const handleInputChange = (idx: number, value: string) => {
    if (checked || showingSolution) return; // Prevent editing when checked or showing solution
    const v = value.replace(/[^a-zA-Z]/g, "").toUpperCase().slice(0, 1); // Only 1 uppercase letter
    const updatedInputs = [...userInputs];
    updatedInputs[idx] = v;
    setUserInputs(updatedInputs);
  };

  // Check answer
  const handleCheckAnswer = () => {
    const allCorrect =
      userInputs.length === elementInstance.images.length &&
      userInputs.every(
        (answer, idx) =>
          answer &&
          answer.toUpperCase() === elementInstance.images[idx].correctLetter.toUpperCase()
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
    const resetInputs = Array(elementInstance.images.length).fill("");
    setUserInputs(resetInputs);
    setChecked(false);
    setIsCorrect(false);
    setShowingSolution(false);
  };

  // Track image errors per image index
  const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>({});

  const handleImageError = (index: number) => {
    setImageErrors((prev) => ({ ...prev, [index]: true }));
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Title & Description */}
      <div className="flex flex-col gap-1">
        <h5 className="text-xl text-text-primary leading-[120%] font-bold">{elementInstance.title}</h5>
        <p className="text-lg text-text-secondary leading-[150%]">{elementInstance.description}</p>
      </div>

      <div className="h-[1px] bg-divider" />

      <p className="text-[16px] text-text-secondary leading-[150%]">
        {dictionary.components.quiz.quizTypeFourStudentView.descriptionText}
      </p>

      <div className="h-[1px] bg-divider" />

      <div className="flex gap-4 w-full justify-around md:flex-row flex-col">
        {/* Labels/Descriptions */}
        <div className="flex items-center justify-start basis-2/5">
          <div className="flex flex-col gap-6 justify-start">
            {elementInstance.labels.map((label, index) => (
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
          {shuffledImageIndices.map((imageIndex) => {
            const image = elementInstance.images[imageIndex];
            const userValue = userInputs[imageIndex]; // Use original imageIndex for user inputs
            const correctValue = image.correctLetter;
            const showCorrect = showingSolution;
            const inputValue = showCorrect ? correctValue : userValue;

            // Determine if placeholder should be shown
            const shouldShowPlaceholder =
              !image.imageFile?.thumbnailUrl || imageErrors[imageIndex];

            return (
              <div key={imageIndex} className="flex flex-col gap-2 items-center">
                <div className="relative w-full">
                  {shouldShowPlaceholder ? (
                    <div className="w-full h-[153px] bg-base-neutral-700 flex items-center justify-center rounded">
                      <span className="text-text-secondary text-md">
                        {dictionary.components.coachBanner.placeHolderText}
                      </span>
                    </div>
                  ) : (
                    <ImageComponent
                      src={image.imageFile?.thumbnailUrl ?? undefined}
                      alt={`Quiz Illustration ${imageIndex + 1}`}
                      className="rounded w-full max-h-[25rem] object-cover"
                      onError={() => handleImageError(imageIndex)}
                      loading="lazy"
                    />
                  )}
                </div>
                <div className="flex gap-2 items-center justify-center">
                  <div className="w-[80px]">
                    <InputField
                      inputText="e.g. A"
                      className="w-[80px] border-[1px] border-card-stroke text-text-primary"
                      value={inputValue}
                      setValue={(value) => handleInputChange(imageIndex, value)}
                      state={checked || showingSolution ? "disabled" : "placeholder"}
                    />
                  </div>
                  {/* Show badge only in these cases: */}
                  {!showingSolution && checked && (
                    correctValue.toUpperCase() === userValue.toUpperCase() ? (
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
                  {showingSolution && (
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
      </div>

      {/* Feedback Section */}
      {checked && !showingSolution && (
        <div>
          {isCorrect ? (
            <Banner
              style="success"
              icon={true}
              customIcon={<IconSuccess />}
              title={dictionary.components.quiz.successBannerText}
            />
          ) : (
            <Banner
              style="error"
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

export default QuizTypeFourStudentView;
