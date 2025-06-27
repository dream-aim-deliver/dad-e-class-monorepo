import CardListLayout from '../card-list-layout';
import { Skeleton } from './skeleton';

interface CoachCardListSkeletonProps {
    cardCount?: number;
}

export function CoachCardListSkeleton({ 
    cardCount = 6 
}: CoachCardListSkeletonProps) {
    return (
        <CardListLayout className="lg:grid-cols-2">
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
            {/* Header section with profile and stats */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
                    <div className="flex flex-col min-w-0 gap-1">
                        <Skeleton className="h-4 w-32 rounded" />
                        <div className="flex w-full gap-1 items-center">
                            <Skeleton className="h-4 w-20 rounded" />
                            <Skeleton className="h-3 w-8 rounded" />
                            <Skeleton className="h-3 w-12 rounded" />
                        </div>
                    </div>
                </div>

                {/* Language & Session Count */}
                <div className="flex items-start gap-y-2 gap-x-4 w-full flex-wrap">
                    <div className="flex items-center gap-1">
                        <Skeleton className="w-4 h-4 rounded flex-shrink-0" />
                        <Skeleton className="h-4 w-24 rounded" />
                    </div>
                    <div className="flex items-center gap-1">
                        <Skeleton className="w-4 h-4 rounded flex-shrink-0" />
                        <Skeleton className="h-4 w-28 rounded" />
                    </div>
                </div>
            </div>

            {/* Skills section */}
            <div className="h-16 flex-shrink-0">
                <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-14 rounded-full" />
                    <Skeleton className="h-6 w-18 rounded-full" />
                </div>
            </div>

            <div className="flex flex-col gap-4">
                {/* Description */}
                <div className="h-21 lg:h-24">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full rounded" />
                        <Skeleton className="h-4 w-full rounded" />
                        <Skeleton className="h-4 w-full rounded" />
                        <Skeleton className="h-4 w-3/4 rounded" />
                    </div>
                </div>

                {/* Teaches Section */}
                <div className="flex flex-wrap gap-2 items-center min-h-18">
                    <Skeleton className="h-4 w-16 rounded" />
                    <div className="flex items-center gap-1">
                        <Skeleton className="w-6 h-6 rounded-small" />
                        <Skeleton className="h-4 w-20 rounded" />
                    </div>
                    <div className="flex items-center gap-1">
                        <Skeleton className="w-6 h-6 rounded-small" />
                        <Skeleton className="h-4 w-24 rounded" />
                    </div>
                    <div className="flex items-center gap-1">
                        <Skeleton className="w-6 h-6 rounded-small" />
                        <Skeleton className="h-4 w-18 rounded" />
                    </div>
                </div>
            </div>

            {/* Card Footer */}
            <div className="flex flex-col gap-2">
                <Skeleton className="w-full h-10 rounded-medium" />
                <Skeleton className="w-full h-10 rounded-medium" />
            </div>
        </div>
    );
}