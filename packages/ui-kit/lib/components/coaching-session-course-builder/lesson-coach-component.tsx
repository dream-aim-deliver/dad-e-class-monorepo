import { FC } from "react"
import { UserAvatar } from "../avatar/user-avatar";
import { StarRating } from "../star-rating";
import { Button } from "../button";
import { IconAccountInformation } from "../icons/icon-account-information";
import { IconCalendarAvailability } from "../icons/icon-calendar-availability";
import { getDictionary, isLocalAware } from "@maany_shr/e-class-translations";

export interface LessonCoachComponentProps extends isLocalAware {
    name: string;
    rating: number;
    imageUrl?: string;
    numberOfRatings: number;
    description: string;
    defaultCoach: boolean;
    nextAvailableDate?: string | null;
    onClickProfile: () => void;
    onClickBook: () => void;
};

/**
 * A component that displays information about a coach, including their name, rating, avatar, and description.
 * It also provides buttons to view the coach's profile or book a session.
 *
 * @param name The name of the coach.
 * @param rating The average rating of the coach (out of 5).
 * @param imageUrl The URL of the coach's avatar image (optional).
 * @param numberOfRatings The total number of ratings the coach has received.
 * @param description A brief description of the coach.
 * @param defaultCoach Indicates whether the coach is the default coach.
 * @param onClickProfile Callback function triggered when the "Profile" button is clicked.
 * @param onClickBook Callback function triggered when the "Book" button is clicked.
 * @param locale The locale for translation and localization purposes.
 *
 * @example
 * <LessonCoachComponent
 *   name="John Doe"
 *   rating={4.5}
 *   imageUrl="https://example.com/avatar.jpg"
 *   numberOfRatings={120}
 *   description="An experienced coach specializing in personal development."
 *   defaultCoach={true}
 *   onClickProfile={() => console.log('Profile clicked')}
 *   onClickBook={() => console.log('Book clicked')}
 *   locale="en"
 * />
 */

export const LessonCoachComponent: FC<LessonCoachComponentProps> = ({
    name,
    rating,
    imageUrl,
    numberOfRatings,
    description,
    defaultCoach,
    nextAvailableDate,
    onClickProfile,
    onClickBook,
    locale,
}) => {
    const dictionary = getDictionary(locale);
    return (
        <div className="flex flex-col p-4 gap-4 bg-base-neutral-800 border-1 border-base-neutral-700 rounded-medium items-start w-full">
            <div className="flex gap-2">
                <UserAvatar
                    imageUrl={imageUrl}
                    size="medium"
                    fullName={name}
                    className="shrink-0"
                />
                <div className="flex flex-col justify-between">
                    <p className="text-text-primary text-md leading-[120%] font-bold truncate">{name}</p>
                    <div className="flex w-full gap-1">
                        <StarRating totalStars={5} size={"4"} rating={rating} />
                        <div className="flex gap-1 items-end">
                            <p className="text-text-primary text-sm leading-[100%] font-bold">{rating}</p>
                            <p className="text-xs text-text-secondary font-bold leading-[100%]">({numberOfRatings})</p>
                        </div>
                    </div>
                </div>
            </div>
            <p className="text-text-secondary text-sm leading-[150%]">
                {description}
            </p>
            {nextAvailableDate && (
                <p className="flex items-center gap-1 text-feedback-success-primary">
                    <IconCalendarAvailability classNames='flex-shrink-0' size="4" />
                    <span className="truncate">
                        {dictionary.components.coachCard.nextAvailable}:{' '}
                        {new Date(nextAvailableDate).toLocaleDateString(locale, { month: 'short', day: 'numeric' })}
                    </span>
                </p>
            )}
            <div className="flex gap-4 w-full">
                <Button
                    variant="text"
                    size="medium"
                    hasIconLeft
                    iconLeft={<IconAccountInformation />}
                    text={dictionary.components.coachingSessionCourseBuilder.profileText}
                    onClick={onClickProfile}
                    className="p-0"
                />
                <Button
                    variant={defaultCoach ? "primary" : "secondary"}
                    size="medium"
                    text={dictionary.components.coachingSessionCourseBuilder.bookText}
                    onClick={onClickBook}
                    className="w-full"
                />
            </div>
        </div>
    )
};