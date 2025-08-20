import { ComponentCard } from '@maany_shr/e-class-ui-kit';
import { LessonComponentButton } from '../types';

interface LessonComponentsBarProps {
    simpleComponentButtons: LessonComponentButton[];
    interactiveComponentButtons: LessonComponentButton[];
}

// TODO: Translate
export default function LessonComponentsBar({
    simpleComponentButtons,
    interactiveComponentButtons,
}: LessonComponentsBarProps) {
    return (
        <>
            <div className="flex flex-col gap-1">
                <span className="text-lg font-bold">Simple</span>
                <span className="text-sm text-text-secondary">
                    Used to present information.
                </span>
            </div>
            <div className="flex flex-col gap-2">
                {simpleComponentButtons.map((button, index) => (
                    <ComponentCard
                        key={index}
                        name={button.label}
                        icon={button.icon}
                        onClick={button.onClick}
                    />
                ))}
            </div>
            <div className="flex flex-col gap-1">
                <span className="text-lg font-bold">Interactive</span>
                <span className="text-sm text-text-secondary">
                    Require input from user.
                </span>
            </div>
            <div className="flex flex-col gap-2">
                {interactiveComponentButtons.map((button, index) => (
                    <ComponentCard
                        key={index}
                        name={button.label}
                        icon={button.icon}
                        onClick={button.onClick}
                    />
                ))}
            </div>
        </>
    );
}
