import { viewModels } from '@maany_shr/e-class-models';
import { TLocale } from '@maany_shr/e-class-translations';
import {
    Badge,
    Button,
    CourseProgressBar,
    IconAccountInformation,
    IconCloudDownload,
    SectionHeading,
} from '@maany_shr/e-class-ui-kit';
import { useLocale } from 'next-intl';
import { StarRating } from 'packages/ui-kit/lib/components/star-rating';

interface EnrolledCourseHeadingProps {
    courseViewModel: viewModels.TEnrolledCourseDetailsViewModel;
    studentProgressViewModel?: viewModels.TStudentProgressViewModel;
}

export default function EnrolledCourseHeading({
    courseViewModel,
    studentProgressViewModel,
}: EnrolledCourseHeadingProps) {
    const hasProgress =
        studentProgressViewModel?.mode === 'default' &&
        studentProgressViewModel.data.progressPercent !== undefined;
    const isCompleted =
        studentProgressViewModel?.mode === 'default' &&
        studentProgressViewModel.data.isCompleted;
    const locale = useLocale() as TLocale;

    const renderProgress = () => {
        if (isCompleted) {
            return (
                <div className="flex flex-col space-y-2 items-start md:items-end">
                    <Badge
                        className="w-fit"
                        size="medium"
                        text="Completed"
                        variant="successprimary"
                    />
                    <Button
                        hasIconLeft
                        iconLeft={<IconCloudDownload />}
                        className="px-0"
                        variant="text"
                        text="Download Certificate"
                    />
                </div>
            );
        }
        if (hasProgress) {
            return (
                <CourseProgressBar
                    percentage={studentProgressViewModel.data.progressPercent}
                    locale={locale}
                    onClickResume={() => {}}
                />
            );
        }
        return null;
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
            {renderProgress()}
        </div>
    );
}
