'use client';

import { DefaultError, DefaultLoading } from '@maany_shr/e-class-ui-kit';
import { useState } from 'react';
import { trpc } from '../../../trpc/client';
import { viewModels } from '@maany_shr/e-class-models';
import { useGetEnrolledCourseDetailsPresenter } from '../../../hooks/use-enrolled-course-details-presenter';
import { useLocale } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';
import EnrolledCourseHeading from './enrolled-course-heading';

interface EnrolledCourseProps {
    roles: string[];
    highestRole: string;
    courseSlug: string;
}

export default function EnrolledCourse(props: EnrolledCourseProps) {
    const [currentRole, setCurrentRole] = useState<string>(props.highestRole);
    const [courseResponse] = trpc.getEnrolledCourseDetails.useSuspenseQuery({
        courseSlug: props.courseSlug,
    });
    const [courseViewModel, setCourseViewModel] = useState<
        viewModels.TEnrolledCourseDetailsViewModel | undefined
    >(undefined);
    const { presenter } =
        useGetEnrolledCourseDetailsPresenter(setCourseViewModel);
    presenter.present(courseResponse, courseViewModel);

    const locale = useLocale() as TLocale;

    if (!courseViewModel) {
        return <DefaultLoading locale={locale} />;
    }

    if (courseViewModel.mode !== 'default') {
        return <DefaultError locale={locale} />;
    }

    return (
        <div>
            <EnrolledCourseHeading courseViewModel={courseViewModel} />
            {/* Additional content can be added here */}
        </div>
    );
}
