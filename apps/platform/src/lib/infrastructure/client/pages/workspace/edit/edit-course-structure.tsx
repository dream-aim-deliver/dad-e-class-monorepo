import {
    Banner,
    ComponentCard,
    IconLesson,
    IconMilestone,
    IconModule,
    DuplicateLessonDialog,
} from '@maany_shr/e-class-ui-kit';
import { TLocale, getDictionary } from '@maany_shr/e-class-translations';
import { DefaultError, DefaultLoading } from '@maany_shr/e-class-ui-kit';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { ModuleEditor } from './components/module-editor';
import { EditCourseContentProps } from './types';
import { getModulesFromResponse } from './utils/transform-modules';
import {
    useContentOperations,
    useCourseStructure,
    useLessonOperations,
    useModuleExpansion,
    useModuleOperations,
} from './hooks/edit-structure-hooks';
import EditLayout from './components/edit-layout';
import { trpc } from '../../../trpc/cms-client';

export default function EditCourseStructure({
    slug,
    isEdited,
    setIsEdited,
    modules,
    setModules,
    setCourseVersion,
    courseStatus,
}: EditCourseContentProps) {
    const locale = useLocale() as TLocale;
    const dictionary = getDictionary(locale);
    const courseStructureViewModel = useCourseStructure(slug);
    const { expandedModuleIndex, setExpandedModuleIndex, onExpand } =
        useModuleExpansion();

    // Duplicate lesson dialog state
    const [isDuplicateDialogOpen, setIsDuplicateDialogOpen] = useState(false);
    const [selectedLessonIdForDuplicate, setSelectedLessonIdForDuplicate] =
        useState<number | null>(null);
    const [duplicateErrorMessage, setDuplicateErrorMessage] = useState<
        string | undefined
    >(undefined);
    const [showDuplicateSuccess, setShowDuplicateSuccess] = useState(false);

    // Duplicate lesson mutation
    const utils = trpc.useUtils();
    const duplicateMutation = trpc.duplicateLesson.useMutation();

    const moduleOperations = useModuleOperations({
        modules,
        setModules,
        setIsEdited,
        setExpandedModuleIndex,
    });

    const contentOperations = useContentOperations({
        modules,
        setModules,
        setIsEdited,
        expandedModuleIndex,
        setExpandedModuleIndex,
    });

    const lessonOperations = useLessonOperations({
        setModules,
        setIsEdited,
    });

    const handleDuplicateLessonClick = (lessonId: number) => {
        setSelectedLessonIdForDuplicate(lessonId);
        setDuplicateErrorMessage(undefined);
        setIsDuplicateDialogOpen(true);
    };

    const handleDuplicateConfirm = async (targetModuleId: number) => {
        if (selectedLessonIdForDuplicate === null) return;

        setDuplicateErrorMessage(undefined);

        try {
            const result = await duplicateMutation.mutateAsync({
                lessonId: selectedLessonIdForDuplicate,
                moduleId: targetModuleId,
            });

            if (!result.success) {
                setDuplicateErrorMessage(
                    dictionary.components.duplicateLessonDialog.errorMessage,
                );
                return;
            }

            // Invalidate course structure to refetch updated data
            utils.getCourseStructure.invalidate({ courseSlug: slug });

            // Expand target module
            const targetModuleIndex = modules.findIndex(
                (module) => module.id === targetModuleId,
            );
            if (targetModuleIndex !== -1) {
                setExpandedModuleIndex(targetModuleIndex);
            }

            // Close dialog and reset
            setIsDuplicateDialogOpen(false);
            setSelectedLessonIdForDuplicate(null);

            // Show success message and auto-dismiss after 5 seconds
            setShowDuplicateSuccess(true);
            setTimeout(() => setShowDuplicateSuccess(false), 5000);
        } catch {
            setDuplicateErrorMessage(
                dictionary.components.duplicateLessonDialog.errorMessage,
            );
        }
    };

    const editCourseTranslations = useTranslations('pages.editCourse');

    useEffect(() => {
        if (!courseStructureViewModel) return;
        if (courseStructureViewModel.mode !== 'default') return;
        setModules(getModulesFromResponse(courseStructureViewModel.data));
        setCourseVersion(courseStructureViewModel.data.courseVersion);
    }, [courseStructureViewModel, setModules, setCourseVersion]);

    if (!courseStructureViewModel) {
        return <DefaultLoading locale={locale} variant="minimal" />;
    }

    if (courseStructureViewModel.mode !== 'default') {
        return <DefaultError locale={locale} />;
    }

    return (
        <EditLayout
            panel={
                <>
                    <h5> {editCourseTranslations('componentsTitle')} </h5>
                    <div className="flex flex-col gap-2">
                        <ComponentCard
                            name={editCourseTranslations('module')}
                            icon={<IconModule />}
                            onClick={moduleOperations.addModule}
                        />
                        <ComponentCard
                            name={editCourseTranslations('lesson')}
                            icon={<IconLesson />}
                            onClick={contentOperations.addLesson}
                        />
                        <ComponentCard
                            name={editCourseTranslations('milestone')}
                            icon={<IconMilestone />}
                            onClick={contentOperations.addMilestone}
                        />
                    </div>
                </>
            }
            editor={
                <>
                    {showDuplicateSuccess && (
                        <Banner
                            style="success"
                            title={dictionary.components.duplicateLessonDialog.successMessage}
                            closeable={true}
                            onClose={() => setShowDuplicateSuccess(false)}
                        />
                    )}
                    {modules.map((module, index) => (
                        <ModuleEditor
                            index={index}
                            key={`module-${index}`}
                            module={module}
                            onUpdate={(updatedModule) =>
                                moduleOperations.updateModule(index, updatedModule)
                            }
                            onDelete={() => moduleOperations.deleteModule(index)}
                            onMoveUp={() => moduleOperations.moveModuleUp(index)}
                            onMoveDown={() => moduleOperations.moveModuleDown(index)}
                            onMoveContentUp={(contentIndex) =>
                                contentOperations.onMoveContentUp(index, contentIndex)
                            }
                            onMoveContentDown={(contentIndex) =>
                                contentOperations.onMoveContentDown(index, contentIndex)
                            }
                            onDeleteContent={(contentIndex) =>
                                contentOperations.onDeleteContent(index, contentIndex)
                            }
                            isExpanded={expandedModuleIndex === index}
                            onExpand={() => onExpand(index)}
                            isFirst={index === 0}
                            isLast={index === modules.length - 1}
                            onLessonTitleChange={(lessonIndex, title) =>
                                lessonOperations.onLessonTitleChange(
                                    index,
                                    lessonIndex,
                                    title,
                                )
                            }
                            onLessonExtraTrainingChange={(
                                lessonIndex,
                                isExtraTraining,
                            ) => {
                                lessonOperations.onExtraTrainingChange(
                                    index,
                                    lessonIndex,
                                    isExtraTraining,
                                );
                            }}
                            onDuplicateLesson={courseStatus === 'draft' ? handleDuplicateLessonClick : undefined}
                            locale={locale}
                        />
                    ))}
                    <DuplicateLessonDialog
                        isOpen={isDuplicateDialogOpen}
                        onOpenChange={setIsDuplicateDialogOpen}
                        modules={modules
                            .filter((m) => m.id !== undefined)
                            .map((m) => ({
                                id: m.id!,
                                title: m.title || dictionary.components.duplicateLessonDialog.selectModulePlaceholder,
                            }))}
                        onConfirm={handleDuplicateConfirm}
                        locale={locale}
                        isLoading={duplicateMutation.isPending}
                        errorMessage={duplicateErrorMessage}
                    />
                </>
            }
        />
    );
}
