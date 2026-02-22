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

interface Coach {
    name: string;
    isCurrentUser: boolean;
    avatarUrl?: string;
}

export interface GroupOverviewCardDetails {
    groupId: number;
    groupName: string;
    currentStudents: number;
    totalStudents?: number;
    course: Course;
    coaches: Coach[];
}

type BaseGroupOverviewCardProps = {
    cardDetails?: GroupOverviewCardDetails;
    onClickCourse?: (slug: string) => void;
    className?: string;
    locale: TLocale;
};

type GroupOverviewCardProps = BaseGroupOverviewCardProps & {
    onClickManage?: () => void;
};

export type { GroupOverviewCardProps };

/**
 * GroupOverviewCard component for displaying group information
 *
 * @param cardDetails - The details of the group to be displayed
 * @param onClickManage - Callback for manage action (shown if current user is a coach)
 * @param onClickCourse - Callback for clicking on course
 * @param className - Additional CSS classes
 * @param locale - The locale for translations
 */
const GroupOverviewCard: FC<GroupOverviewCardProps> = ({
    cardDetails,
    onClickCourse,
    className,
    locale,
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
                        {cardDetails.totalStudents != null
                            ? `${cardDetails.currentStudents}/${cardDetails.totalStudents} ${dictionary.components.groupCard.students}`
                            : `${cardDetails.currentStudents} ${dictionary.components.groupCard.students}`}
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

            {/* Coaches Information */}
            {cardDetails.coaches && cardDetails.coaches.length > 0 && (
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <IconAccountInformation size="4" className="flex-shrink-0" />
                        <span className="text-text-secondary text-sm">
                            {dictionary.components.groupCard.coaches}
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-2 ml-6">
                        {cardDetails.coaches.map((coach, index) => (
                            <div key={index} className="flex items-center gap-1">
                                <UserAvatar
                                    fullName={coach.name}
                                    imageUrl={coach.avatarUrl}
                                    className="rounded-small"
                                    size="small"
                                />
                                <span className={cn(
                                    "text-sm font-medium",
                                    coach.isCurrentUser ? "text-text-primary" : "text-text-secondary"
                                )}>
                                    {coach.isCurrentUser ? dictionary.components.groupCard.you : coach.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Action Button - only Manage button if current user is a coach */}
            {cardDetails.coaches?.some(coach => coach.isCurrentUser) && onClickManage && (
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