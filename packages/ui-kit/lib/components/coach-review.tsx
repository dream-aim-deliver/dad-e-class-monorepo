import { UserAvatar } from './avatar/user-avatar';
import { Button } from './button';
import { IconCalendar } from './icons/icon-calendar';
import { IconClock } from './icons/icon-clock';
import { StarRating } from './star-rating';
import {
  TLocale,
  getDictionary,
  isLocalAware,
} from '@maany_shr/e-class-translations';

/**
 * Props for the ReviewCard component.
 */
export interface ReviewCardProps extends isLocalAware {
  /** Additional class names for styling */
  className?: string;
  /** Rating value out of 5 */
  rating: number;
  /** Name of the reviewer */
  reviewerName: string;
  /** Avatar URL of the reviewer (optional) */
  reviewerAvatar?: string;
  /** Review text content */
  reviewText: string;
  /** Title of the workshop being reviewed */
  workshopTitle: string;
  /** Date of the workshop */
  date: string;
  /** Time of the workshop */
  time: string;
  /** Title of the related course */
  courseTitle: string;
  /** Image URL of the related course */
  courseImage: string;
}

/**
 * ReviewCard Component
 * 
 * Displays a review including rating, reviewer details, review text,
 * and information about the related workshop and course.
 *
 * @param {ReviewCardProps} props - The component properties.
 * @returns {JSX.Element} The rendered component.
 */
const ReviewCard: React.FC<ReviewCardProps> = ({
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
  locale
}) => {
  const dictionary = getDictionary(locale);

  return (
    <div className={`max-w-[390px] min-w-[348px] p-3 bg-base-neutral-900 rounded-small border-1 border-base-neutral-700 ${className}`}>
      <div className='flex flex-col gap-3'>
        <div className='flex flex-col gap-2'>
          {/* Reviewer Details */}
          <div className="w-full flex items-center gap-4 truncate">
            <StarRating totalStars={5} rating={rating} />
            <div className="text-white flex items-center gap-1 flex-1">
              <span className='text-text-secondary'>{dictionary.components.courseReview.by}</span>
              <Button
                className="p-0 gap-1 text-sm max-w-1/2"
                size="small"
                variant="text"
                hasIconLeft
                iconLeft={<UserAvatar className="rounded-full" hasProfilePicture size="small" imageUrl={reviewerAvatar} />}
                text={reviewerName}
                truncateText
              />
            </div>
          </div>
          {/* Review Content */}
          <p className="w-full text-text-primary leading-6 text-md">
            {reviewText}
          </p>
        </div>
      </div>
      {/* Divider */}
      <hr className="border-divider my-4" />
      {/* Workshop and Course Info */}
      <div className="flex flex-col gap-2" data-testid="footer-section">
        <p className="text-sm text-white leading-4 font-important truncate">{workshopTitle}</p>
        <div className="w-full flex items-center gap-3 text-text-secondary text-sm lg:text-md">
          <div className="flex gap-1 items-center">
            <IconCalendar size='4' />
            <p className="text-sm lg:text-md">{date}</p>
          </div>
          <div className="flex gap-1 items-center">
            <IconClock size='4' />
            <p className="text-sm lg:text-md">{time}</p>
          </div>
        </div>
        {/* Course Information */}
        <div className="flex items-center gap-1">
          <Button
            className='p-0 gap-1 text-sm'
           truncateText
            variant='text'
            size="small"
            hasIconLeft
            iconLeft={<UserAvatar hasProfilePicture imageUrl={courseImage} className='rounded-small' size="small" />}
            text={courseTitle}
          />
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;