import { viewModels } from '@maany_shr/e-class-models';
import { TLocale } from '@maany_shr/e-class-translations';
import {
    CourseGeneralInformationView,
    DefaultError,
} from '@maany_shr/e-class-ui-kit';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useTabContext } from 'packages/ui-kit/lib/components/tabs/tab-context';
import { StudentCourseTab } from '../../../utils/course-tabs';

interface EnrolledCourseIntroductionProps {
    courseViewModel: viewModels.TEnrolledCourseDetailsViewModel;
    progressViewModel?: viewModels.TStudentProgressViewModel;
}

export default function EnrolledCourseIntroduction(
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
        <CourseGeneralInformationView
            // These fields aren't utilized and are coming from a common model
            title={''}
            description={''}
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
            studentProgress={progressViewModel?.data.progressPercent}
            imageUrl={courseViewModel.data.imageUrl ?? ''}
            students={courseViewModel.data.students.map((student) => ({
                name: student.name,
                avatarUrl: student.avatarUrl ?? '',
            }))}
            totalStudentCount={courseViewModel.data.studentCount}
            onClickAuthor={() => {
                router.push(`/coaches/${courseViewModel.data.author.username}`);
            }}
            onClickResume={() => {
                tabContext.setActiveTab(StudentCourseTab.STUDY);
            }}
        />
    );
}
