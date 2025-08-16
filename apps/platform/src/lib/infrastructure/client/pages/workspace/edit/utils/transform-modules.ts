import { viewModels } from '@maany_shr/e-class-models';
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
