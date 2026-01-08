import { Button } from "../button";
import { IconChevronDown } from "../icons/icon-chevron-down";
import { IconChevronUp } from "../icons/icon-chevron-up";
import { IconMinus } from "../icons/icon-minus";
import { IconPlus } from "../icons/icon-plus";
import { IconTrashAlt } from "../icons/icon-trash-alt";
import { IconPaste } from "../icons/icon-paste";

interface ContentControlButtonsProps {
    onMoveUp?: () => void;
    onMoveDown?: () => void;
    onDelete: () => void;
    onDuplicate?: () => void;
    isExpanded?: boolean;
    onExpand?: () => void;
    isFirst: boolean;
    isLast: boolean;
}

export function ContentControlButtons({
    onMoveUp,
    onMoveDown,
    onDelete,
    onDuplicate,
    isExpanded = false,
    onExpand,
    isFirst,
    isLast,
}: ContentControlButtonsProps) {
    return (
        <div className="flex gap-2">
            <div className="flex items-center gap-2">
                <Button
                    variant="text"
                    iconLeft={<IconTrashAlt />}
                    hasIconLeft
                    onClick={() => onDelete()}
                    className="px-0"
                />
                {onDuplicate && (
                    <Button
                        variant="text"
                        iconLeft={<IconPaste />}
                        hasIconLeft
                        onClick={() => onDuplicate()}
                        className="px-0"
                    />
                )}
                {onMoveUp && <Button
                    variant="text"
                    iconLeft={<IconChevronUp />}
                    hasIconLeft
                    onClick={() => onMoveUp()}
                    disabled={isFirst}
                    className="px-0"
                />}
                {onMoveDown && <Button
                    variant="text"
                    iconLeft={<IconChevronDown />}
                    hasIconLeft
                    onClick={() => onMoveDown()}
                    disabled={isLast}
                    className="px-0"
                />}
                {onExpand && (
                    <Button
                        variant="text"
                        iconLeft={isExpanded ? <IconMinus /> : <IconPlus />}
                        hasIconLeft
                        onClick={() => onExpand()}
                        className="px-0"
                    />
                )}
            </div>
        </div>
    );
}