'use client';

import { FC } from 'react';
import { cn } from '../utils/style-utils';
import { IconAwarded } from './icons/icon-awarded';
import { IconCorner } from './icons/icon-corner';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import RichTextRenderer from './rich-text-element/renderer';
import { useImageComponent } from '../contexts/image-component-context';

const certificateStyles =
    'relative mx-auto overflow-hidden bg-base-neutral-950 ' +
    'w-full max-w-[1123px] aspect-[1.414/1] ' +
    'flex items-center justify-center p-12';

const cardStyles =
    'relative flex flex-col items-center justify-center ' +
    'bg-card-fill border-card-stroke border ' +
    'rounded-3xl p-16 shadow-lg ' +
    'w-[85%] max-w-[520px]';

export interface ModuleSummary {
    moduleTitle: string;
    moduleNumber: number;
    lessonTitles: string[];
}

export interface CourseCertificateProps extends isLocalAware {
    studentName: string;
    courseTitle: string;
    completionDate: string;
    certificateId: string;
    platformName: string;
    awardedYear: string;
    platformLogoUrl?: string;
    courseDescription?: string;
    courseSummary: ModuleSummary[];
    showBadge: boolean;
    className: string;
    paginationLabel?: string;
    showCourseDescription?: boolean;
}

/**
 * A reusable CourseCertificate component to display a certificate of completion.
 *
 * This component renders a professional certificate layout with:
 * - Platform logo (optional)
 * - Certificate title
 * - Student name
 * - Course title
 * - Awarded badge (optional)
 * - Certificate ID and completion date
 * - Platform/institution name
 *
 * @param studentName The name of the student receiving the certificate
 * @param courseTitle The title of the completed course
 * @param completionDate The date when the course was completed
 * @param certificateId Optional unique identifier for the certificate
 * @param platformName Optional name of the platform or institution
 * @param platformLogoUrl Optional URL to the platform's logo image
 * @param footerText Optional additional text to display at the bottom
 * @param showBadge Whether to display the awarded badge (default: true)
 * @param className Additional CSS classes for the container
 *
 * @example
 * <CourseCertificate
 *   studentName="John Doe"
 *   courseTitle="React Fundamentals"
 *   completionDate="January 15, 2025"
 *   certificateId="CER-123456"
 *   platformName="Learning Platform"
 * />
 */
export const CourseCertificate: FC<CourseCertificateProps> = ({
    studentName,
    courseTitle,
    completionDate,
    certificateId,
    platformName,
    awardedYear,
    platformLogoUrl,
    courseDescription,
    courseSummary,
    showBadge = true,
    className,
    locale,
    paginationLabel,
    showCourseDescription = true,
}) => {
    const ImageComponent = useImageComponent();
    const containerClasses = cn(certificateStyles, className);
    const cardClasses = cn(cardStyles);
    const dictionary = getDictionary(locale).components.certificateGenerator;

    return (
        <div className={containerClasses} style={{ backgroundColor: '#0C0A09', position: 'relative' }}>
            {/* Corner Icons */}
            <div className="pointer-events-none absolute inset-0" style={{ zIndex: 0 }}>
                <div className="absolute top-6 left-6">
                    <IconCorner />
                </div>
                <div className="absolute top-6 right-6" style={{ transform: 'rotate(90deg)' }}>
                    <IconCorner />
                </div>
                <div className="absolute bottom-6 right-6" style={{ transform: 'rotate(180deg)' }}>
                    <IconCorner />
                </div>
                <div className="absolute bottom-6 left-6" style={{ transform: 'rotate(-90deg)' }}>
                    <IconCorner />
                </div>
            </div>

            {/* 2-Column Layout */}
            <div className="flex flex-row gap-2 items-center justify-between w-full" style={{ position: 'relative', zIndex: 1 }}>
                {/* LEFT COLUMN: Certificate Card */}
                <div className="w-[60%] flex items-center justify-center">
                    <div className={cardClasses} style={{ backgroundColor: '#1C1917', borderColor: '#292524' }}>
                        <div className="mb-4 flex flex-col items-center gap-2">
                            {/* Platform Logo */}
                            {platformLogoUrl && (
                                <ImageComponent
                                    src={platformLogoUrl}
                                    alt="Platform Logo"
                                    width={160}
                                    height={48}
                                    className="h-12 w-auto object-contain mx-auto"
                                />
                            )}
                            {/* Platform Name at top */}
                            {platformName && (
                                <p className="text-xs text-text-secondary" style={{ color: '#A8A29E' }}>
                                    {platformName}
                                </p>
                            )}
                        </div>
                        <div className="flex flex-col w-full items-center">
                            {/* Certificate Title */}
                            <h3 style={{ color: '#FAFAF9' }}>{dictionary.certificateTitle}</h3>

                            {/* Certify Text */}
                            <p className="text-md mb-4 text-text-secondary" style={{ color: '#A8A29E' }}>
                                {dictionary.certifyThat}
                            </p>

                            {/* Student Name */}
                            <p className="text-3xl italic mb-4 text-center text-text-primary" style={{ color: '#FAFAF9' }}>
                                {studentName}
                            </p>

                            {/* Completion Text */}
                            <p className="text-md mb-2 text-text-secondary text-center" style={{ color: '#A8A29E' }}>
                                {dictionary.hasCompleted}
                            </p>

                            {/* Course Title */}
                            <p className="text-lg font-bold mb-6 text-center text-text-primary" style={{ color: '#FAFAF9' }}>
                                "{courseTitle}"
                            </p>
                        </div>

                        {/* Certificate ID, Badge and Date */}
                        <div className="w-full flex justify-between items-center mt-4">
                            {certificateId && (
                                <div className="text-center">
                                    <p className="text-text-secondary text-sm" style={{ color: '#A8A29E' }}>
                                        {dictionary.certificateId}
                                    </p>
                                    <p className="text-text-primary font-important text-md" style={{ color: '#FAFAF9' }}>
                                        {certificateId}
                                    </p>
                                </div>
                            )}
                            {showBadge && (
                                <div className="relative mb-6 flex justify-center items-center">
                                    <IconAwarded size="lg" />
                                    <div className="absolute flex flex-col items-center text-xs font-bold text-text-primary-inverted text-center" style={{ color: '#0C0A09', fontWeight: 'bold' }}>
                                        <span>{dictionary.awardedPrefix}</span>
                                        <span>{awardedYear}</span>
                                    </div>
                                </div>
                            )}
                            <div className="text-center">
                                <p className="text-text-secondary text-sm" style={{ color: '#A8A29E' }}>
                                    {dictionary.awardedOn}
                                </p>
                                <p className="font-important text-md text-text-primary" style={{ color: '#FAFAF9' }}>
                                    {completionDate}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Course Details (55%) */}
                <div className="w-[40%] flex flex-col gap-2 py-2">
                    {/* Course Description */}
                    {courseDescription && showCourseDescription && (
                        <div>
                            <h6 style={{ color: '#FAFAF9' }}>{dictionary.courseStructure}</h6>
                            <div className="text-xs text-text-secondary [&_p]:text-xs [&_p]:pb-0 [&_p]:mb-1 [&_div]:text-xs" style={{ color: '#A8A29E' }}>
                                <RichTextRenderer
                                    content={courseDescription}
                                    onDeserializationError={(message, error) => {
                                        console.error('Failed to deserialize course description:', message, error);
                                    }}
                                />
                            </div>
                            <hr className="mt-2 border-base-neutral-700" style={{ borderColor: '#44403C' }} />
                        </div>
                    )}

                    {/* Course Modules */}
                    {courseSummary && courseSummary.length > 0 && (
                        <div className="flex flex-col gap-4">
                            {courseSummary.map((module, index) => (
                                <div key={index}>
                                    <h6 style={{ color: '#FAFAF9' }}>
                                        {dictionary.module}{' '}
                                        {module.moduleNumber}:{' '}
                                        {module.moduleTitle}
                                    </h6>
                                    <p className="text-xs text-text-secondary" style={{ color: '#A8A29E' }}>
                                        {module.lessonTitles.join(' . ')}
                                    </p>
                                    {index < courseSummary.length - 1 && (
                                        <hr className="mt-2 border-base-neutral-700" style={{ borderColor: '#44403C' }} />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            {/* Pagination label */}
            {paginationLabel && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.2em] uppercase text-text-secondary" style={{ color: '#A8A29E', zIndex: 2 }}>
                    {paginationLabel}
                </div>
            )}
        </div>
    );
};
