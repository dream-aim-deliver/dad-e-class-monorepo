import * as React from 'react';
import { Button } from '../../button';
import { CourseStats } from '../course-stats';
import { CourseCreator } from '../course-creator';
import { StarRating } from '../../star-rating';
import { IconGroup } from '../../icons/icon-group';

export interface CoachCourseCardProps {
  title: string;
  rating: number;
  reviewCount: number;
  creatorName: string;
  language: string;
  sessions: number;
  duration: string;
  sales: number;
  thumbnailUrl: string;
  groupName: string;
  onManage?: () => void;
}

export const CoachCourseCard: React.FC<CoachCourseCardProps> = ({
  title,
  rating,
  reviewCount,
  creatorName,
  language,
  sessions,
  duration,
  sales,
  groupName = 'Group Name',
  thumbnailUrl,
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
            <StarRating rating={3} />
            <span className="text-xs text-text-primary leading-[100%]">
              {rating}
            </span>
            <span className="text-xs text-text-secondary leading-[100%]">
              ({reviewCount})
            </span>
          </div>

          <CourseCreator creatorName={creatorName} you={false} />

          <CourseStats
            language={language}
            sessions={sessions}
            duration={duration}
            sales={sales}
          />
        </div>
        <div className="flex gap-1 flex-wrap items-center">
          <div className="flex items-center gap-1">
            <IconGroup classNames="text-text-primary" size="5" />
            <p className="text-text-secondary text-sm">Group</p>
          </div>
          <Button variant="text" text={groupName} className="p-0" />
        </div>
        <Button
          onClick={onManage}
          className="w-full"
          variant="secondary"
          size="medium"
          text="Manage"
        />
      </div>
    </div>
  </div>
);
