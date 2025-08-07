'use client';

import { Breadcrumbs, Button, PageTitle } from '@maany_shr/e-class-ui-kit';
import { useLocale } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';
import UserCoursesList from './user-courses-list';

export default function UserCourses() {
    const locale = useLocale() as TLocale;

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
