'use client';

import { IconCalendar, IconClock } from './icons';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';


export interface GroupCoachingSessionBannerProps extends isLocalAware {
    title: string;
    date: Date;
    time: string;
    durationMinutes: number;
}

/**
 * A banner component that displays summary information about group coaching session.
 *
 * @param title - The title of the session
 * @param date - The date of the session
 * @param time - The time of the session
 * @param durationMinutes - The duration of the session in minutes
 * @param locale - The locale for translation and localization purposes
 *
 * @example
 * <ReviewCard
 *   title={"Session 1"}
 *   date={"2024-10-01"}
 *   time={"10:00 AM"}
 *   durationMinutes={60}
 *   locale={'en'}
 * />
 */
export const GroupCoachingSessionBanner: React.FC<GroupCoachingSessionBannerProps> = ({
    title,
    date,
    time,
    durationMinutes,
    locale
}) => {

    const dictionary = getDictionary(locale);

    return (
        <div className="flex p-3 gap-1 items-start flex-col bg-base-neutral-800 rounded-small border border-base-neutral-700 w-full">
            <div className='flex items-center justify-between w-full'>
                <h6 className='text-text-primary text-md font-bold '>
                    {title}
                </h6>
                <p className='text-text-primary text-xs font-bold'>
                    {durationMinutes} {dictionary.pages.groupWorkspaceCoach.sessionBanner.minutes}
                </p>
            </div>
            <div className="w-full flex items-center gap-3 flex-wrap">
                <div className="flex gap-1 items-center">
                <IconCalendar size='4' classNames='text-text-secondary'/>
                <p className="text-xs text-text-primary">{new Date(date).toISOString().split('T')[0]}</p>
                </div>
                <div className="flex gap-1 items-center">
                <IconClock size='4' classNames='text-text-secondary'/>
                <p className="text-xs text-text-primary">{time}</p>
                </div>
            </div>
        </div>
    );
};