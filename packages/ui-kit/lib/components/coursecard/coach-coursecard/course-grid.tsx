import * as React from 'react';
import type { CourseCardProps } from './types';
import { CoachCourseCard } from './coach-coursecard';

export interface CourseGridProps {
  courses: CourseCardProps[];
}

export const CourseGrid: React.FC<CourseGridProps> = ({ courses }) => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {courses.map((course, index) => (
      <CoachCourseCard key={index} {...course} />
    ))}
  </div>
);
