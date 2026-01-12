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


interface BaseReviewCardProps extends isLocalAware {
  className?: string;
  rating: number;
  reviewerName: string;
  reviewerAvatar?: string;
  reviewText: string;
  workshopTitle: string;
  date: Date;
  time: string;
  onClickReviewer?: () => void;
}

// Standalone coaching session (no course, no group)
interface ReviewCardStandalone extends BaseReviewCardProps {
  type: 'standalone';
}

// With course info (course-linked coaching session)
interface ReviewCardWithCourse extends BaseReviewCardProps {
  type: 'with-course';
  courseTitle: string;
  courseImage: string;
}

// With group info
interface ReviewCardWithGroup extends BaseReviewCardProps {
  type: 'with-group';
  groupName: string;
}

export type ReviewCardProps = ReviewCardStandalone | ReviewCardWithCourse | ReviewCardWithGroup;
/**
* A reusable ReviewCard component that displays user reviews, ratings, and session details.
* Supports three variants: standalone (no course/group), with-course, and with-group.
*
* @param type The type of review card: 'standalone' | 'with-course' | 'with-group'
* @param className Optional additional CSS class names to customize the appearance.
* @param rating The rating given by the reviewer (out of 5).
* @param reviewerName The name of the reviewer.
* @param reviewerAvatar Optional URL of the reviewer's avatar image.
* @param reviewText The text content of the review.
* @param workshopTitle The title of the workshop associated with the review.
* @param date The date of the review or event.
* @param time The time of the review or event.
* @param courseTitle The title of the course (only for type='with-course').
* @param courseImage URL of the course's image (only for type='with-course').
* @param groupName The name of the group (only for type='with-group').
* @param locale The locale used for translations.
*
* @example
* // Standalone coaching session review
* <ReviewCard
*   type="standalone"
*   rating={4.5}
*   reviewerName="John Doe"
*   reviewText="Great session!"
*   workshopTitle="Career Coaching"
*   date={new Date()}
*   time="10:00 AM"
*   locale="en"
* />
*
* @example
* // Course-linked coaching session review
* <ReviewCard
*   type="with-course"
*   rating={4.5}
*   reviewerName="John Doe"
*   reviewText="This workshop was amazing!"
*   workshopTitle="React Mastery"
*   date={new Date()}
*   time="10:00 AM"
*   courseTitle="Advanced React"
*   courseImage="https://example.com/course.jpg"
*   locale="en"
* />
*
* @example
* // Group coaching session review
* <ReviewCard
*   type="with-group"
*   rating={4.5}
*   reviewerName="John Doe"
*   reviewText="Learned a lot with the group!"
*   workshopTitle="Team Building"
*   date={new Date()}
*   time="2:00 PM"
*   groupName="React Enthusiasts"
*   locale="en"
* />
*/
export const ReviewCard: React.FC<ReviewCardProps> = (props) => {
  const {
    className,
    rating,
    reviewerName,
    reviewerAvatar,
    reviewText,
    workshopTitle,
    date,
    time,
    locale,
    onClickReviewer
  } = props;
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
                onClick={onClickReviewer}
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
        {props.type === 'with-course' && (
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              className='p-0 gap-1 text-sm max-w-full'
              variant='text'
              size="small"
              hasIconLeft
              iconLeft={<UserAvatar fullName={props.courseTitle} imageUrl={props.courseImage} className='rounded-small' size="small" />}
              text={props.courseTitle}
            />
          </div>
        )}
        {props.type === 'with-group' && (
          <div className="flex gap-1 flex-wrap items-center">
            <div className="flex items-center gap-1">
              <IconGroup classNames="text-text-primary" size="5" />
              <p className="text-text-secondary text-sm">{dictionary.components.coachReview.group}</p>
            </div>
            <p className="text-sm text-text-primary font-bold">
              {props.groupName}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewCard;