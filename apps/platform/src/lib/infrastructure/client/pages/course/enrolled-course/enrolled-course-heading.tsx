import { viewModels } from '@maany_shr/e-class-models';
import { useGetStudentCourseReviewPresenter } from '../../../hooks/use-get-student-course-review-presenter';
import { TLocale } from '@maany_shr/e-class-translations';
import {
    Badge,
    Button,
    CourseProgressBar,
    Dropdown,
    IconCertification,
    IconEdit,
    IconTrashAlt,
    IconLoaderSpinner,
    StarRating,
    ReviewCard,
    PaginatedCertificate,
    PaginatedCertificateHandle,
    DefaultError,
    Dialog,
    DialogContent,
    DialogBody,
} from '@maany_shr/e-class-ui-kit';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useMemo, useState, useRef, Suspense } from 'react';
import { StudentCourseTab } from '../../../utils/course-tabs';
import { trpc } from '../../../trpc/cms-client';
import StudentGroupButton from './student-group-button';

interface EnrolledCourseHeadingProps {
    courseViewModel: viewModels.TEnrolledCourseDetailsViewModel;
    courseStatusViewModel?: viewModels.TGetCourseStatusViewModel;
    courseSlug: string;
    roles: string[];
    currentRole: string;
    certificateDataViewModel?: viewModels.TGetCourseCertificateDataViewModel;
    isArchived?: boolean;
    showArchivedBadge?: boolean;
}

export default function EnrolledCourseHeading({
    courseViewModel,
    courseStatusViewModel,
    roles,
    currentRole,
    courseSlug,
    certificateDataViewModel,
    isArchived,
    showArchivedBadge,
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
            // Invalidate existing review query to update the submitted state
            utils.getStudentCourseReview.invalidate({ courseSlug });
        },
    });

    // Query for existing review to show submitted state on page reload
    const [existingReviewResponse] = trpc.getStudentCourseReview.useSuspenseQuery({
        courseSlug,
    });
    const [existingReviewViewModel, setExistingReviewViewModel] = useState<
        viewModels.TGetStudentCourseReviewViewModel | undefined
    >(undefined);
    const { presenter: existingReviewPresenter } = useGetStudentCourseReviewPresenter(
        setExistingReviewViewModel,
    );
    // @ts-ignore
    existingReviewPresenter.present(existingReviewResponse, existingReviewViewModel);

    // Check if user already has a review (review can be null or undefined when none exists)
    const hasExistingReview = existingReviewViewModel?.mode === 'default' &&
        existingReviewViewModel.data?.review !== undefined &&
        existingReviewViewModel.data?.review !== null;

    // State for certificate error and loading
    const [certificateError, setCertificateError] = useState<string | null>(null);
    const [isDownloading, setIsDownloading] = useState(false);

    // State for missing student data modal
    const [showMissingDataModal, setShowMissingDataModal] = useState(false);

    // Ref for the PaginatedCertificate component
    const certificateRef = useRef<PaginatedCertificateHandle>(null);

    // Handle download certificate using PaginatedCertificate component
    const handleDownloadCertificate = async () => {
        if (certificateDataViewModel?.mode === 'default' && certificateDataViewModel.data?.certificateData) {
            const { studentName, studentSurname } = certificateDataViewModel.data.certificateData;

            // Validate student data before allowing download
            const hasValidName = studentName && typeof studentName === 'string' && studentName.trim().length > 0;
            const hasValidSurname = studentSurname && typeof studentSurname === 'string' && studentSurname.trim().length > 0;

            if (!hasValidName || !hasValidSurname) {
                setShowMissingDataModal(true);
                return;
            }

            try {
                setIsDownloading(true);
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
            } finally {
                setIsDownloading(false);
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
                        {hasExistingReview ? (
                            // Display existing review (no form, no buttons)
                            <div className="w-[390px] flex flex-col gap-4 p-6 rounded-lg border border-card-stroke bg-card-fill">
                                <p className="text-lg font-bold text-text-primary">
                                    {courseTranslations('completedPanel.yourReview')}
                                </p>
                                <div className="bg-base-neutral-800 p-3 rounded-lg border border-card-stroke">
                                    <p className="text-sm text-text-secondary text-left line-clamp-3">
                                        &quot;{existingReviewViewModel?.mode === 'default' && existingReviewViewModel.data?.review?.review}&quot;
                                    </p>
                                    <div className="flex justify-end items-center gap-1 mt-2">
                                        <StarRating
                                            rating={existingReviewViewModel?.mode === 'default' ? existingReviewViewModel.data?.review?.rating || 0 : 0}
                                            totalStars={5}
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : !isArchived ? (
                            // Show review form if no existing review and course is not archived
                            <ReviewCard
                                modalType="course"
                                locale={locale}
                                onSubmit={handleReviewSubmit}
                                isLoading={createReviewMutation.isPending}
                                isError={createReviewMutation.isError}
                                submitted={createReviewMutation.isSuccess}
                                showSkipButton={false}
                            />
                        ) : null}
                    </div>

                    {/* Right side: Download certificate button */}
                    <div className="flex flex-col space-y-4 items-start md:items-end">
                        <Button
                            hasIconLeft
                            iconLeft={isDownloading ? <IconLoaderSpinner classNames="animate-spin" /> : <IconCertification />}
                            className="px-0 mb-0"
                            variant="text"
                            text={isDownloading
                                ? courseTranslations('completedPanel.downloadingCertificate')
                                : courseTranslations('completedPanel.downloadCertificate')
                            }
                            onClick={handleDownloadCertificate}
                            disabled={isDownloading}
                        />
                        {certificateError && (
                            <DefaultError
                                type="simple"
                                locale={locale}
                                title={courseTranslations('error.title')}
                                description={certificateError}
                            />
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
        const seenLabels = new Set<string>();

        for (const role of roles) {
            let label: string | undefined;
            let normalizedValue = role;

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
                case 'superadmin':
                    label = courseTranslations('roleDropdown.admin');
                    // Normalize superadmin to admin for deduplication
                    normalizedValue = 'admin';
                    break;
            }

            if (!label) continue;

            // Skip if we've already added this label
            if (seenLabels.has(label)) continue;
            seenLabels.add(label);

            options.push({
                label,
                value: normalizedValue,
            });
        }
        return options;
    }, [roles, courseTranslations]);

    const onRoleChange = (role: string | string[] | null) => {
        if (!role && Array.isArray(role)) return;
        if (role === currentRole) return;
        router.push(`/${locale}/courses/${courseSlug}?role=${role}`);
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
                            <div className="flex items-center gap-4">
                                <h1 className="text-left"> {courseViewModel.data.title} </h1>
                                {showArchivedBadge && (
                                    <Badge
                                        className="px-3 py-1"
                                        variant="errorprimary"
                                        size="big"
                                        text={courseTranslations('archivedBadge')}
                                    />
                                )}
                            </div>
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
                        <div className="flex items-center gap-2">
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
                                        hideButton
                                    />
                                )
                            )}
                            {currentRole === "student" && (
                                <Suspense fallback={null}>
                                    <StudentGroupButton
                                        courseSlug={courseSlug}
                                        currentRole={currentRole}
                                    />
                                </Suspense>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2 items-center justify-end">
                        {(currentRole === "admin" || currentRole === "course_creator") && (
                            <Button
                                variant="secondary"
                                hasIconLeft
                                iconLeft={<IconEdit />}
                                size="medium"
                                text={courseTranslations('editCourseButton')}
                                onClick={() => {
                                    window.open(`/${locale}/edit/course/${courseSlug}`, '_blank');
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
                                    className="min-w-[150px]"
                                    options={roleOptions}
                                    defaultValue={currentRole === 'superadmin' ? 'admin' : currentRole}
                                    text={{ simpleText: '' }}
                                    onSelectionChange={onRoleChange}
                                />
                            </div>
                        )}
                    </div>

                </div>
            </div>

            {/* Missing student data modal */}
            <Dialog open={showMissingDataModal} onOpenChange={setShowMissingDataModal} defaultOpen={false}>
                <DialogContent showCloseButton closeOnOverlayClick closeOnEscape className="max-w-md">
                    <DialogBody>
                        <div className="flex flex-col gap-4">
                            <h2 className="text-xl font-semibold text-text-primary">
                                {courseTranslations('missingStudentData.title')}
                            </h2>
                            <p className="text-text-secondary">
                                {courseTranslations('missingStudentData.message')}
                            </p>
                            <div className="flex gap-3 mt-4 justify-end">
                                <Button
                                    variant="secondary"
                                    text={courseTranslations('missingStudentData.cancel')}
                                    onClick={() => setShowMissingDataModal(false)}
                                />
                                <Button
                                    variant="primary"
                                    text={courseTranslations('missingStudentData.goToProfile')}
                                    onClick={() => router.push(`/${locale}/workspace/profile`)}
                                />
                            </div>
                        </div>
                    </DialogBody>
                </DialogContent>
            </Dialog>
        </>
    );
}
