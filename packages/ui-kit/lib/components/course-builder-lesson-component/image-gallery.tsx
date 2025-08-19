import { CourseElementTemplate, CourseElementType, DesignerComponentProps, FormComponentProps } from "../course-builder/types";
import { getDictionary } from "@maany_shr/e-class-translations";
import { IconImageGallery } from "../icons/icon-image-gallery";
import DesignerLayout from "../designer-layout";
import { fileMetadata } from "@maany_shr/e-class-models";
import { Uploader } from "../drag-and-drop-uploader/uploader";
import { useEffect, useState } from "react";
import { IconButton } from "../icon-button";
import { IconChevronLeft } from "../icons/icon-chevron-left";
import { IconChevronRight } from "../icons/icon-chevron-right";
import { cn } from "../../utils/style-utils";


/**
 * @fileoverview Image gallery component for the course builder.
 * Provides functionality for uploading, displaying, and managing multiple images in a carousel layout.
 */
/**
 * Template configuration for the image gallery element in the course builder.
 * Defines the component's type, button appearance, and associated components.
 */
const imageGalleryElement: CourseElementTemplate = {
    type: CourseElementType.ImageGallery,
    designerBtnElement: {
        icon: IconImageGallery,
        label: "Image Gallery"
    },
    // @ts-ignore
    designerComponent: DesignerComponent,
    formComponent: FormComponent
};

type TImageFile = fileMetadata.TFileMetadata & { category: 'image' };

/**
 * Props interface for the image gallery edit component.
 * Extends DesignerComponentProps with additional properties for file handling.
 */
interface ImageGalleryEditProps extends DesignerComponentProps {
    /** Maximum file size allowed for upload in MB */
    maxSize: number;
    /** Callback function triggered when files are changed. Returns a Promise with upload response */
    onImageUpload: (
        fileRequest: fileMetadata.TFileUploadRequest,
        abortSignal?: AbortSignal
    ) => Promise<TImageFile>;

    onUploadComplete: (file: TImageFile) => void;
    onFileDelete: () => void;
    /** Callback function to handle file download */
    onFileDownload: () => void;
    /** Currently selected file or null if no file is selected */
    files: TImageFile[] | null;
}

/**
 * Designer component for managing multiple image uploads in a gallery format.
 * Provides UI for uploading, viewing, and managing multiple images with a maximum limit.
 * 
 * @param elementInstance - The current gallery element instance
 * @param locale - The current locale for translations
 * @param onUpClick - Callback for moving the element up
 * @param onDownClick - Callback for moving the element down
 * @param onDeleteClick - Callback for deleting the element
 * @param files - Array of uploaded files
 * @param onChange - Callback for file changes
 * @param onFileDownload - Callback for file downloads
 * @param onFileDelete - Callback for file deletion
 */
export function DesignerComponent({ elementInstance, locale, onUpClick, onDownClick, onDeleteClick, files, onImageUpload, onUploadComplete, onFileDownload, onFileDelete, maxSize }: ImageGalleryEditProps) {
    if (elementInstance.type !== CourseElementType.ImageGallery) return null;
    const dictionary = getDictionary(locale);

    const handleImageFile = async (
        fileRequest: fileMetadata.TFileUploadRequest,
        abortSignal?: AbortSignal
    ): Promise<TImageFile> => {
        return await onImageUpload(fileRequest, abortSignal);
    };

    const handleUploadComplete = (imageMetadata: fileMetadata.TFileMetadata) => {
        onUploadComplete?.(imageMetadata as TImageFile);
    };

    return (
        <DesignerLayout
            type={elementInstance.type}
            title={dictionary.components.courseBuilder.ImageGalleryText}
            icon={<IconImageGallery classNames="w-6 h-6" />}
            onUpClick={() => onUpClick?.(elementInstance.id)}
            onDownClick={() => onDownClick?.(elementInstance.id)}
            onDeleteClick={() => onDeleteClick?.(elementInstance.id)}
            locale={locale}
            courseBuilder={true}
        >
            <Uploader
                type="multiple"
                variant="image"
                files={files}
                maxFile={6}
                onFilesChange={handleImageFile}
                onUploadComplete={handleUploadComplete}
                onDelete={onFileDelete}
                onDownload={onFileDownload}
                locale={locale}
                maxSize={maxSize}
            />
        </DesignerLayout>
    );
}

/**
 * Form component for displaying a gallery of images with carousel functionality.
 * Provides an interactive image gallery with:
 * - Featured image display
 * - Thumbnail navigation
 * - Responsive layout with different number of visible thumbnails
 * - Previous/Next navigation controls
 * 
 * @param elementInstance - The gallery element instance containing image URLs
 * @returns A responsive image gallery with navigation controls
 */
export function FormComponent({ elementInstance }: FormComponentProps) {
    if (elementInstance.type !== CourseElementType.ImageGallery) return null;

    const [currentIndex, setCurrentIndex] = useState(0);

    /**
     * Helper function to determine the number of visible thumbnails based on screen width.
     * @returns {number} The number of thumbnails to display
     */
    const getVisibleItemCount = () => {
        if (typeof window !== "undefined") {
            const width = window.innerWidth;
            if (width < 640) return 3; // Small mobile devices (e.g., phones in portrait)
            if (width < 768) return 4; // Mobile (640px to 767px)
            return 6;                  // Tablet and larger (768px+)
        }
        return 3; // Default fallback (SSR or undefined window)
    };

    const [visibleItems, setVisibleItems] = useState(getVisibleItemCount());
    const imageElements = elementInstance?.images ? elementInstance.images : [];

    const totalSlides = imageElements.length;

    useEffect(() => {
        const handleResize = () => {
            setVisibleItems(getVisibleItemCount());
        };

        window.addEventListener("resize", handleResize);
        handleResize();

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const canScroll = totalSlides > visibleItems;

    const nextSlide = () => {
        if (!canScroll) return;
        setCurrentIndex((prevIndex) =>
            prevIndex === totalSlides - 1 ? 0 : prevIndex + 1
        );
    };

    const prevSlide = () => {
        if (!canScroll) return;
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? totalSlides - 1 : prevIndex - 1
        );
    };

    const thumbWidthPercent = canScroll
        ? (100 / visibleItems)
        : (totalSlides > 0 ? (100 / totalSlides) : 100);

    const translateXPercent = canScroll
        ? -(currentIndex * (100 / visibleItems))
        : 0;

    return (
        <div className="flex flex-col items-center p-4">
            <div className="w-full max-w-xl">
                {/* Featured image */}
                <img
                    className="w-full h-96 object-cover rounded-lg mb-4"
                    src={imageElements[currentIndex].url}
                    alt={`Image ${currentIndex + 1}`}
                />

                {/* Carousel */}
                <div className="relative overflow-hidden">
                    <div
                        className="flex gap-2 transition-transform duration-500 ease-out"
                        style={{
                            transform: `translateX(${translateXPercent}%)`
                        }}
                    >
                        {imageElements.map((image, index) => (
                            <div
                                key={index}
                                className={cn("flex-shrink-0", index === currentIndex && "border-2 border-button-primary-fill rounded-md")}
                                style={{ width: `${thumbWidthPercent}%` }}
                            >
                                <img
                                    className="w-full h-24 object-cover cursor-pointer rounded-md"
                                    src={image?.url}
                                    alt={`Image ${index}`}
                                    onClick={() => setCurrentIndex(index)}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Navigation buttons */}
                    {canScroll && (
                        <>
                            <IconButton
                                icon={<IconChevronLeft />}
                                onClick={prevSlide}
                                styles="secondary"
                                size="small"
                                className="absolute left-0 top-1/2 -translate-y-1/2 p-2 border-none cursor-pointer text-button-primary-fill bg-none z-10"
                                aria-label="Previous slide"
                            />
                            <IconButton
                                icon={<IconChevronRight />}
                                onClick={nextSlide}
                                styles="secondary"
                                size="small"
                                className="absolute right-0 top-1/2 -translate-y-1/2 p-2 border-none cursor-pointer z-10"
                                aria-label="Next slide"
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default imageGalleryElement;