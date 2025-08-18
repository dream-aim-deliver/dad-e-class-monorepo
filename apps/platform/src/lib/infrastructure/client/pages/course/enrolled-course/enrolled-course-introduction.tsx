import { viewModels } from '@maany_shr/e-class-models';
import { TLocale } from '@maany_shr/e-class-translations';
import {
    CoachingSessionItem,
    CoachingSessionTracker,
    CourseGeneralInformationView,
    DefaultError,
    DefaultLoading,
} from '@maany_shr/e-class-ui-kit';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useTabContext } from 'packages/ui-kit/lib/components/tabs/tab-context';
import { StudentCourseTab } from '../../../utils/course-tabs';
import { trpc } from '../../../trpc/client';
import { Suspense, useState } from 'react';
import { useListIncludedCoachingSessionsPresenter } from '../../../hooks/use-included-coaching-sessions-presenter';
import CourseIntroduction from '../../common/course-introduction';
import CourseOutline from '../../common/course-outline';

interface EnrolledCourseIntroductionProps {
    courseViewModel: viewModels.TEnrolledCourseDetailsViewModel;
    progressViewModel?: viewModels.TStudentProgressViewModel;
    currentRole: string;
    courseSlug: string;
}

function EnrolledCourseIntroductionContent(
    props: EnrolledCourseIntroductionProps,
) {
    const { courseViewModel, progressViewModel } = props;
    const locale = useLocale() as TLocale;
    const tabContext = useTabContext();
    const router = useRouter();

    if (courseViewModel.mode !== 'default') {
        return <DefaultError locale={locale} />;
    }

    return (
        <div className="flex flex-col space-y-10">
            <CourseGeneralInformationView
                // These fields aren't utilized and are coming from a common model
                title={''}
                description={''}
                showProgress={true}
                language={{
                    name: '',
                    code: '',
                }}
                pricing={{
                    fullPrice: 0,
                    partialPrice: 0,
                    currency: '',
                }}
                locale={locale}
                longDescription={courseViewModel.data.description}
                duration={{
                    video: courseViewModel.data.duration.video,
                    coaching: courseViewModel.data.duration.coaching,
                    selfStudy: courseViewModel.data.duration.selfStudy,
                }}
                rating={courseViewModel.data.author.averageRating}
                author={{
                    name:
                        courseViewModel.data.author.name +
                        ' ' +
                        courseViewModel.data.author.surname,
                    image: courseViewModel.data.author.avatarUrl ?? '',
                }}
                progress={progressViewModel?.data.progressPercent}
                imageUrl={courseViewModel.data.imageUrl ?? ''}
                students={courseViewModel.data.students.map((student) => ({
                    name: student.name,
                    avatarUrl: student.avatarUrl ?? '',
                }))}
                totalStudentCount={courseViewModel.data.studentCount}
                onClickAuthor={() => {
                    router.push(
                        `/coaches/${courseViewModel.data.author.username}`,
                    );
                }}
                onClickResume={() => {
                    tabContext.setActiveTab(StudentCourseTab.STUDY);
                }}
                onClickReview={() => {
                    // TODO: add a callback
                    console.log("This would trigger a popup to review the course")
                }}
            />
            <CourseIntroduction courseSlug={props.courseSlug} />
            <CourseOutline courseSlug={props.courseSlug} />
        </div>
    );
}

function IncludedCoachingSessions({ courseSlug }: { courseSlug: string }) {
    const [coachingSessionsResponse] =
        trpc.listIncludedCoachingSessions.useSuspenseQuery({
            courseSlug: courseSlug,
        });
    const [coachingSessionsViewModel, setCoachingSessionsViewModel] = useState<
        viewModels.TIncludedCoachingSessionListViewModel | undefined
    >(undefined);
    const { presenter } = useListIncludedCoachingSessionsPresenter(
        setCoachingSessionsViewModel,
    );
    presenter.present(coachingSessionsResponse, coachingSessionsViewModel);

    const locale = useLocale() as TLocale;

    if (!coachingSessionsViewModel) {
        return <DefaultLoading locale={locale} />;
    }

    // If there is an error, nothing is rendered
    if (coachingSessionsViewModel.mode !== 'default') {
        return;
    }

    const offers = coachingSessionsViewModel.data.offers;

    return (
        <CoachingSessionTracker
            locale={locale}
            onClickBuySessions={() => {
                // TODO: Implement navigation to a page where sessions can be bought
            }}
        >
            {offers.map((offer) => (
                <CoachingSessionItem
                    key={offer.name}
                    used={offer.usedCount}
                    included={offer.usedCount + offer.availableIds.length}
                    title={offer.name}
                    duration={offer.duration}
                    locale={locale}
                    // Fields below are not used in the component, but required by the type
                    description={''}
                    currency={''}
                    price={0}
                />
            ))}
        </CoachingSessionTracker>
    );
}

function StudentEnrolledCourseIntroduction(
    props: EnrolledCourseIntroductionProps,
) {
    const locale = useLocale() as TLocale;

    return (
        <div className="flex flex-col space-y-10">
            <Suspense fallback={<DefaultLoading locale={locale} />}>
                <IncludedCoachingSessions courseSlug={props.courseSlug} />
            </Suspense>
            <EnrolledCourseIntroductionContent {...props} />
        </div>
    );
}

export default function EnrolledCourseIntroduction(
    props: EnrolledCourseIntroductionProps,
) {
    if (props.currentRole === 'student') {
        return <StudentEnrolledCourseIntroduction {...props} />;
    }

    return <EnrolledCourseIntroductionContent {...props} />;
}
