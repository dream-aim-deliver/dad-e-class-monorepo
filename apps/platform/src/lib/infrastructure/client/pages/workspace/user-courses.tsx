'use client';

import { Breadcrumbs, Button, PageTitle } from '@maany_shr/e-class-ui-kit';
import { useLocale, useTranslations } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';
import UserCoursesList from './user-courses-list';

interface UserCoursesProps {
    roles: string[];
}

export default function UserCourses(props: UserCoursesProps) {
    const locale = useLocale() as TLocale;
    const isAdmin = props.roles.includes('admin');

    const breadcrumbsTranslations = useTranslations('components.breadcrumbs');
    const pageTranslations = useTranslations('pages.userCourses');

    return (
        <div className="flex flex-col space-y-2">
            <Breadcrumbs
                items={[
                    {
                        label: breadcrumbsTranslations('home'),
                        onClick: () => {},
                    },
                    {
                        label: breadcrumbsTranslations('workspace'),
                        onClick: () => {},
                    },
                    {
                        label: breadcrumbsTranslations('courses'),
                        onClick: () => {},
                    },
                ]}
            />
            <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center">
                <PageTitle text={pageTranslations('yourCourses')} />
                {isAdmin && <Button text={pageTranslations('createCourse')} />}
                {!isAdmin && (
                    <Button text={pageTranslations('becomeCourseCreator')} />
                )}
            </div>
            <UserCoursesList />
        </div>
    );
}
