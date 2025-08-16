import {
    Button,
    IconChevronDown,
    IconChevronUp,
    IconLesson,
    IconMilestone,
    IconModule,
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

interface CourseModule {
    id?: number;
    title?: string;
}

interface ModuleEditorProps {
    module: CourseModule;
    index: number;
    onUpdate: (index: number, updatedModule: CourseModule) => void;
    onDelete: (index: number) => void;
    onMoveUp: (index: number) => void;
    onMoveDown: (index: number) => void;
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
    isFirst,
    isLast,
}: ModuleEditorProps) {
    const handleTitleChange = (value: string) => {
        onUpdate(index, { ...module, title: value });
    };

    return (
        <div className="flex items-center justify-between gap-4 bg-card-fill border border-base-neutral-700 rounded-lg p-4">
            <div className="flex items-center gap-4 flex-1">
                <div className="h-12 w-12 flex-shrink-0 bg-base-neutral-700 border border-base-neutral-600 rounded-lg flex items-center justify-center">
                    <IconModule />
                </div>
                <InputField
                    value={module.title || ''}
                    inputText="Module title"
                    setValue={handleTitleChange}
                    className="w-full"
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
            </div>
        </div>
    );
}

// TODO: Translate
// TODO: Add search functionality
// TODO: Add lesson templating
export default function EditCourseContent({ slug }: EditCourseContentProps) {
    const [modules, setModules] = useState<CourseModule[]>([]);

    const addModule = () => {
        const newModule: CourseModule = {};
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
    };

    return (
        <div className="flex lg:flex-row flex-col gap-4 text-text-primary">
            <div className="flex flex-col gap-3 bg-card-fill border border-base-neutral-700 rounded-lg p-4 lg:w-[300px] w-full">
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
                        onClick={() => console.log('Lesson clicked')}
                    />
                    <StructureComponent
                        name="Milestone"
                        icon={<IconMilestone />}
                        onClick={() => console.log('Milestone clicked')}
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
                        isFirst={index === 0}
                        isLast={index === modules.length - 1}
                    />
                ))}
            </div>
        </div>
    );
}
