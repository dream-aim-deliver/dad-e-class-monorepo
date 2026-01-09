import { TLocale } from '@maany_shr/e-class-translations';
import {
    Button,
    CourseOutlineAccordion,
    DefaultError,
    DefaultLoading,
    DefaultNotFound,
    Divider,
    IconEyeHide,
    IconEyeShow,
    LessonHeader,
} from '@maany_shr/e-class-ui-kit';
import { useLocale, useTranslations } from 'next-intl';
import { Suspense, useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { viewModels } from '@maany_shr/e-class-models';
import { useGetCourseStructurePresenter } from '../../../hooks/use-course-structure-presenter';
import { useListLessonComponentsPresenter } from '../../../hooks/use-list-lesson-components-presenter';
import LessonForm from './lesson-form';
import LessonNotesPanel from './lesson-notes-panel';
import { trpc } from '../../../trpc/cms-client';
import { CourseSlugProvider } from '../utils/course-slug-context';

interface EnrolledCoursePreviewProps {
    courseSlug: string;
    enableSubmit?: boolean;
    studentUsername?: string;
    initialLessonId?: string;
}

function CoursePreviewLesson(props: {
    lessonId: number;
    enableSubmit?: boolean;
    studentUsername?: string;
}) {
    const locale = useLocale() as TLocale;

    const [componentsResponse, { isPending }] =
        trpc.listLessonComponents.useSuspenseQuery(
            {
                lessonId: props.lessonId,
                withProgress: props.enableSubmit ?? false,
            },
            {
                staleTime: 0,
                refetchOnMount: true,
            },
        );
    const [componentsViewModel, setLessonComponentsViewModel] = useState<
        viewModels.TListLessonComponentsViewModel | undefined
    >(undefined);
    const { presenter } = useListLessonComponentsPresenter(
        setLessonComponentsViewModel,
    );

    // @ts-ignore
    presenter.present(componentsResponse, componentsViewModel);

    if (!componentsViewModel || isPending) {
        return <DefaultLoading locale={locale} variant="minimal" />;
    }

    if (componentsViewModel.mode !== 'default') {
        return <DefaultError locale={locale} />;
    }

    return (
        <LessonForm
            key={`lesson-preview-${props.lessonId}`}
            lessonId={props.lessonId}
            data={componentsViewModel.data}
            enableSubmit={props.enableSubmit}
            studentUsername={props.studentUsername}
        />
    );
}

function CoursePreviewContent(props: EnrolledCoursePreviewProps) {
    const { courseSlug, initialLessonId, studentUsername } = props;
    const locale = useLocale() as TLocale;
    const t = useTranslations('components.lessonNotes');
    const router = useRouter();
    const searchParams = useSearchParams();

    // State for showing/hiding notes panel (only for students with enableSubmit)
    const [showNotes, setShowNotes] = useState(false);

    const [courseStructureResponse] = trpc.getCourseStructure.useSuspenseQuery({
        courseSlug,
    });
    const [courseStructureViewModel, setCourseStructureViewModel] = useState<
        viewModels.TCourseStructureViewModel | undefined
    >(undefined);
    const { presenter } = useGetCourseStructurePresenter(
        setCourseStructureViewModel,
    );
    // @ts-ignore
    presenter.present(courseStructureResponse, courseStructureViewModel);

    const [activeModuleIndex, setActiveModuleIndex] = useState<
        number | undefined
    >(undefined);
    const [activeLessonIndex, setActiveLessonIndex] = useState<
        number | undefined
    >(undefined);
    const hasInitializedLesson = useRef(false);

    // Initialize lesson from URL parameter
    useEffect(() => {
        if (
            hasInitializedLesson.current ||
            !initialLessonId ||
            !courseStructureViewModel ||
            courseStructureViewModel.mode !== 'default'
        ) {
            return;
        }

        const lessonId = parseInt(initialLessonId, 10);
        if (isNaN(lessonId)) return;

        const modules = courseStructureViewModel.data.modules;

        // Find the module and lesson indices
        for (let moduleIndex = 0; moduleIndex < modules.length; moduleIndex++) {
            const lessonIndex = modules[moduleIndex].lessons.findIndex(
                (lesson) => lesson.id === lessonId,
            );
            if (lessonIndex !== -1) {
                setActiveModuleIndex(moduleIndex);
                setActiveLessonIndex(lessonIndex);
                hasInitializedLesson.current = true;
                return;
            }
        }
    }, [courseStructureViewModel, initialLessonId]);

    if (!courseStructureViewModel) {
        return <DefaultLoading locale={locale} variant="minimal" />;
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

        // Update URL with lesson parameter
        const params = new URLSearchParams(searchParams.toString());
        params.set('tab', 'study');
        params.set('lesson', lessonId.toString());
        
        // Preserve role parameter
        const currentRole = params.get('role');
        if (currentRole) {
            params.set('role', currentRole);
        }
        
        router.push(`/${locale}/courses/${courseSlug}?${params.toString()}`);
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
        order: module.position,
        lessons: module.lessons.map((lesson) => ({
            ...lesson,
            order: lesson.position,
            optional: lesson.extraTraining,
        })),
    }));

    const currentModule = getCurrentModule();
    const currentLesson = getCurrentLesson();

    if (transformedModules.length === 0) {
        return <DefaultError locale={locale} description="Course is empty." />;
    }

    return (
        <CourseSlugProvider courseSlug={courseSlug}>
            <div className="flex flex-col w-full gap-6 overflow-hidden">
                {/* Show/Hide Notes button - only for students with enableSubmit */}
                {props.enableSubmit && currentLesson && (
                    <div className="flex justify-end">
                        <Button
                            variant="secondary"
                            size="medium"
                            text={showNotes ? t('hideNotesText') : t('showNotesText')}
                            hasIconLeft
                            iconLeft={showNotes ? <IconEyeHide /> : <IconEyeShow />}
                            onClick={() => setShowNotes(!showNotes)}
                        />
                    </div>
                )}

                <div className={`flex flex-col w-full gap-6 overflow-hidden ${showNotes ? 'lg:flex-row' : 'md:flex-row'}`}>
                    <CourseOutlineAccordion
                        locale={locale}
                        modules={transformedModules}
                        activeLessonId={currentLesson?.id}
                        onLessonClick={handleLessonClick}
                        className="sticky top-30 bottom-30 h-fit overflow-y-auto lg:w-[343px] md:w-[280px] w-full"
                    />
                    <div className="flex-1 min-w-0">
                        {currentModule && currentLesson && (
                            <>
                                <LessonHeader
                                    currentModule={currentModule.position}
                                    totalModules={modules.length}
                                    moduleTitle={currentModule.title}
                                    currentLesson={(activeLessonIndex ?? 0) + 1}
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
                                <Divider className="my-6" />
                                <Suspense
                                    fallback={
                                        <DefaultLoading
                                            locale={locale}
                                            variant="minimal"
                                        />
                                    }
                                >
                                    <CoursePreviewLesson
                                        lessonId={currentLesson.id}
                                        enableSubmit={props.enableSubmit}
                                        studentUsername={studentUsername}
                                    />
                                </Suspense>
                            </>
                        )}
                    </div>

                    {/* Lesson Notes Panel - only shown when notes are visible and for students */}
                    {showNotes && props.enableSubmit && currentLesson && (
                        <LessonNotesPanel lessonId={currentLesson.id} />
                    )}
                </div>
            </div>
        </CourseSlugProvider>
    );
}

export default function EnrolledCoursePreview({
    courseSlug,
    enableSubmit,
    studentUsername,
    initialLessonId,
}: EnrolledCoursePreviewProps) {
    const locale = useLocale() as TLocale;
    return (
        <Suspense
            fallback={<DefaultLoading locale={locale} variant="minimal" />}
        >
            <CoursePreviewContent
                courseSlug={courseSlug}
                enableSubmit={enableSubmit}
                studentUsername={studentUsername}
                initialLessonId={initialLessonId}
            />
        </Suspense>
    );
}
