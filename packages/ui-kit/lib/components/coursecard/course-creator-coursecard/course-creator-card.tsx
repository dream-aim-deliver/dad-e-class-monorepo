import * as React from "react";
import { Badge } from "../../badge";
import { Button } from "../../button";
import { CourseStats } from "../course-stats";
import { CourseCreator } from "../course-creator";
import { StarRating } from "../../star-rating";
import { course } from "@maany_shr/e-class-models";
import { getDictionary, isLocalAware, TLocale } from "@maany_shr/e-class-translations";
import { IconCheck } from "../../icons/icon-check";
import { IconHourglass } from "../../icons/icon-hourglass";
import { IconEdit } from "../../icons/icon-edit";
import { useEffect } from "react";

export type CourseStatus = "published" | "under-review" | "draft";

export interface CourseCreatorCardProps extends isLocalAware, course.TCourseMetadata {
  rating: number;
  reviewCount: number;
  sessions: number;
  sales: number;
  status: CourseStatus;
  onEdit?: () => void;
  onManage?: () => void;
  onClickUser?: () => void;
}

const StatusBadge: React.FC<{ status: CourseStatus, locale: TLocale }> = ({ status, locale }) => {
  const dictionary = getDictionary(locale);
  const variants = {
    published: "successprimary",
    "under-review": "warningprimary",
    draft: "info",
  } as const;

  const labels = {
    published: dictionary.components.courseCard.publishedBadge || "Published",
    "under-review": dictionary.components.courseCard.underReviewBadge || "Under Review",
    draft: dictionary.components.courseCard.draftBadge || "Draft",
  }

  const icons = {
    published: <IconCheck size='5' />,
    "under-review": <IconHourglass size='5' />,
    draft: <IconEdit size='5' />,
  };

  return (
    <Badge
      className="px-3 py-1 mb-2 gap-2 self-start mt-2"
      variant={variants[status]}
      size="big"
      text={labels[status]}
      hasIconLeft
      iconLeft={icons[status]}
    />
  );
};

/**
 * Card component for displaying course information created by the user.
 *
 * @param course The course metadata object containing title, duration, imageUrl, rating, author, and language.
 * @param reviewCount The number of reviews for the course.
 * @param sessions The number of sessions in the course.
 * @param sales The number of sales for the course.
 * @param status The status of the course. Options:
 *   - `published`: The course is live and available.
 *   - `under-review`: The course is being reviewed.
 *   - `draft`: The course is still in draft mode.
 * @param locale The locale for translation and localization purposes.
 * @param onEdit Optional callback function triggered when the edit button is clicked.
 * @param onManage Optional callback function triggered when the manage button is clicked.
 *
 * @example
 * <CourseCreatorCard
 *   course={{
 *     title: "Learn React",
 *     duration: { video: 120, coaching: 60, selfStudy: 60 },
 *     imageUrl: "course-image.jpg",
 *     rating: 4.5,
 *     author: { name: "John Doe", image: "author-image.jpg" },
 *     language: { name: "English" },
 *   }}
 *   reviewCount={25}
 *   sessions={10}
 *   sales={150}
 *   status="published"
 *   locale="en"
 *   onEdit={() => console.log("Edit clicked!")}
 *   onManage={() => console.log("Manage clicked!")}
 * />
 */
export const CourseCreatorCard: React.FC<CourseCreatorCardProps> = ({
  title,
  duration,
  imageUrl,
  rating,
  author,
  language,
  reviewCount,
  sessions,
  sales,
  status,
  locale,
  onEdit,
  onManage,
  onClickUser,
}) => {
  const [isImageError, setIsImageError] = React.useState(false);
  const [isTruncated, setIsTruncated] = React.useState(false);
  const titleRef = React.useRef<HTMLHeadingElement>(null);
  // Calculate total course duration in minutes and convert to hours
  const totalDurationInMinutes = duration.video + duration.coaching + duration.selfStudy;
  const totalDurationInHours = totalDurationInMinutes / 60;
  // Format the number: show as integer if it's a whole number, otherwise show with 2 decimal places
  const formattedDuration = Number.isInteger(totalDurationInHours)
    ? totalDurationInHours.toString()
    : totalDurationInHours.toFixed(2);

  const dictionary = getDictionary(locale);
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

            {status === "published" && (
              <div className="flex gap-1 items-end">
                <StarRating totalStars={5} rating={rating} />
                <span className="text-xs text-text-primary leading-[100%]">
                  {rating}
                </span>
                <span className="text-xs text-text-secondary leading-[100%]">
                  ({reviewCount})
                </span>
              </div>
            )}

            <CourseCreator creatorName={author.name} imageUrl={author.image} locale={locale as TLocale} you={true} onClickUser={onClickUser} />

            <CourseStats
              locale={locale as TLocale}
              language={language.name}
              sessions={sessions}
              duration={`${formattedDuration}  ${dictionary.components.courseCard.hours}`}
              sales={sales}
            />
          </div>

          {/* Status Badge */}
          <StatusBadge status={status} locale={locale as TLocale} />

          <div className="flex flex-col gap-2">
            {status === "published" ? (
              <>
                <Button
                  onClick={onManage}
                  className="w-full"
                  variant="secondary"
                  size="medium"
                  text={dictionary.components.courseCard.manageButton}
                />

                <Button
                  onClick={onEdit}
                  className="w-full"
                  variant="text"
                  size="medium"
                  text={dictionary.components.courseCard.editCourseButton}
                />
              </>
            ) : (
              <Button
                onClick={onEdit}
                disabled={status === "under-review"}
                className="w-full"
                variant="primary"
                size="medium"
                text={dictionary.components.courseCard.editCourseButton}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};