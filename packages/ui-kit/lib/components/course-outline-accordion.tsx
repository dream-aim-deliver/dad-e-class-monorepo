import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import {
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
    Accordion,
} from '../../lib/components/accordion';
import { ModuleHeader } from '../../lib/components/course-outline/module-header';
import { LessonLink } from '../../lib/components/course-outline/lesson-link';
import { LessonLinkItem } from '../../lib/components/course-outline/lesson-link-item';
import { useMemo } from 'react';
import { Milestone } from './course-outline/milestone';
import { cn } from '../utils/style-utils';

interface CourseLesson {
    id: number;
    title: string;
    order: number;
    optional?: boolean;
    completed?: boolean;
    updated?: boolean;
}

interface CourseMilestone {
    id: number;
    precedingLessonId: number;
    completed?: boolean;
}

export type CourseModule = {
    id: number;
    title: string;
    order: number;
    lessons: CourseLesson[];
    milestones: CourseMilestone[];
    completed?: boolean;
}

interface CourseOutlineAccordionProps extends isLocalAware {
    modules: CourseModule[];
    activeLessonId?: number;
    onLessonClick: (lessonId: number) => void;
    className?: string;
}

export function CourseOutlineAccordion({
    locale,
    modules,
    activeLessonId,
    onLessonClick,
    className,
}: CourseOutlineAccordionProps) {
    const dictionary = getDictionary(locale).components.courseOutline;

    const sortedModules = useMemo(() => {
        const sortedModules = [...modules].sort((a, b) => a.order - b.order);
        for (const module of sortedModules) {
            const sortedLessons = [...module.lessons].sort(
                (a, b) => a.order - b.order,
            );
            module.lessons = sortedLessons;
        }
        return sortedModules;
    }, [modules]);

    const milestonesMap = useMemo(() => {
        const milestonesMap: Record<number, CourseMilestone[]> = {};
        for (const module of sortedModules) {
            for (const lesson of module.lessons) {
                milestonesMap[lesson.id] = module.milestones.filter(
                    (m) => m.precedingLessonId === lesson.id,
                );
            }
        }
        return milestonesMap;
    }, [sortedModules]);

    return (
        <Accordion
            className={cn("flex flex-col gap-7 flex-shrink-0", className)}
            type="single"
            defaultValue={[sortedModules[0].title]}
        >
            <div className="w-full bg-card-fill rounded-medium border border-card-stroke p-4">
                <p className="text-md text-text-primary font-bold border-b border-divider pb-4">
                    {dictionary.title}
                </p>
                {sortedModules.map((module, moduleIndex) => {
                    return (
                        <AccordionItem
                            className="py-4 border-b border-divider"
                            key={`module-${module.id}`}
                            value={module.title}
                        >
                            <AccordionTrigger value={module.title}>
                                <ModuleHeader
                                    totalModules={modules.length}
                                    currentModule={moduleIndex + 1}
                                    moduleTitle={module.title}
                                    locale={locale}
                                />
                            </AccordionTrigger>
                            <AccordionContent
                                value={module.title}
                                className="pt-2"
                            >
                                <LessonLink key={`module-link-${module.id}`}>
                                    {module.lessons.map(
                                        (lesson, lessonIndex) => {
                                            const lessonLink = (
                                                <LessonLinkItem
                                                    key={`lesson-${module.id}-${lesson.id}`}
                                                    lessonTitle={lesson.title}
                                                    lessonNumber={
                                                        lessonIndex + 1
                                                    }
                                                    isCompleted={
                                                        lesson.completed
                                                    }
                                                    isActive={
                                                        lesson.id ===
                                                        activeLessonId
                                                    }
                                                    isOptional={lesson.optional}
                                                    isUpdated={lesson.updated}
                                                    locale={locale}
                                                    onClick={() =>
                                                        onLessonClick(lesson.id)
                                                    }
                                                />
                                            );
                                            const milestones =
                                                milestonesMap[lesson.id] || [];
                                            return (
                                                <div key={`lesson-container-${module.id}-${lesson.id}`}>
                                                    {lessonLink}
                                                    {milestones.map(
                                                        (milestone) => (
                                                            <div
                                                                className="py-2"
                                                                key={`milestone-${module.id}-${lesson.id}-${milestone.id}`}
                                                            >
                                                                <Milestone
                                                                    completed={
                                                                        milestone.completed ?? false
                                                                    }
                                                                    locale={
                                                                        locale
                                                                    }
                                                                />
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            );
                                        },
                                    )}
                                </LessonLink>
                            </AccordionContent>
                        </AccordionItem>
                    );
                })}
            </div>
        </Accordion>
    );
}
