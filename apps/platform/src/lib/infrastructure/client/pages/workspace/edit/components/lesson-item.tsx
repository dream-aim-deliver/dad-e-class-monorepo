import {
    Button,
    CheckBox,
    ContentControlButtons,
    IconEdit,
    IconLesson,
    InputField,
} from '@maany_shr/e-class-ui-kit';
import { CourseLesson } from '../types';
import { getDictionary, TLocale } from '@maany_shr/e-class-translations';

interface LessonItemProps {
    lesson: CourseLesson;
    onMoveUp: () => void;
    onMoveDown: () => void;
    onDelete: () => void;
    onDuplicate?: () => void;
    isFirst: boolean;
    isLast: boolean;
    onTitleChange: (newTitle: string) => void;
    onExtraTrainingChange: (isExtraTraining: boolean) => void;
    locale: TLocale;
}

export function LessonItem({
    lesson,
    onMoveUp,
    onMoveDown,
    onDelete,
    onDuplicate,
    isFirst,
    isLast,
    onTitleChange,
    onExtraTrainingChange,
    locale,
}: LessonItemProps) {
    const dictionary = getDictionary(locale);
    return (
        <div className="flex flex-col gap-4 bg-card-fill border border-base-neutral-700 rounded-lg p-4">
            <div className="flex gap-4 items-center w-full">
                <IconLesson />
                <InputField
                    value={lesson.title || ''}
                    inputText={dictionary.components.lessonItem.lessonTitleText}
                    setValue={(value) => {
                        onTitleChange(value);
                    }}
                    className="flex-1 font-bold"
                />
                <ContentControlButtons
                    onMoveUp={onMoveUp}
                    onMoveDown={onMoveDown}
                    onDelete={onDelete}
                    onDuplicate={lesson.id !== undefined ? onDuplicate : undefined}
                    isFirst={isFirst}
                    isLast={isLast}
                />
            </div>
            <CheckBox
                name=""
                label={dictionary.components.lessonItem.extraTrainingText}
                value=""
                checked={lesson.isExtraTraining}
                onChange={() => onExtraTrainingChange(!lesson.isExtraTraining)}
                withText
                className="w-fit"
            />
            <Button
                variant="secondary"
                text={lesson.id ? dictionary.components.lessonItem.editText : dictionary.components.lessonItem.saveToEditText}
                disabled={lesson.id === undefined}
                iconLeft={<IconEdit />}
                hasIconLeft
                onClick={() =>
                    window.open(`/edit/lesson/${lesson.id}`, '_blank')
                }
            />
        </div>
    );
}
