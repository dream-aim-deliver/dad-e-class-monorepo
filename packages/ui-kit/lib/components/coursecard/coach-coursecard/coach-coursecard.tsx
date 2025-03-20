import * as React from 'react';
import { useState } from 'react';
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

export interface CoachCourseCardProps extends Omit<course.TCourseMetadata, 'description' | 'pricing'> {
  reviewCount: number;
  sessions: number;
  sales: number;
  groupName?: string;
  onManage?: () => void;
  locale: TLocale;
}

/**
 * Card component for displaying course information relevant to a coach.
 *
 * @param title The title of the course.
 * @param rating The average rating of the course.
 * @param reviewCount The number of reviews for the course.
 * @param language The language object containing the name of the course language.
 * @param sessions The number of sessions in the course.
 * @param author The author object containing the name and image of the course creator.
 * @param duration The duration object containing video, coaching, and self-study times in minutes.
 * @param sales The number of sales for the course.
 * @param groupName Optional name of the group associated with the course.
 * @param imageUrl The URL of the course image.
 * @param onManage Optional callback function triggered when the manage button is clicked.
 * @param locale The locale for translation and localization purposes.
 *
 * @example
 * <CoachCourseCard
 *   title="Advanced Coaching Techniques"
 *   rating={4.8}
 *   reviewCount={30}
 *   language={{ name: "English" }}
 *   sessions={12}
 *   author={{ name: "Jane Smith", image: "author-image.jpg" }}
 *   duration={{ video: 180, coaching: 90, selfStudy: 60 }}
 *   sales={200}
 *   groupName="Coaching Pros"
 *   imageUrl="course-image.jpg"
 *   onManage={() => console.log("Manage clicked!")}
 *   locale="en"
 * />
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
  const [isImageError, setIsImageError] = useState(false);
  const handleImageError = () => {
    setIsImageError(true);
  };
  // Calculate total course duration in minutes and convert to hours
  const totalDurationInMinutes = duration.video + duration.coaching + duration.selfStudy;
  const totalDurationInHours = totalDurationInMinutes / 60;
  // Format the number: show as integer if it's a whole number, otherwise show with 2 decimal places
  const formattedDuration = Number.isInteger(totalDurationInHours)
    ? totalDurationInHours.toString()
    : totalDurationInHours.toFixed(2);

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
              <StarRating totalStars={5}  rating={rating} />
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
              duration={`${formattedDuration} ${dictionary.components.courseCard.hours}`}
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