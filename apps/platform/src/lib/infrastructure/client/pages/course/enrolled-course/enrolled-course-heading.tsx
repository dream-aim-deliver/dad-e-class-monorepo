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
    ReviewCard
} from '@maany_shr/e-class-ui-kit';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { StudentCourseTab } from '../../../utils/course-tabs';
import { trpc } from '../../../trpc/cms-client';
import { useGetCourseCertificateDataPresenter } from '../../../hooks/use-get-course-certificate-data-presenter';

interface EnrolledCourseHeadingProps {
    courseViewModel: viewModels.TEnrolledCourseDetailsViewModel;
    courseStatusViewModel?: viewModels.TGetCourseStatusViewModel;
    courseSlug: string;
    roles: string[];
    currentRole: string;
}

export default function EnrolledCourseHeading({
    courseViewModel,
    courseStatusViewModel,
    roles,
    currentRole,
    courseSlug,
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
    const createReviewMutation = trpc.createCourseReview.useMutation();

    // State for certificate data
    const [certificateDataResponse] = trpc.getCourseCertificateData.useSuspenseQuery({
        courseSlug: courseSlug,
    });
    const [certificateDataViewModel, setCertificateDataViewModel] = useState<
        viewModels.TGetCourseCertificateDataViewModel | undefined
    >(undefined);
    const { presenter: certificateDataPresenter } = useGetCourseCertificateDataPresenter(
        setCertificateDataViewModel
    );

    // @ts-ignore
    certificateDataPresenter.present(certificateDataResponse, certificateDataViewModel);

    // Handle download certificate
    const handleDownloadCertificate = () => {
        if (certificateDataViewModel?.mode === 'default') {
            const data = certificateDataViewModel.data;
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
                                    window.location.href = `/courses/${courseSlug}?role=${currentRole}&tab=${StudentCourseTab.STUDY}`;
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
    );
}
