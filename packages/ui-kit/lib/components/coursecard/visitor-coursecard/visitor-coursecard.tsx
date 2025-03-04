import * as React from 'react';
import { Button } from '../../button';
import { CourseStats } from '../course-stats';
import { CourseCreator } from '../course-creator';
import { StarRating } from '../../star-rating';
import { IconGroup } from '../../icons/icon-group';
import { course } from '@maany_shr/e-class-models';
import { getDictionary, TLocale } from '@maany_shr/e-class-translations';

// Extend the existing type with the properties we need that aren't in TCourseMetadata
export interface VisitorCourseCardProps extends Omit<
  course.TCourseMetadata,
  'description' | 'pricing'
> {
  reviewCount: number;
  sessions: number;
  sales: number;
  onDetails?: () => void;
  onBuy?: () => void;
  locale: TLocale
}

/**
 * Properties for the VisitorCourseCard component.
 *
 * @typedef {Object} VisitorCourseCardProps
 * @property {string} title - The title of the course.
 * @property {number} rating - The average rating of the course.
 * @property {number} reviewCount - The number of reviews for the course.
 * @property {Object} author - The author of the course.
 * @property {string} author.name - The name of the author.
 * @property {string} author.image - The URL of the author's image.
 * @property {Object} language - The language in which the course is offered.
 * @property {string} language.name - The name of the language.
 * @property {number} sessions - The number of sessions in the course.
 * @property {Object} duration - The duration of the course.
 * @property {number} duration.video - The duration of video content in minutes.
 * @property {number} duration.coaching - The duration of coaching sessions in minutes.
 * @property {number} duration.selfStudy - The duration of self-study content in minutes.
 * @property {number} sales - The number of sales for the course.
 * @property {string} imageUrl - The URL of the course image.
 * @property {TLocale} locale - The locale for translations.
 * @property {Function} [onDetails] - Callback function when the "Details" button is clicked.
 * @property {Function} [onBuy] - Callback function when the "Buy" button is clicked.
 */

/**
 * VisitorCourseCard component displays course information for visitors.
 *
 * @param {VisitorCourseCardProps} props - The properties for the component.
 * @returns {JSX.Element} The rendered VisitorCourseCard component.
 *
 * @example
 * <VisitorCourseCard
 *   title="Introduction to Programming"
 *   rating={4.5}
 *   reviewCount={120}
 *   author={{ name: "John Doe", image: "author.jpg" }}
 *   language={{ name: "English" }}
 *   sessions={10}
 *   duration={{ video: 600, coaching: 120, selfStudy: 180 }}
 *   sales={200}
 *   imageUrl="course.jpg"
 *   locale="en-US"
 *   onDetails={() => console.log('Details clicked')}
 *   onBuy={() => console.log('Buy clicked')}
 * />
 */
export const VisitorCourseCard: React.FC<VisitorCourseCardProps> = ({
  title,
  rating,
  reviewCount,
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
              <StarRating rating={rating} />
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
              text={dictionary.components.courseCard.buyCourseButton}
            />
          </div>
        </div>
      </div>
    </div>
  )
};
