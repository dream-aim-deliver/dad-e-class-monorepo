import {
    ComponentCard,
    IconLesson,
    IconMilestone,
    IconModule,
} from '@maany_shr/e-class-ui-kit';
import { TLocale } from '@maany_shr/e-class-translations';
import { DefaultError, DefaultLoading } from '@maany_shr/e-class-ui-kit';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect } from 'react';
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

export default function EditCourseStructure({
    slug,
    isEdited,
    setIsEdited,
    modules,
    setModules,
    setCourseVersion,
}: EditCourseContentProps) {
    const locale = useLocale() as TLocale;
    const courseStructureViewModel = useCourseStructure(slug);
    const { expandedModuleIndex, setExpandedModuleIndex, onExpand } =
        useModuleExpansion();

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
            editor={modules.map((module, index) => (
                <ModuleEditor
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
                    locale={locale}
                />
            ))}
        />
    );
}
