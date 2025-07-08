import { viewModels } from '@maany_shr/e-class-models';
import { SectionHeading } from '@maany_shr/e-class-ui-kit';
import { StarRating } from 'packages/ui-kit/lib/components/star-rating';

interface EnrolledCourseHeadingProps {
    courseViewModel: viewModels.TEnrolledCourseDetailsViewModel;
}

export default function EnrolledCourseHeading({
    courseViewModel,
}: EnrolledCourseHeadingProps) {
    return (
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
    );
}
