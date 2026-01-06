'use client';

import { getDictionary, isLocalAware } from "@maany_shr/e-class-translations";
import { IconButton } from "./icon-button";
import { IconClose } from "./icons/icon-close";
import { Button } from "./button";
import { IconCertification } from "./icons/icon-certification";
import { IconStar } from "./icons/icon-star";
import { Badge } from "./badge";
import { IconSuccess } from "./icons/icon-success";
import { IconLoaderSpinner } from "./icons/icon-loader-spinner";
import { useState } from "react";
import { cn } from "../utils/style-utils";
import { useImageComponent } from "../contexts/image-component-context";

export interface CourseCompletionModalProps extends isLocalAware {
    courseImage: string;
    courseTitle: string;
    completionDate: string;
    onClickDownloadCertificate: () => void;
    onClickRateCourse: () => void;
    onClose: () => void;
    className?: string;
    isDownloadingCertificate?: boolean;
};

/**
 * A modal dialog displayed when a user completes a course.
 * Shows a success badge, course information, and buttons to download a certificate or rate the course.
 * Supports localization via the `locale` prop.
 *
 * @param courseImage The URL of the course image to display.
 * @param courseTitle The title of the completed course.
 * @param completionDate The date and time when the course was completed.
 * @param onClickDownloadCertificate Function to handle the "Download Certificate" button click.
 * @param onClickRateCourse Function to handle the "Rate the Course" button click.
 * @param onClose Function to close the modal.
 * @param className Optional additional CSS classes for styling.
 * @param locale The current locale for translations.
 *
 * @example
 * <CourseCompletionModal
 *   courseImage="https://example.com/course-image.jpg"
 *   courseTitle="Introduction to AI"
 *   completionDate={new Date()}
 *   onClickDownloadCertificate={() => console.log('Download Certificate clicked')}
 *   onClickRateCourse={() => console.log('Rate Course clicked')}
 *   onClose={() => setShowModal(false)}
 *   locale="en"
 *   className="custom-class"
 * />
 */

export const CourseCompletionModal: React.FC<CourseCompletionModalProps> = ({
    courseImage,
    courseTitle,
    completionDate,
    onClickDownloadCertificate,
    onClickRateCourse,
    onClose,
    className,
    locale,
    isDownloadingCertificate = false,
}) => {
    const dictionary = getDictionary(locale);
    const ImageComponent = useImageComponent();
    const [isImageError, setIsImageError] = useState(false);

    // Handle image loading error
    const handleImageError = () => {
        setIsImageError(true);
    };
    const shouldShowPlaceholder = !courseImage || isImageError;

    // Format date and time (UTC, ISO format)
    const isoString = new Date(completionDate).toISOString();
    const [datePart, timePart] = isoString.split('T');
    const formattedDate = datePart; // "YYYY-MM-DD"
    const formattedTime = timePart.slice(0, 5); // "HH:mm"

    return (
        <div className={cn(`w-[390px] flex flex-col items-end gap-6 p-6 rounded-lg border-1 border-card-stroke bg-card-fill shadow-[0_4px_12px_rgba(12,10,9,1)] relative`, className)}>
            {/* Close button to close the modal */}
            <div className="absolute right-0 top-0">
                <IconButton
                    data-testid="close-modal-button"
                    styles="text"
                    icon={<IconClose />}
                    size="small"
                    onClick={onClose}
                    className="text-button-text-text"
                />
            </div>
            <div className="flex flex-col items-start gap-4 w-full pt-2">
                <div className="flex flex-col gap-3 w-full">
                    <div className="flex flex-col gap-3 items-start">
                        <IconSuccess classNames="text-feedback-success-primary" />
                        <p className="text-text-primary text-xl font-bold leading-[120%]">
                            {dictionary.components.courseCompletionModal.courseCompletedText}
                        </p>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-3 p-4 bg-base-neutral-800 border-1 border-base-neutral-700 rounded-medium w-full ">
                        <div className="flex flex-col gap-2 items-center justify-center">
                            {shouldShowPlaceholder ? (
                                <div className="w-full h-20 bg-base-neutral-700 flex items-center justify-center rounded-medium">
                                    <span className="text-text-secondary text-md">
                                        {dictionary.components.coachBanner.placeHolderText}
                                    </span>
                                </div>
                            ) : (
                                <ImageComponent
                                    loading="lazy"
                                    src={courseImage}
                                    alt={courseTitle}
                                    width={48}
                                    height={48}
                                    onError={handleImageError}
                                    className="w-12 h-12 rounded-medium"
                                />
                            )}
                            <p
                                className="text-text-primary text-md font-bold leading-[150%] line-clamp-1 w-full"
                                title={courseTitle}
                            >
                                {courseTitle}
                            </p>
                        </div>
                        <Badge
                            variant="successprimary"
                            size="big"
                            text={`${dictionary.components.courseCompletionModal.completedOnText} ${formattedDate} ${dictionary.components.courseCompletionModal.atText} ${formattedTime}`}
                            className="w-fit"
                        />
                    </div>
                </div>
                <div className="flex flex-col gap-2 w-full">
                    <Button
                        hasIconLeft
                        iconLeft={isDownloadingCertificate ? <IconLoaderSpinner classNames="animate-spin" /> : <IconCertification />}
                        variant="secondary"
                        size="medium"
                        onClick={onClickDownloadCertificate}
                        text={isDownloadingCertificate
                            ? dictionary.components.courseCompletionModal.downloadingCertificateText
                            : dictionary.components.courseCompletionModal.downloadCertificateText}
                        className="w-full"
                        disabled={isDownloadingCertificate}
                    />
                    <Button
                        hasIconLeft
                        iconLeft={<IconStar />}
                        variant="primary"
                        size="medium"
                        onClick={onClickRateCourse}
                        text={dictionary.components.courseCompletionModal.rateTheCourseText}
                        className="w-full"
                    />
                </div>
            </div>
        </div>
    );
};