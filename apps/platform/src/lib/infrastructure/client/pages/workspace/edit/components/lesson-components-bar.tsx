import { ComponentCard } from '@maany_shr/e-class-ui-kit';
import { LessonComponentButton } from '../types';
import { getDictionary, TLocale } from '@maany_shr/e-class-translations';

interface LessonComponentsBarProps {
    simpleComponentButtons: LessonComponentButton[];
    interactiveComponentButtons: LessonComponentButton[];
    locale: TLocale;
}

export default function LessonComponentsBar({
    simpleComponentButtons,
    interactiveComponentButtons,
    locale,
}: LessonComponentsBarProps) {
    const dictionary = getDictionary(locale);

    return (
        <>
            <div className="flex flex-col gap-1">
                <span className="text-lg font-bold">{dictionary.components.lessonComponentBar.simpleText}</span>
                <span className="text-md text-text-secondary">
                    {dictionary.components.lessonComponentBar.presentInformationText}
                </span>
            </div>
            <div className="flex flex-col gap-2 pb-3">
                {simpleComponentButtons.map((button, index) => (
                    <ComponentCard
                        key={index}
                        name={button.label}
                        icon={button.icon}
                        onClick={button.onClick}
                    />
                ))}
            </div>
            <div className="flex flex-col">
                <span className="text-lg font-bold">{dictionary.components.lessonComponentBar.interactiveText}</span>
                <span className="text-md text-text-secondary">
                    {dictionary.components.lessonComponentBar.requireInputText}
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
