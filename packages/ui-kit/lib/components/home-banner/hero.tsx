import { AutoPlayVideoPlayer } from '../auto-play-video-player';
import { homePage } from '@maany_shr/e-class-models';
import { isLocalAware } from '@maany_shr/e-class-translations';
import { Outline } from '../outline';

export interface HeroProps extends homePage.THomeBanner, isLocalAware {
}

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

export const Hero: React.FC<HeroProps> = ({
    title,
    description,
    videoId,
    thumbnailUrl,
    locale
}) => {
    const hasMedia = Boolean(videoId);

    return (
        <div className="flex flex-col @3xl:flex-row gap-10 items-start @3xl:items-center w-full">
            <Outline
                title={title as string}
                description={description as string}
                className={`${hasMedia ? '@3xl:flex-[1_1_50%] @3xl:max-w-[50%]' : 'w-full'} gap-6`}
            />
            {hasMedia && (
                <div className="w-full aspect-video @3xl:flex-[1_1_50%] @3xl:max-w-[50%] @3xl:min-h-[200px] @3xl:min-w-0">
                    <AutoPlayVideoPlayer
                        videoId={videoId}
                        thumbnailUrl={thumbnailUrl}
                        locale={locale}
                        className="w-full h-full"
                    />
                </div>
            )}
        </div>
    );
};
