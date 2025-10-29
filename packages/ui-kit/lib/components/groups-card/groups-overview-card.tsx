import { FC } from 'react';
import { Button } from '../button';
import { UserAvatar } from '../avatar/user-avatar';
import { cn } from '../../utils/style-utils';
import { TLocale, getDictionary } from '@maany_shr/e-class-translations';
import { IconGroup, IconCourse, IconAccountInformation } from '../icons';

interface Course {
    image: string;
    title: string;
    slug: string;
}

interface Creator {
    name: string;
    image?: string;
}

export interface GroupOverviewCardDetails {
    groupName: string;
    currentStudents: number;
    totalStudents: number;
    course: Course;
    coach: {
        name: string;
        isCurrentUser: boolean;
    };
    creator: Creator;
}

type BaseGroupOverviewCardProps = {
    cardDetails?: GroupOverviewCardDetails;
    onClickCourse?: (slug: string) => void;
    className?: string;
    locale: TLocale;
    isAdmin?: boolean;
};

type GroupOverviewCardProps = BaseGroupOverviewCardProps & {
    onClickManage?: () => void;
};

export type { GroupOverviewCardProps };

/**
 * GroupOverviewCard component for displaying group information
 * 
 * @param cardDetails - The details of the group to be displayed
 * @param isAdmin - Whether the current user is an admin (shows manage button and sets coach as "You")
 * @param onClickManage - Callback for admin manage action
 * @param onClickCourse - Callback for clicking on course
 * @param className - Additional CSS classes
 * @param locale - The locale for translations
 */
const GroupOverviewCard: FC<GroupOverviewCardProps> = ({
    cardDetails,
    onClickCourse,
    className,
    locale,
    isAdmin = false,
    onClickManage,
}) => {
    if (!cardDetails) return null;

    const dictionary = getDictionary(locale);

    return (
        <div
            role="article"
            className={cn(
                'flex flex-col bg-card-fill gap-4 text-sm md:text-md border border-card-stroke p-4 rounded-lg text-text-secondary h-fit',
                className
            )}
        >
            {/* Header - Group Name */}
            <div className="flex flex-col gap-2">
                <h3 className="text-text-primary text-sm md:text-md leading-4 font-bold">
                    {cardDetails.groupName}
                </h3>

                {/* Student Count */}
                <div className="flex items-center gap-1">
                    <IconGroup size="4" className="flex-shrink-0" />
                    <span className="text-text-secondary text-sm">
                        {cardDetails.currentStudents}/{cardDetails.totalStudents} {dictionary.components.groupCard.students}
                    </span>
                </div>
            </div>

            {/* Course Information */}
            <div className="flex items-center gap-3">
                <IconCourse size="4" className="flex-shrink-0" />
                <span className="text-text-secondary text-sm">{dictionary.components.groupCard.course}</span>
                <Button
                    className="p-0 gap-1 text-sm truncate"
                    size="small"
                    title={cardDetails.course.title}
                    variant="text"
                    hasIconLeft
                    iconLeft={
                        <UserAvatar
                            fullName={cardDetails.course.title}
                            imageUrl={cardDetails.course.image}
                            className="rounded-small"
                            size="small"
                        />
                    }
                    text={cardDetails.course.title}
                    onClick={() => onClickCourse?.(cardDetails.course.slug)}
                />
            </div>

            {/* Coach Information - only show if admin */}
            {isAdmin && (
                <div className="flex items-center gap-2">
                    <span className="text-text-secondary text-sm">
                        {dictionary.components.groupCard.coach}
                    </span>
                    <span className="text-text-primary text-md">
                        {dictionary.components.groupCard.you}
                    </span>
                </div>
            )}

            {/* Creator Information - only show if not admin */}
            {!isAdmin && (
                <div className="flex items-center gap-2">
                    <IconAccountInformation size="4" className="flex-shrink-0" />
                    <span className="text-text-secondary text-sm">{dictionary.components.groupCard.createdBy}</span>
                    <div className="flex items-center gap-1">
                        <UserAvatar
                            fullName={cardDetails.creator.name}
                            imageUrl={cardDetails.creator.image}
                            className="rounded-small"
                            size="small"
                        />
                        <span className="text-text-secondary text-sm font-medium">
                            {cardDetails.creator.name}
                        </span>
                    </div>
                </div>
            )}

            {/* Action Button - only Manage button for admin */}
            {isAdmin && onClickManage && (
                <div className="mt-2">
                    <Button
                        variant="secondary"
                        size="medium"
                        onClick={onClickManage}
                        text={dictionary.components.groupCard.manage}
                        className="w-full"
                    />
                </div>
            )}
        </div>
    );
};

export { GroupOverviewCard };
export default GroupOverviewCard;