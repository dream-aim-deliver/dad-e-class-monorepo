import * as React from 'react';
import { Button } from '../../button';
import { CourseStats } from '../course-stats';
import { CourseCreator } from '../course-creator';
import { StarRating } from '../../star-rating';

export interface VisitorCourseCardProps {
  title: string;
  rating: number;
  reviewCount: number;
  creatorName: string;
  language: string;
  sessions: number;
  duration: string;
  sales: number;
  thumbnailUrl: string;
  description: string;
  onDetails?: () => void;
  onManage?: () => void;
}

export const VisitorCourseCard: React.FC<VisitorCourseCardProps> = ({
  title,
  rating,
  reviewCount,
  creatorName,
  language,
  sessions,
  duration,
  sales,
  description,
  thumbnailUrl,
  onDetails,
  onManage,
}) => (
  <div className="max-w-7xl mx-auto">
    <div className="flex flex-col flex-1 w-auto h-auto rounded-medium border border-card-stroke bg-card-fill overflow-hidden transition-transform hover:scale-[1.02]">
      <div className="relative">
        <img
          loading="lazy"
          src={thumbnailUrl}
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

          <CourseCreator creatorName={creatorName} />

          <CourseStats
            language={language}
            sessions={sessions}
            duration={duration}
            sales={sales}
          />
        </div>
        <p className="text-sm leading-[150%] text-text-secondary text-start">
          {description}
        </p>
        <div className="flex flex-col gap-2 mt-2">
          <Button
            onClick={onManage}
            className="w-full"
            variant="secondary"
            size="medium"
            text="Details"
          />
          <Button
            onClick={onDetails}
            className="w-full"
            size="medium"
            text="Buy (from CHF 240)"
          />
        </div>
      </div>
    </div>
  </div>
);
