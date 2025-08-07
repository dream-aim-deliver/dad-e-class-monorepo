'use client';

import { useState } from 'react';
import { trpc } from '../../trpc/client';
import { viewModels } from '@maany_shr/e-class-models';
import { useListUserCoursesPresenter } from '../../hooks/use-user-courses-presenter';
import {
    Breadcrumbs,
    Button,
    DefaultError,
    DefaultLoading,
    DefaultNotFound,
    PageTitle,
} from '@maany_shr/e-class-ui-kit';
import { useLocale } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';
import UserCoursesList from './user-courses-list';

export default function UserCourses() {
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
        <div className="flex flex-col space-y-2">
            <Breadcrumbs
                items={[
                    { label: 'Home', onClick: () => {} },
                    { label: 'Workspace', onClick: () => {} },
                    { label: 'Courses', onClick: () => {} },
                ]}
            />
            <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center">
                <PageTitle text="Your Courses" />
                <Button text="Create a course" />
            </div>
            <UserCoursesList />
        </div>
    );
}
