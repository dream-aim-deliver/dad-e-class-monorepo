'use client';

import * as React from 'react';
import { TLocale } from '@maany_shr/e-class-translations';
import { CourseCardAddToPackage } from '../course-card/add-to-package/course-card-add-to-package';
import { CourseCardAddToPackageList } from '../course-card/add-to-package/course-card-add-to-package-list';

export interface PackageCoursesStepCourseItem {
    id: string;
    title: string;
    description: string;
    rating: number;
    reviewCount: number;
    language: { code: string; name: string };
    sessions: number;
    duration: { video: number; coaching: number; selfStudy: number };
    sales: number;
    imageUrl: string;
    author: { name: string; image: string };
    pricing: { fullPrice: number; currency: string; partialPrice: number };
}

export interface PackageCoursesStepProps {
    courses: PackageCoursesStepCourseItem[];
    selectedCourseIds: string[];
    onToggleCourseSelection: (courseId: string) => void;
    locale: TLocale;
}

/**
 * PackageCoursesStep
 *
 * Step 2 of the Create Package flow. Displays selected courses in a
 * horizontal scroll section and renders the searchable list of all
 * courses using CourseCardAddToPackageList.
 */
export const PackageCoursesStep: React.FC<PackageCoursesStepProps> = ({
    courses,
    selectedCourseIds,
    onToggleCourseSelection,
    locale,
}) => {
    const selectedCourses = React.useMemo(
        () => courses.filter((c) => selectedCourseIds.includes(c.id)),
        [courses, selectedCourseIds],
    );

    return (
        <div>

            {/* All courses list */}
            <CourseCardAddToPackageList locale={locale} onSearch={() => {}}>
                {courses.map((course) => (
                    <CourseCardAddToPackage
                        key={course.id}
                        {...course}
                        courseAdded={selectedCourseIds.includes(course.id)}
                        onAddOrRemove={() => onToggleCourseSelection(course.id)}
                        onClickUser={() => {}}
                        locale={locale}
                    />
                ))}
            </CourseCardAddToPackageList>
        </div>
    );
};


