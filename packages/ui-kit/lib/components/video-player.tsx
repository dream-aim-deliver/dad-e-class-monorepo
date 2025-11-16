'use client';

import MuxPlayer from '@mux/mux-player-react';
import { useEffect, useState } from 'react';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { IconLoaderSpinner } from './icons/icon-loader-spinner';

export interface VideoPlayerProps extends isLocalAware {
    videoId?: string;
    thumbnailUrl?: string;
    onErrorCallback?: (message: string, error: Event | Error) => void;
    className?: string;
}
/**
 * A responsive, localized video player component built on top of Mux.
 *
 * Supports optional lazy-loading via a thumbnail and handles various playback scenarios including:
 * error fallback, loading indicator, and autoplay after interaction.
 *
 * @component
 * @param {string} [videoId] - Mux playback ID used to load the video stream.
 * @param {string} [thumbnailUrl] - Optional preview image displayed before the video is played.
 * @param {(message: string, error: Event | Error) => void} onErrorCallback - Callback invoked when the video fails to load or play.
 * @param {string} locale - Current user locale used for fetching localized text.
 * @param {string} [className="w-full"] - Optional CSS class for customizing the outer container.
 *
 * @state {boolean} showPlayer - Determines whether the MuxPlayer is visible or the thumbnail is shown.
 * @state {boolean} autoPlay - Indicates if the video should autoplay once the player is shown.
 * @state {boolean} videoError - Indicates if the player encountered an error or no video ID was provided.
 * @state {boolean} isPlayerReady - Tracks whether the Mux player has finished loading.
 *
 * @behavior
 * - Displays a thumbnail initially if provided. On click, reveals the video player with autoplay enabled.
 * - If no thumbnail is provided, loads the player immediately.
 * - Shows a loading spinner while the player is initializing.
 * - Displays a localized error fallback UI if the `videoId` is missing or player encounters a failure.
 * - Uses translations from `@maany_shr/e-class-translations` for localized messages.
 *
 * @note
 * - This component avoids `useCallback` as its internal handlers do not cause re-renders or prop drilling.
 *   If memoizing the component or extracting handlers upward, consider using `useCallback`.
 *
 * @example
 * <VideoPlayer
 *   videoId="mux123abc"
 *   thumbnailUrl="/assets/preview.jpg"
 *   onErrorCallback={(message, err) => console.error(message, err)}
 *   locale="en"
 *   className="aspect-video"
 * />
 */
export const VideoPlayer: React.FC<VideoPlayerProps> = ({
    videoId,
    thumbnailUrl,
    onErrorCallback,
    locale,
    className = 'w-full',
}) => {
    const dictionary = getDictionary(locale);
    const [showPlayer, setShowPlayer] = useState(!thumbnailUrl);
    const [autoPlay, setAutoPlay] = useState(false);
    const [videoError, setVideoError] = useState(!videoId);
    const [isPlayerReady, setIsPlayerReady] = useState(false);
    const [thumbnailLoaded, setThumbnailLoaded] = useState<boolean | undefined>(
        thumbnailUrl !== undefined ? false : undefined,
    );

    useEffect(() => {
        setVideoError(!videoId);
        setIsPlayerReady(false);
        setAutoPlay(false);
        setThumbnailLoaded(thumbnailUrl !== undefined ? false : undefined); // Start as false, becomes true on image load
        if (!thumbnailUrl) setShowPlayer(true);
    }, [videoId, thumbnailUrl]);

    const handleThumbnailClick = () => {
        setShowPlayer(true);
        setAutoPlay(true);
    };

    const handleThumbnailError = () => {
        setShowPlayer(true);
        setAutoPlay(false);
        setThumbnailLoaded(true);
    };

    const handleThumbnailLoad = () => {
        setThumbnailLoaded(true);
    };

    const handleVideoError = (event: Event) => {
        setVideoError(true);
        onErrorCallback?.(
            dictionary.components.videoPlayer.videoErrorText,
            event,
        );
    };

    const handlePlayerReady = () => {
        setIsPlayerReady(true);
    };

    const hasThumbnail: boolean = !showPlayer && thumbnailUrl !== undefined;

    // Fixed aspect ratio container with absolute positioning for all content
    return (
        <div className={`relative ${className}`}>
            {/* Thumbnail state */}
            {hasThumbnail && (
                <div className="absolute inset-0 w-full h-full">
                    <img
                        src={thumbnailUrl}
                        alt="Thumbnail"
                        className={`w-full h-full object-contain cursor-pointer transition-opacity duration-200 ${
                            thumbnailLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                        onClick={handleThumbnailClick}
                        onError={handleThumbnailError}
                        onLoad={handleThumbnailLoad}
                    />
                </div>
            )}

            {/* Error state */}
            {videoError && (
                <div className="absolute inset-0 w-full h-full bg-base-neutral-700 flex items-center justify-center p-4">
                    <span className="text-text-secondary text-md">
                        {dictionary.components.videoPlayer.videoErrorText}
                    </span>
                </div>
            )}

            {/* Loading state - only shown when player is loading and no error */}
            {((thumbnailUrl && thumbnailLoaded === false) ||
                (showPlayer && !isPlayerReady && !videoError)) && (
                <div className="absolute inset-0 w-full h-full bg-base-neutral-700 flex items-center justify-center p-4">
                    <IconLoaderSpinner
                        classNames="animate-spin text-text-primary "
                        size="6"
                    />
                </div>
            )}

            {/* Video player - always rendered but hidden when not ready */}
            {showPlayer && !videoError && (
                <div
                    className={`absolute inset-0 w-full h-full ${!isPlayerReady ? 'opacity-0' : 'opacity-100'}`}
                >
                    <MuxPlayer
                        key={videoId}
                        streamType="on-demand"
                        playbackId={videoId}
                        accentColor="var(--color-base-brand-500)"
                        className="w-full h-full"
                        autoPlay={autoPlay}
                        onCanPlay={handlePlayerReady}
                        onError={handleVideoError}
                    />
                </div>
            )}
        </div>
    );
};
