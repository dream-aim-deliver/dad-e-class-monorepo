'use client';

import { createContext, useContext, ReactNode, useMemo } from 'react';

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
    // Memoize context value to prevent unnecessary re-renders
    const value = useMemo(() => ({ courseSlug }), [courseSlug]);

    return (
        <CourseSlugContext.Provider value={value}>
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
