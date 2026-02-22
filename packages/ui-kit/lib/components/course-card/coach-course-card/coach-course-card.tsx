'use client';
import * as React from 'react';
import { useState } from 'react';
import { Button } from '../../button';
import { CourseStats } from '../course-stats';
import { CourseCreator } from '../course-creator';
import { RatingDisplay } from '../../rating-display';
import { Badge } from '../../badge';
import { course } from '@maany_shr/e-class-models';
import {
  TLocale,
  getDictionary,
} from '@maany_shr/e-class-translations';
import { useImageComponent } from '../../../contexts/image-component-context';

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
  const ImageComponent = useImageComponent();
  const dictionary = getDictionary(locale);
  const [isImageError, setIsImageError] = useState(false);

  const handleImageError = () => {
    setIsImageError(true);
  };

  const shouldShowPlaceholder = !imageUrl || isImageError;

  // Calculate total course duration in minutes and format as "Xh Ym"
  const totalDurationInMinutes = (duration as any).video as number + (duration as any).coaching as number + (duration as any).selfStudy as number;
  
  // Format duration as "Xh Ym" or just "Ym" if less than an hour
  const formatDuration = (minutes: number): string => {
    if (minutes <= 0) return '0m';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };
  const formattedDuration = formatDuration(totalDurationInMinutes);

  return (
    <div className="w-full mx-auto">
      <div className="flex flex-col flex-1 pb-2 w-auto h-fit rounded-medium border border-card-stroke bg-card-fill overflow-visible transition-transform hover:scale-[1.02]">
        <div className="relative overflow-hidden rounded-t-medium">
          {shouldShowPlaceholder ? (
            <div className="w-full h-[200px] bg-base-neutral-700 flex items-center justify-center">
              <span className="text-text-secondary text-md">
                {dictionary.components.coachBanner.placeHolderText}
              </span>
            </div>
          ) : (
            <ImageComponent
              loading="lazy"
              src={imageUrl}
              alt={title}
              width={430}
              height={200}
              className="w-full h-[200px] object-cover"
              onError={handleImageError}
            />
          )}
        </div>

        <div className="flex flex-col p-4 gap-4">
          <div className="flex flex-col gap-2">
            <div className="group relative">
              <h6
                title={title}
                className="text-md font-bold text-text-primary line-clamp-2 text-start"
              >
                {title}
              </h6>

            </div>

            <RatingDisplay rating={rating as number} totalRatings={reviewCount} />

            <CourseCreator creatorName={(author as any).name as string} imageUrl={(author as any).image as string} you={false} locale={locale as TLocale} onClickUser={onClickUser} />

            <CourseStats
              locale={locale as TLocale}
              language={language?.code?.toUpperCase() ?? ''}
              sessions={sessions}
              duration={formattedDuration}
              sales={sales}
            />
          </div>
          {groupName && (
            <Badge
              className="px-3 py-1 gap-2 self-start"
              variant="info"
              size="big"
              text={dictionary.components.courseCard.group}
            />
          )}
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