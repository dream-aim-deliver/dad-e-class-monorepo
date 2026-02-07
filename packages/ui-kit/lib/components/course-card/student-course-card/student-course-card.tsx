'use client';
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
import RichTextRenderer from '../../rich-text-element/renderer';
import { useImageComponent } from '../../../contexts/image-component-context';
import { Badge } from '../../badge';

export type TCourseMetadata = z.infer<typeof course.CourseMetadataSchema>;

interface StudentCourseCardProps extends TCourseMetadata {
  locale: TLocale;
  reviewCount: number;
  sales: number;
  coachingSessionCount?: number | null;
  progress?: number;
  hasReviewed?: boolean;
  status?: 'archived';
  onBegin?: () => void;
  onResume?: () => void;
  onReview?: () => void;
  onDetails?: () => void;
  onClickUser?: () => void;
  groupName?: string;
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
 * @param onClickUser Optional callback function triggered when the user name is clicked.
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
 *   onClickUser={() => console.log("User clicked!")}
 * />
 */
export const StudentCourseCard: React.FC<StudentCourseCardProps> = ({
  title,
  description,
  duration,
  reviewCount,
  sales,
  coachingSessionCount,
  imageUrl,
  rating,
  author,
  language,
  progress = 0,
  hasReviewed,
  status,
  locale,
  onBegin,
  onResume,
  onReview,
  onDetails,
  onClickUser,
  groupName,
}) => {
  const ImageComponent = useImageComponent();
  // Helper function to extract plain text from rich text content
  const extractPlainText = (content: string | any[]): string => {
    try {
      let parsedContent: any[];

      // If content is a string, try to parse it
      if (typeof content === 'string') {
        try {
          parsedContent = JSON.parse(content);
        } catch {
          return content;
        }
      } else {
        parsedContent = content;
      }

      // Recursively extract text from the Slate structure
      const extractText = (nodes: any[]): string => {
        return nodes.map((node) => {
          if (node.text !== undefined) {
            return node.text;
          }
          if (node.children) {
            return extractText(node.children);
          }
          return '';
        }).join('');
      };

      return extractText(parsedContent);
    } catch (error) {
      return '';
    }
  };

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

  const dictionary = getDictionary(locale);
  const [isImageError, setIsImageError] = useState(false);

  const handleImageError = () => {
    setIsImageError(true);
  };

  const shouldShowPlaceholder = !imageUrl || isImageError;
  const studyProgress =
    progress === 100
      ? 'completed'
      : progress > 0
        ? 'in-progress'
        : 'yet-to-start';

  return (
    <div className="w-full mx-auto">
      <div className="flex flex-col flex-1 w-auto h-fit rounded-medium border border-card-stroke bg-card-fill overflow-hidden transition-transform hover:scale-[1.02]">
        <div className="relative">
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
            <div className="flex gap-1 items-end">
              <StarRating totalStars={5} rating={rating as number} />
              <span className="text-xs text-text-primary leading-[100%]">
                {rating}
              </span>
              <span className="text-xs text-text-secondary leading-[100%]">
                ({reviewCount})
              </span>
            </div>

            <CourseCreator
              creatorName={author?.name as string}
              imageUrl={author?.image}
              locale={locale as TLocale}
              onClickUser={onClickUser}
            />

            <CourseStats
              locale={locale as TLocale}
              language={(language as any).name as string}
              sessions={coachingSessionCount ?? 0}
              duration={formattedDuration}
              sales={sales}
              sessionLabelVariant="available"
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

          {studyProgress === 'yet-to-start' && description && (
            <div
              className="cursor-help [&_p]:pb-0"
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
              title={extractPlainText(description)}
            >
              <RichTextRenderer content={description} onDeserializationError={console.error} className="text-sm leading-[150%] text-text-secondary text-start" />
            </div>
          )}

          {studyProgress === 'in-progress' && (
            <div className='flex gap-4'>
              <ProgressBar progress={progress} />
              <p className='text-sm leading-[100%] text-text-secondary'>{Number(progress.toFixed(2))}%</p>
            </div>
          )}

          {status === 'archived' && (
            <Badge
              className="px-3 py-1 gap-2 self-start"
              variant="errorprimary"
              size="big"
              text="Archived"
            />
          )}

          <div className="flex flex-col gap-2">
            <CourseActions
              locale={locale as TLocale}
              studyProgress={studyProgress}
              progress={progress}
              hasReviewed={hasReviewed}
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