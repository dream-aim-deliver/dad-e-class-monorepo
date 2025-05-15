import { useEffect, useState } from "react";
import {CourseElementTemplate, CourseElementType, DesignerComponentProps, FormComponentProps } from "../course-builder/types";
import DesignerLayout from "./designer-layout";
import { getDictionary } from "@maany_shr/e-class-translations";
import { UploadedFileType, Uploader, UploadResponse } from "../drag-and-drop/uploader";
import { IconButton } from "../icon-button";
import { IconChevronLeft } from "../icons/icon-chevron-left";
import { IconChevronRight } from "../icons/icon-chevron-right";
import { IconImageGallery } from "../icons/icon-image-gallery";
import { ImageFilePreview, ImageGalleryPreview } from "./types";
import { cn } from "../../utils/style-utils";

const imageGalleryElement: CourseElementTemplate = {
    type: CourseElementType.ImageGallery,
    designerBtnElement: {
        icon: IconImageGallery,
        label: "Image Gallery"
    },
    designerComponent: DesignerComponent,
    formComponent: FormComponent
};
interface ImageGalleryEditProps extends DesignerComponentProps  {
  onFilesChange: (files: UploadedFileType[]) => Promise<UploadResponse>;
  onFileDelete: () => void;
  onFileDownload: () => void;
  files: UploadedFileType[] | null;
}
export function DesignerComponent({ elementInstance, locale, onUpClick, onDownClick, onDeleteClick, files, onFilesChange, onFileDownload, onFileDelete }: ImageGalleryEditProps) {
    if (elementInstance.type !== CourseElementType.ImageGallery) return null;
    const dictionary = getDictionary(locale);

    return (
        <DesignerLayout
            type={elementInstance.type}
            title={dictionary.components.courseBuilder.ImageGalleryText}
            icon={<IconImageGallery classNames="w-6 h-6" />}
            onUpClick={() => onUpClick(elementInstance.id)}
            onDownClick={() => onDownClick(elementInstance.id)}
            onDeleteClick={() => onDeleteClick(elementInstance.id)}
            locale={locale}
            courseBuilder={true}
        >
            <Uploader
                type="multiple"
                variant="image"
                files={files}
                maxFile={6}
                onFilesChange={onFilesChange}
                onDelete={onFileDelete}
                onDownload={onFileDownload}
                locale={locale}
            />
        </DesignerLayout>
    );
}

/**
 * Form Component for Download Files
 * Renders the rich text content in the form view
 */
export function FormComponent({ elementInstance, locale }: FormComponentProps) {
    if (elementInstance.type !== CourseElementType.ImageGallery) return null;
  
    const [currentIndex, setCurrentIndex] = useState(0);
  
  const getVisibleItemCount = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 640) return 3; // Small mobile
      if (window.innerWidth < 768) return 4; // Mobile
      if (window.innerWidth > 768) return 6; // Tablet
    }
    return 3; // Default fallback
  };
  
  const [visibleItems, setVisibleItems] = useState(getVisibleItemCount());
  const imageElements = 
    "imageUrls" in elementInstance ? (elementInstance as ImageGalleryPreview).imageUrls : [];

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

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === totalSlides - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? totalSlides - 1 : prevIndex - 1
    );
  };
  
  return (
    <div className="flex flex-col items-center p-4">
      <div className="w-full max-w-xl">
        {/* Featured image */}
        <img
          className="w-full h-96 object-cover rounded-lg mb-4"
          src={imageElements[currentIndex]}
          alt={`Image ${currentIndex + 1}`}
        />
        
        {/* Carousel */}
        <div className="relative overflow-hidden">
          <div 
            className="flex gap-2 transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / visibleItems)}%)`
            }}
          >
            {imageElements.map((image, index) => (
              <div 
                key={index} 
                className={cn("flex-shrink-0",index === currentIndex && "border-2 border-button-primary-fill rounded-md")}
                style={{ width: `${100 / visibleItems}%` }}
              >
                <img
                  className="w-full h-24 object-cover cursor-pointer rounded-md"   
                  src={image}
                  alt={`Image ${index}`}
                  onClick={() => setCurrentIndex(index)}
                />
              </div>
            ))}
          </div>
          
          {/* Navigation buttons */}
          <IconButton
            icon={<IconChevronLeft />}
            onClick={prevSlide}
            styles="secondary"
            size="small"
            className="absolute left-0 top-1/2 -translate-y-1/2  p-2  border-none cursor-pointer text-button-primary-fill bg-none z-10"
            aria-label="Previous slide"
          />
          <IconButton
          icon={<IconChevronRight />}
            onClick={nextSlide}
            styles="secondary"
            size="small"
            className="absolute  right-0 top-1/2 -translate-y-1/2  p-2  border-none cursor-pointer  z-10"
            aria-label="Next slide"
        />
        </div>
      </div>
    </div>
  );
}

export default imageGalleryElement;