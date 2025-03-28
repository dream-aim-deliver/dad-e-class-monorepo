import * as React from 'react';
import { Button } from '../../button';
import { CourseStats } from '../course-stats';
import { CourseCreator } from '../course-creator';
import { StarRating } from '../../star-rating';
import { course } from '@maany_shr/e-class-models';
import { getDictionary, TLocale } from '@maany_shr/e-class-translations';

// Extend the existing type with the properties we need that aren't in TCourseMetadata
export interface VisitorCourseCardProps extends course.TCourseMetadata {
  reviewCount: number;
  sessions: number;
  sales: number;
  onDetails?: () => void;
  onBuy?: () => void;
  locale: TLocale
}

/**
 * Card component for displaying course information tailored for visitors, including options to view details or buy.
 *
 * @param title The title of the course.
 * @param rating The average rating of the course.
 * @param reviewCount The number of reviews for the course.
 * @param author The author object containing the name and image of the course creator.
 * @param language The language object containing the name of the course language.
 * @param sessions The number of sessions in the course.
 * @param duration The duration object containing video, coaching, and self-study times in minutes.
 * @param sales The number of sales for the course.
 * @param imageUrl The URL of the course image.
 * @param locale The locale for translation and localization purposes.
 * @param onDetails Optional callback function triggered when the "Details" button is clicked.
 * @param onBuy Optional callback function triggered when the "Buy Course" button is clicked.
 *
 * @example
 * <VisitorCourseCard
 *   title="Web Development Basics"
 *   rating={4.5}
 *   reviewCount={20}
 *   author={{ name: "Bob Smith", image: "author-image.jpg" }}
 *   language={{ name: "English" }}
 *   sessions={8}
 *   duration={{ video: 150, coaching: 60, selfStudy: 90 }}
 *   sales={120}
 *   imageUrl="course-image.jpg"
 *   locale="en"
 *   onDetails={() => console.log("Details clicked!")}
 *   onBuy={() => console.log("Buy clicked!")}
 * />
 */
export const VisitorCourseCard: React.FC<VisitorCourseCardProps> = ({
  title,
  description,
  rating,
  reviewCount,
  pricing,
  author,
  language,
  sessions,
  duration,
  sales,
  imageUrl,
  locale,
  onDetails,
  onBuy
}) => {
  const dictionary = getDictionary(locale);
  // Calculate total course duration in minutes
  const totalDurationInMinutes =
    duration.video + duration.coaching + duration.selfStudy;
  const totalDurationInHours = (totalDurationInMinutes / 60).toFixed(2);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col flex-1 w-auto h-auto rounded-medium border border-card-stroke bg-card-fill overflow-hidden transition-transform hover:scale-[1.02]">
        <div className="relative">
          <img
            loading="lazy"
            src={imageUrl}
            alt={title}
            className="w-full aspect-[2.15] object-cover"
          />
        </div>

        <div className="flex flex-col p-4 gap-4">
          <div className="flex flex-col gap-2">
            <h6 className="text-md font-bold text-text-primary line-clamp-2 text-start">
              {title}
            </h6>

            <div className="flex gap-1 items-end">
              <StarRating totalStars={5} rating={rating} />
              <span className="text-xs text-text-primary leading-[100%]">
                {rating}
              </span>
              <span className="text-xs text-text-secondary leading-[100%]">
                ({reviewCount})
              </span>
            </div>

            <CourseCreator creatorName={author?.name} imageUrl={author?.image} you={false} locale={locale as TLocale} />

            <CourseStats
              locale={locale as TLocale}
              language={language.name}
              sessions={sessions}
              duration={`${totalDurationInHours} hours`}
              sales={sales}
            />
          </div>

          {description && (
            <p className="text-sm leading-[150%] text-text-secondary text-start">
              {description}
            </p>
          )}

          <div className="flex flex-col gap-2">
            <Button
              className=""
              variant={'secondary'}
              size={'medium'}
              onClick={onDetails}
              text={dictionary.components.courseCard.detailsCourseButton}
            />
            <Button
              className=""
              variant={'primary'}
              size={'medium'}
              onClick={onBuy}
              text={`${dictionary.components.courseCard.buyButton} (${dictionary.components.courseCard.fromButton} ${pricing.currency} ${pricing.fullPrice})`}
            />
          </div>
        </div>
      </div>
    </div>
  )
};
