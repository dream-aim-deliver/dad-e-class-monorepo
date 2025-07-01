import { Skeleton } from './skeleton';

interface CarouselSkeletonProps {
    className?: string;
}

export function CarouselSkeleton({ className = "" }: CarouselSkeletonProps) {
    return (
        <div className={`px-4 md:px-6 lg:px-8 ${className}`}>
            <div className="max-w-7xl mx-auto">
                <div className="relative">
                    {/* Carousel Content Skeleton */}
                    <div className="overflow-hidden">
                        <div className="flex w-full justify-center flex-shrink-0">
                            {/* Card 1 - Always visible */}
                            <div className="justify-items-center flex-shrink-0 px-2 w-full max-w-[90%] sm:w-1/2 sm:max-w-[45%] lg:w-1/3 lg:max-w-[30%]">
                                <CarouselCardSkeleton />
                            </div>

                            {/* Card 2 - Hidden on mobile, visible on sm+ */}
                            <div className="hidden sm:block flex-shrink-0 px-2 w-1/2 max-w-[45%] lg:w-1/3 lg:max-w-[30%]">
                                <CarouselCardSkeleton />
                            </div>

                            {/* Card 3 - Hidden on mobile and tablet, visible on lg+ */}
                            <div className="hidden lg:block flex-shrink-0 px-2 w-1/3 max-w-[30%]">
                                <CarouselCardSkeleton />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Empty space for pagination */}
                <div className="h-5 mt-5"></div>

                {/* CTA Button Skeleton */}
                <div className="flex justify-center mt-8 px-4">
                    <Skeleton className="w-48 h-14 rounded-big" />
                </div>
            </div>
        </div>
    );
}

// Individual card skeleton component
function CarouselCardSkeleton() {
    return (
        <div className="flex flex-col w-full max-w-[382px]">
            <div className="flex flex-col w-full h-[540px] rounded-lg border border-solid bg-card-fill border-card-stroke">
                {/* Image Skeleton */}
                <div className="relative w-full h-[262px] rounded-t-medium overflow-hidden">
                    <Skeleton className="w-full h-full rounded-t-medium" />
                </div>

                {/* Content Skeleton */}
                <div className="flex flex-col p-4 w-full flex-grow gap-4 justify-between">
                    <div className="text-left flex flex-col gap-2">
                        {/* Title Skeleton */}
                        <Skeleton className="h-6 w-4/5 rounded" />
                        <Skeleton className="h-6 w-3/5 rounded" />

                        {/* Description Skeleton */}
                        <div className="space-y-2 mt-2">
                            <Skeleton className="h-4 w-full rounded" />
                            <Skeleton className="h-4 w-full rounded" />
                            <Skeleton className="h-4 w-4/5 rounded" />
                            <Skeleton className="h-4 w-3/4 rounded" />
                        </div>
                    </div>

                    {/* Button Skeleton */}
                    <Skeleton className="w-full h-10 sm:h-12 rounded" />
                </div>
            </div>
        </div>
    );
}
