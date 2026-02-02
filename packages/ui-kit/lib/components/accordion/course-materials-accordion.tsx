import React, { useEffect, useRef } from 'react';
import { isLocalAware } from '@maany_shr/e-class-translations';
import { getDictionary } from '@maany_shr/e-class-translations';
import { viewModels, useCaseModels } from '@maany_shr/e-class-models';
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from './index';
import { IconChevronUp } from '../icons/icon-chevron-up';
import { IconChevronDown } from '../icons/icon-chevron-down';
import { cn } from '../../utils/style-utils';
import RichTextRenderer from '../rich-text-element/renderer';
import { LinkPreview } from '../links';
import { FilePreview } from '../drag-and-drop-uploader/file-preview';
import { IconCloudDownload } from '../icons';

/**
 * Props for the CourseMaterialsAccordion component
 */
interface CourseMaterialsAccordionProps extends isLocalAware {
    /** The course materials data containing modules and module count */
    data: viewModels.TCourseMaterialsListSuccess;
    /** Optional lesson ID to auto-expand and scroll to (for deep-linking) */
    expandLessonId?: string;
}

/**
 * CourseMaterialsAccordion Component - Displays course modules with lessons and materials
 * based on the actual course materials data structure.
 */
export const CourseMaterialsAccordion: React.FC<
    CourseMaterialsAccordionProps
> = (props) => {
    const { data, locale, expandLessonId } = props;
    const { modules, moduleCount } = data;
    const dictionary = getDictionary(locale);
    const scrollRef = useRef<boolean>(false);

    // Filter modules to only include those with lessons that have materials
    const modulesWithMaterials = modules?.map(module => ({
        ...module,
        lessons: module.lessons?.filter(lesson =>
            lesson.materials && lesson.materials.length > 0
        ) || [],
    })).filter(module => module.lessons.length > 0);

    // Find the module that contains the target lesson for deep-linking
    const targetModuleId = expandLessonId
        ? modulesWithMaterials?.find(m => m.lessons?.some(l => l.id === expandLessonId))?.id
        : undefined;

    // Scroll the target lesson into view after initial render
    useEffect(() => {
        if (expandLessonId && targetModuleId && !scrollRef.current) {
            scrollRef.current = true;
            const timer = setTimeout(() => {
                const element = document.getElementById(`lesson-material-${expandLessonId}`);
                element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [expandLessonId, targetModuleId]);

    const renderMaterial = (material: useCaseModels.TCourseMaterial) => {
        switch (material.type) {
            case 'richText':
                return (
                    <div key={material.id}>
                        <RichTextRenderer
                            content={material.text || ''}
                            onDeserializationError={(message, error) => {
                                console.error(
                                    'Error deserializing rich text:',
                                    message,
                                    error,
                                );
                            }}
                            className="text-text-secondary leading-normal [&_ol]:ml-2 [&_ol_li]:mb-3"
                        />
                    </div>
                );
            case 'links':
                return (
                    <div key={material.id}>
                        <h4>
                            {
                                dictionary.components.courseMaterialsAccordion
                                    .usefulLinks
                            }
                        </h4>
                        <div className="p-4 border border-base-neutral-700 rounded-medium mb-4">
                            {material.links?.map((link: any, idx: number) => (
                                <LinkPreview
                                    key={idx}
                                    title={link.title}
                                    url={link.url}
                                    preview={false}
                                />
                            ))}
                        </div>
                    </div>
                );
            case 'downloadFiles':
                return (
                    <div key={material.id}>
                        <span className="flex items-center gap-2 mb-2">
                            <IconCloudDownload classNames="text-text-primary" />{' '}
                            <p className="font-important md:text-md text-sm text-text-primary">
                                {
                                    dictionary.components
                                        .courseMaterialsAccordion.downloadFiles
                                }
                            </p>
                        </span>
                        <div className="px-4 border border-base-neutral-700 rounded-medium mb-4">
                            {material.files?.map((file: any, idx: number) => (
                                <FilePreview
                                    key={idx}
                                    uploadResponse={{
                                        id: file.id || `file-${idx}`,
                                        name: file.name,
                                        size: file.size || 0,
                                        category: 'generic',
                                        status: 'available',
                                        url: file.downloadUrl,
                                    }}
                                    onDownload={(id) =>
                                        window.open(file.downloadUrl, '_blank')
                                    }
                                    deletion={{ isAllowed: false }}
                                    readOnly={true}
                                    locale={locale}
                                />
                            ))}
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <Accordion
            className={cn('flex flex-col gap-6')}
            type="multiple"
            defaultValue={
                targetModuleId ? [targetModuleId]
                : modulesWithMaterials?.[0]?.id ? [modulesWithMaterials[0].id]
                : []
            }
        >
            {modulesWithMaterials?.map((module, moduleIndex) => {
                return (
                <AccordionItem
                    key={module.id}
                    value={module.id!}
                    className="bg-card-fill border border-card-stroke px-6 py-4 rounded-medium"
                >
                    <AccordionTrigger
                        value={module.id!}
                        className="w-full"
                        expandIcon={
                            <span
                                title={
                                    dictionary.components
                                        .courseMaterialsAccordion.expand
                                }
                                className="text-button-text-text"
                            >
                                <IconChevronUp size="6" />
                            </span>
                        }
                        collapseIcon={
                            <span
                                title={
                                    dictionary.components
                                        .courseMaterialsAccordion.collapse
                                }
                                className="text-button-text-text"
                            >
                                <IconChevronDown size="6" />
                            </span>
                        }
                    >
                        <div className="flex items-center gap-4 flex-1">
                            <h3>{module.title}</h3>
                            <span className="text-text-secondary text-xs md:text-sm">
                                {moduleIndex + 1}/{moduleCount}{' '}
                                {
                                    dictionary.components
                                        .courseMaterialsAccordion.module
                                }
                            </span>
                        </div>
                    </AccordionTrigger>

                    <AccordionContent value={module.id!} className="pt-4">
                        {/* Lessons Accordion within Module */}
                        <div>
                            <Accordion
                                type="multiple"
                                className="flex flex-col gap-4"
                                defaultValue={
                                    targetModuleId === module.id && expandLessonId ? [expandLessonId]
                                    : moduleIndex === 0 && module.lessons?.[0]?.id ? [module.lessons[0].id]
                                    : undefined
                                }
                            >
                                {module.lessons?.map((lesson, lessonIndex) => (
                                    <AccordionItem
                                        key={lesson.id}
                                        value={lesson.id!}
                                        id={`lesson-material-${lesson.id}`}
                                        className="bg-base-neutral-800 p-4 rounded-medium border border-base-neutral-700"
                                    >
                                        <AccordionTrigger
                                            value={lesson.id!}
                                            expandIcon={
                                                <span
                                                    title={
                                                        dictionary.components
                                                            .courseMaterialsAccordion
                                                            .expand
                                                    }
                                                    className="text-button-text-text"
                                                >
                                                    <IconChevronUp size="6" />
                                                </span>
                                            }
                                            collapseIcon={
                                                <span
                                                    title={
                                                        dictionary.components
                                                            .courseMaterialsAccordion
                                                            .collapse
                                                    }
                                                    className="text-button-text-text"
                                                >
                                                    <IconChevronDown size="6" />
                                                </span>
                                            }
                                        >
                                            <div className="flex items-center gap-4 flex-1">
                                                <h4>{lesson.title}</h4>
                                                <span className="text-text-secondary text-xs md:text-sm">
                                                    {lessonIndex + 1}/
                                                    {module.lessonCount}{' '}
                                                    {
                                                        dictionary.components
                                                            .courseMaterialsAccordion
                                                            .lesson
                                                    }
                                                </span>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent value={lesson.id!}>
                                            <hr className="border-divider my-4" />
                                            <div className="flex flex-col gap-4 pb-6">
                                                {lesson.materials?.map(
                                                    (material) =>
                                                        renderMaterial(
                                                            material,
                                                        ),
                                                )}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    </AccordionContent>
                </AccordionItem>
                );
            })}
        </Accordion>
    );
};
