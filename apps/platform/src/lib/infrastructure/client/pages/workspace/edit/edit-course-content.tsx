import {
    ComponentCard,
    IconLesson,
    IconMilestone,
    IconModule,
} from '@maany_shr/e-class-ui-kit';
import { TLocale } from '@maany_shr/e-class-translations';
import { DefaultError, DefaultLoading } from '@maany_shr/e-class-ui-kit';
import { useLocale } from 'next-intl';
import { trpc } from '../../../trpc/client';
import { viewModels } from '@maany_shr/e-class-models';
import { useGetCourseStructurePresenter } from '../../../hooks/use-course-structure-presenter';
import { useEffect, useState } from 'react';
import { ModuleEditor } from './components/module-editor';
import {
    ContentType,
    CourseLesson,
    CourseMilestone,
    CourseModule,
    EditCourseContentProps,
} from './types';

export default function EditCourseContent({
    slug,
    isEdited,
    setIsEdited,
    modules,
    setModules,
}: EditCourseContentProps) {
    const locale = useLocale() as TLocale;

    const [courseStructureResponse] = trpc.getCourseStructure.useSuspenseQuery(
        {
            courseSlug: slug,
        },
        {
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            refetchOnMount: false,
            retry: false,
            staleTime: Infinity,
        },
    );
    const [courseStructureViewModel, setCourseStructureViewModel] = useState<
        viewModels.TCourseStructureViewModel | undefined
    >(undefined);
    const { presenter } = useGetCourseStructurePresenter(
        setCourseStructureViewModel,
    );
    presenter.present(courseStructureResponse, courseStructureViewModel);

    useEffect(() => {
        if (!courseStructureViewModel) return;
        if (courseStructureViewModel.mode !== 'default') return;
        setModules(
            courseStructureViewModel.data.modules.map((module) => {
                const content: (CourseLesson | CourseMilestone)[] = [];
                module.lessons.forEach((lesson) => {
                    content.push({
                        type: ContentType.Lesson,
                        id: lesson.id,
                        title: lesson.title,
                        isExtraTraining: lesson.extraTraining,
                    });
                });
                return {
                    ...module,
                    content,
                };
            }),
        );
    }, [courseStructureViewModel]);

    const [expandedModuleIndex, setExpandedModuleIndex] = useState<
        number | null
    >(null);

    if (!courseStructureViewModel) {
        return <DefaultLoading locale={locale} />;
    }

    if (courseStructureViewModel.mode !== 'default') {
        return <DefaultError locale={locale} />;
    }

    const addModule = () => {
        const newModule: CourseModule = {
            content: [],
        };
        setModules([...modules, newModule]);
        setIsEdited(true);
    };

    const updateModule = (index: number, updatedModule: CourseModule) => {
        setModules((prev) => {
            const updated = [...prev];
            updated[index] = updatedModule;
            return updated;
        });
        setIsEdited(true);
    };

    const deleteModule = (index: number) => {
        setModules((prev) => prev.filter((_, i) => i !== index));
        setExpandedModuleIndex(null);
        setIsEdited(true);
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
        setIsEdited(true);
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
        setIsEdited(true);
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

        setIsEdited(true);
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

        setIsEdited(true);
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

        setIsEdited(true);
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

        setIsEdited(true);
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

        setIsEdited(true);
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

        setIsEdited(true);
    };

    const onExtraTrainingChange = (
        moduleIndex: number,
        lessonIndex: number,
        isExtraTraining: boolean,
    ) => {
        setModules((prev) => {
            if (moduleIndex < 0 || moduleIndex >= prev.length) return prev;
            const module = prev[moduleIndex];
            if (!module) return prev;

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
                            isExtraTraining,
                        };
                    }
                    return lesson;
                }),
            };

            return updated;
        });

        setIsEdited(true);
    };

    return (
        <div className="flex lg:flex-row flex-col gap-4 text-text-primary">
            <div className="h-fit flex flex-col gap-3 bg-card-fill border border-base-neutral-700 rounded-lg p-4 lg:w-[300px] w-full">
                <span className="text-lg font-bold">Components</span>
                <div className="flex flex-col gap-2">
                    <ComponentCard
                        name="Module"
                        icon={<IconModule />}
                        onClick={() => addModule()}
                    />
                    <ComponentCard
                        name="Lesson"
                        icon={<IconLesson />}
                        onClick={() => addLesson()}
                    />
                    <ComponentCard
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
                        onLessonExtraTrainingChange={(
                            lessonIndex,
                            isExtraTraining,
                        ) => {
                            onExtraTrainingChange(
                                index,
                                lessonIndex,
                                isExtraTraining,
                            );
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
