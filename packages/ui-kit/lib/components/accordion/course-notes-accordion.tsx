import React from 'react';
import { isLocalAware } from '@maany_shr/e-class-translations';
import { getDictionary } from '@maany_shr/e-class-translations';
import { viewModels } from '@maany_shr/e-class-models';
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
import { Button } from '../button';

/**
 * Props for the CourseNotesAccordion component
 */
interface CourseNotesAccordionProps extends isLocalAware {
    /** The course materials data containing modules and module count */
    data: viewModels.TStudentNotesSuccess;
    onClickViewLesson: (lessonId: string) => void;
    onDeserializationError: (message: string, error: Error) => void;
}

/**
 * CourseNotesAccordion Component - Displays course modules with lessons and materials
 * based on the actual course materials data structure.
 */
export const CourseNotesAccordion: React.FC<CourseNotesAccordionProps> = (
    props,
) => {
    const { data, locale, onClickViewLesson, onDeserializationError } = props;
    const { modules, moduleCount } = data;
    const dictionary = getDictionary(locale);

    return (
        <Accordion
            className={cn('flex flex-col gap-6')}
            type="multiple"
            defaultValue={modules?.[0]?.id ? [modules[0].id] : []}
        >
            {modules?.map((module, moduleIndex) => (
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
                            <h4 className="text-base-white md:text-2xl text-xl font-semibold">
                                {
                                    dictionary.components
                                        .courseMaterialsAccordion.module
                                }{' '}
                                {moduleIndex + 1} - {module.title}
                            </h4>
                        </div>
                    </AccordionTrigger>

                    <AccordionContent value={module.id!} className="pt-4 w-full">
                        {/* Lessons Accordion within Module */}
                        <div className="flex w-full">
                            <Accordion
                                type="multiple"
                                className="flex flex-col gap-4 w-full"
                                defaultValue={
                                    moduleIndex === 0 && module.lessons?.[0]?.id
                                        ? [module.lessons[0].id]
                                        : undefined
                                }
                            >
                                {module.lessons?.map((lesson, lessonIndex) => (
                                    <AccordionItem
                                        key={lesson.id}
                                        value={lesson.id!}
                                        className="bg-base-neutral-800 p-4 rounded-medium border border-base-neutral-700 w-full"
                                    >
                                        <AccordionTrigger
                                            value={lesson.id!}
                                            className="w-full"
                                            expandIcon={
                                                <span
                                                    title={
                                                        dictionary.components
                                                            .courseMaterialsAccordion
                                                            .expand
                                                    }
                                                    className="text-button-text-text"
                                                >
                                                    <IconChevronUp size="5" />
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
                                                    <IconChevronDown size="5" />
                                                </span>
                                            }
                                        >
                                            <div className="flex items-center gap-4 flex-1 justify-between">
                                                <h5>
                                                    {
                                                        dictionary.components
                                                            .courseMaterialsAccordion
                                                            .lesson
                                                    }{' '}
                                                    {modules
                                                        .slice(0, moduleIndex)
                                                        .reduce(
                                                            (sum, mod) =>
                                                                sum +
                                                                (mod.lessonCount ?? 0),
                                                            0,
                                                        ) +
                                                        (lessonIndex + 1)}{' '}
                                                    - {lesson.title}
                                                </h5>
                                                <Button
                                                    variant="text"
                                                    text={
                                                        dictionary.components
                                                            .lessonNotes
                                                            .viewLessonText
                                                    }
                                                    onClick={() =>
                                                        onClickViewLesson(
                                                            lesson.id!,
                                                        )
                                                    }
                                                    size="small"
                                                />
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent value={lesson.id!} className="w-full">
                                            <hr className="border-divider my-4" />
                                            <div className="text-text-secondary leading-[150%] w-full overflow-hidden pb-6">
                                                {lesson.notes && (
                                                    <RichTextRenderer
                                                        content={lesson.notes}
                                                        onDeserializationError={
                                                            onDeserializationError
                                                        }
                                                    />
                                                )}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
};
