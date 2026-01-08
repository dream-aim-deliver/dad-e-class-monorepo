import { viewModels } from '@maany_shr/e-class-models';
import { useGetCourseStructurePresenter } from '../../../../hooks/use-course-structure-presenter';
import { useState } from 'react';
import {
    ContentType,
    CourseLesson,
    CourseMilestone,
    CourseModule,
} from '../types';
import { trpc } from '../../../../trpc/cms-client';

export function useCourseStructure(slug: string) {
    const [courseStructureResponse] = trpc.getCourseStructure.useSuspenseQuery(
        { courseSlug: slug },
        {
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            refetchOnMount: true,
            retry: false,
        },
    );

    const [courseStructureViewModel, setCourseStructureViewModel] = useState<
        viewModels.TCourseStructureViewModel | undefined
    >(undefined);

    const { presenter } = useGetCourseStructurePresenter(
        setCourseStructureViewModel,
    );
    // @ts-ignore
    presenter.present(courseStructureResponse, courseStructureViewModel);

    return courseStructureViewModel;
}

interface UseModuleOperationsProps {
    modules: CourseModule[];
    setModules: React.Dispatch<React.SetStateAction<CourseModule[]>>;
    setIsEdited: (edited: boolean) => void;
    setExpandedModuleIndex: React.Dispatch<React.SetStateAction<number | null>>;
}

export function useModuleOperations({
    modules,
    setModules,
    setIsEdited,
    setExpandedModuleIndex,
}: UseModuleOperationsProps) {
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

    return {
        addModule,
        updateModule,
        deleteModule,
        moveModuleUp,
        moveModuleDown,
    };
}

interface UseContentOperationsProps {
    modules: CourseModule[];
    setModules: React.Dispatch<React.SetStateAction<CourseModule[]>>;
    setIsEdited: (edited: boolean) => void;
    expandedModuleIndex: number | null;
    setExpandedModuleIndex: React.Dispatch<React.SetStateAction<number | null>>;
}

export function useContentOperations({
    modules,
    setModules,
    setIsEdited,
    expandedModuleIndex,
    setExpandedModuleIndex,
}: UseContentOperationsProps) {
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

            const courseModule = prev[moduleIndex];
            if (!courseModule || contentIndex >= courseModule.content.length)
                return prev;

            const newContent = [...courseModule.content];
            [newContent[contentIndex - 1], newContent[contentIndex]] = [
                newContent[contentIndex],
                newContent[contentIndex - 1],
            ];

            const updated = [...prev];
            updated[moduleIndex] = {
                ...courseModule,
                content: newContent,
            };

            return updated;
        });

        setIsEdited(true);
    };

    const onMoveContentDown = (moduleIndex: number, contentIndex: number) => {
        setModules((prev) => {
            if (moduleIndex < 0 || moduleIndex >= prev.length) return prev;

            const courseModule = prev[moduleIndex];
            if (!courseModule) return prev;
            if (
                contentIndex < 0 ||
                contentIndex >= courseModule.content.length - 1
            )
                return prev;

            const newContent = [...courseModule.content];
            [newContent[contentIndex], newContent[contentIndex + 1]] = [
                newContent[contentIndex + 1],
                newContent[contentIndex],
            ];

            const updated = [...prev];
            updated[moduleIndex] = {
                ...courseModule,
                content: newContent,
            };

            return updated;
        });

        setIsEdited(true);
    };

    const onDeleteContent = (moduleIndex: number, contentIndex: number) => {
        setModules((prev) => {
            if (moduleIndex < 0 || moduleIndex >= prev.length) return prev;

            const courseModule = prev[moduleIndex];
            if (!courseModule) return prev;
            if (contentIndex < 0 || contentIndex >= courseModule.content.length)
                return prev;

            const newContent = courseModule.content.filter(
                (_, index) => index !== contentIndex,
            );

            const updated = [...prev];
            updated[moduleIndex] = {
                ...courseModule,
                content: newContent,
            };

            return updated;
        });

        setIsEdited(true);
    };

    return {
        addLesson,
        addMilestone,
        onMoveContentUp,
        onMoveContentDown,
        onDeleteContent,
    };
}

interface UseLessonOperationsProps {
    setModules: React.Dispatch<React.SetStateAction<CourseModule[]>>;
    setIsEdited: (edited: boolean) => void;
}

export function useLessonOperations({
    setModules,
    setIsEdited,
}: UseLessonOperationsProps) {
    const onLessonTitleChange = (
        moduleIndex: number,
        lessonIndex: number,
        newTitle: string,
    ) => {
        setModules((prev) => {
            if (moduleIndex < 0 || moduleIndex >= prev.length) return prev;
            const courseModule = prev[moduleIndex];
            if (
                !courseModule ||
                lessonIndex < 0 ||
                lessonIndex >= courseModule.content.length
            )
                return prev;
            const lesson = courseModule.content[lessonIndex];
            if (!lesson) return prev;

            const updated = [...prev];
            updated[moduleIndex] = {
                ...courseModule,
                content: courseModule.content.map((lesson, index) => {
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
            const courseModule = prev[moduleIndex];
            if (!courseModule) return prev;

            const updated = [...prev];
            updated[moduleIndex] = {
                ...courseModule,
                content: courseModule.content.map((lesson, index) => {
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

    return {
        onLessonTitleChange,
        onExtraTrainingChange,
    };
}

export function useModuleExpansion() {
    const [expandedModuleIndex, setExpandedModuleIndex] = useState<
        number | null
    >(null);

    const onExpand = (index: number) => {
        setExpandedModuleIndex((prev) => (prev === index ? null : index));
    };

    return {
        expandedModuleIndex,
        setExpandedModuleIndex,
        onExpand,
    };
}

