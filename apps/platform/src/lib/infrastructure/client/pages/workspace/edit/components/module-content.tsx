import { getDictionary } from '@maany_shr/e-class-translations';
import { ContentType, ModuleContentProps } from '../types';
import { LessonItem } from './lesson-item';
import { MilestoneItem } from './milestone-item';

export function ModuleContent({
    content,
    onMoveContentUp,
    onMoveContentDown,
    onDeleteContent,
    onLessonTitleChange,
    onLessonExtraTrainingChange,
    onDuplicateLesson,
    locale,
    moduleIndex,
}: ModuleContentProps) {
    const isEmpty = content.length === 0;
    const dictionary = getDictionary(locale);

    return (
        <div className="flex flex-col gap-2 ml-4">
            {isEmpty && (
                <div className=" flex flex-col gap-2 bg-card-fill border border-base-neutral-700 rounded-lg p-4">
                    <span className="text-text-secondary">
                        {dictionary.components.moduleContent.addLessonsOrMilestonesText}
                    </span>
                </div>
            )}
            {content.map((item, index) => {
                if (item.type === ContentType.Milestone) {
                    return (
                        <MilestoneItem
                            key={`milestone-${moduleIndex}-${index}`}
                            milestone={item}
                            onMoveUp={() => onMoveContentUp(index)}
                            onMoveDown={() => onMoveContentDown(index)}
                            onDelete={() => onDeleteContent(index)}
                            isFirst={index === 0}
                            isLast={index === content.length - 1}
                            locale={locale}
                        />
                    );
                }
                if (item.type === ContentType.Lesson) {
                    return (
                        <LessonItem
                            key={`lesson-${moduleIndex}-${index}`}
                            lesson={item}
                            onMoveUp={() => onMoveContentUp(index)}
                            onMoveDown={() => onMoveContentDown(index)}
                            onDelete={() => onDeleteContent(index)}
                            onDuplicate={
                                item.id !== undefined && onDuplicateLesson
                                    ? () => onDuplicateLesson(item.id!)
                                    : undefined
                            }
                            isFirst={index === 0}
                            isLast={index === content.length - 1}
                            onTitleChange={(newTitle) =>
                                onLessonTitleChange(index, newTitle)
                            }
                            onExtraTrainingChange={(isExtraTraining) =>
                                onLessonExtraTrainingChange(
                                    index,
                                    isExtraTraining,
                                )
                            }
                            locale={locale}
                        />
                    );
                }
                return null;
            })}
        </div>
    );
}
