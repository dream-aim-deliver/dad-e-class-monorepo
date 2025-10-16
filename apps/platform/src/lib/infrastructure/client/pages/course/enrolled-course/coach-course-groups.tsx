'use client';

import { DefaultError, DefaultLoading } from '@maany_shr/e-class-ui-kit';
import { useLocale, useTranslations } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';
import { viewModels } from '@maany_shr/e-class-models';
import { useState } from 'react';
import { trpc } from '../../../trpc/cms-client';
import { useListCourseGroupsPresenter } from '../../../hooks/use-list-course-groups-presenter';

interface EnrolledCourseGroupsProps {
    courseSlug: string;
    currentRole: string;
}

export default function CoachCourseGroups({
    courseSlug,
    currentRole,
}: EnrolledCourseGroupsProps) {
    const locale = useLocale() as TLocale;
    const t = useTranslations('pages.course.groups');

    const [groupsResponse] = trpc.listCourseGroups.useSuspenseQuery({
        courseSlug,
    });

    const [groupsViewModel, setGroupsViewModel] = useState<
        viewModels.TListCourseGroupsViewModel | undefined
    >(undefined);

    const { presenter } = useListCourseGroupsPresenter(setGroupsViewModel);
    // @ts-ignore
    presenter.present(groupsResponse, groupsViewModel);

    if (!groupsViewModel) {
        return <DefaultLoading locale={locale} variant="minimal" />;
    }

    if (groupsViewModel.mode === 'kaboom') {
        const errorData = groupsViewModel.data;
        console.error(errorData);
        return <DefaultError locale={locale} />;
    }

    // TODO: Implement groups list rendering
    return (
        <div className="space-y-6">
            <div className="flex flex-col space-y-2">
                <h2 className="text-2xl font-bold">{t('title')}</h2>
                <p className="text-muted-foreground">{t('description')}</p>
            </div>
        </div>
    );
}
