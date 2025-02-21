import React from "react";
import { z } from "zod";
import { CourseCard } from "./course-card";
import { course } from "@maany_shr/e-class-models";

// Infer types from Zod schemas
export type TCourseMetadata = z.infer<typeof course.CourseMetadataSchema>;

interface CourseGridProps {
  courses: TCourseMetadata[]; 
}

export const CourseGrid: React.FC<CourseGridProps> = ({ courses }) => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {courses.map((course, index) => (
      <CourseCard
        key={index} 
        {...course}
      />
    ))}
  </div>
);