import { isLocalAware } from "@maany_shr/e-class-translations";
import { VideoPlayer } from "./video-player";
import { FC } from "react";
import RichTextRenderer from "./rich-text-element/renderer";

export interface CourseIntroBannerProps extends isLocalAware {
    description: string;
    videoId: string;
    thumbnailUrl?: string;
    onErrorCallback: (message: string, error: any) => void;
}

/**
 * A responsive banner component that introduces a course with a title, description, and embedded video.
 * 
 * @param description A short description providing context or summary about the course.
 * @param videoId The unique identifier for the course's intro video (used by the `VideoPlayer`).
 * @param thumbnailUrl (optional) URL of the video's thumbnail image to be shown before playback.
 * @param locale The current locale for localization-aware rendering (inherited from `isLocalAware`).
 * @param onErrorCallback A callback function to handle errors in the `VideoPlayer` component.
 * 
 * The component combines video content with textual course information, ensuring a clear and engaging
 * course introduction. It uses a flexible layout to support different screen sizes.
 *
 * @example
 * <CourseIntroBanner
 *   title="Learn Full Stack Development"
 *   description="A comprehensive course covering both frontend and backend technologies."
 *   videoId="dQw4w9WgXcQ"
 *   thumbnailUrl="https://example.com/thumbnail.jpg"
 *   locale="en"
 * />
 */

export const CourseIntroBanner: FC<CourseIntroBannerProps> = ({ 
    description, 
    videoId,
    thumbnailUrl,
    locale,
    onErrorCallback
}) => {
    return (
        <div className="flex items-center md:flex-row flex-col w-full gap-[2.5rem]">
            {/* VideoPlayer */}
            <div className="aspect-video w-full md:flex-1 md:basis-[60%]">
                <VideoPlayer
                    videoId={videoId} 
                    thumbnailUrl={thumbnailUrl} 
                    locale={locale}
                    onErrorCallback={onErrorCallback}
                    className="w-full h-full" 
                />
            </div>
            {/* Text Content and Description */}
            <RichTextRenderer
                content={description}
                className="w-full md:flex-1 md:basis-[40%] lg:text-md text-normal leading-[150%] text-text-secondary"
                onDeserializationError={(message, error) => {
                    console.error(
                        'Error deserializing content:',
                        message,
                        error,
                    );
                }}
            />
        </div>
    );
};