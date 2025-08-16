import {
    IconLesson,
    IconMilestone,
    IconModule,
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

// TODO: Translate
// TODO: Add search functionality
// TODO: Add lesson templating
export default function EditCourseContent({ slug }: EditCourseContentProps) {
    const [modules, setModules] = useState<CourseModule[]>([]);

    const addModule = () => {
        const newModule: CourseModule = {};
        setModules([...modules, newModule]);
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
                        onClick={() => console.log('Course Structure clicked')}
                    />
                    <StructureComponent
                        name="Milestone"
                        icon={<IconMilestone />}
                        onClick={() => console.log('Course Structure clicked')}
                    />
                </div>
            </div>
            <div className="flex flex-col gap-4">
                {modules.map((module, index) => (
                    <div
                        key={`module-${index}`}
                        className="flex gap-3 bg-card-fill border border-base-neutral-700 rounded-lg p-4"
                    >
                        <div className="h-12 w-12 bg-base-neutral-700 border border-base-neutral-600 rounded-lg flex items-center justify-center">
                            <IconModule />
                        </div>
                        <InputField
                            value={module.title || ''}
                            inputText="Module title"
                            setValue={(value) => {
                                setModules((prev) => {
                                    const updated = [...prev];
                                    updated[index].title = value;
                                    return updated;
                                });
                            }}
                            className="w-full"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
