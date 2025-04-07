import MuxPlayer from '@mux/mux-player-react';
import { useEffect, useState } from 'react';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';


export interface VideoPlayerProps extends isLocalAware {
  videoId?: string;
  thumbnailUrl?: string;
  onErrorCallback: (message: string, error: any) => void;
}
/**
 * A responsive, localized video player built on top of Mux, with optional lazy-loading via a thumbnail.
 * It handles error fallback, loading state, and autoplay toggling.
 *
 * @param videoId Mux playback ID used to load the video stream.
 * @param thumbnailUrl Optional image displayed before the video is played.
 * @param onErrorCallback A callback invoked when the video player fails to load or play.
 * @param locale Current user locale used for translations.
 *
 * @state showPlayer Whether to show the MuxPlayer or the thumbnail.
 * @state autoPlay Whether the video should autoplay after interaction.
 * @state videoError Whether to show the error fallback UI.
 * @state isPlayerReady Whether the Mux player has finished loading and is ready to play.
 *
 * @behavior
 * - Shows a thumbnail first (if provided), which when clicked, reveals the video player with autoplay enabled.
 * - If no thumbnail is provided, video player loads immediately.
 * - Shows a loading spinner until the Mux player is ready.
 * - Displays an error fallback UI when `videoId` is missing or the player fails to load.
 * - Uses localized text from `@maany_shr/e-class-translations`.
 *
 * @note
 * - We intentionally avoid `useCallback` here since the handler functions are not passed down or causing re-renders.
 * - If you memoize this component or lift handlers, consider wrapping callbacks with `useCallback`.
 *
 * @example
 * <VideoPlayer
 *   videoId="123abc"
 *   thumbnailUrl="/preview.jpg"
 *   onErrorCallback={(message, err) => console.error(message, err)}
 *   locale="en"
 * />
 */
export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoId,
  thumbnailUrl,
  onErrorCallback,
  locale
}) => {
  const dictionary = getDictionary(locale);
  const [showPlayer, setShowPlayer] = useState(!thumbnailUrl);
  const [autoPlay, setAutoPlay] = useState(false);
  const [videoError, setVideoError] = useState(!videoId);
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  useEffect(() => {
    setVideoError(!videoId);
    setIsPlayerReady(false);
    setAutoPlay(false);
    if (!thumbnailUrl) setShowPlayer(true);
  }, [videoId, thumbnailUrl]);

  const handleThumbnailClick = () => {
    setShowPlayer(true);
    setAutoPlay(true);
  };

  const handleThumbnailError = () => {
    setShowPlayer(true);
    setAutoPlay(false);
  };

  const handleVideoError = (event:any) => {
    setVideoError(true);
    onErrorCallback(dictionary.components.videoPlayer.videoErrorText, event);
  };

  const handlePlayerReady = () => {
    setIsPlayerReady(true);
  };

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
      ) : videoError ? (
        <div className="rounded-medium w-full min-w-[18rem] h-[16rem] bg-base-neutral-700 flex items-center justify-center p-4">
          <span className="text-text-secondary text-md">
            {dictionary.components.videoPlayer.videoErrorText}
          </span>
        </div>
      ) : (
        <>
          {!isPlayerReady && (
            <div className="rounded-medium w-full min-w-[18rem] h-[16rem] bg-base-neutral-700 flex items-center justify-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-0   border-b-2 border-text-primary" />
            </div>
          )}
          <MuxPlayer
            key={videoId}
            streamType="on-demand"
            playbackId={videoId}
            accentColor="var(--color-base-brand-500)"
            className={`w-full h-full ${!isPlayerReady ? 'hidden' : ''}`}
            autoPlay={autoPlay}
            onCanPlay={handlePlayerReady}
            onError={handleVideoError}
          />
        </>
      )}
    </div>
  );
};
