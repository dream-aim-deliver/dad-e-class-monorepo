import CardListLayout from '../card-list-layout';
import { Skeleton } from './skeleton';

interface CoachCardListSkeletonProps {
    cardCount?: number;
}

export function CoachCardListSkeleton({ 
    cardCount = 6 
}: CoachCardListSkeletonProps) {
    return (
        <CardListLayout className="lg:grid-cols-3  w-full">
            {Array.from({ length: cardCount }).map((_, index) => (
                <CoachCardSkeleton key={index} />
            ))}
        </CardListLayout>
    );
}

// Individual coach card skeleton component matching CoachCard structure
function CoachCardSkeleton() {
    return (
        <div className="flex flex-col bg-card-fill gap-4 text-sm md:text-md border border-card-stroke p-4 rounded-lg text-text-secondary h-[550px]">
            {/* Profile line */}
            <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <Skeleton className="h-4 w-32 rounded" />
            </div>

            {/* Info lines */}
            <Skeleton className="h-4 w-48 rounded" />
            <Skeleton className="h-4 w-40 rounded" />

            {/* Skills section */}
            <Skeleton className="h-6 w-full rounded" />

            <div className="space-y-2">
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-3/4 rounded" />
            </div>

            {/* Teaches line */}
            <Skeleton className="h-4 w-56 rounded" />

            {/* Card Footer */}
            <div className="flex flex-col gap-2">
                <Skeleton className="w-full h-10 rounded-medium" />
                <Skeleton className="w-full h-10 rounded-medium" />
            </div>
        </div>
    );
}