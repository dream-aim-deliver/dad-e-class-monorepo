import { TLocale } from '@maany_shr/e-class-translations';
import {
    CourseOutlineAccordion,
    DefaultError,
    DefaultLoading,
    LessonHeader,
} from '@maany_shr/e-class-ui-kit';
import { useLocale } from 'next-intl';
import { Suspense, useState } from 'react';
import { trpc } from '../../../trpc/client';
import { viewModels } from '@maany_shr/e-class-models';
import { useGetCourseStructurePresenter } from '../../../hooks/use-course-structure-presenter';

interface EnrolledCoursePreviewProps {
    courseSlug: string;
}

function CoursePreviewContent(props: EnrolledCoursePreviewProps) {
    const { courseSlug } = props;
    const locale = useLocale() as TLocale;

    const [courseStructureResponse] = trpc.getCourseStructure.useSuspenseQuery({
        courseSlug,
    });
    const [courseStructureViewModel, setCourseStructureViewModel] = useState<
        viewModels.TCourseStructureViewModel | undefined
    >(undefined);
    const { presenter } = useGetCourseStructurePresenter(
        setCourseStructureViewModel,
    );
    presenter.present(courseStructureResponse, courseStructureViewModel);

    const [activeModuleIndex, setActiveModuleIndex] = useState<
        number | undefined
    >(undefined);
    const [activeLessonIndex, setActiveLessonIndex] = useState<
        number | undefined
    >(undefined);

    if (!courseStructureViewModel) {
        return <DefaultLoading locale={locale} />;
    }

    if (courseStructureViewModel.mode !== 'default') {
        return <DefaultError locale={locale} />;
    }

    const modules = courseStructureViewModel.data.modules;

    const getCurrentModule = () => {
        if (activeModuleIndex === undefined) return undefined;
        return modules[activeModuleIndex];
    };

    const getCurrentLesson = () => {
        if (activeLessonIndex === undefined) return undefined;
        const currentModule = getCurrentModule();
        if (!currentModule) return undefined;
        return currentModule.lessons[activeLessonIndex];
    };

    const handleLessonClick = (lessonId: number) => {
        const moduleIndex = modules.findIndex((module) =>
            module.lessons.some((lesson) => lesson.id === lessonId),
        );

        if (moduleIndex === -1) return;

        const lessonIndex = modules[moduleIndex].lessons.findIndex(
            (lesson) => lesson.id === lessonId,
        );

        setActiveLessonIndex(lessonIndex);
        setActiveModuleIndex(moduleIndex);
    };

    const handlePreviousLesson = () => {
        if (activeLessonIndex === undefined) return;

        const previousLessonIndex = activeLessonIndex - 1;
        if (previousLessonIndex >= 0) {
            setActiveLessonIndex(previousLessonIndex);
        }
    };

    const handleNextLesson = () => {
        if (activeLessonIndex === undefined) return;

        const currentModule = getCurrentModule();
        if (!currentModule) return;

        const nextLessonIndex = activeLessonIndex + 1;
        if (nextLessonIndex < currentModule.lessons.length) {
            setActiveLessonIndex(nextLessonIndex);
        }
    };

    const transformedModules = modules.map((module) => ({
        ...module,
        lessons: module.lessons.map((lesson) => ({
            ...lesson,
            optional: lesson.extraTraining,
        })),
    }));

    const currentModule = getCurrentModule();
    const currentLesson = getCurrentLesson();

    return (
        <div className="flex flex-row space-x-6">
            <CourseOutlineAccordion
                locale={locale}
                modules={transformedModules}
                activeLessonId={currentLesson?.id}
                onLessonClick={handleLessonClick}
            />
            <div className="w-full">
                {currentModule && currentLesson && (
                    <LessonHeader
                        currentModule={currentModule.order}
                        totalModules={modules.length}
                        moduleTitle={currentModule.title}
                        currentLesson={currentLesson.order}
                        totalLessons={currentModule.lessons.length}
                        lessonTitle={currentLesson.title}
                        areNotesAvailable={false}
                        onClickPrevious={handlePreviousLesson}
                        onClickNext={handleNextLesson}
                        onClick={() => {
                            // This function handles opening notes. As they aren't available in preview mode, it's left empty.
                        }}
                        locale={locale}
                    />
                )}
            </div>
        </div>
    );
}

export default function EnrolledCoursePreview({
    courseSlug,
}: EnrolledCoursePreviewProps) {
    const locale = useLocale() as TLocale;
    return (
        <Suspense fallback={<DefaultLoading locale={locale} />}>
            <CoursePreviewContent courseSlug={courseSlug} />
        </Suspense>
    );
}
