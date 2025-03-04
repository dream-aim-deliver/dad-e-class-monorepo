import * as React from 'react';
import { z } from 'zod';
import { CourseStats } from '../course-stats';
import { CourseCreator } from '../course-creator';
import { ProgressBar } from '../../progress-bar';
import { CourseActions } from './course-actions';
import { StarRating } from '../../star-rating';
import { course } from '@maany_shr/e-class-models';
import { TLocale } from '@maany_shr/e-class-translations';

export type TCourseMetadata = z.infer<typeof course.CourseMetadataSchema>;

interface CourseCardProps extends TCourseMetadata {
  locale: TLocale;
  reviewCount: number;
  progress?: number;
  onBegin?: () => void;
  onResume?: () => void;
  onReview?: () => void;
  onDetails?: () => void;
}

/**
 * Props for the StudentCourseCard component.
 *
 * @typedef {object} CourseCardProps
 * @property {string} title - The title of the course.
 * @property {string} description - A brief description of the course.
 * @property {object} duration - An object containing durations for different components of the course.
 * @property {number} duration.video - Duration of video content in minutes.
 * @property {number} duration.coaching - Duration of coaching sessions in minutes.
 * @property {number} duration.selfStudy - Duration of self-study materials in minutes.
 * @property {number} reviewCount - Number of reviews for the course.
 * @property {object} pricing - Pricing details of the course.
 * @property {number} pricing.fullPrice - Full price of the course.
 * @property {string} imageUrl - URL of the course's cover image.
 * @property {number} rating - Average rating of the course.
 * @property {object} author - Information about the course author.
 * @property {string} author.name - Name of the author.
 * @property {string} author.image - URL to the author's image.
 * @property {object} language - Language details of the course.
 * @property {string} language.name - Name of the language.
 * @property {number} [progress=0] - Progress percentage of the student in the course.
 * @property {TLocale} locale - Locale setting for translations.
 * @property {function} [onBegin] - Callback function when the course is started.
 * @property {function} [onResume] - Callback function when the course is resumed.
 * @property {function} [onReview] - Callback function when the course is reviewed.
 * @property {function} [onDetails] - Callback function when course details are requested.
 */

/**
 * StudentCourseCard component displays detailed information about a course for students.
 *
 * @param {CourseCardProps} props - Properties passed to the component.
 * @returns {React.ReactElement} The rendered StudentCourseCard component.
 */
export const StudentCourseCard: React.FC<CourseCardProps> = ({
  title,
  description,
  duration,
  reviewCount,
  pricing,
  imageUrl,
  rating,
  author,
  language,
  progress = 0,
  locale,
  onBegin,
  onResume,
  onReview,
  onDetails,
}) => {
  // Calculate total course duration in minutes
  const totalDurationInMinutes =
    duration.video + duration.coaching + duration.selfStudy;
  const totalDurationInHours = (totalDurationInMinutes / 60).toFixed(2);

  // Determine study progress based on progress value
  const studyProgress =
    progress === 100
      ? 'completed'
      : progress > 0
        ? 'in-progress'
        : 'yet-to-start';

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
            
            <CourseCreator
              creatorName={author?.name}
              imageUrl={author?.image}
              locale={locale as TLocale}
            />

            <CourseStats
              locale={locale as TLocale}
              language={language.name}
              sessions={10}
              duration={`${totalDurationInHours} hours`}
              sales={pricing.fullPrice}
            />
          </div>

          {studyProgress === 'yet-to-start' && description && (
            <p className="text-sm leading-[150%] text-text-secondary text-start">
              {description}
            </p>
          )}

          {studyProgress === 'in-progress' && (
            <ProgressBar progress={progress} />
          )}

          <div className="flex flex-col gap-2">
            <CourseActions
              locale={locale as TLocale}
              studyProgress={studyProgress}
              progress={progress}
              onBegin={onBegin}
              onResume={onResume}
              onReview={onReview}
              onDetails={onDetails}
            />
          </div>
        </div>
      </div>
    </div>
  );
};