import {
    ContentControlButtons,
    IconMilestone,
} from '@maany_shr/e-class-ui-kit';
import { CourseMilestone } from '../types';
import { getDictionary, TLocale } from '@maany_shr/e-class-translations';

interface MilestoneItemProps {
    milestone: CourseMilestone;
    onMoveUp: () => void;
    onMoveDown: () => void;
    onDelete: () => void;
    isFirst: boolean;
    isLast: boolean;
    locale: TLocale;
}

export function MilestoneItem({
    milestone,
    onMoveUp,
    onMoveDown,
    onDelete,
    isFirst,
    isLast,
    locale,
}: MilestoneItemProps) {
    const dictionary = getDictionary(locale);

    return (
        <div className="flex gap-4 items-center bg-card-fill border border-base-neutral-700 rounded-lg px-4 py-2">
            <IconMilestone />
            <span className="font-bold w-full">{dictionary.components.milestone.milestoneText}</span>
            <ContentControlButtons
                onMoveUp={onMoveUp}
                onMoveDown={onMoveDown}
                onDelete={onDelete}
                isFirst={isFirst}
                isLast={isLast}
            />
        </div>
    );
}
