import { VideoPlayer } from '../video-player';
import { homePage } from '@maany_shr/e-class-models';

/**
 * A Hero component that displays a prominent section with a title, description, and an embedded video player.
 * This component is designed to highlight key content with a visually appealing layout, combining text and video.
 *
 * @param title The main title of the hero section.
 * @param description The supporting text or description for the hero section.
 * @param videoId The unique identifier for the video to be played.
 * @param thumbnailUrl The URL of the thumbnail image for the video.
 *
 * @example
 * <Hero
 *   title="Welcome to Our Platform"
 *   description="Learn from the best instructors around the world."
 *   videoId="abc123xyz"
 *   thumbnailUrl="https://example.com/thumbnail.jpg"
 * />
 */

export const Hero: React.FC<homePage.THomeBanner> = ({
  title,
  description,
  videoId,
  thumbnailUrl,
}) => {
  return (
    <div className="flex md:flex-row flex-col  gap-[4.1875rem] items-center w-full">
        <div className="flex flex-col gap-[2.5625rem] items-start w-full md:col-span-3">
            <p className="text-4xl text-text-primary font-bold leading-[100%] tracking-[-0.08rem]">
                {title}
            </p>
            <p className="text-lg text-text-secondary leading-[150%]">{description}</p>
        </div>
        {/* VideoPlayer */}
        <VideoPlayer videoId={videoId} thumbnailUrl={thumbnailUrl} />
    </div>
  );
};
