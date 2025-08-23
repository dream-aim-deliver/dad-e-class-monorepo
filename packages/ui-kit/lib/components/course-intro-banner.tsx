import { isLocalAware, getDictionary } from '@maany_shr/e-class-translations';
import { VideoPlayer } from './video-player';
import { FC } from 'react';
import RichTextRenderer from './rich-text-element/renderer';

export interface CourseIntroBannerProps extends isLocalAware {
    description: string;
    videoId: string;
    thumbnailUrl?: string;
    onErrorCallback: (message: string, error: any) => void;
}

/**
 * A responsive banner component that introduces a course with localized title text,
 * a rich-text description, and an embedded video.
 *
 * @param description A rich-text description providing context or summary about the course.
 * @param videoId The unique identifier for the course's intro video (used by the `VideoPlayer`).
 * @param thumbnailUrl (optional) URL of the video's thumbnail image to be shown before playback.
 * @param locale The current locale for localization-aware rendering (inherited from `isLocalAware`).
 * @param onErrorCallback A callback function to handle errors in the `VideoPlayer` component.
 *
 * The component displays a video alongside descriptive text, ensuring a clear and engaging
 * course introduction. It adapts to different screen sizes with a flexible layout.
 *
 * @example
 * <CourseIntroBanner
 *   description="A comprehensive course covering both frontend and backend technologies."
 *   videoId="dQw4w9WgXcQ"
 *   thumbnailUrl="https://example.com/thumbnail.jpg"
 *   locale="en"
 *   onErrorCallback={(msg, err) => console.error(msg, err)}
 * />
 */

export const CourseIntroBanner: FC<CourseIntroBannerProps> = ({
    description,
    videoId,
    thumbnailUrl,
    locale,
    onErrorCallback,
}) => {
    const dictionary = getDictionary(locale).components.courseIntroBanner;

    return (
        <div className="flex items-center md:flex-row flex-col w-full gap-7 bg-card-fill rounded-medium border-[1px] border-card-stroke p-13">
            {/* VideoPlayer */}
            <div className="flex aspect-video w-full md:flex-1 md:basis-[50%]">
                <VideoPlayer
                    videoId={videoId}
                    thumbnailUrl={thumbnailUrl}
                    locale={locale}
                    onErrorCallback={onErrorCallback}
                    className="w-full h-full"
                />
            </div>
            {/* Text Content and Description */}
            <div className="flex flex-col gap-3 md:flex-1 md:basis-[40%]">
                <h2 className="text-text-primary text-2xl lg:text-3xl">
                    {' '}
                    {dictionary.title}{' '}
                </h2>
                <RichTextRenderer
                    content={description}
                    className="w-full  lg:text-md text-normal leading-[150%] text-text-secondary"
                    onDeserializationError={(message, error) => {
                        console.error(
                            'Error deserializing content:',
                            message,
                            error,
                        );
                    }}
                />
            </div>
        </div>
    );
};
