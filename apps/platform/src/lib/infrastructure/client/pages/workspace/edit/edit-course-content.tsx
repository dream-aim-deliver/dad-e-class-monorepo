import {
    Button,
    IconChevronDown,
    IconChevronUp,
    IconLesson,
    IconMilestone,
    IconMinus,
    IconModule,
    IconPlus,
    IconTrashAlt,
    InputField,
} from '@maany_shr/e-class-ui-kit';
import { useState } from 'react';

interface EditCourseContentProps {
    slug: string;
}

interface StructureComponentProps {
    name: string;
    icon: React.ReactNode;
    onClick?: () => void;
}

function StructureComponent({ name, icon, onClick }: StructureComponentProps) {
    return (
        <div
            className="flex items-center gap-2 bg-base-neutral-800 border border-base-neutral-700 rounded-lg p-4 cursor-pointer"
            onClick={onClick}
        >
            {icon}
            <span className="text-lg">{name}</span>
        </div>
    );
}

enum ContentType {
    Lesson = 'lesson',
    Milestone = 'milestone',
}

interface CourseLesson {
    type: ContentType.Lesson;
    id?: number;
    title?: string;
    isExtraTraining: boolean;
}

interface CourseMilestone {
    type: ContentType.Milestone;
    id?: number;
}

interface CourseModule {
    id?: number;
    title?: string;
    content: (CourseLesson | CourseMilestone)[];
}

interface ModuleContentProps {
    content: (CourseLesson | CourseMilestone)[];
    onMoveContentUp: (contentIndex: number) => void;
    onMoveContentDown: (contentIndex: number) => void;
    onDeleteContent: (contentIndex: number) => void;
    onLessonTitleChange: (lessonIndex: number, newTitle: string) => void;
    onLessonExtraTrainingChange: (
        lessonIndex: number,
        extraTraining: boolean,
    ) => void;
}

function ContentControlButtons({
    onMoveUp,
    onMoveDown,
    onDelete,
    isExpanded = false,
    onExpand,
    isFirst,
    isLast,
}: {
    onMoveUp: () => void;
    onMoveDown: () => void;
    onDelete: () => void;
    isExpanded?: boolean;
    onExpand?: () => void;
    isFirst: boolean;
    isLast: boolean;
}) {
    return (
        <div className="flex gap-2">
            <div className="flex items-center gap-2">
                <Button
                    variant="text"
                    iconLeft={<IconTrashAlt />}
                    hasIconLeft
                    onClick={() => onDelete()}
                    className="px-0"
                />
                <Button
                    variant="text"
                    iconLeft={<IconChevronUp />}
                    hasIconLeft
                    onClick={() => onMoveUp()}
                    disabled={isFirst}
                    className="px-0"
                />
                <Button
                    variant="text"
                    iconLeft={<IconChevronDown />}
                    hasIconLeft
                    onClick={() => onMoveDown()}
                    disabled={isLast}
                    className="px-0"
                />
                {onExpand && (
                    <Button
                        variant="text"
                        iconLeft={isExpanded ? <IconMinus /> : <IconPlus />}
                        hasIconLeft
                        onClick={() => onExpand()}
                        className="px-0"
                    />
                )}
            </div>
        </div>
    );
}

function LessonItem({
    lesson,
    onMoveUp,
    onMoveDown,
    onDelete,
    isFirst,
    isLast,
    onTitleChange,
    onExtraTrainingChange,
}: {
    lesson: CourseLesson;
    onMoveUp: () => void;
    onMoveDown: () => void;
    onDelete: () => void;
    isFirst: boolean;
    isLast: boolean;
    onTitleChange: (newTitle: string) => void;
    onExtraTrainingChange: (isExtraTraining: boolean) => void;
}) {
    return (
        <div className="flex gap-4 items-center bg-card-fill border border-base-neutral-700 rounded-lg p-3">
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
    );
}

function MilestoneItem({
    milestone,
    onMoveUp,
    onMoveDown,
    onDelete,
    isFirst,
    isLast,
}: {
    milestone: CourseMilestone;
    onMoveUp: () => void;
    onMoveDown: () => void;
    onDelete: () => void;
    isFirst: boolean;
    isLast: boolean;
}) {
    return (
        <div className="flex gap-2 items-center bg-card-fill border border-base-neutral-700 rounded-lg p-3">
            <IconMilestone />
            <span className="font-bold w-full">Milestone</span>
            <ContentControlButtons
                onMoveUp={onMoveUp}
                onMoveDown={onMoveDown}
                onDelete={onDelete}
                isFirst={isFirst}
                isLast={isLast}
            />
        </div>
    );
}

function ModuleContent({
    content,
    onMoveContentUp,
    onMoveContentDown,
    onDeleteContent,
    onLessonTitleChange,
    onLessonExtraTrainingChange,
}: ModuleContentProps) {
    const isEmpty = content.length === 0;

    return (
        <div className="flex flex-col gap-2 ml-4">
            {isEmpty && (
                <div className=" flex flex-col gap-2 bg-card-fill border border-base-neutral-700 rounded-lg p-4">
                    <span className="text-text-secondary">
                        Add lessons or milestones
                    </span>
                </div>
            )}
            {content.map((item, index) => {
                if (item.type === ContentType.Milestone) {
                    return (
                        <MilestoneItem
                            key={`milestone-${index}`}
                            milestone={item}
                            onMoveUp={() => onMoveContentUp(index)}
                            onMoveDown={() => onMoveContentDown(index)}
                            onDelete={() => onDeleteContent(index)}
                            isFirst={index === 0}
                            isLast={index === content.length - 1}
                        />
                    );
                }
                if (item.type === ContentType.Lesson) {
                    return (
                        <LessonItem
                            key={`lesson-${index}`}
                            lesson={item}
                            onMoveUp={() => onMoveContentUp(index)}
                            onMoveDown={() => onMoveContentDown(index)}
                            onDelete={() => onDeleteContent(index)}
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
                        />
                    );
                }
                return null;
            })}
        </div>
    );
}

interface ModuleEditorProps {
    module: CourseModule;
    onUpdate: (updatedModule: CourseModule) => void;
    onDelete: () => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
    onMoveContentUp: (contentIndex: number) => void;
    onMoveContentDown: (contentIndex: number) => void;
    onDeleteContent: (contentIndex: number) => void;
    isExpanded: boolean;
    onExpand: () => void;
    isFirst: boolean;
    isLast: boolean;

    onLessonTitleChange: (index: number, title: string) => void;
    onLessonExtraTrainingChange: (
        index: number,
        isExtraTraining: boolean,
    ) => void;
}

export function ModuleEditor({
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
}: ModuleEditorProps) {
    const handleTitleChange = (value: string) => {
        onUpdate({ ...module, title: value });
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-4 bg-card-fill border border-base-neutral-700 rounded-lg p-4">
                <div className="flex items-center gap-4 flex-1">
                    <div className="h-12 w-12 flex-shrink-0 bg-base-neutral-700 border border-base-neutral-600 rounded-lg flex items-center justify-center">
                        <IconModule />
                    </div>
                    <InputField
                        value={module.title || ''}
                        inputText="Module title"
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
                />
            )}
        </div>
    );
}

// TODO: Translate
// TODO: Add search functionality
// TODO: Add lesson templating
// TODO: Add limits on number of modules, lessons, and milestones
export default function EditCourseContent({ slug }: EditCourseContentProps) {
    const [modules, setModules] = useState<CourseModule[]>([]);
    const [expandedModuleIndex, setExpandedModuleIndex] = useState<
        number | null
    >(null);

    const addModule = () => {
        const newModule: CourseModule = {
            content: [],
        };
        setModules([...modules, newModule]);
    };

    const updateModule = (index: number, updatedModule: CourseModule) => {
        setModules((prev) => {
            const updated = [...prev];
            updated[index] = updatedModule;
            return updated;
        });
    };

    const deleteModule = (index: number) => {
        setModules((prev) => prev.filter((_, i) => i !== index));
    };

    const moveModuleUp = (index: number) => {
        if (index === 0) return;

        setModules((prev) => {
            const updated = [...prev];
            [updated[index - 1], updated[index]] = [
                updated[index],
                updated[index - 1],
            ];
            return updated;
        });

        setExpandedModuleIndex(null);
    };

    const moveModuleDown = (index: number) => {
        setModules((prev) => {
            if (index === prev.length - 1) return prev;

            const updated = [...prev];
            [updated[index], updated[index + 1]] = [
                updated[index + 1],
                updated[index],
            ];
            return updated;
        });

        setExpandedModuleIndex(null);
    };

    const addLesson = () => {
        setModules((prev) => {
            let targetModuleIndex = expandedModuleIndex;

            if (targetModuleIndex === null) {
                if (prev.length === 0) {
                    return prev;
                }
                targetModuleIndex = 0;
            }

            if (targetModuleIndex < 0 || targetModuleIndex >= prev.length) {
                return prev;
            }

            const newLesson: CourseLesson = {
                type: ContentType.Lesson,
                isExtraTraining: false,
            };

            const updated = [...prev];
            updated[targetModuleIndex] = {
                ...updated[targetModuleIndex],
                content: [...updated[targetModuleIndex].content, newLesson],
            };

            return updated;
        });

        if (expandedModuleIndex === null && modules.length > 0) {
            setExpandedModuleIndex(0);
        }
    };

    const addMilestone = () => {
        setModules((prev) => {
            let targetModuleIndex = expandedModuleIndex;

            if (targetModuleIndex === null) {
                if (prev.length === 0) {
                    return prev;
                }
                targetModuleIndex = 0;
            }

            if (targetModuleIndex < 0 || targetModuleIndex >= prev.length) {
                return prev;
            }

            const newMilestone: CourseMilestone = {
                type: ContentType.Milestone,
            };

            const updated = [...prev];
            updated[targetModuleIndex] = {
                ...updated[targetModuleIndex],
                content: [...updated[targetModuleIndex].content, newMilestone],
            };

            return updated;
        });

        if (expandedModuleIndex === null && modules.length > 0) {
            setExpandedModuleIndex(0);
        }
    };

    const onMoveContentUp = (moduleIndex: number, contentIndex: number) => {
        setModules((prev) => {
            if (moduleIndex < 0 || moduleIndex >= prev.length) return prev;
            if (contentIndex <= 0) return prev;

            const module = prev[moduleIndex];
            if (!module || contentIndex >= module.content.length) return prev;

            const newContent = [...module.content];
            [newContent[contentIndex - 1], newContent[contentIndex]] = [
                newContent[contentIndex],
                newContent[contentIndex - 1],
            ];

            const updated = [...prev];
            updated[moduleIndex] = {
                ...module,
                content: newContent,
            };

            return updated;
        });
    };

    const onMoveContentDown = (moduleIndex: number, contentIndex: number) => {
        setModules((prev) => {
            if (moduleIndex < 0 || moduleIndex >= prev.length) return prev;

            const module = prev[moduleIndex];
            if (!module) return prev;
            if (contentIndex < 0 || contentIndex >= module.content.length - 1)
                return prev;

            const newContent = [...module.content];
            [newContent[contentIndex], newContent[contentIndex + 1]] = [
                newContent[contentIndex + 1],
                newContent[contentIndex],
            ];

            const updated = [...prev];
            updated[moduleIndex] = {
                ...module,
                content: newContent,
            };

            return updated;
        });
    };

    const onDeleteContent = (moduleIndex: number, contentIndex: number) => {
        setModules((prev) => {
            if (moduleIndex < 0 || moduleIndex >= prev.length) return prev;

            const module = prev[moduleIndex];
            if (!module) return prev;
            if (contentIndex < 0 || contentIndex >= module.content.length)
                return prev;

            const newContent = module.content.filter(
                (_, index) => index !== contentIndex,
            );

            const updated = [...prev];
            updated[moduleIndex] = {
                ...module,
                content: newContent,
            };

            return updated;
        });
    };

    const onLessonTitleChange = (
        moduleIndex: number,
        lessonIndex: number,
        newTitle: string,
    ) => {
        setModules((prev) => {
            if (moduleIndex < 0 || moduleIndex >= prev.length) return prev;
            const module = prev[moduleIndex];
            if (
                !module ||
                lessonIndex < 0 ||
                lessonIndex >= module.content.length
            )
                return prev;
            const lesson = module.content[lessonIndex];
            if (!lesson) return prev;

            const updated = [...prev];
            updated[moduleIndex] = {
                ...module,
                content: module.content.map((lesson, index) => {
                    if (
                        index === lessonIndex &&
                        lesson.type === ContentType.Lesson
                    ) {
                        return {
                            ...lesson,
                            title: newTitle,
                        };
                    }
                    return lesson;
                }),
            };

            return updated;
        });
    };

    return (
        <div className="flex lg:flex-row flex-col gap-4 text-text-primary">
            <div className="h-fit flex flex-col gap-3 bg-card-fill border border-base-neutral-700 rounded-lg p-4 lg:w-[300px] w-full">
                <span className="text-lg font-bold">Components</span>
                <div className="flex flex-col gap-2">
                    <StructureComponent
                        name="Module"
                        icon={<IconModule />}
                        onClick={() => addModule()}
                    />
                    <StructureComponent
                        name="Lesson"
                        icon={<IconLesson />}
                        onClick={() => addLesson()}
                    />
                    <StructureComponent
                        name="Milestone"
                        icon={<IconMilestone />}
                        onClick={() => addMilestone()}
                    />
                </div>
            </div>
            <div className="flex flex-col gap-2 flex-1">
                {modules.map((module, index) => (
                    <ModuleEditor
                        key={`module-${index}`}
                        module={module}
                        onUpdate={(updatedModule) =>
                            updateModule(index, updatedModule)
                        }
                        onDelete={() => deleteModule(index)}
                        onMoveUp={() => moveModuleUp(index)}
                        onMoveDown={() => moveModuleDown(index)}
                        onMoveContentUp={(contentIndex) =>
                            onMoveContentUp(index, contentIndex)
                        }
                        onMoveContentDown={(contentIndex) =>
                            onMoveContentDown(index, contentIndex)
                        }
                        onDeleteContent={(contentIndex) =>
                            onDeleteContent(index, contentIndex)
                        }
                        isExpanded={expandedModuleIndex === index}
                        onExpand={() => {
                            if (expandedModuleIndex === index) {
                                setExpandedModuleIndex(null);
                            } else {
                                setExpandedModuleIndex(index);
                            }
                        }}
                        isFirst={index === 0}
                        isLast={index === modules.length - 1}
                        onLessonTitleChange={(lessonIndex, title) =>
                            onLessonTitleChange(index, lessonIndex, title)
                        }
                        onLessonExtraTrainingChange={() => {}}
                    />
                ))}
            </div>
        </div>
    );
}
