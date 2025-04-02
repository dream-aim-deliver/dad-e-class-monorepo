import MuxPlayer from '@mux/mux-player-react';
import { useState, useEffect, useRef } from 'react';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';

export interface VideoPlayerProps extends isLocalAware {
    videoId?: string;
    thumbnailUrl?: string;
    onErrorCallback?: (message: string, error: any) => void;
}

/**
 * VideoPlayer Component
 *
 * A customizable video player that integrates with Mux for seamless video streaming.  
 * It supports thumbnail previews, error handling, and localization.
 *
 * @component
 * @param {VideoPlayerProps} props - The properties for the VideoPlayer component.
 * @param {string} [props.videoId] - The unique identifier for the video (Mux playback ID).
 * @param {string} [props.thumbnailUrl] - The URL of the thumbnail image displayed before playback.
 * @param {string} props.locale - The current language/locale for text translations.
 * @param {(message: string, error: any) => void} props.onErrorCallback - A callback function triggered when an error occurs.
 */
export const VideoPlayer: React.FC<VideoPlayerProps> = ({
    videoId,
    thumbnailUrl,
    locale,
    onErrorCallback,
}) => {
    const dictionary = getDictionary(locale);
    const [showPlayer, setShowPlayer] = useState(false);
    const [autoPlay, setAutoPlay] = useState(false);
    const [videoError, setVideoError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const muxPlayerRef = useRef<any>(null);
    const timeoutRef = useRef<any>(null);
    
    // Check if videoId exists at all
    useEffect(() => {
        if (!videoId || videoId.trim() === '') {
            setVideoError(true);
            setIsLoading(false);
            onErrorCallback(dictionary.components.videoPlayer.videoErrorText, new Error('Missing video ID'));
        } else {
            setVideoError(false);
            // Only show player if there's a valid ID and no thumbnail, or if user clicked thumbnail
            setShowPlayer(!thumbnailUrl);
            
            // Reset loading state when ID changes
            setIsLoading(true);
        }
        
        // Clear any existing timeout when ID changes
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        
        // Set timeout to show error if video doesn't load within a reasonable time
        // This helps prevent prolonged flickering
        if (videoId) {
            timeoutRef.current = setTimeout(() => {
                if (isLoading) {
                    setVideoError(true);
                    setIsLoading(false);
                    onErrorCallback(dictionary.components.videoPlayer.videoErrorText, new Error('Video load timeout'));
                }
            }, 3000);
        }
        
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [videoId, thumbnailUrl, dictionary, onErrorCallback]);

    const handleThumbnailClick = () => {
        setShowPlayer(true);
        setAutoPlay(true);
    };

    const handleVideoError = (event: any) => {
        setVideoError(true);
        setIsLoading(false);
        onErrorCallback(dictionary.components.videoPlayer.videoErrorText, event);
        
        // Clear timeout since we got a definitive error
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    };
    
    const handlePlayerLoaded = () => {
        setIsLoading(false);
        
        // Clear timeout since player loaded successfully
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    };

    // Error component
    const ErrorDisplay = () => (
        <div className="rounded-medium w-full min-w-[18rem] h-[16rem] bg-base-neutral-700 flex items-center justify-center p-4">
            <span className="text-text-secondary text-md">
                {dictionary.components.videoPlayer.videoErrorText}
            </span>
        </div>
    );

    // Loading component - shown while waiting for player to initialize
    const LoadingDisplay = () => (
      <div className='h-full w-full items-center justify-center flex'>
        <div className="w-6 h-6 border-4 border-base-neutral-700 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    const playerStyle = videoError ? { display: 'none' } : {};

    return (
        <div className="w-full overflow-hidden">
            {!showPlayer && thumbnailUrl ? (
                <img
                    src={thumbnailUrl}
                    alt="Video Thumbnail"
                    className="w-auto max-w-full h-auto object-contain cursor-pointer"
                    onClick={handleThumbnailClick}
                    onError={() => {
                        if (!videoError) {
                            setShowPlayer(true);
                        }
                    }}
                />
            ) : (
                <div className="relative w-full">
                    {/* Show error display when in error state */}
                    {videoError && <ErrorDisplay />}
                    
                    {/* Show loading display when still loading and not in error state */}
                    {isLoading && !videoError && <LoadingDisplay />}
                    
                    {/* Always render MuxPlayer but hide it completely with CSS when in error state */}
                    {/* This approach allows error events to be captured without visible flickering */}
                    <div style={playerStyle} className={isLoading && !videoError ? "opacity-0" : "opacity-100"}>
                        <MuxPlayer
                            ref={muxPlayerRef}
                            streamType="on-demand"
                            playbackId={videoId}
                            accentColor="var(--color-base-brand-500)"
                            className="w-full h-full"
                            autoPlay={autoPlay}
                            onError={handleVideoError}
                            onLoadedData={handlePlayerLoaded}
                            onCanPlay={handlePlayerLoaded}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};