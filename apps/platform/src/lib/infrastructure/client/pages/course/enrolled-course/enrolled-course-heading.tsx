import { viewModels } from '@maany_shr/e-class-models';
import { TLocale } from '@maany_shr/e-class-translations';
import {
    Badge,
    Button,
    CourseProgressBar,
    Dropdown,
    IconCloudDownload,
    SectionHeading,
    StarRating,
} from '@maany_shr/e-class-ui-kit';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { StudentCourseTab } from '../../../utils/course-tabs';

interface EnrolledCourseHeadingProps {
    courseViewModel: viewModels.TEnrolledCourseDetailsViewModel;
    studentProgressViewModel?: viewModels.TStudentProgressViewModel;
    courseSlug: string;
    roles: string[];
    currentRole: string;
}

export default function EnrolledCourseHeading({
    courseViewModel,
    studentProgressViewModel,
    roles,
    currentRole,
    courseSlug,
}: EnrolledCourseHeadingProps) {
    const hasProgress =
        studentProgressViewModel?.mode === 'default' &&
        studentProgressViewModel.data.progressPercent !== undefined;
    const isCompleted =
        studentProgressViewModel?.mode === 'default' &&
        studentProgressViewModel.data.isCompleted;

    const locale = useLocale() as TLocale;
    const router = useRouter();

    const renderProgress = () => {
        if (isCompleted) {
            return (
                <div className="flex flex-col space-y-4 items-start md:items-end">
                    <Badge
                        className="w-fit"
                        size="medium"
                        text={courseTranslations('completedPanel.badgeText')}
                        variant="successprimary"
                    />
                    <Button
                        hasIconLeft
                        iconLeft={<IconCloudDownload />}
                        className="px-0 mb-0"
                        variant="text"
                        text={courseTranslations(
                            'completedPanel.downloadCertificate',
                        )}
                        onClick={() => {
                            // TODO: Implement certificate download functionality
                        }}
                    />
                </div>
            );
        }
        if (hasProgress) {
            return (
                <CourseProgressBar
                    percentage={studentProgressViewModel.data.progressPercent}
                    locale={locale}
                    onClickResume={() => {
                        window.location.href = `/courses/${courseSlug}?role=${currentRole}&tab=${StudentCourseTab.STUDY}`;
                    }}
                />
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

    return (
        <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-center">
            <div className="flex flex-col space-y-3">
                <SectionHeading text={courseViewModel.data.title} />
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
            <div className="flex flex-col space-y-4 items-start md:items-end">
                {renderProgress()}
                {roleOptions.length > 1 && (
                    <div className="flex space-x-3 items-center">
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
    );
}
