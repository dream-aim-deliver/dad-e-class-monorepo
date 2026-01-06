'use client';

import MuxPlayer from '@mux/mux-player-react';
import { useEffect, useState } from 'react';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { IconLoaderSpinner } from './icons/icon-loader-spinner';
import { parseVideoId } from '../utils/mux-utils';

export interface AutoPlayVideoPlayerProps extends isLocalAware {
    videoId?: string;
    thumbnailUrl?: string;
    onErrorCallback?: (message: string, error: Event | Error) => void;
    className?: string;
}

/**
 * A responsive, localized video player component built on top of Mux that autoplays on page load.
 *
 * Automatically plays videos with sound disabled when the component mounts. Supports optional
 * poster/thumbnail image and handles various playback scenarios including error fallback and loading indicator.
 *
 * @component
 * @param {string} [videoId] - Mux playback ID used to load the video stream.
 * @param {string} [thumbnailUrl] - Optional poster image displayed before the video loads.
 * @param {(message: string, error: Event | Error) => void} onErrorCallback - Callback invoked when the video fails to load or play.
 * @param {string} locale - Current user locale used for fetching localized text.
 * @param {string} [className="w-full"] - Optional CSS class for customizing the outer container.
 *
 * @state {boolean} videoError - Indicates if the player encountered an error or no video ID was provided.
 * @state {boolean} isPlayerReady - Tracks whether the Mux player has finished loading.
 *
 * @behavior
 * - Automatically plays the video with muted sound when the component loads.
 * - Displays a poster image if provided via thumbnailUrl prop.
 * - Shows a loading spinner while the player is initializing.
 * - Displays a localized error fallback UI if the `videoId` is missing or player encounters a failure.
 * - Uses translations from `@maany_shr/e-class-translations` for localized messages.
 *
 * @note
 * - This component always autoplays with muted sound. For user-initiated playback, use the VideoPlayer component instead.
 * - This component avoids `useCallback` as its internal handlers do not cause re-renders or prop drilling.
 *   If memoizing the component or extracting handlers upward, consider using `useCallback`.
 *
 * @example
 * <AutoPlayVideoPlayer
 *   videoId="mux123abc"
 *   thumbnailUrl="/assets/poster.jpg"
 *   onErrorCallback={(message, err) => console.error(message, err)}
 *   locale="en"
 *   className="aspect-video"
 * />
 */
export const AutoPlayVideoPlayer: React.FC<AutoPlayVideoPlayerProps> = ({
    videoId,
    thumbnailUrl,
    onErrorCallback,
    locale,
    className = 'w-full',
}) => {
    const dictionary = getDictionary(locale);
    const { playbackId, playbackToken } = parseVideoId(videoId);
    const [videoError, setVideoError] = useState(!videoId);
    const [isPlayerReady, setIsPlayerReady] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        setVideoError(!videoId);
        setIsPlayerReady(false);
    }, [videoId]);

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

    // Fixed aspect ratio container with absolute positioning for all content
    return (
        <div className={`relative ${className}`}>
            {/* Error state */}
            {videoError && (
                <div className="absolute inset-0 w-full h-full bg-base-neutral-700 flex items-center justify-center p-4">
                    <span className="text-text-secondary text-md">
                        {dictionary.components.videoPlayer.videoErrorText}
                    </span>
                </div>
            )}

            {/* Loading state - only shown when player is loading and no error */}
            {!isPlayerReady && !videoError && (
                <div className="absolute inset-0 w-full h-full bg-base-neutral-700 flex items-center justify-center p-4">
                    <IconLoaderSpinner
                        classNames="animate-spin text-text-primary"
                        size="6"
                    />
                </div>
            )}

            {/* Video player - only rendered on client after mount to avoid hydration mismatch */}
            {mounted && !videoError && (
                <div
                    className={`absolute inset-0 w-full h-full ${!isPlayerReady ? 'opacity-0' : 'opacity-100'}`}
                >
                    <MuxPlayer
                        key={videoId}
                        streamType="on-demand"
                        playbackId={playbackId}
                        tokens={playbackToken ? { playback: playbackToken } : undefined}
                        accentColor="var(--color-base-brand-500)"
                        className="w-full h-full"
                        autoPlay={true}
                        muted={true}
                        loop={true}
                        poster={thumbnailUrl ?? ''}
                        onCanPlay={handlePlayerReady}
                        onError={handleVideoError}
                    />
                </div>
            )}
        </div>
    );
};

