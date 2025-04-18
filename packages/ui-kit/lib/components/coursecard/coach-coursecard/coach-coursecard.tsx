import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
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
  onClickUser?: () => void;
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
 * @param onClickUser Optional callback function triggered when the user name is clicked.
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
 *   onClickUser={() => console.log("Author clicked!")}
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
  onClickUser,
  locale
}) => {
  const dictionary = getDictionary(locale);
  const [isImageError, setIsImageError] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const handleImageError = () => {
    setIsImageError(true);
  };

  // Check if the title is truncated
  useEffect(() => {
    const checkTruncation = () => {
      if (titleRef.current) {
        const { scrollHeight, clientHeight } = titleRef.current;
        setIsTruncated(scrollHeight > clientHeight);
      }
    };

    checkTruncation();
    window.addEventListener('resize', checkTruncation);
    return () => window.removeEventListener('resize', checkTruncation);
  }, [title]);

  // Calculate total course duration in minutes and convert to hours
  const totalDurationInMinutes = duration.video + duration.coaching + duration.selfStudy;
  const totalDurationInHours = totalDurationInMinutes / 60;
  const formattedDuration = Number.isInteger(totalDurationInHours)
    ? totalDurationInHours.toString()
    : totalDurationInHours.toFixed(2);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col flex-1 w-auto h-auto rounded-medium border border-card-stroke bg-card-fill overflow-hidden transition-transform hover:scale-[1.02]">
        <div className="relative">
          {isImageError ? (
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
            <div className="group relative">
              <h6
                ref={titleRef}
                className="text-md font-bold text-text-primary line-clamp-2 text-start"
              >
                {title}
              </h6>
              {isTruncated && (
                <div className="absolute invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-card-stroke text-text-primary text-sm rounded py-2 px-3 -top-35 -left-2 max-w-auto z-10">
                  {title}
                  <div className="absolute top-full left-4 w-0 h-0 border-x-8 border-x-transparent border-t-4 border-card-stroke" />
                </div>
              )}
            </div>

            <div className="flex gap-1 items-end">
              <StarRating totalStars={5} rating={rating} />
              <span className="text-xs text-text-primary leading-[100%]">
                {rating}
              </span>
              <span className="text-xs text-text-secondary leading-[100%]">
                ({reviewCount})
              </span>
            </div>

            <CourseCreator creatorName={author.name} imageUrl={author.image} you={false} locale={locale as TLocale} onClickUser={onClickUser} />

            <CourseStats
              locale={locale as TLocale}
              language={language.name}
              sessions={sessions}
              duration={`${formattedDuration} ${dictionary.components.courseCard.hours}`}
              sales={sales}
            />
          </div>
          <div className="flex gap-1 flex-wrap items-center w-full">
            <div className="flex items-center gap-1">
              <IconGroup classNames="text-text-primary" size="5" />
              <p className="text-text-secondary text-sm">{dictionary.components.courseCard.group}</p>
            </div>
            <Button variant="text" text={groupName} className="p-0 max-w-full" />
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
  );
};