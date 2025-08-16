export enum ContentType {
    Lesson = 'lesson',
    Milestone = 'milestone',
}

export interface CourseLesson {
    type: ContentType.Lesson;
    id?: number;
    title?: string;
    isExtraTraining: boolean;
}

export interface CourseMilestone {
    type: ContentType.Milestone;
    id?: number;
}

export interface CourseModule {
    id?: number;
    title?: string;
    content: (CourseLesson | CourseMilestone)[];
}

export interface EditCourseContentProps {
    slug: string;
}

export interface ModuleContentProps {
    content: (CourseLesson | CourseMilestone)[];
    onMoveContentUp: (contentIndex: number) => void;
    onMoveContentDown: (contentIndex: number) => void;
    onDeleteContent: (contentIndex: number) => void;
    onLessonTitleChange: (lessonIndex: number, newTitle: string) => void;
    onLessonExtraTrainingChange: (
        lessonIndex: number,
        extraTraining: boolean,
    ) => void;
}

export interface ModuleEditorProps {
    module: CourseModule;
    onUpdate: (updatedModule: CourseModule) => void;
    onDelete: () => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
    onMoveContentUp: (contentIndex: number) => void;
    onMoveContentDown: (contentIndex: number) => void;
    onDeleteContent: (contentIndex: number) => void;
    isExpanded: boolean;
    onExpand: () => void;
    isFirst: boolean;
    isLast: boolean;
    onLessonTitleChange: (index: number, title: string) => void;
    onLessonExtraTrainingChange: (
        index: number,
        isExtraTraining: boolean,
    ) => void;
}
