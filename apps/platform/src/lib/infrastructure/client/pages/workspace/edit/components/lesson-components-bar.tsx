import { ComponentCard, Tabs } from '@maany_shr/e-class-ui-kit';
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
        <Tabs.Root defaultTab="simple">
            <Tabs.List className="flex overflow-auto bg-base-neutral-800 rounded-medium gap-2 mb-4">
                <Tabs.Trigger value="simple" isLast={false}>
                    {dictionary.components.lessonComponentBar.simpleText}
                </Tabs.Trigger>
                <Tabs.Trigger value="interactive" isLast={true}>
                    {dictionary.components.lessonComponentBar.interactiveText}
                </Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="simple">
                <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                        <span className="text-sm text-text-secondary">
                            {dictionary.components.lessonComponentBar.presentInformationText}
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
                </div>
            </Tabs.Content>

            <Tabs.Content value="interactive">
                <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                        <span className="text-sm text-text-secondary">
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
                </div>
            </Tabs.Content>
        </Tabs.Root>
    );
}
