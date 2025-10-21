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
 * A component for Step 2 of the Create Package flow, handling course selection
 * and display. This component manages the course selection interface where users
 * can browse and select courses to include in their package.
 *
 * Features:
 * - Course search and filtering capabilities
 * - Course selection/deselection with visual feedback
 * - Course card display with detailed information
 * - Empty state handling when no courses are available
 * - Integration with CourseCardAddToPackageList for search functionality
 *
 * Props:
 * @param {PackageCoursesStepCourseItem[]} courses - Array of available courses to display
 * @param {string[]} selectedCourseIds - Array of currently selected course IDs
 * @param {function} onToggleCourseSelection - Function to handle course selection/deselection
 * @param {TLocale} locale - Current locale for translations
 *
 * Usage:
 * ```tsx
 * <PackageCoursesStep
 *   courses={courses}
 *   selectedCourseIds={selectedCourseIds}
 *   onToggleCourseSelection={onToggleCourseSelection}
 *   locale={locale}
 * />
 * ```
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
            <CourseCardAddToPackageList locale={locale} onSearch={() => undefined}>
                {courses.length === 0 ? (
                    <div className="text-center text-text-secondary py-8">
                        {dictionary.components.packageCoursesStep.emptyState}
                    </div>
                ) : (
                    courses.map((course) => (
                        <CourseCardAddToPackage
                            key={course.id}
                            title={course.title}
                            description={course.description}
                            rating={course.rating}
                            reviewCount={course.reviewCount}
                            language={course.language}
                            sessions={course.sessions}
                            duration={course.duration}
                            sales={course.sales}
                            imageUrl={course.imageUrl}
                            author={course.author}
                            pricing={course.pricing}
                            courseAdded={selectedCourseIds.includes(course.id)}
                            onAddOrRemove={() => onToggleCourseSelection(course.id)}
                            onClickUser={() => undefined}
                            locale={locale}
                        />
                    ))
                )}
            </CourseCardAddToPackageList>
        </div>
    );
};


