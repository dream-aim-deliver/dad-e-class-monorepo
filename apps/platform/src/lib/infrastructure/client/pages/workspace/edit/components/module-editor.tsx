import {
    ContentControlButtons,
    IconModule,
    InputField,
} from '@maany_shr/e-class-ui-kit';
import { ModuleEditorProps } from '../types';
import { ModuleContent } from './module-content';
import { useTranslations } from 'next-intl';

export function ModuleEditor({
    index,
    module,
    onUpdate,
    onDelete,
    onMoveUp,
    onMoveDown,
    onMoveContentUp,
    onMoveContentDown,
    onDeleteContent,
    isExpanded,
    onExpand,
    isFirst,
    isLast,
    onLessonTitleChange,
    onLessonExtraTrainingChange,
    onDuplicateLesson,
    locale,
}: ModuleEditorProps) {
    const handleTitleChange = (value: string) => {
        onUpdate({ ...module, title: value });
    };
    const editCourseTranslations = useTranslations(
        'pages.editCourse.moduleEditor',
    );

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-4 bg-card-fill border border-base-neutral-700 rounded-lg p-4">
                <div className="flex items-center gap-4 flex-1">
                    <div className="h-12 w-12 flex-shrink-0 bg-base-neutral-700 border border-base-neutral-600 rounded-lg flex items-center justify-center">
                        <IconModule />
                    </div>
                    <InputField
                        value={module.title || ''}
                        inputText={editCourseTranslations('moduleTitle')}
                        setValue={handleTitleChange}
                        className="w-full font-bold"
                    />
                </div>
                <ContentControlButtons
                    onMoveUp={onMoveUp}
                    onMoveDown={onMoveDown}
                    onDelete={onDelete}
                    isFirst={isFirst}
                    isLast={isLast}
                    isExpanded={isExpanded}
                    onExpand={onExpand}
                />
            </div>
            {isExpanded && (
                <ModuleContent
                    moduleIndex={index}
                    content={module.content}
                    onMoveContentUp={(contentIndex) =>
                        onMoveContentUp(contentIndex)
                    }
                    onMoveContentDown={(contentIndex) =>
                        onMoveContentDown(contentIndex)
                    }
                    onDeleteContent={(contentIndex) =>
                        onDeleteContent(contentIndex)
                    }
                    onLessonTitleChange={(lessonIndex, newTitle) =>
                        onLessonTitleChange(lessonIndex, newTitle)
                    }
                    onLessonExtraTrainingChange={(
                        lessonIndex,
                        isExtraTraining,
                    ) =>
                        onLessonExtraTrainingChange(
                            lessonIndex,
                            isExtraTraining,
                        )
                    }
                    onDuplicateLesson={onDuplicateLesson}
                    locale={locale}
                />
            )}
        </div>
    );
}
