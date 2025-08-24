import {
    Button,
    CheckBox,
    ContentControlButtons,
    IconEdit,
    IconLesson,
    InputField,
} from '@maany_shr/e-class-ui-kit';
import { CourseLesson } from '../types';

interface LessonItemProps {
    lesson: CourseLesson;
    onMoveUp: () => void;
    onMoveDown: () => void;
    onDelete: () => void;
    isFirst: boolean;
    isLast: boolean;
    onTitleChange: (newTitle: string) => void;
    onExtraTrainingChange: (isExtraTraining: boolean) => void;
}

export function LessonItem({
    lesson,
    onMoveUp,
    onMoveDown,
    onDelete,
    isFirst,
    isLast,
    onTitleChange,
    onExtraTrainingChange,
}: LessonItemProps) {
    // TODO: Translate
    return (
        <div className="flex flex-col gap-4 bg-card-fill border border-base-neutral-700 rounded-lg p-4">
            <div className="flex gap-4 items-center w-full">
                <IconLesson />
                <InputField
                    value={lesson.title || ''}
                    inputText="Lesson title"
                    setValue={(value) => {
                        onTitleChange(value);
                    }}
                    className="flex-1 font-bold"
                />
                <ContentControlButtons
                    onMoveUp={onMoveUp}
                    onMoveDown={onMoveDown}
                    onDelete={onDelete}
                    isFirst={isFirst}
                    isLast={isLast}
                />
            </div>
            <CheckBox
                name=""
                label="Extra training"
                value=""
                checked={lesson.isExtraTraining}
                onChange={() => onExtraTrainingChange(!lesson.isExtraTraining)}
                withText
                className="w-fit"
            />
            <Button
                variant="secondary"
                text={lesson.id ? 'Edit' : 'Save to edit'}
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
