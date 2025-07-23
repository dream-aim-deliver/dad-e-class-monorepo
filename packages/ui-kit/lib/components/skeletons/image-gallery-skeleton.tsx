import { Skeleton } from './skeleton';

interface ImageGallerySkeletonProps {
    className?: string;
}

export function ImageGallerySkeleton({ className = "" }: ImageGallerySkeletonProps) {
    return (
        <div className={`flex flex-col items-center p-4 ${className}`}>
            <div className="w-full max-w-xl">
                {/* Featured Image Skeleton */}
                <div className="w-full h-96 mb-4">
                    <Skeleton className="w-full h-full rounded-lg" />
                </div>

                {/* Thumbnail Carousel Skeleton */}
                <div className="relative overflow-hidden">
                    <div className="flex gap-2">
                        {/* Mobile: 2 thumbnails */}
                        <ThumbnailSkeleton className="block" />
                        <ThumbnailSkeleton className="block" />
                        
                        {/* Tablet (sm+): 3 thumbnails */}
                        <ThumbnailSkeleton className="hidden sm:block" />
                        
                        {/* Desktop (lg+): 4 thumbnails */}
                        <ThumbnailSkeleton className="hidden lg:block" />
                        <ThumbnailSkeleton className="hidden lg:block" />
                        <ThumbnailSkeleton className="hidden lg:block" />
                    </div>

                    {/* Navigation Button Skeletons */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2">
                        <Skeleton className="w-8 h-8 rounded-full" />
                    </div>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2">
                        <Skeleton className="w-8 h-8 rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    );
}

// Individual thumbnail skeleton component
function ThumbnailSkeleton({ className = "" }: { className?: string }) {
    return (
        <div className={`flex-shrink-0 flex-1 ${className}`}>
            <Skeleton className="w-full h-24 rounded-md" />
        </div>
    );
}
