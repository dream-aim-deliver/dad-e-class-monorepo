import { viewModels } from '@maany_shr/e-class-models';
import { TLocale } from '@maany_shr/e-class-translations';
import {
    Badge,
    Button,
    CourseProgressBar,
    Dropdown,
    IconCertification,
    IconEdit,
    IconTrashAlt,
    StarRating,
    ReviewCard,
    PaginatedCertificate,
    PaginatedCertificateHandle,
    DefaultError,
} from '@maany_shr/e-class-ui-kit';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useMemo, useState, useRef } from 'react';
import { StudentCourseTab } from '../../../utils/course-tabs';
import { trpc } from '../../../trpc/cms-client';

interface EnrolledCourseHeadingProps {
    courseViewModel: viewModels.TEnrolledCourseDetailsViewModel;
    courseStatusViewModel?: viewModels.TGetCourseStatusViewModel;
    courseSlug: string;
    roles: string[];
    currentRole: string;
    certificateDataViewModel?: viewModels.TGetCourseCertificateDataViewModel;
}

export default function EnrolledCourseHeading({
    courseViewModel,
    courseStatusViewModel,
    roles,
    currentRole,
    courseSlug,
    certificateDataViewModel,
}: EnrolledCourseHeadingProps) {
    // Use courseStatusViewModel for both completion status and progress
    const isCompleted =
        courseStatusViewModel?.mode === 'default' &&
        courseStatusViewModel.data?.courseStatus.status === 'completed';
    
    const progressPercent =
        courseStatusViewModel?.mode === 'default' &&
        courseStatusViewModel.data?.courseStatus.status === 'inProgress' &&
        'progress' in courseStatusViewModel.data.courseStatus
            ? courseStatusViewModel.data.courseStatus.progress
            : undefined;
    
    const hasProgress = progressPercent !== undefined;

    const locale = useLocale() as TLocale;
    const router = useRouter();
    const utils = trpc.useUtils();
    const createReviewMutation = trpc.createCourseReview.useMutation({
        onSuccess: () => {
            // Invalidate course details to refresh review stats
            utils.getEnrolledCourseDetails.invalidate({ courseSlug });
        },
    });

    // State for certificate error
    const [certificateError, setCertificateError] = useState<string | null>(null);

    // Ref for the PaginatedCertificate component
    const certificateRef = useRef<PaginatedCertificateHandle>(null);

    // Handle download certificate using PaginatedCertificate component
    const handleDownloadCertificate = async () => {
        if (certificateDataViewModel?.mode === 'default' && certificateDataViewModel.data?.certificateData) {
            try {
                setCertificateError(null); // Clear any previous errors

                // Get the certificate DOM element
                const element = certificateRef.current?.getElement();
                if (!element) {
                    throw new Error('Certificate component not ready');
                }

                const certData = certificateDataViewModel.data.certificateData;

                // Generate filename
                const sanitizedStudentName = certData.studentUsername;
                const sanitizedCourseTitle = courseSlug;
                const filename = `Certificate_${sanitizedStudentName}_${sanitizedCourseTitle}.pdf`;

                // Dynamically import html2pdf (client-side only)
                const html2pdf = (await import('html2pdf.js')).default;

                // Configure html2pdf options
                const options = {
                    margin: 0,
                    filename: filename,
                    image: { type: 'jpeg' as const, quality: 0.98 },
                    html2canvas: {
                        scale: 2,
                        useCORS: true,
                        logging: false,
                        backgroundColor: '#0C0A09'
                    },
                    jsPDF: {
                        unit: 'mm' as const,
                        format: 'a4' as const,
                        orientation: 'landscape' as const
                    },
                    pagebreak: { mode: ['css', 'legacy'] as const }
                };

                // Generate and download PDF
                await html2pdf().set(options).from(element).save();
            } catch (error) {
                setCertificateError(typeof error === 'string' ? error : 'Failed to generate certificate');
            }
        }
    };


    const handleReviewSubmit = (rating: number, review: string) => {
        createReviewMutation.mutate({
            courseSlug,
            rating,
            review,
        });
    };


    const renderProgress = () => {
        if (isCompleted) {
            return (
                <div className="w-full flex flex-col md:flex-row justify-between items-start space-y-6 gap-6">
                    {/* Left side: Review component */}
                    <div className="flex flex-col space-y-4">
                        <ReviewCard
                            modalType="course"
                            locale={locale}
                            onSubmit={handleReviewSubmit}
                            isLoading={createReviewMutation.isPending}
                            isError={createReviewMutation.isError}
                            submitted={createReviewMutation.isSuccess}
                            showSkipButton={false}
                        />
                    </div>

                    {/* Right side: Download certificate button */}
                    <div className="flex flex-col space-y-4 items-start md:items-end">
                        <Button
                            hasIconLeft
                            iconLeft={<IconCertification />}
                            className="px-0 mb-0"
                            variant="text"
                            text={courseTranslations(
                                'completedPanel.downloadCertificate',
                            )}
                            onClick={handleDownloadCertificate}
                        />
                        {certificateError && (
                            <DefaultError title={certificateError} locale={locale} />
                        )}
                    </div>
                </div>
            );
        }

        return null;
    };

    const courseTranslations = useTranslations('pages.course');

    const roleOptions = useMemo(() => {
        if (!roles || roles.length === 0) {
            return [];
        }

        const options: { label: string; value: string }[] = [];
        for (const role of roles) {
            let label: string | undefined;

            switch (role) {
                case 'student':
                    label = courseTranslations('roleDropdown.student');
                    break;
                case 'coach':
                    label = courseTranslations('roleDropdown.coach');
                    break;
                case 'course_creator':
                    label = courseTranslations('roleDropdown.creator');
                    break;
                case 'creator':
                    label = courseTranslations('roleDropdown.creator');
                    break;
                case 'admin':
                    label = courseTranslations('roleDropdown.admin');
                    break;
            }

            if (!label) continue;

            options.push({
                label,
                value: role,
            });
        }
        return options;
    }, [roles, courseTranslations]);

    const onRoleChange = (role: string | string[] | null) => {
        if (!role && Array.isArray(role)) return;
        if (role === currentRole) return;
        router.push(`/courses/${courseSlug}?role=${role}`);
    };

    if (courseViewModel.mode !== 'default') return null;

    return (
        <>
            {/* Hidden PaginatedCertificate component for PDF generation */}
            {certificateDataViewModel?.mode === 'default' && certificateDataViewModel.data?.certificateData && (
                <div className="fixed -left-[9999px] top-0">
                    <PaginatedCertificate
                        ref={certificateRef}
                        studentName={`${certificateDataViewModel.data.certificateData.studentName} ${certificateDataViewModel.data.certificateData.studentSurname}`}
                        courseTitle={certificateDataViewModel.data.certificateData.courseName}
                        completionDate={new Date(certificateDataViewModel.data.certificateData.awardedOn).toLocaleDateString(locale, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                        certificateId={certificateDataViewModel.data.certificateData.certificateId}
                        platformName={certificateDataViewModel.data.certificateData.platformName}
                        awardedYear={new Date(certificateDataViewModel.data.certificateData.awardedOn).getFullYear().toString()}
                        platformLogoUrl={certificateDataViewModel.data.certificateData.platformLogoUrl}
                        courseDescription={certificateDataViewModel.data.certificateData.courseDescription}
                        courseSummary={certificateDataViewModel.data.certificateData.courseSummary}
                        showBadge={true}
                        className=""
                        locale={locale}
                    />
                </div>
            )}

        <div className="flex flex-col space-y-4">
            {/* Title and Buttons Row */}
            <div className="w-full flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div className="flex-1 flex items-end gap-4 justify-between">
                    <div className="flex flex-col gap-4">
                        <h1 className="text-left"> {courseViewModel.data.title} </h1>
                        <div className="flex space-x-2 items-center">
                            <StarRating
                                totalStars={5}
                                rating={courseViewModel.data.averageRating}
                            />
                            <span className="text-text-primary">
                                {courseViewModel.data.averageRating}
                            </span>
                            <span className="text-sm text-text-secondary">
                                ({courseViewModel.data.reviewCount})
                            </span>
                        </div>
                    </div>
                    {isCompleted ? (
                        <Badge
                            className="w-fit"
                            size="medium"
                            text={courseTranslations('completedPanel.badgeText')}
                            variant="successprimary"
                        />
                    ) : (
                        hasProgress && (
                            <CourseProgressBar
                                percentage={progressPercent ?? 0}
                                locale={locale}
                                onClickResume={() => {
                                    // ✅ Use Next.js router for instant SPA navigation
                                    router.push(`/courses/${courseSlug}?role=${currentRole}&tab=${StudentCourseTab.STUDY}`);
                                }}
                            />
                        )
                    )}
                </div>
                <div className="flex flex-wrap gap-2 items-center justify-end">
                    {currentRole === "admin" && (
                        <Button
                            variant="text"
                            hasIconLeft
                            iconLeft={<IconTrashAlt />}
                            text={courseTranslations('archiveCourseButton')}
                            size="medium"
                            onClick={() => {
                                //TODO: Implement course deletion
                            }} />
                    )}
                    {(currentRole === "admin" || currentRole === "course_creator") && (
                        <Button
                            variant="secondary"
                            hasIconLeft
                            iconLeft={<IconEdit />}
                            size="medium"
                            text={courseTranslations('editCourseButton')}
                            onClick={() => {
                                //TODO: Implement course editing
                            }} />
                    )}
                </div>
            </div>


            <div className="w-full flex flex-col md:flex-row md:justify-between md:items-center gap-4">

                <div className="w-full">
                    {renderProgress()}
                    {roleOptions.length > 1 && (
                        <div className="flex space-x-3 items-center justify-end mt-4">
                            <span className="text-text-secondary">
                                {courseTranslations('roleDropdown.viewAs')}
                            </span>
                            <Dropdown
                                type="simple"
                                className="w-fit"
                                options={roleOptions}
                                defaultValue={currentRole}
                                text={{}}
                                onSelectionChange={onRoleChange}
                            />
                        </div>
                    )}
                </div>

            </div>
        </div>
        </>
    );
}
