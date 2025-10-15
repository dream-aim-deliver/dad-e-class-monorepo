'use client';

import { createContext, useContext, ReactNode } from 'react';

interface CourseSlugContextType {
    courseSlug: string;
}

const CourseSlugContext = createContext<CourseSlugContextType | undefined>(
    undefined,
);

export function CourseSlugProvider({
    courseSlug,
    children,
}: {
    courseSlug: string;
    children: ReactNode;
}) {
    return (
        <CourseSlugContext.Provider value={{ courseSlug }}>
            {children}
        </CourseSlugContext.Provider>
    );
}

export function useCourseSlug() {
    const context = useContext(CourseSlugContext);
    if (context === undefined) {
        throw new Error('useCourseSlug must be used within a CourseSlugProvider');
    }
    return context.courseSlug;
}
