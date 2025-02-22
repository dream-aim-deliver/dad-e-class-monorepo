import * as React from 'react';
import { z } from 'zod';
import { CourseStats } from './course-stats';
import { CourseCreator } from '../course-creator';
import { ProgressBar } from './progress-bar';
import { CourseActions } from './course-actions';
import { StarRating } from '../../star-rating';
import { course } from '@maany_shr/e-class-models';

// Infer types from Zod schemas
export type TCourseDuration = z.infer<typeof course.CourseDurationSchema>;
export type TCoursePricing = z.infer<typeof course.CoursePricingSchema>;
export type TCourseMetadata = z.infer<typeof course.CourseMetadataSchema>;

interface CourseCardProps extends TCourseMetadata {
  progress?: number; // Progress percentage (0-100)
  onBegin?: () => void;
  onResume?: () => void;
  onReview?: () => void;
  onDetails?: () => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  title,
  description,
  duration,
  pricing,
  imageUrl,
  rating,
  author,
  language,
  progress,
  onBegin,
  onResume,
  onReview,
  onDetails,
}) => {
  // Calculate total course duration in minutes
  const totalDurationInMinutes =
    duration.video + duration.coaching + duration.selfStudy;
  const totalDurationInHours = (totalDurationInMinutes / 60).toFixed(2);
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col flex-1 w-auto h-auto rounded-lg border border-stone-800 bg-stone-900 overflow-hidden transition-transform hover:scale-[1.02]">
        {/* Course Thumbnail */}
        <img
          loading="lazy"
          src={imageUrl}
          alt={title}
          className="w-full aspect-[2.15] object-cover"
        />

        {/* Course Details */}
        <div className="flex flex-col p-4 gap-4">
          {/* Title and Rating */}
          <div className="flex flex-col">
            <h3 className="text-base font-bold text-stone-50 line-clamp-2">
              {title}
            </h3>
            <div className="flex items-end gap-1">
              <StarRating rating={rating} />
              <span className="text-xs text-stone-50">{rating}</span>
            </div>
          </div>

          {/* Author Information */}
          <CourseCreator creatorName={author.name} />

          {/* Course Stats */}
          <CourseStats
            language={language.name}
            sessions={10}
            duration={`${totalDurationInHours} hours`}
            sales={pricing.fullPrice}
          />

          {/* Description (if applicable) */}
          {!progress && description && (
            <p className="text-sm gap-2 text-stone-300 line-clamp-3">
              {description}
            </p>
          )}

          {/* Progress Bar (if in progress) */}
          {progress && progress > 0 && (
            <ProgressBar progress={progress % 100} />
          )}

          {/* Action Buttons */}
          <CourseActions
            studyProgress={progress ? 'in-progress' : 'yet-to-start'}
            progress={progress}
            onBegin={onBegin}
            onResume={onResume}
            onReview={onReview}
            onDetails={onDetails}
          />
        </div>
      </div>
    </div>
  );
};
