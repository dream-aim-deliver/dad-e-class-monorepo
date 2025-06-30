import CardListLayout from '../card-list-layout';
import { Skeleton } from './skeleton';

interface CourseCardListSkeletonProps {
    cardCount?: number;
}

export function CourseCardListSkeleton({ 
    cardCount = 6 
}: CourseCardListSkeletonProps) {
    return (
        <CardListLayout>
            {Array.from({ length: cardCount }).map((_, index) => (
                <CourseCardSkeleton key={index} />
            ))}
        </CardListLayout>
    );
}

// Individual course card skeleton component matching VisitorCourseCard structure
function CourseCardSkeleton() {
    return (
        <div className="flex flex-col w-auto h-[600px] rounded-medium border border-card-stroke bg-card-fill overflow-hidden">
            {/* Image Skeleton */}
            <div className="relative flex-shrink-0">
                <Skeleton className="w-full h-[200px] rounded-none" />
            </div>

            {/* Content Skeleton */}
            <div className="flex flex-col flex-1 p-4 gap-4">
                {/* Header section with title, rating, author, stats */}
                <div className="flex flex-col gap-2 flex-shrink-0">
                    {/* Title Skeleton */}
                    <Skeleton className="h-6 w-4/5 rounded" />
                    
                    {/* Rating Skeleton */}
                    <Skeleton className="h-4 w-1/2 rounded" />

                    {/* Course Creator Skeleton */}
                    <div className="flex items-center gap-2">
                        <Skeleton className="w-8 h-8 rounded-full" />
                        <Skeleton className="h-4 w-24 rounded" />
                    </div>

                    {/* Course Stats Skeleton */}
                    <Skeleton className="h-4 w-full rounded" />
                </div>

                {/* Description Skeleton */}
                <div className="flex-1 min-h-0">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full rounded" />
                        <Skeleton className="h-4 w-full rounded" />
                        <Skeleton className="h-4 w-3/4 rounded" />
                    </div>
                </div>

                {/* Buttons Skeleton */}
                <div className="flex flex-col gap-2 flex-shrink-0 mt-auto">
                    <Skeleton className="w-full h-10 rounded-medium" />
                    <Skeleton className="w-full h-10 rounded-medium" />
                </div>
            </div>
        </div>
    );
}
