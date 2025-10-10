import { Button } from '../button';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { IconEdit } from '../icons/icon-edit';
import { IconTrashAlt } from '../icons/icon-trash-alt';

export interface ManageCoachingOfferingITemProps extends isLocalAware {
    title: string;
    onEdit: () => void;
    onDelete: () => void;
    durationMinutes: number;
    description: string;
    price: string;
}

export const ManageCoachingOfferingItem = ({
    title,
    locale,
    onEdit,
    onDelete,
    durationMinutes,
    description,
    price,
}: ManageCoachingOfferingITemProps) => {
    const dictionary = getDictionary(locale).components.manageCoachingOffering;

    return (
        <div className="flex flex-row w-full justify-between gap-1">
            <div className="flex flex-col items-start">
                {/* Left side: Title and descriptions */}
                <div className="flex flex-row items-center gap-2 flex-1">
                    <h6>{title}</h6>
                    <p className="text-text-secondary text-sm">
                        {' '}
                        {durationMinutes} {dictionary.minutes}{' '}
                    </p>
                </div>
                <p className="text-text-secondary text-sm"> {description} </p>
            </div>

            {/* Right side: Action buttons & prices */}
            <div className="flex items-center gap-2">
                <p className="text-text-primary text-sm font-important">
                    {price}
                </p>
                <Button
                    variant="text"
                    size="medium"
                    onClick={onEdit}
                    hasIconLeft
                    iconLeft={<IconEdit size="5" />}
                    text={dictionary.edit}
                />

                <Button
                    variant="text"
                    size="medium"
                    onClick={onDelete}
                    hasIconLeft
                    iconLeft={<IconTrashAlt size="5" />}
                    text={dictionary.delete}
                />
            </div>
        </div>
    );
};
