import {
    Button,
    IconChevronDown,
    IconChevronUp,
    IconLesson,
    IconMilestone,
    IconMinus,
    IconModule,
    IconPlus,
    IconTrashAlt,
    InputField,
} from '@maany_shr/e-class-ui-kit';
import { useState } from 'react';

interface EditCourseContentProps {
    slug: string;
}

interface StructureComponentProps {
    name: string;
    icon: React.ReactNode;
    onClick?: () => void;
}

function StructureComponent({ name, icon, onClick }: StructureComponentProps) {
    return (
        <div
            className="flex items-center gap-2 bg-base-neutral-800 border border-base-neutral-700 rounded-lg p-4 cursor-pointer"
            onClick={onClick}
        >
            {icon}
            <span className="text-lg">{name}</span>
        </div>
    );
}

interface CourseLesson {
    id?: number;
    title?: string;
    isExtraTraining: boolean;
}

interface CourseMilestone {
    id?: number;
}

interface CourseModule {
    id?: number;
    title?: string;
    lessons: CourseLesson[];
    milestones: CourseMilestone[];
}

interface ModuleContentProps {
    lessons: CourseLesson[];
    milestones: CourseMilestone[];
}

function MilestoneItem({ milestone }: { milestone: CourseMilestone }) {
    return (
        <div className="flex gap-2 items-center bg-card-fill border border-base-neutral-700 rounded-lg p-3">
            <IconMilestone />
            <span className="font-bold">Milestone</span>
        </div>
    );
}

function ModuleContents({ lessons, milestones }: ModuleContentProps) {
    const isEmpty = lessons.length === 0 && milestones.length === 0;

    return (
        <div className="flex flex-col gap-2 ml-4">
            {isEmpty && (
                <div className=" flex flex-col gap-2 bg-card-fill border border-base-neutral-700 rounded-lg p-4">
                    <span className="text-text-secondary">
                        Add lessons or milestones
                    </span>
                </div>
            )}
            {milestones.map((milestone, index) => (
                <MilestoneItem
                    key={`milestone-${index}`}
                    milestone={milestone}
                />
            ))}
        </div>
    );
}

interface ModuleEditorProps {
    module: CourseModule;
    index: number;
    onUpdate: (index: number, updatedModule: CourseModule) => void;
    onDelete: (index: number) => void;
    onMoveUp: (index: number) => void;
    onMoveDown: (index: number) => void;
    isExpanded: boolean;
    onExpand: () => void;
    isFirst: boolean;
    isLast: boolean;
}

export function ModuleEditor({
    module,
    index,
    onUpdate,
    onDelete,
    onMoveUp,
    onMoveDown,
    isExpanded,
    onExpand,
    isFirst,
    isLast,
}: ModuleEditorProps) {
    const handleTitleChange = (value: string) => {
        onUpdate(index, { ...module, title: value });
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-4 bg-card-fill border border-base-neutral-700 rounded-lg p-4">
                <div className="flex items-center gap-4 flex-1">
                    <div className="h-12 w-12 flex-shrink-0 bg-base-neutral-700 border border-base-neutral-600 rounded-lg flex items-center justify-center">
                        <IconModule />
                    </div>
                    <InputField
                        value={module.title || ''}
                        inputText="Module title"
                        setValue={handleTitleChange}
                        className="w-full font-bold"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="text"
                        iconLeft={<IconTrashAlt />}
                        hasIconLeft
                        onClick={() => onDelete(index)}
                        className="px-0"
                    />
                    <Button
                        variant="text"
                        iconLeft={<IconChevronUp />}
                        hasIconLeft
                        onClick={() => onMoveUp(index)}
                        disabled={isFirst}
                        className="px-0"
                    />
                    <Button
                        variant="text"
                        iconLeft={<IconChevronDown />}
                        hasIconLeft
                        onClick={() => onMoveDown(index)}
                        disabled={isLast}
                        className="px-0"
                    />
                    <Button
                        variant="text"
                        iconLeft={isExpanded ? <IconMinus /> : <IconPlus />}
                        hasIconLeft
                        onClick={onExpand}
                        className="px-0"
                    />
                </div>
            </div>
            {isExpanded && (
                <ModuleContents
                    lessons={module.lessons}
                    milestones={module.milestones}
                />
            )}
        </div>
    );
}

// TODO: Translate
// TODO: Add search functionality
// TODO: Add lesson templating
export default function EditCourseContent({ slug }: EditCourseContentProps) {
    const [modules, setModules] = useState<CourseModule[]>([]);
    const [expandedModuleIndex, setExpandedModuleIndex] = useState<
        number | null
    >(null);

    const addModule = () => {
        const newModule: CourseModule = {
            lessons: [],
            milestones: [],
        };
        setModules([...modules, newModule]);
    };

    const updateModule = (index: number, updatedModule: CourseModule) => {
        setModules((prev) => {
            const updated = [...prev];
            updated[index] = updatedModule;
            return updated;
        });
    };

    const deleteModule = (index: number) => {
        setModules((prev) => prev.filter((_, i) => i !== index));
    };

    const moveModuleUp = (index: number) => {
        if (index === 0) return;

        setModules((prev) => {
            const updated = [...prev];
            [updated[index - 1], updated[index]] = [
                updated[index],
                updated[index - 1],
            ];
            return updated;
        });

        setExpandedModuleIndex(null);
    };

    const moveModuleDown = (index: number) => {
        setModules((prev) => {
            if (index === prev.length - 1) return prev;

            const updated = [...prev];
            [updated[index], updated[index + 1]] = [
                updated[index + 1],
                updated[index],
            ];
            return updated;
        });

        setExpandedModuleIndex(null);
    };

    const addLesson = () => {
        let moduleIndex = expandedModuleIndex;
        if (moduleIndex === null) {
            setExpandedModuleIndex(0);
            moduleIndex = 0;
        }

        const newLesson: CourseLesson = {
            isExtraTraining: false,
        };
        setModules((prev) => {
            const updated = [...prev];
            updated[moduleIndex].lessons.push(newLesson);
            return updated;
        });
    };

    const addMilestone = () => {
        let moduleIndex = expandedModuleIndex;
        if (moduleIndex === null) {
            setExpandedModuleIndex(0);
            moduleIndex = 0;
        }

        const newMilestone: CourseMilestone = {};
        setModules((prev) => {
            const updated = [...prev];
            updated[moduleIndex].milestones.push(newMilestone);
            return updated;
        });
    };

    return (
        <div className="flex lg:flex-row flex-col gap-4 text-text-primary">
            <div className="h-fit flex flex-col gap-3 bg-card-fill border border-base-neutral-700 rounded-lg p-4 lg:w-[300px] w-full">
                <span className="text-lg font-bold">Components</span>
                <div className="flex flex-col gap-2">
                    <StructureComponent
                        name="Module"
                        icon={<IconModule />}
                        onClick={addModule}
                    />
                    <StructureComponent
                        name="Lesson"
                        icon={<IconLesson />}
                        onClick={addLesson}
                    />
                    <StructureComponent
                        name="Milestone"
                        icon={<IconMilestone />}
                        onClick={addMilestone}
                    />
                </div>
            </div>
            <div className="flex flex-col gap-2 flex-1">
                {modules.map((module, index) => (
                    <ModuleEditor
                        key={`module-${index}`}
                        module={module}
                        index={index}
                        onUpdate={updateModule}
                        onDelete={deleteModule}
                        onMoveUp={moveModuleUp}
                        onMoveDown={moveModuleDown}
                        isExpanded={expandedModuleIndex === index}
                        onExpand={() => {
                            if (expandedModuleIndex === index) {
                                setExpandedModuleIndex(null);
                            } else {
                                setExpandedModuleIndex(index);
                            }
                        }}
                        isFirst={index === 0}
                        isLast={index === modules.length - 1}
                    />
                ))}
            </div>
        </div>
    );
}
