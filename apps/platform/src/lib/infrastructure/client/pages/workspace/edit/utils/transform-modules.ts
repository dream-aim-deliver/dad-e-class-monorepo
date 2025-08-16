import { useCaseModels, viewModels } from '@maany_shr/e-class-models';
import {
    ContentType,
    CourseLesson,
    CourseMilestone,
    CourseModule,
} from '../types';

export function getModulesFromResponse(
    viewModel: viewModels.TCourseStructureSuccess,
): CourseModule[] {
    return viewModel.modules.map((module) => {
        const content: (CourseLesson | CourseMilestone)[] = [];
        module.lessons.forEach((lesson) => {
            content.push({
                type: ContentType.Lesson,
                id: lesson.id,
                title: lesson.title,
                isExtraTraining: lesson.extraTraining,
            });
        });
        module.milestones.forEach((milestone) => {
            const precedingLessonIndex = content.findIndex(
                (item) =>
                    item.type === ContentType.Lesson &&
                    item.id === milestone.precedingLessonId,
            );
            content.splice(precedingLessonIndex + 1, 0, {
                type: ContentType.Milestone,
                id: milestone.id,
            });
        });
        return {
            ...module,
            content,
        };
    });
}

type RequestModules = useCaseModels.TSaveCourseStructureRequest['modules'];

// TODO: Define custom error types for module validation and lesson validation

export function getRequestFromModules(modules: CourseModule[]): RequestModules {
    const requestModules: RequestModules = [];

    for (let moduleIndex = 0; moduleIndex < modules.length; moduleIndex++) {
        const module = modules[moduleIndex];
        if (!module.title) {
            throw new Error(
                `Module at position ${moduleIndex + 1} doesn't have a title`,
            );
        }

        const requestModule: RequestModules[number] = {
            id: module.id,
            title: module.title || '',
            lessons: [],
            milestones: [],
            order: moduleIndex + 1,
        };

        for (
            let contentIndex = 0;
            contentIndex < module.content.length;
            contentIndex++
        ) {
            const item = module.content[contentIndex];
            const order = contentIndex + 1;
            if (item.type === ContentType.Lesson) {
                if (!item.title) {
                    throw new Error(
                        `Lesson at position ${contentIndex + 1} within module ${moduleIndex + 1} doesn't have a title`,
                    );
                }
                requestModule.lessons.push({
                    id: item.id,
                    title: item.title || '',
                    isExtraTraining: item.isExtraTraining,
                    order: order,
                });
            } else if (item.type === ContentType.Milestone) {
                requestModule.milestones.push({
                    id: item.id,
                    order: order,
                });
            }
        }

        requestModules.push(requestModule);
    }

    return requestModules;
}
