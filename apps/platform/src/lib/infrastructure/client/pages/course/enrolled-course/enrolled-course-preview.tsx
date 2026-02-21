import { TLocale } from '@maany_shr/e-class-translations';
import {
    Button,
    CourseOutlineAccordion,
    DefaultError,
    DefaultLoading,
    DefaultNotFound,
    Divider,
    Banner,
    IconEyeHide,
    IconEyeShow,
    LessonHeader,
    ModulePagination,
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
    isArchived?: boolean;
    showArchivedBadge?: boolean;
}

function CoursePreviewLesson(props: {
    lessonId: number;
    enableSubmit?: boolean;
    studentUsername?: string;
    isArchived?: boolean;
}) {
    const locale = useLocale() as TLocale;
    const t = useTranslations('pages.enrolledCourse');

    const [componentsResponse, { isPending }] =
        trpc.listLessonComponents.useSuspenseQuery(
            {
                lessonId: props.lessonId,
                withProgress: true,
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
        return (
            <DefaultError
                type="simple"
                locale={locale}
                title={t('error.title')}
                description={t('error.description')}
            />
        );
    }

    return (
        <LessonForm
            key={`lesson-preview-${props.lessonId}`}
            lessonId={props.lessonId}
            data={componentsViewModel.data}
            enableSubmit={props.enableSubmit}
            studentUsername={props.studentUsername}
            isArchived={props.isArchived}
        />
    );
}

function CoursePreviewContent(props: EnrolledCoursePreviewProps) {
    const { courseSlug, initialLessonId, studentUsername } = props;
    const locale = useLocale() as TLocale;
    const lessonNotesT = useTranslations('components.lessonNotes');
    const t = useTranslations('pages.enrolledCourse');
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
        return (
            <DefaultError
                type="simple"
                locale={locale}
                title={t('error.title')}
                description={t('error.description')}
            />
        );
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
        return (
            <DefaultError
                type="simple"
                locale={locale}
                title={t('error.title')}
                description={t('error.courseEmpty')}
            />
        );
    }

    return (
        <CourseSlugProvider courseSlug={courseSlug}>
            <div className="flex flex-col w-full gap-6 min-w-0">
                {/* Show/Hide Notes button - for students, hidden only when course is archived */}
                {!props.showArchivedBadge && props.enableSubmit && currentLesson && (
                    <div className="flex justify-end">
                        <Button
                            variant="secondary"
                            size="medium"
                            text={showNotes ? lessonNotesT('hideNotesText') : lessonNotesT('showNotesText')}
                            hasIconLeft
                            iconLeft={showNotes ? <IconEyeHide /> : <IconEyeShow />}
                            onClick={() => setShowNotes(!showNotes)}
                        />
                    </div>
                )}
                {/* Archived course banner - shown instead of notes button */}
                {props.showArchivedBadge && currentLesson && (
                    <Banner
                        style="warning"
                        icon
                        title={lessonNotesT('archivedBannerTitle')}
                        description={lessonNotesT('archivedBannerDescription')}
                    />
                )}

                <div className={`flex flex-col w-full gap-6 ${showNotes ? 'lg:flex-row' : 'md:flex-row'}`}>
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
                                        isArchived={props.isArchived}
                                    />
                                </Suspense>
                                <Divider className="my-6" />
                                <ModulePagination
                                    currentIndex={activeLessonIndex ?? 0}
                                    totalLessons={currentModule.lessons.length}
                                    onPrevious={handlePreviousLesson}
                                    onNext={handleNextLesson}
                                    locale={locale}
                                    className="justify-end"
                                />
                            </>
                        )}
                    </div>

                    {/* Lesson Notes Panel - only shown when notes are visible, hidden for archived courses */}
                    {showNotes && !props.showArchivedBadge && props.enableSubmit && currentLesson && (
                        <LessonNotesPanel lessonId={currentLesson.id} isArchived={props.isArchived} />
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
    isArchived,
    showArchivedBadge,
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
                isArchived={isArchived}
                showArchivedBadge={showArchivedBadge}
            />
        </Suspense>
    );
}
