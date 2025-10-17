'use client';

import * as React from 'react';
import { TLocale, getDictionary } from '@maany_shr/e-class-translations';
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
    const dictionary = getDictionary(locale);
    
    return (
        <div>
            {/* All courses list */}
            {/* TODO: Add search functionality when available */}
            <CourseCardAddToPackageList locale={locale} onSearch={() => undefined}>
                {courses.length === 0 ? (
                    <div className="text-center text-text-secondary py-8">
                        {dictionary.components.packageCoursesStep.emptyState}
                    </div>
                ) : (
                    courses.map((course) => (
                        <CourseCardAddToPackage
                            key={course.id}
                            {...course}
                            courseAdded={selectedCourseIds.includes(course.id)}
                            onAddOrRemove={() => onToggleCourseSelection(course.id)}
                            // TODO: Add author page route when available
                            onClickUser={() => undefined}
                            locale={locale}
                        />
                    ))
                )}
            </CourseCardAddToPackageList>
        </div>
    );
};


