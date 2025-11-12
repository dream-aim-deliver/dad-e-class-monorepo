'use client';
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
import { ElementValidator } from '../lesson/types';
import DefaultError from '../default-error';

export const getValidationError: ElementValidator = (props) => {
    const { elementInstance, dictionary } = props;

    if (elementInstance.type !== CourseElementType.ImageGallery)
        return dictionary.components.lessons.typeValidationText;

    // Check if at least two image files are attached
    if (!elementInstance.images || elementInstance.images.length < 2) {
        return dictionary.components.imageGalleryLesson
            .imageCountValidationText;
    }

    // Validate each image file metadata
    for (let i = 0; i < elementInstance.images.length; i++) {
        const image = elementInstance.images[i];

        if (!image.id || !image.name || !image.url) {
            return `${dictionary.components.imageGalleryLesson.matadataValidationText} ${i + 1}: ${dictionary.components.imageGalleryLesson.missingPropertiesValidationText}`;
        }

        // Validate that it's an image file
        if (image.category !== 'image') {
            return `${dictionary.components.imageGalleryLesson.file} ${i + 1} ${dictionary.components.imageGalleryLesson.categoryValidationText}`;
        }

        if (image.status !== 'available') {
            return `${dictionary.components.imageGalleryLesson.image} ${i + 1} ${dictionary.components.imageGalleryLesson.statusValidationText}`;
        }

        // Validate URL format
        try {
            new URL(image.url);
        } catch {
            return `${dictionary.components.imageGalleryLesson.urlValidationText} ${i + 1}`;
        }
    }

    return undefined;
};

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
    designerComponent: DesignerComponent as React.FC<DesignerComponentProps>,
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
    onFileDelete: (id: string) => void;
    /** Callback function to handle file download */
    onFileDownload: (id: string) => void;
    /** Current upload progress percentage (0-100) */
    uploadProgress?: number;
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
export function DesignerComponent({ elementInstance, locale, onUpClick, onDownClick, onDeleteClick, onImageUpload, onUploadComplete, onFileDownload, onFileDelete, maxSize, uploadProgress }: ImageGalleryEditProps) {
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
                files={elementInstance.images}
                maxFile={6}
                onFilesChange={handleImageFile}
                onUploadComplete={handleUploadComplete}
                onDelete={onFileDelete}
                onDownload={onFileDownload}
                locale={locale}
                maxSize={maxSize}
                isDeletionAllowed={true}
                uploadProgress={uploadProgress}
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
export function FormComponent({ elementInstance, locale }: FormComponentProps) {
    if (elementInstance.type !== CourseElementType.ImageGallery) return null;

    const dictionary = getDictionary(locale);
    const validationError = getValidationError({ elementInstance, dictionary });
    if (validationError) {
        return (
            <DefaultError
                locale={locale}
                title={dictionary.components.lessons.elementValidationText}
                description={validationError}
            />
        );
    }

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
        <section className="w-full flex justify-center p-4 rounded-lg">
            <div className="w-full max-w-[1000px]">
                {/* Featured image */}
                <img
                    className="max-w-[700px] object-cover rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-base-neutral-700 mb-6 mx-auto block"
                    src={imageElements[currentIndex].url}
                    alt={`Image ${currentIndex + 1}`}
                />

                {/* Carousel */}
                <div className="relative overflow-hidden w-full">
                    <div
                        className="flex gap-2 transition-transform duration-500 ease-out min-w-0"
                        style={{
                            transform: `translateX(${translateXPercent}%)`
                        }}
                    >
                        {imageElements.map((image, index) => (
                            <div
                                key={index}
                                className={cn("flex-shrink-0 p-1 transition-all duration-300 min-w-0", index === currentIndex && "ring-2 ring-button-primary-fill ring-offset-2 ring-offset-base-neutral-900 rounded-lg shadow-lg scale-105")}
                                style={{ width: `calc(${thumbWidthPercent}% - ${(imageElements.length - 1) * 0.5 / imageElements.length}rem)` }}
                            >
                                <img
                                    className="w-full h-24 object-cover cursor-pointer rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 border border-base-neutral-600"
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
                                className="absolute -left-2 top-1/2 -translate-y-1/2 p-3 bg-base-neutral-800 hover:bg-base-neutral-700 border border-base-neutral-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer text-text-primary z-10"
                                aria-label="Previous slide"
                            />
                            <IconButton
                                icon={<IconChevronRight />}
                                onClick={nextSlide}
                                styles="secondary"
                                size="small"
                                className="absolute -right-2 top-1/2 -translate-y-1/2 p-3 bg-base-neutral-800 hover:bg-base-neutral-700 border border-base-neutral-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer text-text-primary z-10"
                                aria-label="Next slide"
                            />
                        </>
                    )}
                </div>
            </div>
        </section>
    )
}

export default imageGalleryElement;