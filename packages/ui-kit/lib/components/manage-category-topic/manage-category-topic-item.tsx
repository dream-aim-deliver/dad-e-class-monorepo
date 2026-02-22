import { Button } from '../button';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { Badge } from '../badge';
import { IconEdit } from '../icons/icon-edit';
import { IconTrashAlt } from '../icons/icon-trash-alt';
import { Divider } from '../..';

export interface ManageCategoryTopicItemProps extends isLocalAware {
    title: string;
    coursesCount: number;
    coachesCount?: number;
    type: 'category' | 'topic';
    onEdit: () => void;
    onDelete: () => void;
}

/**
 * `ManageCategoryTopicItem` displays a single topic/category item with its usage statistics
 * and action buttons for editing and deleting.
 *
 * The component shows:
 * - Title of the topic/category
 * - Badge with number of courses using it
 * - Optional badge with number of coaches using it
 * - Edit and Delete action buttons
 *
 * @param {ManageCategoryTopicItemProps} props - The properties for the component
 * @param {string} props.title - The title/name of the topic or category
 * @param {number} props.coursesCount - Number of courses using this item
 * @param {number} [props.coachesCount] - Optional number of coaches using this item
 * @param {() => void} props.onEdit - Callback when edit button is clicked
 * @param {() => void} props.onDelete - Callback when delete button is clicked
 * @param {string} props.locale - Locale for translations
 */
export const ManageCategoryTopicItem = ({
    title,
    coursesCount,
    coachesCount,
    type = 'category',
    locale,
    onEdit,
    onDelete,
}: ManageCategoryTopicItemProps) => {
    const dictionary = getDictionary(locale).components.manageCategoryTopicItem;

    const coursesText = dictionary.courses;
    const coachesText = dictionary.coaches;

    return (
        <div className='flex flex-col w-full'>
            <div className="flex flex-row items-center">
                {/* Left side: Title and badges */}
                <div className="flex flex-row items-center gap-2 flex-1">
                    <p className="text:md md:text-lg font-important text-text-primary">
                        {title}
                    </p>

                    {/* Courses badge */}
                    <Badge
                        variant="info"
                        size="medium"
                        text={`${coursesCount} ${coursesText}`}
                    />

                    {/* Coaches badge - only show for topics */}
                    {type === 'topic' && typeof coachesCount === 'number' && (
                        <Badge
                            variant="info"
                            size="medium"
                            text={`${coachesCount} ${coachesText}`}
                        />
                    )}
                </div>

                {/* Right side: Action buttons */}
                <div className="flex items-center -space-x-4">
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
            <Divider className='my-2'/>
        </div>
    );
};
