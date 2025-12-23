'use client';

import { Badge } from '../../badge';
import Banner from '../../banner';
import { Button } from '../../button';
import { IconCheck } from '../../icons/icon-check';
import { IconClose } from '../../icons/icon-close';
import { RadioButton } from '../../radio-button';
import React, { FC, useEffect, useState } from 'react';
import {
    QuizTypeTwoElement,
} from '../../course-builder-lesson-component/types';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { IconError, IconSuccess } from '../../icons';
import { useImageComponent } from '../../../contexts/image-component-context';

export interface GroupOption {
    optionText: string;
    correct: boolean;
    selected: boolean;
}

export interface QuizGroup {
    groupTitle: string;
    options: GroupOption[];
}

/**
 * A preview component for a matching-type quiz question, displaying multiple groups
 * of options and allowing users to select one option per group. It provides feedback
 * on the user's selections and the correct matches.
 *
 * This component takes quiz data with multiple groups and their respective options
 * as props. It manages the user's selections within each group, checks if all
 * selections are correct, and displays appropriate feedback or the solution.
 *
 * @param type The specific type or variant of the quiz preview (can be undefined or a specific string).
 * @param quizType The type of the quiz question (e.g., "quizTypeTwo").
 * @param id The unique identifier of the quiz question.
 * @param order The order of the quiz question in a sequence.
 * @param title The main text of the quiz question.
 * @param description Additional descriptive text for the question.
 * @param imageId The ID of an associated image.
 * @param imageThumbnailUrl The URL of the thumbnail for the associated image.
 * @param groups An array of `QuizGroup` objects, where each group has a `groupTitle`
 * and an array of `GroupOption` objects. Each `GroupOption` contains the option text,
 * whether it's the correct match within its group, and whether it's currently selected.
 * @param onChange A callback function triggered when the user selects an option in any group.
 * It receives an updated `QuizTypeTwoPreviewElement` object reflecting the user's choices.
 * @param locale The current locale for internationalization, used to fetch dictionary translations.
 *
 * @example
 * <QuizTypeTwoPreview
 * id="preview-2"
 * title="Match the following terms with their definitions."
 * description="Select the correct definition for each term."
 * groups={[
 * {
 * groupTitle: "Term A",
 * options: [
 * { optionText: "Definition 1 for A", correct: false, selected: false },
 * { optionText: "Correct Definition for A", correct: true, selected: false },
 * ],
 * },
 * {
 * groupTitle: "Term B",
 * options: [
 * { optionText: "Correct Definition for B", correct: true, selected: false },
 * { optionText: "Definition 2 for B", correct: false, selected: false },
 * ],
 * },
 * ]}
 * onChange={(updatedData) => console.log("Selections:", updatedData)}
 * locale="en"
 * />
 */

interface QuizTypeTwoStudentViewProps extends isLocalAware {
    elementInstance: QuizTypeTwoElement;
}

const QuizTypeTwoStudentView: FC<QuizTypeTwoStudentViewProps> = ({
    elementInstance,
    locale,
}) => {
    const dictionary = getDictionary(locale);
    const ImageComponent = useImageComponent();

    // State to manage the quiz groups and their options
    const [groups, setGroups] = useState<QuizGroup[]>([]);
    const [checked, setChecked] = useState<boolean>(false);
    const [isCorrect, setIsCorrect] = useState<boolean>(false);
    const [showingSolution, setShowingSolution] = useState<boolean>(false);

    useEffect(() => {
        const mappedGroups = elementInstance.groups.map((group) => ({
            groupTitle: group.title,
            options: group.options.map((opt) => ({
                optionText: opt.name,
                correct: opt.correct ?? opt.id === group.correctOptionId,
                selected: false, // Initialize as not selected
            })),
        }));
        setGroups(mappedGroups);
    }, [elementInstance]);

    // Handlers
    const handleSelect = (groupIdx: number, optionIdx: number) => {
        const newGroups = groups.map((group, gi) => ({
            ...group,
            options: group.options.map((opt, oi) => ({
                ...opt,
                selected: gi === groupIdx ? oi === optionIdx : opt.selected,
            })),
        }));        setGroups(newGroups);

        setChecked(false);
        setIsCorrect(false);
        setShowingSolution(false);
    };

    // function to handle check answer
    const handleCheckAnswer = () => {
        const allCorrect = groups.every((group) => {
            return group.options.every((opt) => {
                if (!opt.correct && !opt.selected) return true;
                return opt.selected && opt.correct;
            });
        });
        setIsCorrect(allCorrect);
        setChecked(true);
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
        const newGroups = groups.map((group) => ({
            ...group,
            options: group.options.map((opt) => ({ ...opt, selected: false })),
        }));
        setGroups(newGroups);
        setChecked(false);
        setIsCorrect(false);
        setShowingSolution(false);
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
                <h5 className="text-xl text-text-primary leading-[120%] font-bold">
                    {elementInstance.title}
                </h5>
                <p className="text-lg text-text-secondary leading-[150%]">
                    {elementInstance.description}
                </p>
            </div>
            {/* Image - only show if imageFile exists */}
            {hasImage && (
                <div className="relative">
                    {!thumbnailUrl || isImageError ? (
                        <div className="w-full h-[280px] bg-base-neutral-700 flex items-center justify-center rounded-medium">
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

            {/* Groups & Choices */}
            <div className="flex flex-col md:flex-row w-full">
                {groups.map((group, groupIdx) => (
                    <React.Fragment key={groupIdx}>
                        <div className="flex flex-col gap-3 w-full">
                            <p className="text-lg text-text-primary font-bold leading-[120%]">
                                {group.groupTitle}
                            </p>
                            <div className="flex flex-col gap-3 justify-start w-full">
                                {group.options.map((choice, optionIdx) => {
                                    const isSelected = showingSolution
                                        ? choice.correct
                                        : choice.selected;

                                    return (
                                        <div
                                            key={optionIdx}
                                            className="flex justify-between items-center"
                                        >
                                            <RadioButton
                                                name={`group-choice-${elementInstance.id}-${groupIdx}`}
                                                value={`choice-${optionIdx}`}
                                                checked={isSelected}
                                                onChange={() =>
                                                    handleSelect(
                                                        groupIdx,
                                                        optionIdx,
                                                    )
                                                }
                                                disabled={
                                                    checked || showingSolution
                                                }
                                                withText={true}
                                                label={choice.optionText}
                                                labelClass="text-md text-text-primary leading-[150%] cursor-pointer"
                                            />
                                            {!showingSolution &&
                                                checked &&
                                                choice.selected &&
                                                (choice.correct ? (
                                                    <Badge
                                                        variant="successprimary"
                                                        hasIconLeft
                                                        iconLeft={<IconCheck />}
                                                        className="px-[2px] rounded-medium gap-0"
                                                    />
                                                ) : (
                                                    <Badge
                                                        variant="errorprimary"
                                                        hasIconLeft
                                                        iconLeft={<IconClose />}
                                                        className="px-[2px] rounded-medium gap-0"
                                                    />
                                                ))}
                                            {showingSolution &&
                                                choice.correct && (
                                                    <Badge
                                                        variant="successprimary"
                                                        hasIconLeft
                                                        iconLeft={<IconCheck />}
                                                        className="px-[2px] rounded-medium gap-0"
                                                    />
                                                )}
                                        </div>
                                    );
                                })}
                            </div>
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
                            variant="secondary"
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
                            variant="secondary"
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
                        disabled={groups.some((group) => group.options.every((opt) => !opt.selected))}
                        text={dictionary.components.quiz.checkAnswerText}
                    />
                )}
                {/* Clear (only if checked and correct and not showing solution) */}
                {isCorrect && checked && !showingSolution && (
                    <Button
                        onClick={handleTryAgain}
                        variant="secondary"
                        className="w-[50%]"
                        text={dictionary.components.quiz.clearText}
                    />
                )}
            </div>
        </div>
    );
};

export default QuizTypeTwoStudentView;
