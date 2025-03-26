import MuxPlayer from '@mux/mux-player-react';
import { useState } from 'react';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
export interface VideoPlayerProps extends isLocalAware{
    videoId?: string;
    thumbnailUrl?: string;
};

/**
 * A VideoPlayer component that wraps the MuxPlayer for easy video playback.
 * This component is designed to integrate seamlessly with Mux's video streaming service.
 *
 * @param {VideoPlayerProps} props - The props for the VideoPlayer component
 * @param {string} props.videoId - The unique identifier for the video (Mux's playback ID)
 * @param {string} props.thumbnailUrl - The URL of the thumbnail image to display before video playback
 *
 * @returns {JSX.Element} A MuxPlayer component configured with the provided props
 *
 * @example
 * <VideoPlayer
 *   videoId="abc123xyz"
 *   thumbnailUrl="https://example.com/thumbnail.jpg"
 * />
 */

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
    videoId,
    thumbnailUrl,
    locale
}) => {
    const dictionary = getDictionary(locale);
    const [showPlayer, setShowPlayer] = useState(!thumbnailUrl); 
    const [autoPlay, setAutoPlay] = useState(false);
    const [videoError , setVideoError] = useState(!videoId);

    const handleThumbnailClick = () => {
        setShowPlayer(true);
        setAutoPlay(true); 
    };

    const handleThumbnailError = () => {
        setShowPlayer(true); 
        setAutoPlay(false); 
    };

    const handleVideoError = () => {
        setVideoError(true);
    }

    return (
        <div className="w-full overflow-hidden">
            {!showPlayer && thumbnailUrl ? (
                <img 
                    src={thumbnailUrl}
                    alt="Thumbnail"
                    className="w-auto max-w-full h-auto object-contain cursor-pointer"
                    onClick={handleThumbnailClick}
                    onError={handleThumbnailError}
                />
            ) : (
                videoError ? 
                (
                    <div className="rounded-medium w-full min-w-[18rem] h-[16rem]  bg-base-neutral-700 flex items-center justify-center p-4">
                        <span className="text-text-secondary text-md">
                            {dictionary.components.videoPlayer.videoErrorText}
                        </span>
                    </div>
                ) :
                <MuxPlayer
                    streamType="on-demand"
                    playbackId={videoId}
                    accentColor="var(--color-base-brand-500)"
                    className="w-full h-full"
                    autoPlay={autoPlay}
                    onError={handleVideoError}
                />
            )}
        </div>
    );
};
