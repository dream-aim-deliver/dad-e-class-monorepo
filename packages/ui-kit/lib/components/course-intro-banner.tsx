import { isLocalAware } from "@maany_shr/e-class-translations";
import { VideoPlayer } from "./video-player";
import { FC } from "react";

export interface CourseIntroBannerProps extends isLocalAware {
    title: string;
    description: string;
    videoId: string;
    thumbnailUrl?: string;
    onErrorCallback: (message: string, error: any) => void;
}

/**
 * A responsive banner component that introduces a course with a title, description, and embedded video.
 * 
 * @param title The main heading or title of the course, displayed prominently.
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
    title, 
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
            <div className="flex flex-col gap-[1rem] w-full md:flex-1 md:basis-[40%]">
                <h2 title={title} className="text-3xl text-text-primary font-bold line-clamp-2">
                    {title}
                </h2>
                <p className="text-xl text-base-white ">
                    {description}
                </p>
            </div>
        </div>
    );
};