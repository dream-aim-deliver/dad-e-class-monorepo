import { UserAvatar } from '../avatar/user-avatar';
import { Button } from '../button';
import { IconGroup } from '../icons';
import { IconCalendar } from '../icons/icon-calendar';
import { IconClock } from '../icons/icon-clock';
import { StarRating } from '../star-rating';
import {
  getDictionary,
  isLocalAware,
} from '@maany_shr/e-class-translations';


export interface ReviewCardProps extends isLocalAware {
  className?: string;
  rating: number;
  reviewerName: string;
  reviewerAvatar?: string;
  reviewText: string;
  workshopTitle: string;
  date: Date;
  time: string;
  courseTitle: string;
  courseImage: string;
  groupName?: string;
}
/**
* A reusable ReviewCard component that displays user reviews, ratings, and course details.
*
* @param className Optional additional CSS class names to customize the appearance.
* @param rating The rating given by the reviewer (out of 5).
* @param reviewerName The name of the reviewer.
* @param reviewerAvatar Optional URL of the reviewer's avatar image.
* @param reviewText The text content of the review.
* @param workshopTitle The title of the workshop associated with the review.
* @param date The date of the review or event.
* @param time The time of the review or event.
* @param courseTitle The title of the course related to the review.
* @param courseImage URL of the course's image.
* @param groupName Optional name of the group associated with the review.
* @param locale The locale used for translations.
*
* @example
* <ReviewCard
*   rating={4.5}
*   reviewerName="John Doe"
*   reviewerAvatar="https://example.com/avatar.jpg"
*   reviewText="This workshop was amazing! Learned a lot."
*   workshopTitle="React Mastery"
*   date="2024-09-10"
*   time="10:00 AM"
*   courseTitle="Advanced React"
*   courseImage="https://example.com/course.jpg"
*   groupName="React Enthusiasts"
*   locale="en"
* />
*/
export const ReviewCard: React.FC<ReviewCardProps> = ({
  className,
  rating,
  reviewerName,
  reviewerAvatar,
  reviewText,
  workshopTitle,
  date,
  time,
  courseTitle,
  courseImage,
  groupName,
  locale
}) => {
  const dictionary = getDictionary(locale);

  return (
    <div className={`w-full  p-3 bg-base-neutral-900 rounded-small border-1 border-base-neutral-700 ${className}`}>
      <div className='flex flex-col gap-3'>
        <div className='flex flex-col gap-2'>
          <div className="w-full flex items-center gap-4 truncate">
            <StarRating totalStars={5} rating={rating} size="4" />

            <div className="text-white flex items-center gap-1 flex-1 truncate">
              <span className='text-text-secondary'>{dictionary.components.coachReview.by}</span>
              <Button
                className="p-0 gap-1 text-sm max-w-3/4"
                size="small"
                variant="text"
                hasIconLeft
                iconLeft={<UserAvatar className="rounded-full" fullName={reviewerName} size="small" imageUrl={reviewerAvatar} />}
                text={reviewerName}

              />
            </div>
          </div>
          <p className="w-full text-text-primary leading-6 text-md">
            {reviewText}
          </p>
        </div>
      </div>
      <hr className="border-divider my-4" />
      <div className="flex flex-col gap-2" data-testid="footer-section">
        <p className="text-sm text-white leading-4 font-important truncate">{workshopTitle}</p>
        <div className="w-full flex items-center gap-3 flex-wrap text-text-secondary text-sm lg:text-md">
          <div className="flex gap-1 items-center">
            <IconCalendar size='4' />
            <p className="text-sm lg:text-md">{new Date(date).toISOString().split('T')[0]}</p>
          </div>
          <div className="flex gap-1 items-center">
            <IconClock size='4' />
            <p className="text-sm lg:text-md">{time}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            className='p-0 gap-1 text-sm  max-w-full'
            variant='text'
            size="small"
            hasIconLeft
            iconLeft={<UserAvatar fullName={courseTitle} imageUrl={courseImage} className='rounded-small' size="small" />}
            text={courseTitle}
          />
          {groupName && (
            <div className="flex gap-1 flex-wrap items-center">
              <div className="flex items-center gap-1">
                <IconGroup classNames="text-text-primary" size="5" />
                <p className="text-text-secondary text-sm">{dictionary.components.coachReview.group}</p>
              </div>
              <p className="text-sm text-text-primary font-bold">
                {groupName}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;