import * as React from "react";
import { Badge } from "../../badge";
import { Button } from "../../button";
import { CourseStats } from "../course-stats";
import { CourseCreator } from "../course-creator";
import { StarRating } from "../../star-rating";
import { course } from "@maany_shr/e-class-models";
import { IconClock } from "../../icons/icon-clock";
import { IconGroup } from "../../icons/icon-group";
import { IconCoachingSession } from "../../icons/icon-coaching-session";
import { getDictionary, isLocalAware, TLocale } from "@maany_shr/e-class-translations";

export type CourseStatus = "published" | "under-review" | "draft";

interface CourseCreatorCardProps extends isLocalAware {
  course: course.TCourseMetadata;
  reviewCount: number;
  sessions: number;
  sales: number;
  status: CourseStatus;
  onEdit?: () => void;
  onManage?: () => void;
}

const StatusBadge: React.FC<{ status: CourseStatus , locale: TLocale }> = ({ status, locale }) => {
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
    published: <IconClock size='5'/>,
    "under-review": <IconCoachingSession size='5' />,
    draft: <IconGroup size='5' />,
  };

  return (
    <Badge
      className="px-3 py-1 mb-2 gap-2 self-start mt-2"
      variant={variants[status]}
      size="big"
    >
      {icons[status]} {labels[status].toString()}
    </Badge>
  );
};

export const CourseCreatorCard: React.FC<CourseCreatorCardProps> = ({
  course,
  reviewCount,
  sessions,
  sales,
  status,
  locale,
  onEdit,
  onManage,
}) => {
  const {
    title,
    duration,
    imageUrl,
    rating,
    author,
    language,
  } = course;

  // Calculate total course duration in minutes and convert to hours
  const totalDurationInMinutes = duration.video + duration.coaching + duration.selfStudy;
  const totalDurationInHours = (totalDurationInMinutes / 60).toFixed(2);
  const dictionary = getDictionary(locale);
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

            {status === "published" && (
              <div className="flex gap-1 items-end">
                <StarRating rating={rating} />
                <span className="text-xs text-text-primary leading-[100%]">
                  {rating}
                </span>
                <span className="text-xs text-text-secondary">
                  ({reviewCount})
                </span>
              </div>
            )}

            <CourseCreator creatorName={author.name} locale={locale as TLocale} you={true} />

            <CourseStats
              locale={locale as TLocale}
              language={language.name}
              sessions={sessions}
              duration={`${totalDurationInHours} hours`}
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
                  variant="primary"
                  size="medium"
                  text={dictionary.components.courseCard.manageButton}
                />
                
                <Button
                  onClick={onEdit}
                  className="w-full"
                  variant="secondary"
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