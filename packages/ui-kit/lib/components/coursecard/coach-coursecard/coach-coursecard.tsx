import * as React from 'react';
import { Button } from '../../button';
import { CourseStats } from '../course-stats';
import { CourseCreator } from '../course-creator';
import { StarRating } from '../../star-rating';
import { IconGroup } from '../../icons/icon-group';
import { course } from '@maany_shr/e-class-models';
import {
  TLocale,
  getDictionary,
} from '@maany_shr/e-class-translations';


/**
 * Props for the CoachCourseCard component.
 *
 * Extends the existing course metadata type, omitting 'description' and 'pricing',
 * and adds additional properties specific to the coach's course card.
 */
export interface CoachCourseCardProps extends Omit<course.TCourseMetadata, 'description' | 'pricing'> {
  /** Number of reviews the course has received. */
  reviewCount: number;
  /** Total number of sessions included in the course. */
  sessions: number;
  /** Total number of sales made for the course. */
  sales: number;
  /** Optional name of the group associated with the course. */
  groupName?: string;
  /** Optional callback function triggered when the 'Manage' button is clicked. */
  onManage?: () => void;
  /** Locale setting for internationalization. */
  locale: TLocale;
}

/**
 * CoachCourseCard Component
 *
 * A card component that displays detailed information about a coach's course,
 * including title, rating, author, duration, and more. It also provides a 'Manage' button
 * for course management actions.
 *
 * @param {CoachCourseCardProps} props - The properties passed to the component.
 * @returns {JSX.Element} The rendered CoachCourseCard component.
 *
 * @example
 * ```tsx
 * <CoachCourseCard
 *   title="React for Beginners"
 *   rating={4.5}
 *   reviewCount={120}
 *   language={{ name: 'English' }}
 *   sessions={10}
 *   author={{ name: 'John Doe', image: 'path/to/image.jpg' }}
 *   duration={{ video: 600, coaching: 120, selfStudy: 180 }}
 *   sales={200}
 *   groupName="Frontend Developers"
 *   imageUrl="path/to/course/image.jpg"
 *   onManage={() => handleManageCourse()}
 *   locale="en-US"
 * />
 * ```
 */
export const CoachCourseCard: React.FC<CoachCourseCardProps> = ({
  title,
  rating,
  reviewCount,
  language,
  sessions,
  author,
  duration,
  sales,
  groupName = '',
  imageUrl,
  onManage,
  locale
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

            <CourseCreator creatorName={author.name} imageUrl={author.image} you={false} locale={locale as TLocale} />

            <CourseStats
              locale={locale as TLocale}
              language={language.name}
              sessions={sessions}
              duration={`${totalDurationInHours} hours`}
              sales={sales}
            />
          </div>
          <div className="flex gap-1 flex-wrap items-center">
            <div className="flex items-center gap-1">
              <IconGroup classNames="text-text-primary" size="5" />
              <p className="text-text-secondary text-sm">{dictionary.components.courseCard.group}</p>
            </div>
            <Button variant="text" text={groupName} className="p-0" />
          </div>
          <Button
            onClick={onManage}
            className="w-full"
            variant="secondary"
            size="medium"
            text={dictionary.components.courseCard.manageButton}
          />
        </div>
      </div>
    </div>
  )
};