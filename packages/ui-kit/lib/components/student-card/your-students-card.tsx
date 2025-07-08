import { Button } from '../button';
import { UserAvatar } from '../avatar/user-avatar';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { Badge } from '../badge';
import { IconCoachingOffer } from '../icons/icon-coaching-offer';
import { IconCourse } from '../icons/icon-course';
import { IconAssignment } from '../icons/icon-assignment';
import { HomeAccordion } from '../home-accordion';
import { homePage } from '@maany_shr/e-class-models';

export interface YourStudentCardProps extends isLocalAware {
    status: 'default' | 'long-wait' | 'waiting-feedback' | 'course-completed';
    studentName: string;
    studentImageUrl: string;
    courseName: string;
    courseImageUrl: string;
    assignmentTitle?: string;
    onStudentDetails: () => void;
    onViewAssignment?: () => void;
    coachingSessionsLeft?: number;
    completedCourseDate?: Date;
    onClickCourse: () => void;
    accordionData: {
        title: string;
        items: homePage.TAccordionItem[];
    };
}

export const YourStudentCard = ({
    status,
    studentName,
    studentImageUrl,
    courseName,
    courseImageUrl,
    assignmentTitle,
    onClickCourse,
    completedCourseDate,
    onStudentDetails,
    onViewAssignment,
    coachingSessionsLeft,
    locale,
    accordionData,
}: YourStudentCardProps) => {
    const dictionary = getDictionary(locale).components.studentCard;

    return (
        <div className="flex flex-col md:p-4 p-2 gap-2 rounded-medium border border-card-stroke bg-card-fill w-full lg:min-w-[22rem]">
            {/* Avatar, student name & Badge */}
            <div className="flex flex-row items-center gap-3 mb-2">
                <UserAvatar
                    fullName={studentName}
                    className="w-10 h-10 rounded-full flex-shrink-0"
                    imageUrl={studentImageUrl}
                />
                <div className="flex flex-col gap-1">
                    <h6 className="text-md text-text-primary font-important">
                        {studentName}
                    </h6>
                    {typeof coachingSessionsLeft === 'number' &&
                        coachingSessionsLeft > 0 && (
                            <Badge
                                className="flex items-center"
                                variant="info"
                                size="small"
                                text={`${coachingSessionsLeft} ${dictionary.coachingSessionsLeftText}`}
                            />
                        )}
                </div>
            </div>
            {/* Courses list */}
            {accordionData && (
                <div className="mt-4">
                    <HomeAccordion
                        title={accordionData.title}
                        items={accordionData.items}
                    />
                </div>
            )}

            {/* Student details button */}
            <Button
                onClick={onStudentDetails}
                variant="secondary"
                size="medium"
                text={dictionary.studentDetailsButton}
            />
        </div>
    );
};
