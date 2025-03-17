import * as React from 'react';
import { useState } from 'react';
import { z } from 'zod';
import { CourseStats } from '../course-stats';
import { CourseCreator } from '../course-creator';
import { ProgressBar } from '../../progress-bar';
import { CourseActions } from './course-actions';
import { StarRating } from '../../star-rating';
import { course } from '@maany_shr/e-class-models';
import { getDictionary, TLocale } from '@maany_shr/e-class-translations';

export type TCourseMetadata = z.infer<typeof course.CourseMetadataSchema>;

interface CourseCardProps extends TCourseMetadata {
  locale: TLocale;
  sales: number;
  reviewCount: number;
  progress?: number;
  onBegin?: () => void;
  onResume?: () => void;
  onReview?: () => void;
  onDetails?: () => void;
}

/**
 * Card component for displaying course information tailored for students, including progress and actions.
 *
 * @param title The title of the course.
 * @param description The description of the course, displayed when study progress is 'yet-to-start'.
 * @param duration The duration object containing video, coaching, and self-study times in minutes.
 * @param reviewCount The number of reviews for the course.
 * @param pricing The pricing object containing the full price of the course.
 * @param imageUrl The URL of the course image.
 * @param rating The average rating of the course.
 * @param author The author object containing the name and image of the course creator.
 * @param language The language object containing the name of the course language.
 * @param progress Optional numeric value representing the course completion progress (defaults to 0).
 * @param locale The locale for translation and localization purposes.
 * @param onBegin Optional callback function triggered when the "Begin Course" button is clicked.
 * @param onResume Optional callback function triggered when the "Resume Course" button is clicked.
 * @param onReview Optional callback function triggered when the "Review Course" button is clicked.
 * @param onDetails Optional callback function triggered when the "Details" button is clicked.
 *
 * @example
 * <StudentCourseCard
 *   title="Introduction to Programming"
 *   description="Learn the basics of coding."
 *   duration={{ video: 120, coaching: 60, selfStudy: 30 }}
 *   reviewCount={15}
 *   pricing={{ fullPrice: 99 }}
 *   imageUrl="course-image.jpg"
 *   rating={4.2}
 *   author={{ name: "Alice Johnson", image: "author-image.jpg" }}
 *   language={{ name: "English" }}
 *   progress={50}
 *   locale="en"
 *   onBegin={() => console.log("Begin clicked!")}
 *   onResume={() => console.log("Resume clicked!")}
 *   onReview={() => console.log("Review clicked!")}
 *   onDetails={() => console.log("Details clicked!")}
 * />
 */
export const StudentCourseCard: React.FC<CourseCardProps> = ({
  title,
  description,
  duration,
  reviewCount,
  sales,
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
   // Calculate total course duration in minutes and convert to hours
   const totalDurationInMinutes = duration.video + duration.coaching + duration.selfStudy;
   const totalDurationInHours = totalDurationInMinutes / 60;
   // Format the number: show as integer if it's a whole number, otherwise show with 2 decimal places
   const formattedDuration = Number.isInteger(totalDurationInHours)
     ? totalDurationInHours.toString()
     : totalDurationInHours.toFixed(2);

  const dictionary = getDictionary(locale);
  const [isImageError, setIsImageError] = useState(false);

  const handleImageError = () => {
    setIsImageError(true);
  };
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
          {isImageError ? (
            // Placeholder for broken image (matching CoachBanner styling)
            <div className="w-full h-[200px] bg-base-neutral-700 flex items-center justify-center">
              <span className="text-text-secondary text-md">
                {dictionary.components.coachBanner.placeHolderText}
              </span>
            </div>
          ) : (
            <img
              loading="lazy"
              src={imageUrl}
              alt={title}
              className="w-full aspect-[2.15] object-cover"
              onError={handleImageError}
            />
          )}
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
              duration={`${formattedDuration} ${dictionary.components.courseCard.hours}`}
              sales={sales}
            />
          </div>

          {studyProgress === 'yet-to-start' && description && (
            <p className="text-sm leading-[150%] text-text-secondary text-start">
              {description}
            </p>
          )}

          {studyProgress === 'in-progress' && (
            <div className='flex gap-4'>
              <ProgressBar progress={progress} />
              <p className='text-sm leading-[100%] text-text-secondary'>{progress}%</p>
            </div>
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