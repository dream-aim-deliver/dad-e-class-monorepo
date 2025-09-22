'use client';

import { useCaseModels, viewModels } from '@maany_shr/e-class-models';
import { TLocale, getDictionary } from '@maany_shr/e-class-translations';
import {
    DefaultError,
    DefaultLoading,
    CourseMaterialsAccordion,
} from '@maany_shr/e-class-ui-kit';
import { useLocale, useTranslations } from 'next-intl';
import { Suspense, useState } from 'react';
import { useListCourseMaterialsPresenter } from '../../../hooks/use-list-course-materials-presenter';
import { trpc } from '../../../trpc/cms-client';
interface EnrolledCourseMaterialProps {
    currentRole: string;
    courseSlug: string;
}

function EnrolledCourseMaterialContent(props: EnrolledCourseMaterialProps) {
    const { courseSlug, currentRole } = props;
    const locale = useLocale() as TLocale;
    const dictionary = getDictionary(locale);
    const courseTranslations = useTranslations('pages.course');

    // Fetch course materials using TRPC
    const [courseMaterialsResponse] = trpc.listCourseMaterials.useSuspenseQuery(
        {
            courseSlug: courseSlug,
        },
    );

    // Set up presenter
    const [courseMaterialsViewModel, setCourseMaterialsViewModel] = useState<
        viewModels.TCourseMaterialsListViewModel | undefined
    >(undefined);

    const { presenter } = useListCourseMaterialsPresenter(
        setCourseMaterialsViewModel,
    );

    // Present the data
    presenter.present(courseMaterialsResponse, courseMaterialsViewModel);

    if (!courseMaterialsViewModel) {
        return <DefaultLoading locale={locale} variant="minimal" />;
    }

    // Handle different view model modes
    if (
        courseMaterialsViewModel.mode === 'kaboom' ||
        courseMaterialsViewModel.mode === 'not-found'
    ) {
        return <DefaultError locale={locale} />;
    }

    if (props.currentRole === 'visitor')
        throw new Error(courseTranslations('completedPanel.accessDeniedError'));

    return (
        <div className="flex flex-col space-y-6">
            {courseMaterialsViewModel.data.moduleCount === 0 ? (
                <div className="flex flex-col md:p-5 p-3 gap-2 rounded-medium border border-card-stroke bg-card-fill w-full lg:min-w-[22rem]">
                    <p className="text-text-primary text-md">
                        {dictionary.pages.course.materials.noMaterialsAvailable}
                    </p>
                </div>
            ) : (
                <CourseMaterialsAccordion
                    data={courseMaterialsViewModel.data}
                    locale={locale}
                />
            )}
        </div>
    );
}

export default function EnrolledCourseMaterial(
    props: EnrolledCourseMaterialProps,
) {
    const locale = useLocale() as TLocale;

    return (
            <Suspense
                fallback={<DefaultLoading locale={locale} variant="minimal" />}
            >
                <EnrolledCourseMaterialContent {...props} />
            </Suspense>
    );
}
