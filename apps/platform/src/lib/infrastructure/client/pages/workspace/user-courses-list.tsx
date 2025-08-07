import { useState } from 'react';
import { trpc } from '../../trpc/client';
import { viewModels } from '@maany_shr/e-class-models';
import { useListUserCoursesPresenter } from '../../hooks/use-user-courses-presenter';
import {
    CardListLayout,
    CoachCourseCard,
    DefaultError,
    DefaultLoading,
    DefaultNotFound,
} from '@maany_shr/e-class-ui-kit';
import { useLocale } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';

export default function UserCoursesList() {
    const locale = useLocale() as TLocale;

    const [coursesResponse] = trpc.listUserCourses.useSuspenseQuery({
        pagination: {
            page: 1,
            pageSize: 6,
        },
    });
    const [coursesViewModel, setCoursesViewModel] = useState<
        viewModels.TUserCourseListViewModel | undefined
    >(undefined);
    const { presenter } = useListUserCoursesPresenter(setCoursesViewModel);
    presenter.present(coursesResponse, coursesViewModel);

    if (!coursesViewModel) {
        return <DefaultLoading locale={locale} />;
    }

    if (coursesViewModel.mode === 'not-found') {
        return <DefaultNotFound locale={locale} />;
    }

    if (coursesViewModel.mode === 'kaboom') {
        return <DefaultError locale={locale} />;
    }

    const courses = coursesViewModel.data.courses;

    if (courses.length === 0) {
        return <DefaultNotFound locale={locale} />;
    }

    return (
        <CardListLayout>
            {courses.map((course) => {
                if (course.role === 'coach') {
                    return (
                        <CoachCourseCard
                            key={course.id}
                            title={course.title}
                            reviewCount={course.reviewCount}
                            sessions={course.coachingSessionCount ?? 0}
                            sales={course.salesCount}
                            locale={locale}
                            language={{
                                code: '',
                                name: course.language,
                            }}
                            imageUrl={course.imageUrl ?? ''}
                            author={{
                                name:
                                    course.author.name +
                                    ' ' +
                                    course.author.surname,
                                image: course.author.avatarUrl ?? '',
                            }}
                            duration={{
                                selfStudy: course.fullDuration,
                                video: 0,
                                coaching: 0,
                            }}
                            rating={course.averageRating}
                        />
                    );
                }
                return <div key={course.id}>Mock</div>;
            })}
        </CardListLayout>
    );
}
