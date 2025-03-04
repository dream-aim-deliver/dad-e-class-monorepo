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
interface ReviewCardProps extends isLocalAware {
  className?: string;
  rating: number;
  reviewerName: string;
  reviewerAvatar?: string;
  reviewText: string;
  workshopTitle: string;
  date: string;
  time: string;
  courseTitle: string;
  courseImage: string;
};





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
    <div className={`max-w-[390px] min-w-[348px] p-4 bg-card-fill rounded-small border-1 border-card-stroke ${className}`}>
      <div className='flex flex-col gap-3'>
        <div className='flex flex-col gap-2'>
          <div className="w-full flex items-center gap-4 truncate">
            <StarRating rating={rating} />
            <div className="text-white flex items-center gap-1 flex-1">
              <span className='text-text-secondary'>by</span>
              <Button
                className="p-0 gap-1 text-sm"
                variant="text"
                hasIconLeft
                iconLeft={<UserAvatar className="rounded-full" size="small" imageUrl={reviewerAvatar} />}
                text={reviewerName}
              />
            </div>
          </div>
          <p className="w-full text-text-primary leading-6 md:text-xl">
            {reviewText}
          </p>
        </div>
      </div>
      <hr className="border-divider my-4" />
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
        <div className="flex items-center gap-1">
          <Button
            className='p-0 gap-1 text-sm'
            variant='text'
            hasIconLeft
            iconLeft={<UserAvatar imageUrl={courseImage} className='rounded-small' size="small" />}
            text={courseTitle}
          />
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
