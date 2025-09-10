import { Skeleton } from './skeleton';

interface StudentCardListSkeletonProps {
    cardCount?: number;
}

export function StudentCardListSkeleton({ 
    cardCount = 6 
}: StudentCardListSkeletonProps) {
    return (
        <div className="flex flex-col gap-4 justify-center items-center w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 w-full">
                {Array.from({ length: cardCount }).map((_, index) => (
                    <StudentCardSkeleton key={index} />
                ))}
            </div>
        </div>
    );
}

// Individual student card skeleton component matching StudentCard structure
function StudentCardSkeleton() {
    return (
        <div className="flex flex-col md:p-4 p-2 gap-2 rounded-medium border border-card-stroke bg-card-fill w-full">
            {/* Avatar, student name & Badge */}
            <div className="flex flex-row items-center gap-3 mb-2">
                <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
                <div className="flex flex-col gap-1">
                    <Skeleton className="h-4 w-32 rounded" />
                    <Skeleton className="h-5 w-24 rounded" />
                </div>
            </div>

            {/* Coach details */}
            <div className="flex flex-wrap items-center gap-2">
                <Skeleton className="w-4 h-4 rounded" />
                <Skeleton className="h-3 w-12 rounded" />
                <div className="flex items-center gap-1">
                    <Skeleton className="w-6 h-6 rounded-full" />
                    <Skeleton className="h-3 w-20 rounded" />
                </div>
            </div>

            {/* Course details */}
            <div className="flex flex-wrap items-center gap-2">
                <Skeleton className="w-4 h-4 rounded" />
                <Skeleton className="h-3 w-12 rounded" />
                <div className="flex items-center gap-1">
                    <Skeleton className="w-4 h-4 rounded-small" />
                    <Skeleton className="h-3 w-28 rounded" />
                </div>
            </div>

            {/* Assignment details area (sometimes present) */}
            <div className="flex flex-col gap-2 items-start justify-between bg-neutral-800 p-2 rounded-small border border-neutral-700">
                <div className="flex flex-row w-full items-center justify-between">
                    <div className="flex flex-row gap-2 items-center">
                        <Skeleton className="w-4 h-4 rounded" />
                        <Skeleton className="h-4 w-36 rounded" />
                    </div>
                </div>
                <Skeleton className="h-5 w-20 rounded" />
                <Skeleton className="w-full h-8 rounded mt-2" />
            </div>

            {/* Course completed badge area */}
            <div className="flex flex-col mb-2 items-start justify-between">
                <Skeleton className="h-5 w-32 rounded" />
            </div>

            {/* Student details button */}
            <Skeleton className="w-full h-10 rounded-medium" />
        </div>
    );
}
